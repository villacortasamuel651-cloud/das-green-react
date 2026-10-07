import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { fileTypeFromFile } from "file-type";
import jwt from "jsonwebtoken";
import multer from "multer";
import sharp from "sharp";
import { initializeDatabase, pool } from "./db.js";
import { clearAdminCookie, requireAdmin, requireSameOrigin, setAdminCookie } from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mediaRoot = path.resolve(process.env.MEDIA_ROOT || path.join(__dirname, "..", "private-media"));
const app = express();
const port = Number(process.env.PORT || 3001);
const imageLimit = 15 * 1024 * 1024;
const videoLimit = Number(process.env.MAX_VIDEO_BYTES || 150 * 1024 * 1024);
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false });

const requiredEnvironment = ["MYSQL_USER", "MYSQL_PASSWORD", "MYSQL_DATABASE", "JWT_SECRET", "APP_ORIGIN"];
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);
if (missingEnvironment.length) throw new Error(`Faltan variables de entorno: ${missingEnvironment.join(", ")}`);
if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET debe tener al menos 32 caracteres.");

await fs.mkdir(mediaRoot, { recursive: true, mode: 0o750 });
app.disable("x-powered-by");
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.post("/api/auth/login", loginLimit, requireSameOrigin, async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const [rows] = await pool.execute("SELECT id, email, password_hash FROM admins WHERE email = ? LIMIT 1", [email]);
    const admin = rows[0];
    const valid = admin && await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    setAdminCookie(res, admin);
    return res.json({ admin: { email: admin.email } });
  } catch (error) { return next(error); }
});

app.get("/api/auth/me", (req, res) => {
  try {
    const token = req.cookies?.das_admin;
    const admin = jwt.verify(token || "", process.env.JWT_SECRET, { issuer: "das-green", audience: "das-green-admin" });
    return res.json({ admin: { email: admin.email } });
  } catch { clearAdminCookie(res); return res.status(401).json({ error: "No hay una sesión activa." }); }
});

app.post("/api/auth/logout", requireSameOrigin, (_req, res) => {
  clearAdminCookie(res);
  res.status(204).end();
});

app.get("/api/content/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT payload, updated_at FROM content WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Contenido no encontrado." });
    const payload = typeof rows[0].payload === "string" ? JSON.parse(rows[0].payload) : rows[0].payload;
    return res.json({ content: payload, updatedAt: rows[0].updated_at });
  } catch (error) { return next(error); }
});

app.put("/api/content/:id", requireSameOrigin, requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return res.status(400).json({ error: "Identificador inválido." });
    if (!req.body || Array.isArray(req.body) || typeof req.body !== "object") return res.status(400).json({ error: "Contenido inválido." });
    const payloadText = JSON.stringify(req.body);
    if (/data:(?:image|video)\//i.test(payloadText)) return res.status(400).json({ error: "No se permiten archivos codificados en el contenido; guarda una URL de medios." });
    const [previousRows] = await pool.execute("SELECT payload FROM content WHERE id = ?", [id]);
    const previous = previousRows[0]?.payload;
    await pool.execute(
      "INSERT INTO content (id, payload) VALUES (?, ?) ON DUPLICATE KEY UPDATE payload = VALUES(payload)",
      [id, payloadText],
    );
    const previousJson = typeof previous === "string" ? previous : JSON.stringify(previous || {});
    const retainedJson = JSON.stringify(req.body);
    const previousMedia = [...previousJson.matchAll(/\/api\/media\/([0-9a-f-]{36})/gi)].map((match) => match[0]);
    const retained = new Set([...retainedJson.matchAll(/\/api\/media\/([0-9a-f-]{36})/gi)].map((match) => match[0]));
    for (const url of new Set(previousMedia)) {
      if (retained.has(url)) continue;
      const [references] = await pool.execute("SELECT id FROM content WHERE CAST(payload AS CHAR) LIKE ? LIMIT 1", [`%${url}%`]);
      if (references.length) continue;
      const mediaId = url.split("/").pop();
      const [mediaRows] = await pool.execute("SELECT storage_name FROM media WHERE id = ?", [mediaId]);
      if (mediaRows.length) {
        await fs.unlink(path.join(mediaRoot, path.basename(mediaRows[0].storage_name))).catch(() => {});
        await pool.execute("DELETE FROM media WHERE id = ?", [mediaId]);
      }
    }
    return res.json({ ok: true });
  } catch (error) { return next(error); }
});

