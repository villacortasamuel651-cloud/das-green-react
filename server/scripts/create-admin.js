import "dotenv/config";
import bcrypt from "bcryptjs";
import { initializeDatabase, pool } from "../db.js";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  throw new Error("Configura ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres) en el entorno.");
}

await initializeDatabase();
const passwordHash = await bcrypt.hash(password, 12);
await pool.execute("INSERT INTO admins (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)", [email, passwordHash]);
await pool.end();
console.log(`Administrador creado/actualizado: ${email}`);
