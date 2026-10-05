import { site } from "../../../config/site";
import useContactForm from "../../../hooks/useContactForm";
import Button from "../../ui/Button/Button";

export default function FreeAccessForm({ course, onBack }) {
  const { status, submit } = useContactForm();

  if (status === "success") {
    return (
      <div className="access-done" role="status">
        <span className="access-check">✓</span>
        <p className="access-title">¡Solicitud registrada!</p>
        <p className="access-text">
          Gracias. Recibirás el acceso a <strong>{course.title}</strong> en tu correo.
        </p>

        {course.enrollUrl && (
          <Button href={course.enrollUrl} target="_blank" rel="noopener noreferrer">
            Ir al curso
          </Button>
        )}
      </div>
    );
  }

  return (
    <form className="access-form" onSubmit={submit}>
      <p className="access-title">Recibe el acceso gratis</p>
      <p className="access-text">Déjanos tus datos y te enviaremos el acceso a este curso.</p>

      {/* Datos que llegan a tu correo para identificar la solicitud */}
      <input type="hidden" name="_subject" value={`Acceso a curso gratuito: ${course.title}`} />
      <input type="hidden" name="course" value={course.title} />
      <input type="hidden" name="source" value="Curso gratuito" />

      <div className="field">
        <label htmlFor="access-name">Nombre completo</label>
        <input id="access-name" name="name" type="text" required minLength={2} autoComplete="name" autoFocus />
      </div>

      <div className="field">
        <label htmlFor="access-email">Correo electrónico</label>
        <input id="access-email" name="email" type="email" required autoComplete="email" />
      </div>

      <label className="access-consent">
        <input type="checkbox" name="consent" value="Acepta" required />
        <span>
            Acepto que mis datos se usen para enviarme el acceso al curso y novedades relacionadas.{" "}
        <a href="#privacidad">Política de privacidad</a>
        </span>
    </label>

      {/* Campo trampa contra spam */}
      <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <button type="submit" className="primary-button" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Obtener acceso"}
        {status !== "sending" && <span>→</span>}
      </button>

      {status === "error" && (
        <p className="form-status error" role="alert">
          No pudimos registrar tu solicitud. Inténtalo de nuevo o escríbenos a {site.email}.
        </p>
      )}

      <button type="button" className="access-back" onClick={onBack}>
        ← Volver al detalle
      </button>
    </form>
  );
}