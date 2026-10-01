import { site } from "../../../config/site";
import { contactSubjects } from "../../../data/contact";
import useContactForm from "../../../hooks/useContactForm";
import Reveal from "../../ui/Reveal/Reveal";
import "./Contact.css";

const info = [
  { icon: "in", title: "LinkedIn", value: site.linkedin, href: site.linkedinUrl },
  { icon: "✉", title: "Correo", value: site.email, href: `mailto:${site.email}` },
  { icon: "♧", title: "Ubicación", value: site.location },
];

export default function Contact() {
  const { status, errorMessage, submit } = useContactForm();

  return (
    <section className="contact" id="contacto">
      <div className="container contact-grid">
        <Reveal className="contact-text">
          <span className="section-label">CONTACTO</span>

          <h2>Hablemos sobre nuevas oportunidades.</h2>

          <p>
            Estoy abierto a conversar sobre proyectos, alianzas y oportunidades
            que generen un impacto positivo.
          </p>

          <div className="contact-info">
            {info.map((item) => {
              const Tag = item.href ? "a" : "div";
              return (
                <Tag className="contact-item" href={item.href} key={item.title}>
                  <div className="contact-icon">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.value}</span>
                  </div>
                </Tag>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="contact-form-card" delay={150}>
          <h3>Envíame un mensaje</h3>

          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Nombre completo</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  autoComplete="name"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="field">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="subject">Motivo de contacto</label>
              <select id="subject" name="subject" required defaultValue="">
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {contactSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                minLength={10}
                placeholder="Cuéntame brevemente en qué puedo ayudarte"
              />
            </div>

            {/* Campo trampa contra spam: las personas no lo ven */}
            <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <button type="submit" className="primary-button form-submit" disabled={status === "sending"}>
              {status === "sending" ? "Enviando…" : "Enviar mensaje"}
              {status !== "sending" && <span>→</span>}
            </button>

            <p className="form-note">Tus datos se usarán únicamente para responder tu consulta.</p>

            {status === "success" && (
              <p className="form-status success" role="status">
                ¡Gracias! Recibí tu mensaje y te responderé a la brevedad.
              </p>
            )}

            {status === "error" && (
  <p className="form-status error" role="alert">
    No pudimos enviar tu mensaje. Inténtalo nuevamente o escríbenos a {site.email}.
    {errorMessage && <small style={{ display: "block", marginTop: 6 }}>Detalle: {errorMessage}</small>}
  </p>
)}
          </form>
        </Reveal>
      </div>
    </section>
  );
}