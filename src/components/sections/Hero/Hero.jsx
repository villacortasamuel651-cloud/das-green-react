import Button from "../../ui/Button/Button";
import { heroContent } from "../../../data/hero";
import useContent from "../../../hooks/useContent";
import "./Hero.css";

export default function Hero() {
  const remote = useContent("hero") ?? {};
  const legacySlide = remote.slides?.[0] ?? {};
  const content = {
    ...heroContent,
    ...legacySlide,
    ...remote,
    eyebrow: remote.eyebrow ?? legacySlide.eyebrow ?? heroContent.eyebrow,
    title: remote.title ?? legacySlide.title ?? heroContent.title,
    highlight: remote.highlight ?? legacySlide.highlight ?? heroContent.highlight,
    text: remote.text ?? legacySlide.text ?? heroContent.text,
    ctaLabel: remote.ctaLabel ?? legacySlide.ctaLabel ?? legacySlide.cta?.label ?? heroContent.ctaLabel,
    ctaHref: remote.ctaHref ?? legacySlide.ctaHref ?? legacySlide.cta?.href ?? heroContent.ctaHref,
    videoUrl: remote.videoUrl ?? heroContent.videoUrl,
  };

  return (
    <section className={`hero ${content.videoUrl ? "has-video" : "hero-placeholder"}`} id="inicio">
      {content.videoUrl ? (
        <video className="hero-video" autoPlay loop muted playsInline aria-hidden="true">
          <source src={content.videoUrl} type={content.videoMimeType || "video/mp4"} />
        </video>
      ) : (
        <div className="hero-video-placeholder" aria-label="Espacio reservado para el video de fondo">
          <span>VIDEO DE PRESENTACIÓN</span>
          <span>El video se podrá cargar desde el panel de administración</span>
        </div>
      )}
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}<strong>{content.highlight}</strong></h1>
        <p>{content.text}</p>
        <Button href={content.ctaHref}>{content.ctaLabel}</Button>
      </div>
      <span className="hero-index">LIMA · PERÚ</span>
    </section>
  );
}
