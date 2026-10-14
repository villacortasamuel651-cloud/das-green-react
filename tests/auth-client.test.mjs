import assert from "node:assert/strict";
import test from "node:test";
import { getAdminSession, loginAdmin } from "../src/utils/auth.js";

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", ...headers },
});

test("el cliente confirma la cookie antes de permitir navegar al panel", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (path, options) => {
    calls.push({ path, options });
    return json({ admin: { email: "admin@example.test" } });
  });
  assert.deepEqual(await loginAdmin(" admin@example.test ", " password "), { email: "admin@example.test" });
  assert.deepEqual(calls.map((call) => call.path), ["/api/auth/login", "/api/auth/me"]);
  assert.deepEqual(JSON.parse(calls[0].options.body), { email: "admin@example.test", password: " password " });
  assert.ok(calls.every((call) => call.options.credentials === "include" && call.options.cache === "no-store"));
});

test("el bloqueo antiguo en texto también muestra tiempo de espera en español", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("Too many requests, please try again later.", {
    status: 429, headers: { "Retry-After": "61", "Content-Type": "text/html" },
  }));
  await assert.rejects(loginAdmin("admin@example.test", "example"), /Espera 2 minutos/);
});

test("una credencial rechazada conserva el mensaje y no hace una segunda petición de sesión", async (t) => {
  const mocked = t.mock.method(globalThis, "fetch", async () => json({ error: "Correo o contraseña incorrectos." }, 401));
  await assert.rejects(loginAdmin("admin@example.test", "example"), /Correo o contraseña incorrectos/);
  assert.equal(mocked.mock.callCount(), 1);
});

test("un HTTP 200 con HTML del fallback nunca se acepta como autenticación", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("<html>landing</html>", { status: 200 }));
  await assert.rejects(loginAdmin("admin@example.test", "example"), /respuesta inesperada/);
  await assert.rejects(getAdminSession(), /respuesta inesperada/);
});

test("si el navegador no conserva la cookie se muestra un error de sesión sin falso acceso", async (t) => {
  t.mock.method(globalThis, "fetch", async (path) => path.endsWith("/login")
    ? json({ admin: { email: "admin@example.test" } })
    : json({ error: "Inicia sesión para continuar." }, 401));
  await assert.rejects(loginAdmin("admin@example.test", "example"), /No se pudo confirmar la sesión.*cookies/);
});

test("los fallos internos se presentan sin exponer detalles del servidor", async (t) => {
  t.mock.method(globalThis, "fetch", async () => json({ error: "internal detail" }, 500));
  await assert.rejects(loginAdmin("admin@example.test", "example"), /servicio de acceso no está disponible/);
});