const upload = multer({
  dest: mediaRoot,
  limits: { fileSize: Math.max(imageLimit, videoLimit), files: 1 },
  fileFilter: (_req, file, callback) => {
    const validImage = file.mimetype.startsWith("image/");
    const validVideo = ["video/mp4", "video/webm"].includes(file.mimetype);
    callback(validImage || validVideo ? null : new Error("Solo se aceptan imágenes, MP4 o WebM."), validImage || validVideo);
  },
});

app.post("/api/media", requireSameOrigin, requireAdmin, upload.single("file"), async (req, res, next) => {
  let tempPath = req.file?.path;
  try {
    if (!req.file) return res.status(400).json({ error: "Selecciona un archivo." });
    const kind = req.body.kind;
    const isImage = req.file.mimetype.startsWith("image/");
    if ((kind === "image") !== isImage || !["image", "video"].includes(kind)) {
      await fs.unlink(tempPath).catch(() => {});
      return res.status(400).json({ error: "El tipo de archivo no coincide con el destino." });
    }
    const detected = await fileTypeFromFile(tempPath);
    const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/tiff", "image/bmp"]);
    const allowedVideoTypes = new Set(["video/mp4", "video/webm"]);
    if (!detected || (isImage ? !allowedImageTypes.has(detected.mime) : !allowedVideoTypes.has(detected.mime))) {
      await fs.unlink(tempPath).catch(() => {});
      return res.status(415).json({ error: "El contenido del archivo no coincide con un formato compatible." });
    }
    if (isImage && req.file.size > imageLimit) {
      await fs.unlink(tempPath).catch(() => {});
      return res.status(413).json({ error: "La imagen supera el límite de 15 MB." });
    }
    if (!isImage && req.file.size > videoLimit) {
      await fs.unlink(tempPath).catch(() => {});
      return res.status(413).json({ error: "El video supera el límite configurado." });
    }

    const id = crypto.randomUUID();
    let ext = ".webp";
    let mimeType = "image/webp";
    let size = req.file.size;
    if (isImage) {
      const outputPath = path.join(mediaRoot, `${id}.webp`);
      await sharp(tempPath, { limitInputPixels: 40_000_000 })
        .rotate().resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 }).toFile(outputPath);
      await fs.unlink(tempPath);
      tempPath = outputPath;
      const stat = await fs.stat(outputPath);
      size = stat.size;
    } else {
      ext = detected.mime === "video/webm" ? ".webm" : ".mp4";
      mimeType = detected.mime;
      const finalPath = path.join(mediaRoot, `${id}${ext}`);
      await fs.rename(tempPath, finalPath);
      tempPath = finalPath;
    }

    const storageName = `${id}${ext}`;
    try {
      await pool.execute("INSERT INTO media (id, kind, mime_type, storage_name, size_bytes) VALUES (?, ?, ?, ?, ?)",
        [id, kind, mimeType, storageName, size]);
    } catch (error) {
      await fs.unlink(tempPath).catch(() => {});
      throw error;
    }
    return res.status(201).json({ id, kind, url: `/api/media/${id}`, mimeType, size });
  } catch (error) {
    if (tempPath) await fs.unlink(tempPath).catch(() => {});
    return next(error);
  }
});

app.get("/api/media/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT storage_name, mime_type, size_bytes FROM media WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).end();
    const entry = rows[0];
    const filePath = path.join(mediaRoot, path.basename(entry.storage_name));
    res.setHeader("Content-Type", entry.mime_type);
    res.setHeader("Content-Length", entry.size_bytes);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.sendFile(filePath, (error) => { if (error && !res.headersSent) next(error); });
  } catch (error) { return next(error); }
});

app.delete("/api/media/:id", requireSameOrigin, requireAdmin, async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT storage_name FROM media WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Archivo no encontrado." });
    const url = `/api/media/${req.params.id}`;
    const [references] = await pool.execute("SELECT id FROM content WHERE CAST(payload AS CHAR) LIKE ? LIMIT 1", [`%${url}%`]);
    if (references.length) return res.status(409).json({ error: "Este archivo todavía está vinculado a contenido publicado." });
    await fs.unlink(path.join(mediaRoot, path.basename(rows[0].storage_name))).catch((error) => { if (error.code !== "ENOENT") throw error; });
    await pool.execute("DELETE FROM media WHERE id = ?", [req.params.id]);
    return res.status(204).end();
  } catch (error) { return next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error instanceof multer.MulterError) return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ error: "No se pudo procesar el archivo." });
  if (error.message?.startsWith("Solo se aceptan")) return res.status(415).json({ error: error.message });
  return res.status(500).json({ error: "Error interno del servidor." });
});

await initializeDatabase();
app.listen(port, () => console.log(`DAS Green API escuchando en el puerto ${port}`));
