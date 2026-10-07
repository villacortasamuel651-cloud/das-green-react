import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

if (process.env.NODE_ENV === "production") throw new Error("Este script solo configura una base MySQL local.");

async function promptForRootPassword() {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) {
    throw new Error("Define MYSQL_ROOT_PASSWORD en el entorno o ejecuta este comando desde una terminal interactiva.");
  }
  process.stdout.write("Contraseña de root MySQL (entrada oculta): ");
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let password = "";
    const finish = (error) => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("data", onData);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(password);
    };
    const onData = (chunk) => {
      for (const character of chunk) {
        if (character === "\u0003") return finish(new Error("Configuración cancelada."));
        if (character === "\r" || character === "\n") return finish();
        if (character === "\u007f" || character === "\b") password = password.slice(0, -1);
        else password += character;
      }
    };
    process.stdin.on("data", onData);
  });
}

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const envPath = path.join(projectRoot, ".env");
const host = "127.0.0.1";
const database = "das_green";
const appUser = "das_green_app";
const appPassword = crypto.randomBytes(32).toString("hex");
const jwtSecret = crypto.randomBytes(48).toString("base64url");
const adminEmail = process.env.ADMIN_EMAIL || "admin@dasgreen.local";
const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(18).toString("base64url");
const rootPassword = process.env.MYSQL_ROOT_PASSWORD || await promptForRootPassword();
const root = await mysql.createConnection({ host, port: 3306, user: "root", password: rootPassword });

try {
  await root.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await root.query(`CREATE USER IF NOT EXISTS '${appUser}'@'127.0.0.1' IDENTIFIED BY ${root.escape(appPassword)}`);
  await root.query(`ALTER USER '${appUser}'@'127.0.0.1' IDENTIFIED BY ${root.escape(appPassword)}`);
  await root.query(`GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON \`${database}\`.* TO '${appUser}'@'127.0.0.1'`);

  await root.query(`
    CREATE TABLE IF NOT EXISTS \`${database}\`.admins (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  await root.query(`
    CREATE TABLE IF NOT EXISTS \`${database}\`.content (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      payload JSON NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  await root.query(`
    CREATE TABLE IF NOT EXISTS \`${database}\`.media (
      id CHAR(36) NOT NULL PRIMARY KEY,
      kind ENUM('image', 'video') NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      storage_name VARCHAR(100) NOT NULL UNIQUE,
      size_bytes BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await root.execute(`INSERT INTO \`${database}\`.admins (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`, [adminEmail, passwordHash]);
} finally {
  await root.end();
}

const config = {
  MYSQL_HOST: host,
  MYSQL_PORT: "3306",
  MYSQL_USER: appUser,
  MYSQL_PASSWORD: appPassword,
  MYSQL_DATABASE: database,
  PORT: "3001",
  JWT_SECRET: jwtSecret,
  APP_ORIGIN: "http://localhost:5173",
  MEDIA_ROOT: "./private-media",
  ADMIN_EMAIL: adminEmail,
  ADMIN_PASSWORD: adminPassword,
};
const existing = await fs.readFile(envPath, "utf8").catch(() => "");
const lines = existing.split(/\r?\n/);
for (const [key, value] of Object.entries(config)) {
  const index = lines.findIndex((line) => line.startsWith(`${key}=`));
  const line = `${key}=${value}`;
  if (index === -1) lines.push(line);
  else lines[index] = line;
}
await fs.writeFile(envPath, `${lines.filter((line, index) => line || index < lines.length - 1).join("\n")}\n`, { mode: 0o600 });
await fs.mkdir(path.join(projectRoot, "private-media"), { recursive: true });

console.log(`Base lista: ${database} en ${host}:3306`);
console.log(`Usuario de aplicación creado: ${appUser}`);
console.log(`Acceso inicial del panel: ${adminEmail}`);
console.log(`Contraseña inicial del panel: ${adminPassword}`);
console.log("La configuración sensible quedó en .env (ignorado por Git). Cambia la contraseña inicial después de iniciar sesión.");
