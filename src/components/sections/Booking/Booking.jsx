import { site } from "../../../config/site";
import Button from "../../ui/Button/Button";
import "./Booking.css";

export default function Booking() {
  const handleClick = (e) => {
  e.preventDefault();

  if (!site.calendarUrl) {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  window.open(site.calendarUrl, "_blank", "noopener,noreferrer");
};

  return (
    <section className="booking-section" id="agendar">
      <div className="container booking-container">
        <div className="booking-content">
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
        </div>

        <div className="calendar-visual">
          <div className="calendar-card">
            <div className="calendar-top">
              <span>GOOGLE</span>
              <strong>CALENDAR</strong>
            </div>

            <div className="calendar-icon">📅</div>

            <p>Reserva un espacio para conversar.</p>

            <div className="calendar-line" />
            <div className="calendar-line short" />
          </div>
        </div>
      </div>
    </section>
  );
}