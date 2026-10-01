import Reveal from "../../ui/Reveal/Reveal";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import { priceLabel } from "./courseUtils";

export default function CourseCard({ course, onOpen, delay = 0 }) {
  const free = course.type === "free";

  return (
    <Reveal as="article" className="course-card" delay={delay}>
      <div className="course-image">
        <ImagePlaceholder src={course.image} alt={course.title} tone="light" />
        <span className={`course-badge ${course.type}`}>{free ? "GRATUITO" : "CURSO"}</span>
      </div>

      <div className="course-content">
        <span className="course-category">{course.category}</span>
        <h3>{course.title}</h3>
        <p>{course.description}</p>

        <ul className="course-meta">
          <li>{course.level}</li>
          <li>{course.duration}</li>
          <li>{course.modality}</li>
        </ul>

        <div className="course-footer">
          <strong className={free ? "free-price" : "course-price"}>{priceLabel(course)}</strong>
          <button type="button" className="course-link" onClick={() => onOpen(course)}>
            Ver detalles →
          </button>
        </div>
      </div>
    </Reveal>
  );
}