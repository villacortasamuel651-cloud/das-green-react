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
          <h2>{testimonialsSection.title}</h2>
        </div>

        <div className="testimonial-slider" onMouseEnter={pause} onMouseLeave={resume}>
          {testimonials.map((t, i) => (
            <article
              key={t.text}
              className={`testimonial ${i === index ? "active" : ""}`}
              aria-hidden={i !== index}
            >
              <span className="quote-symbol">“</span>

              <p className="testimonial-text">{t.text}</p>

              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </article>
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