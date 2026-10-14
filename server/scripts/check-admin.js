import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";

// Diagnóstico de solo lectura; no muestra correos, hashes ni secretos.
const required = ["MYSQL_USER", "MYSQL_PASSWORD", "MYSQL_DATABASE"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Faltan variables para comprobar la base: ${missing.join(", ")}.`);
  process.exitCode = 1;
} else {
  try {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM admins");
    const total = Number(rows[0].total);
    console.log(`Cuentas de administrador creadas: ${total}.`);
    if (total === 0) {
      console.error("No existe un administrador en esta base. Configura una cuenta mediante npm run admin:create en el servidor correcto.");
      process.exitCode = 1;
    } else if (process.env.ADMIN_EMAIL?.trim()) {
      const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
      const [matches] = await pool.execute("SELECT password_hash FROM admins WHERE email = ? LIMIT 1", [email]);
      if (!matches.length) {
        console.error("El correo indicado en ADMIN_EMAIL no corresponde a una cuenta de esta base.");
        process.exitCode = 1;
      } else if (!/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(matches[0].password_hash)) {
        console.error("La cuenta existe, pero su contraseña guardada no tiene un formato bcrypt válido.");
        process.exitCode = 1;
      } else {
        console.log("La cuenta indicada existe y tiene un hash bcrypt válido.");
        if (process.env.ADMIN_PASSWORD) {
          const matchesPassword = await bcrypt.compare(process.env.ADMIN_PASSWORD, matches[0].password_hash);
          if (matchesPassword) console.log("La contraseña indicada coincide con la guardada en esta base.");
          else {
            console.error("La contraseña indicada no coincide con la guardada en esta base.");
            process.exitCode = 1;
          }
        } else console.log("No se proporcionó ADMIN_PASSWORD: la contraseña no se comprobó.");
        console.log("No se modificó ninguna cuenta ni contraseña.");
      }
    }
  } catch (error) {
    const messages = {
      ER_NO_SUCH_TABLE: "No existe la tabla admins en la base configurada. Revisa la inicialización y la base de destino.",
      ER_BAD_FIELD_ERROR: "La tabla admins no tiene las columnas esperadas. Revisa su esquema antes de modificarlo.",
      ER_ACCESS_DENIED_ERROR: "MySQL rechazó la conexión. Revisa las credenciales privadas del servicio.",
      ECONNREFUSED: "No se pudo conectar con MySQL. Revisa que el servicio esté activo y el host sea correcto.",
    };
    console.error(messages[error.code] || "No se pudo comprobar la cuenta. Revisa conexión, permisos y esquema de MySQL.");
    process.exitCode = 1;
  }
}
await pool.end();
