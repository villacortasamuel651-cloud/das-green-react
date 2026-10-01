import { useEffect, useState } from "react";
import { site } from "../../../config/site";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);

  // Aparece cuando el visitante ya pasó la portada
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!site.whatsapp) return null;

  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`;

  return (
    <a
      className={`whatsapp-button ${show ? "visible" : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      tabIndex={show ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l4.9-1.3A10 10 0 1 0 12 2z" />
        <circle cx="8" cy="12" r="1.3" />
        <circle cx="12" cy="12" r="1.3" />
        <circle cx="16" cy="12" r="1.3" />
      </svg>
      <span>Escríbenos</span>
    </a>
  );
}