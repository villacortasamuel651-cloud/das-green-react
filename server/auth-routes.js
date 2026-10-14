import bcrypt from "bcryptjs";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { clearAdminCookie, requireAdmin, requireSameOrigin, setAdminCookie } from "./auth.js";

export function createAuthRouter({ database, loginLimitOptions = {} }) {
  const router = Router();
  const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: "Demasiados intentos de acceso. Espera unos minutos antes de volver a intentarlo." },
    ...loginLimitOptions,
  });

  router.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });

  router.post("/login", requireSameOrigin, loginLimit, async (req, res, next) => {
    try {
      const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
      const password = typeof req.body?.password === "string" ? req.body.password : "";
      if (!email || !password) return res.status(400).json({ error: "Introduce tu correo y contraseña." });
      const [rows] = await database.execute("SELECT id, email, password_hash FROM admins WHERE email = ? LIMIT 1", [email]);
      const admin = rows[0];
      const valid = admin && await bcrypt.compare(password, admin.password_hash);
      if (!valid) return res.status(401).json({ error: "Correo o contraseña incorrectos." });
      setAdminCookie(res, admin);
      return res.json({ admin: { email: admin.email } });
    } catch (error) { return next(error); }
  });

  router.get("/me", requireAdmin, (req, res) => res.json({ admin: { email: req.admin.email } }));

  router.post("/logout", requireSameOrigin, (_req, res) => {
    clearAdminCookie(res);
    res.status(204).end();
  });

  return router;
}
