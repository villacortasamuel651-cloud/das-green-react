// Sube los tamaños de texto pequeños. EJECUTAR UNA SOLA VEZ.
import fs from "node:fs";
import path from "node:path";

if (fs.existsSync(".fonts-bumped")) {
  console.log("Ya se ejecutó antes. Para evitar subir los tamaños dos veces, no se hizo nada.");
  process.exit(0);
}

const SIZES = { 8: 11, 9: 12, 10: 12, 11: 13, 12: 14, 13: 14, 14: 15 };
const COLORS = { "#73848c": "#8fa1a9", "#7e929b": "#93a6ae" }; // más contraste sobre fondo oscuro

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walk(path.join(dir, e.name))
      : e.name.endsWith(".css")
      ? [path.join(dir, e.name)]
      : []
  );

let changed = 0;
for (const file of [...walk("src/components"), ...walk("src/styles")]) {
  const before = fs.readFileSync(file, "utf8");
  const after = before
    .replace(/font-size:\s*(\d+)px/g, (m, n) => (SIZES[n] ? `font-size: ${SIZES[n]}px` : m))
    .replace(/#[0-9a-fA-F]{6}/g, (c) => COLORS[c.toLowerCase()] ?? c);

  if (after !== before) {
    fs.writeFileSync(file, after);
    changed++;
    console.log("✔", file);
  }
}

fs.writeFileSync(".fonts-bumped", "ok");
console.log(`Listo: ${changed} archivos actualizados.`);