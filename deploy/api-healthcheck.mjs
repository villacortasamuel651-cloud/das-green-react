// Comprueba HTTP y una consulta a content sin crear ni modificar datos.
try {
  const response = await fetch(`http://127.0.0.1:${process.env.PORT || 3001}/api/content/__docker_healthcheck__`, {
    signal: AbortSignal.timeout(5000),
  });
  if (![200, 404].includes(response.status)) process.exit(1);
} catch {
  process.exit(1);
}
