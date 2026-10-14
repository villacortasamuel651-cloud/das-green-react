import assert from "node:assert/strict";
import crypto from "node:crypto";
import { once } from "node:events";
import test from "node:test";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import express from "express";

process.env.NODE_ENV = "production";
process.env.APP_ORIGIN = "https://dazgreen.com";
process.env.JWT_SECRET = crypto.randomBytes(48).toString("hex");
const { createAuthRouter } = await import("../server/auth-routes.js");
const password = "test-password-only";
const account = { id: 1, email: "admin@example.test", password_hash: await bcrypt.hash(password, 4) };

async function setup(t, { accounts = [account], limit = 10 } = {}) {
  const queries = [];
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/auth", createAuthRouter({
    database: { execute: async (sql, params) => {
      queries.push({ sql, params });
      return [accounts.filter((admin) => admin.email === params[0])];
    } },
    loginLimitOptions: { limit },
  }));
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  const login = (body = { email: account.email, password }, origin = process.env.APP_ORIGIN) => fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
  return { base, login, queries };
}

test("login válido entrega cookie segura y la sesión permite comprobar el administrador", async (t) => {
  const { base, login, queries } = await setup(t);
  const response = await login({ email: ` ${account.email.toUpperCase()} `, password });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { admin: { email: account.email } });
  assert.deepEqual(queries[0].params, [account.email]);
  const cookie = response.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Strict/);
  assert.doesNotMatch(cookie, /Domain=/);
  const session = await fetch(`${base}/api/auth/me`, { headers: { Cookie: cookie.split(";")[0] } });
  assert.equal(session.status, 200);
  assert.deepEqual(await session.json(), { admin: { email: account.email } });
  const anonymous = await fetch(`${base}/api/auth/me`);
  assert.equal(anonymous.status, 401);
});

test("cuenta ausente y contraseña incorrecta devuelven el mismo rechazo sin filtrar cuentas", async (t) => {
  const { login } = await setup(t);
  for (const body of [{ email: "absent@example.test", password }, { email: account.email, password: "incorrecta" }]) {
    const response = await login(body);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: "Correo o contraseña incorrectos." });
    assert.equal(response.headers.get("set-cookie"), null);
  }
});

test("base sin administradores rechaza el acceso y no crea cuentas de forma automática", async (t) => {
  const { login, queries } = await setup(t, { accounts: [] });
  assert.equal((await login()).status, 401);
  assert.equal(queries.length, 1);
  assert.match(queries[0].sql, /^SELECT /);
});

test("datos vacíos o de tipo incorrecto no se consultan en MySQL", async (t) => {
  const { login, queries } = await setup(t);
  for (const body of [{ email: "", password: "" }, { email: {}, password: [] }]) {
    assert.equal((await login(body)).status, 400);
  }
  assert.equal(queries.length, 0);
});

test("bloqueo devuelve JSON español y Retry-After; accesos válidos no consumen fallos", async (t) => {
  const { login } = await setup(t, { limit: 2 });
  for (let i = 0; i < 3; i++) assert.equal((await login()).status, 200);
  const invalid = { email: account.email, password: "incorrecta" };
  assert.equal((await login(invalid)).status, 401);
  assert.equal((await login(invalid)).status, 401);
  const blocked = await login(invalid);
  assert.equal(blocked.status, 429);
  assert.match(blocked.headers.get("content-type"), /application\/json/);
  assert.ok(Number(blocked.headers.get("retry-after")) > 0);
  assert.match((await blocked.json()).error, /Demasiados intentos/);
});

test("un origen ajeno se rechaza antes de consultar cuentas o consumir el límite", async (t) => {
  const { login, queries } = await setup(t, { limit: 1 });
  const rejected = await login(undefined, "https://another-site.example");
  assert.equal(rejected.status, 403);
  assert.equal(queries.length, 0);
  assert.equal((await login()).status, 200);
});

test("logout elimina la cookie y sus respuestas no se cachean", async (t) => {
  const { base } = await setup(t);
  const response = await fetch(`${base}/api/auth/logout`, { method: "POST", headers: { Origin: process.env.APP_ORIGIN } });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("set-cookie"), /Expires=Thu, 01 Jan 1970/);
});
