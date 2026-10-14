import { site } from "../../../config/site";
import { mergeBooking } from "../../../data/booking";
import useContent from "../../../hooks/useContent";
import Button from "../../ui/Button/Button";
import Reveal from "../../ui/Reveal/Reveal";
import "./Booking.css";

export default function Booking() {
  const { section, card } = mergeBooking(useContent("booking"));

  return (
    <section className="booking-section" id="agendar">
      <div className="container booking-container">
        <Reveal className="booking-content">
          <span className="section-label">{section.label}</span>

          <h2>{section.title}</h2>

          <p>{section.text}</p>

          <Button
            href={site.calendarUrl || "#contacto"}
            target={site.calendarUrl ? "_blank" : undefined}
            rel={site.calendarUrl ? "noopener noreferrer" : undefined}
            aria-label={site.calendarUrl ? `${section.button} (se abre en una pestaña nueva)` : undefined}
          >
            {section.button}
          </Button>

          <small className="calendar-note">{section.note}</small>
        </Reveal>

        <Reveal className="calendar-visual" delay={150}>
          <div className="calendar-card">
            <span className="calendar-eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>

            <ul className="calendar-details">
              {card.details.map((d) => (
                <li key={d.label}>
                  <span>{d.label}</span>
                  <strong>{d.value}</strong>
                </li>
              ))}
            </ul>

            <p className="calendar-foot">{card.footer}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
