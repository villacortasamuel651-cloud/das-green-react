import { heroSlides } from "../../../data/hero";
import useSlider from "../../../hooks/useSlider";
import Button from "../../ui/Button/Button";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import "./Hero.css";

export default function Hero() {
  const { index, next, prev, goTo, pause, resume } = useSlider(heroSlides.length);

  return (
    <section className="hero" id="inicio" onMouseEnter={pause} onMouseLeave={resume}>
      <div className="hero-slider">
        {heroSlides.map((slide, i) => (
          <article
            key={slide.highlight}
            className={`hero-slide ${i === index ? "active" : ""}`}
            aria-hidden={i !== index}
          >
            <div className="hero-content">
              <span className="eyebrow">{slide.eyebrow}</span>

              <h1>
                {slide.title}
                <strong>{slide.highlight}</strong>
              </h1>

              <p>{slide.text}</p>

              <Button href={slide.cta.href}>{slide.cta.label}</Button>
            </div>

            <div className="hero-image">
              <ImagePlaceholder
                src={slide.image}
                alt={`${slide.title} ${slide.highlight}`}
                label="ESPACIO PARA IMAGEN"
              />
            </div>
          </article>
        ))}
      </div>

      <button className="slider-button prev" aria-label="Anterior" onClick={prev}>
        ←
      </button>
      <button className="slider-button next" aria-label="Siguiente" onClick={next}>
        →
      </button>

      <div className="slider-dots">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.highlight}
            className={`dot ${i === index ? "active" : ""}`}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}