import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { loadLocalContent, projectRoot } from "../server/seed/local-content.js";
import { seedContent } from "../server/seed/content-seeder.js";
import { createSeedMediaStore } from "../server/seed/media-store.js";

const databaseFor = (existing = new Map(), { failInsert = false, failCommit = false } = {}) => {
  const calls = [];
  let pending = new Map();
  const connection = {
    execute: async (sql, params = []) => {
      calls.push(sql);
      if (sql.includes("GET_LOCK")) return [[{ acquired: 1 }]];
      if (sql.includes("RELEASE_LOCK")) return [[{ released: 1 }]];
      if (sql.startsWith("SELECT id")) return [[...(existing.has(params[0]) ? [{ id: params[0] }] : [])]];
      if (sql.startsWith("INSERT INTO content")) {
        if (failInsert) throw new Error("INSERT_FAILED");
        pending.set(params[0], JSON.parse(params[1]));
      }
      return [[], []];
    },
    beginTransaction: async () => { calls.push("BEGIN"); },
    commit: async () => {
      if (failCommit) throw new Error("COMMIT_UNKNOWN");
      calls.push("COMMIT");
      for (const [id, value] of pending) existing.set(id, value);
      pending = new Map();
    },
    rollback: async () => { calls.push("ROLLBACK"); pending = new Map(); },
    release: () => { calls.push("RELEASE"); },
  };
  return { getConnection: async () => connection, calls, connection };
};
const passthroughMedia = { prepare: async (value) => value, rollback: async () => {} };

test("el contenido local respeta los 18 contratos y los IDs de reconciliación", async () => {
  const documents = await loadLocalContent();
  assert.equal(documents.length, 18);
  assert.equal(new Set(documents.map((entry) => entry.id)).size, 18);
  assert.equal(documents.find((entry) => entry.id === "hero").payload.highlight, "ZORRILLA GREEN");
  for (const document of documents) {
    document.payload.items?.forEach((item, index) => assert.equal(item.id, `local-${index}`));
    assert.ok(!JSON.stringify(document.payload).includes("data:image"));
  }
});

test("el seeder es idempotente y conserva payloads existentes, incluso vacíos", async () => {
  const existing = new Map([["hero", { videoUrl: "/api/media/existing", custom: true }], ["gallery", { items: [] }]]);
  const database = databaseFor(existing);
  const documents = [{ id: "hero", payload: {} }, { id: "gallery", payload: {} }, { id: "contact", payload: { title: "Hola" } }];
  const report = await seedContent({ database, documents, mediaStore: passthroughMedia });
  assert.deepEqual(report.created, ["contact"]);
  assert.deepEqual(report.preserved, ["hero", "gallery"]);
  assert.equal(existing.get("hero").custom, true);
  assert.deepEqual(existing.get("gallery"), { items: [] });
  const repeated = await seedContent({ database, documents, mediaStore: passthroughMedia });
  assert.deepEqual(repeated.created, []);
  assert.equal(repeated.preserved.length, 3);
  assert.ok(!database.calls.some((sql) => /^(UPDATE|DELETE)\b|admins/.test(sql)));
});

test("dry-run lee el destino sin bloqueos, transacciones, archivos ni escrituras", async () => {
  const database = databaseFor();
  const report = await seedContent({ database, documents: [{ id: "about", payload: {} }], dryRun: true,
    mediaStore: { prepare: () => { throw new Error("No debe cargar imágenes"); } } });
  assert.deepEqual(report.created, ["about"]);
  assert.ok(database.calls.every((sql) => sql.startsWith("SELECT id") || sql === "RELEASE"));
});

test("un error antes del commit revierte SQL y limpia archivos nuevos", async () => {
  const database = databaseFor(new Map(), { failInsert: true });
  let cleaned = false;
  await assert.rejects(seedContent({ database, documents: [{ id: "about", payload: {} }],
    mediaStore: { prepare: async () => ({}), rollback: async () => { cleaned = true; } } }), /INSERT_FAILED/);
  assert.ok(cleaned);
  assert.ok(database.calls.includes("ROLLBACK"));
  assert.ok(database.calls.some((sql) => sql.includes("RELEASE_LOCK")));
});

test("un resultado desconocido de commit conserva archivos para no romper contenido", async () => {
  const database = databaseFor(new Map(), { failCommit: true });
  let cleaned = false;
  await assert.rejects(seedContent({ database, documents: [{ id: "about", payload: {} }],
    mediaStore: { prepare: async () => ({}), rollback: async () => { cleaned = true; } } }), /COMMIT_UNKNOWN/);
  assert.equal(cleaned, false);
});

test("las imágenes se convierten a WebP privado y se reutilizan sin duplicarse", async () => {
  const mediaRoot = await fs.mkdtemp(path.join(os.tmpdir(), "dazgreen-seed-test-"));
  try {
    const database = databaseFor();
    const store = createSeedMediaStore({ projectRoot, mediaRoot });
    const source = "seed-file:src/assets/images/about/profile.jpg";
    const prepared = await store.prepare({ image: source, nested: [source, source] }, database.connection);
    assert.match(prepared.image, /^\/api\/media\/[0-9a-f-]{36}$/);
    assert.deepEqual(prepared.nested, [prepared.image, prepared.image]);
    const files = await fs.readdir(mediaRoot);
    assert.equal(files.length, 1);
    const buffer = await fs.readFile(path.join(mediaRoot, files[0]));
    assert.equal(buffer.subarray(8, 12).toString(), "WEBP");
    assert.equal(database.calls.filter((sql) => sql.startsWith("INSERT INTO media")).length, 1);
    await assert.rejects(store.prepare("seed-file:../../outside.jpg", database.connection), /SEED_INVALID_PATH/);
    await store.rollback();
    assert.deepEqual(await fs.readdir(mediaRoot), []);
  } finally {
    // Solo el directorio temporal creado por esta prueba.
    await fs.rm(mediaRoot, { recursive: true, force: true });
  }
});
