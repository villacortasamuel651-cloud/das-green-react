import jwt from "jsonwebtoken";

const COOKIE_NAME = "das_admin";
const isProduction = process.env.NODE_ENV === "production";

export function setAdminCookie(res, admin) {
  const token = jwt.sign({ sub: String(admin.id), email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: "8h",
    issuer: "das-green",
    audience: "das-green-admin",
  });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60 * 1000,
  });
}

export function clearAdminCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: isProduction, sameSite: "strict", path: "/" });
}

export function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "Inicia sesión para continuar." });
    req.admin = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "das-green",
      audience: "das-green-admin",
    });
    return next();
  } catch {
    clearAdminCookie(res);
    return res.status(401).json({ error: "La sesión expiró. Inicia sesión nuevamente." });
  }
}

export function requireSameOrigin(req, res, next) {
  const expected = process.env.APP_ORIGIN;
  const origin = req.get("origin");
  const isLocalDevelopmentOrigin = process.env.NODE_ENV !== "production" && (() => {
    try {
      const parsed = new URL(origin);
      return parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname);
    } catch {
      return false;
    }
  })();
  if (origin && expected && origin !== expected && !isLocalDevelopmentOrigin) {
    return res.status(403).json({ error: "Origen no permitido." });
  }
  return next();
}
