async function readAdmin(response) {
  const result = await response.json().catch(() => null);
  if (response.status === 429) {
    const seconds = Number(response.headers.get("Retry-After"));
    const minutes = Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds / 60) : null;
    const wait = minutes ? `${minutes} ${minutes === 1 ? "minuto" : "minutos"}` : "unos minutos";
    throw new Error(`Demasiados intentos de acceso. Espera ${wait} antes de volver a intentarlo.`);
  }
  if (!response.ok) {
    if (response.status >= 500) throw new Error("El servicio de acceso no está disponible. Inténtalo de nuevo más tarde.");
    throw new Error(result?.error || "No se pudo iniciar sesión. Inténtalo de nuevo.");
  }
  if (!result?.admin?.email || typeof result.admin.email !== "string") {
    throw new Error("El servicio de acceso devolvió una respuesta inesperada. Inténtalo de nuevo más tarde.");
  }
  return result.admin;
}

export async function getAdminSession({ signal } = {}) {
  const response = await fetch("/api/auth/me", { credentials: "include", cache: "no-store", signal });
  return readAdmin(response);
}

export async function loginAdmin(email, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({ email: email.trim(), password }),
  });
  await readAdmin(response);
  try {
    return await getAdminSession();
  } catch (error) {
    throw new Error(`No se pudo confirmar la sesión. Comprueba que tu navegador permite cookies. ${error.message}`);
  }
}
