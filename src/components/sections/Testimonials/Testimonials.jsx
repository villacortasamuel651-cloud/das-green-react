import { testimonials, testimonialsSection } from "../../../data/testimonials";
import useSlider from "../../../hooks/useSlider";
import "./Testimonials.css";

export default function Testimonials() {
  const { index, goTo, pause, resume } = useSlider(testimonials.length);

  return (
    <section className="testimonials" id="testimonios">
      <div className="container">
      <div className="testimonial-header">
  <span className="section-label">{testimonialsSection.label}</span>
  <h2 className="testimonial-title">
    Lo que dicen <span className="highlight">quienes han compartido</span> el camino
  </h2>
</div>

        {/* Carrusel tipo D’Leche & Miel */}
        <div
          className="snap-carousel testimonial-grid"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {testimonials.map((t, i) => (
            <figure
              key={t.text}
              className={`testimonial ${i === index ? "active" : ""}`}
              aria-hidden={i !== index}
            >
              <img src={t.image} alt={t.name} className="testimonial-img" />

              <figcaption className="testimonial-content">
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="testimonial-dots">
          {testimonials.map((t, i) => (
            <button
              key={t.text}
              className={`testimonial-dot ${i === index ? "active" : ""}`}
              aria-label={`Testimonio ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
