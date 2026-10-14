import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export function createSeedMediaStore({ projectRoot, mediaRoot }) {
  const createdFiles = [];
  const cache = new Map();
  const imagePath = (value) => {
    if (typeof value !== "string") return null;
    const relative = value.startsWith("seed-file:") ? value.slice(10) : value.startsWith("/images/") ? `public${value}` : null;
    if (!relative) return null;
    const source = path.resolve(projectRoot, relative);
    const allowedRoots = [path.resolve(projectRoot, "src/assets/images"), path.resolve(projectRoot, "public/images")];
    if (!allowedRoots.some((root) => source.startsWith(root + path.sep))) throw new Error("SEED_INVALID_PATH");
    return source;
  };

  const migrateImage = async (source, connection) => {
    if (cache.has(source)) return cache.get(source);
    const buffer = await sharp(source, { limitInputPixels: 40_000_000 }).rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 }).toBuffer();
    const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 32);
    const id = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`;
    const filename = `${id}.webp`;
    const destination = path.join(mediaRoot, filename);
    const [existing] = await connection.execute("SELECT storage_name FROM media WHERE id = ?", [id]);
    if (existing.length && existing[0].storage_name !== filename) throw new Error("SEED_MEDIA_CONFLICT");
    await fs.mkdir(mediaRoot, { recursive: true, mode: 0o750 });
    try {
      await fs.writeFile(destination, buffer, { flag: "wx", mode: 0o640 });
      createdFiles.push(destination);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      if (!(await fs.readFile(destination)).equals(buffer)) throw new Error("SEED_MEDIA_CONFLICT");
    }
    if (!existing.length) {
      await connection.execute("INSERT INTO media (id, kind, mime_type, storage_name, size_bytes) VALUES (?, ?, ?, ?, ?)", [id, "image", "image/webp", filename, buffer.length]);
    }
    const url = `/api/media/${id}`;
    cache.set(source, url);
    return url;
  };

  const prepare = async (value, connection) => {
    const source = imagePath(value);
    if (source) return migrateImage(source, connection);
    if (Array.isArray(value)) {
      const result = [];
      for (const item of value) result.push(await prepare(item, connection));
      return result;
    }
    if (value && typeof value === "object") {
      // Secuencial: una sola conexión/operación por archivo, también para medios repetidos.
      const result = {};
      for (const [key, item] of Object.entries(value)) result[key] = await prepare(item, connection);
      return result;
    }
    return value;
  };
  return {
    prepare,
    rollback: async () => { for (const file of createdFiles) await fs.unlink(file).catch(() => {}); },
  };
}
