export async function seedContent({ database, documents, mediaStore, dryRun = false }) {
  const connection = await database.getConnection();
  const report = { created: [], preserved: [], dryRun };
  let locked = false;
  let inTransaction = false;
  let commitAttempted = false;
  try {
    if (!dryRun) {
      const [[lock]] = await connection.execute("SELECT GET_LOCK('dazgreen-content-seed', 10) AS acquired");
      if (Number(lock.acquired) !== 1) throw new Error("SEED_LOCK_UNAVAILABLE");
      locked = true;
      await connection.beginTransaction();
      inTransaction = true;
    }
    for (const { id, payload } of documents) {
      const [existing] = await connection.execute(`SELECT id FROM content WHERE id = ?${dryRun ? "" : " FOR UPDATE"}`, [id]);
      if (existing.length) { report.preserved.push(id); continue; }
      if (!dryRun) {
        const content = await mediaStore.prepare(payload, connection);
        const serialized = JSON.stringify(content);
        if (/data:(?:image|video)\//i.test(serialized) || serialized.includes("seed-file:")) throw new Error("SEED_INVALID_MEDIA");
        await connection.execute("INSERT INTO content (id, payload) VALUES (?, ?)", [id, serialized]);
      }
      report.created.push(id);
    }
    if (!dryRun) {
      commitAttempted = true;
      await connection.commit();
      inTransaction = false;
    }
    return report;
  } catch (error) {
    if (inTransaction) await connection.rollback().catch(() => {});
    // Un fallo de red durante COMMIT puede tener resultado desconocido.
    // Conservar los archivos en ese caso evita romper referencias confirmadas.
    if (!dryRun && !commitAttempted) await mediaStore.rollback();
    throw error;
  } finally {
    if (locked) await connection.execute("SELECT RELEASE_LOCK('dazgreen-content-seed')").catch(() => {});
    connection.release();
  }
}
