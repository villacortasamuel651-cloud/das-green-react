import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../utils/auth";
import { site } from "../config/site";
import AdminIcon from "./AdminIcon";
import "./admin.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submittingRef = useRef(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      await loginAdmin(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof TypeError
        ? "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo."
        : err.message || "No se pudo iniciar sesión.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page admin-login">
      <aside className="admin-login-story">
        <Link to="/" className="admin-brand"><span>{site.brand.main}</span> {site.brand.sub}<small>{site.name}</small></Link>
        <div className="admin-login-intro">
          <span className="admin-eyebrow">PANEL DE ADMINISTRACIÓN</span>
          <h2>Una presencia que<br />crece contigo.</h2>
          <p>Un espacio para compartir tu trayectoria, tus ideas y lo que viene después.</p>
          <div className="admin-login-illustration" aria-hidden="true">
            <div className="admin-illustration-bar"><i /><i /><i /></div>
            <div className="admin-illustration-layout"><div className="admin-illustration-nav"><span /><span /><span /><span /></div><div className="admin-illustration-content"><div /><span /><span /><section><i /><i /><i /></section></div></div>
          </div>
        </div>
        <p className="admin-login-owner">{site.name}<span>Sitio personal · Administración de contenido</span></p>
      </aside>
      <main className="admin-login-main">
        <Link className="admin-back-link" to="/">← Volver al sitio</Link>
        <div className="admin-login-form-wrap">
          <span className="admin-login-lock"><AdminIcon name="lock" /></span>
          <span className="admin-eyebrow">ACCESO ADMINISTRATIVO</span>
          <h1>Bienvenido de nuevo.</h1>
          <p className="admin-login-description">Ingresa con tu cuenta para gestionar el contenido del sitio.</p>
          <form className="admin-login-form" onSubmit={handleSubmit} aria-busy={submitting}>
            <div className="admin-field">
              <label htmlFor="admin-email">Correo electrónico</label>
              <input id="admin-email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={submitting} required aria-describedby={error ? "admin-login-error" : undefined} />
            </div>
            <div className="admin-field">
              <label htmlFor="admin-password">Contraseña</label>
              <div className="admin-password-field">
                <input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Ingresa tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} disabled={submitting} required aria-describedby={error ? "admin-login-error" : undefined} />
                <button type="button" className="admin-password-toggle" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword} aria-controls="admin-password" onClick={() => setShowPassword(!showPassword)} disabled={submitting}><AdminIcon name="eye" /></button>
              </div>
            </div>
            {error && <p id="admin-login-error" className="admin-alert" role="alert">{error}</p>}
            <button className="admin-login-submit" type="submit" disabled={submitting}>{submitting && <span className="admin-spinner" aria-hidden="true" />}{submitting ? "Ingresando…" : "Ingresar al panel"}{!submitting && <AdminIcon name="arrow" />}</button>
            <p className="admin-login-note">Acceso reservado a los administradores del sitio.</p>
          </form>
        </div>
        <p className="admin-login-footer">{site.brand.main} {site.brand.sub} · Panel de contenido</p>
      </main>
    </div>
  );
}
