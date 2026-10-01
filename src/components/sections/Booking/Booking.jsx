import { site } from "../../../config/site";
import { bookingCard } from "../../../data/booking";
import Button from "../../ui/Button/Button";
import Reveal from "../../ui/Reveal/Reveal";
import "./Booking.css";

export default function Booking() {
  const handleClick = (e) => {
    e.preventDefault();

    // Sin enlace de calendario todavía: lleva al formulario de contacto
    if (!site.calendarUrl) {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.open(site.calendarUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="booking-section" id="agendar">
      <div className="container booking-container">
        <Reveal className="booking-content">
          <span className="section-label">AGENDEMOS UNA REUNIÓN</span>

          <h2>¿Hablamos sobre tu próximo proyecto?</h2>

          <p>
            Agenda un espacio en mi calendario y conversemos sobre nuevas
            oportunidades, proyectos o alianzas.
          </p>

          <Button href="#" onClick={handleClick}>
            Agendar reunión
          </Button>

          <small className="calendar-note">
            Elige un horario disponible y recibirás la invitación por correo.
          </small>
        </Reveal>

        <Reveal className="calendar-visual" delay={150}>
          <div className="calendar-card">
            <span className="calendar-eyebrow">{bookingCard.eyebrow}</span>
            <h3>{bookingCard.title}</h3>

            <ul className="calendar-details">
              {bookingCard.details.map((d) => (
                <li key={d.label}>
                  <span>{d.label}</span>
                  <strong>{d.value}</strong>
                </li>
              ))}
            </ul>

            <p className="calendar-foot">{bookingCard.footer}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}