import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../ui/Button/Button";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import FreeAccessForm from "./FreeAccessForm";
import { priceLabel } from "./courseUtils";
import "./CourseModal.css";

export default function CourseModal({ course, onClose }) {
  const closeRef = useRef(null);
  const [step, setStep] = useState("details"); // details | form

  useEffect(() => {
    const previous = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose();

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  const free = course.type === "free";
  const external = Boolean(course.enrollUrl);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="modal-close" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>

        <div className="modal-media">
          <ImagePlaceholder src={course.image} alt={course.title} tone="light" />
          <span className={`course-badge ${course.type}`}>{free ? "GRATUITO" : "CURSO"}</span>
        </div>

        <div className="modal-body">
          <div className="modal-main">
            <span className="course-category">{course.category}</span>
            <h3 id="course-modal-title">{course.title}</h3>
            <p className="modal-lead">{course.description}</p>

            <h4>Lo que aprenderás</h4>
            <ul className="modal-list check">
              {course.learn.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h4>Temario</h4>
            <ol className="modal-list syllabus">
              {course.syllabus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>

            <h4>Dirigido a</h4>
            <p className="modal-audience">{course.audience}</p>
          </div>

          <aside className="modal-side">
            <strong className={`modal-price ${free ? "free-price" : ""}`}>{priceLabel(course)}</strong>

            {free && step === "form" ? (
              <FreeAccessForm course={course} onBack={() => setStep("details")} />
            ) : (
              <>
                <ul className="modal-facts">
                  <li><span>Nivel</span><strong>{course.level}</strong></li>
                  <li><span>Duración</span><strong>{course.duration}</strong></li>
                  <li><span>Modalidad</span><strong>{course.modality}</strong></li>
                  <li><span>Certificado</span><strong>{course.certificate ? "Incluido" : "No incluido"}</strong></li>
                </ul>

                {free ? (
                  <button type="button" className="primary-button" onClick={() => setStep("form")}>
                    Acceder gratis
                    <span>→</span>
                  </button>
                ) : (
                  <Button
                    href={external ? course.enrollUrl : "#contacto"}
                    onClick={external ? undefined : onClose}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    Inscribirme
                  </Button>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
    </div>,
    document.body
  );
}