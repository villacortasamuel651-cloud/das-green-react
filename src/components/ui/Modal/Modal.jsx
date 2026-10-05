import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export default function Modal({ onClose, titleId, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    // En fase de captura: si hay otra ventana abierta debajo, Esc solo cierra esta
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey, true);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey, true);
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div className="ui-modal-overlay" onClick={onClose}>
      <div
        className="ui-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="ui-modal-close" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}