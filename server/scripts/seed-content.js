import "dotenv/config";
import path from "node:path";
import { loadLocalContent, projectRoot } from "../seed/local-content.js";
import { seedContent } from "../seed/content-seeder.js";
import { createSeedMediaStore } from "../seed/media-store.js";

const args = process.argv.slice(2);
if (args.some((arg) => !["--preview", "--dry-run"].includes(arg))) {
  console.error("Uso: npm run content:seed -- [--preview | --dry-run]");
  process.exit(1);
}
const documents = await loadLocalContent();
if (args.includes("--preview")) {
  console.log(`Contenido local preparado: ${documents.length} documentos (${documents.map((item) => item.id).join(", ")}).`);
  console.log("No se conectó a MySQL ni se escribieron archivos. El seeder conserva cualquier documento existente.");
} else {
  const required = ["MYSQL_USER", "MYSQL_PASSWORD", "MYSQL_DATABASE", "MEDIA_ROOT"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) { console.error(`Faltan variables del servidor: ${missing.join(", ")}.`); process.exit(1); }
  const { pool } = await import("../db.js");
  try {
    const report = await seedContent({ database: pool, documents, dryRun: args.includes("--dry-run"),
      mediaStore: createSeedMediaStore({ projectRoot, mediaRoot: path.resolve(process.env.MEDIA_ROOT) }) });
    console.log(`${report.dryRun ? "Se crearían" : "Creados"}: ${report.created.length} (${report.created.join(", ") || "ninguno"}).`);
    console.log(`Conservados: ${report.preserved.length} (${report.preserved.join(", ") || "ninguno"}).`);
    console.log("No se modificaron cuentas ni contraseñas de administrador.");
  } catch (error) {
    console.error(`No se completó el seeder (${error.code || "SEED_ERROR"}). Revisa conexión, permisos, archivos y espacio del servidor. No se sobrescribe contenido existente.`);
    process.exitCode = 1;
  } finally { await pool.end(); }
}
