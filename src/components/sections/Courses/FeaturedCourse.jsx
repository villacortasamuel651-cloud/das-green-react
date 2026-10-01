import Reveal from "../../ui/Reveal/Reveal";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import { priceLabel } from "./courseUtils";

export default function FeaturedCourse({ course, onOpen }) {
  return (
    <Reveal as="article" className="course-featured">
      <div className="featured-image">
        <ImagePlaceholder src={course.image} alt={course.title} />
        <span className="featured-flag">{course.badge || "DESTACADO"}</span>
      </div>

      <div className="featured-content">
        <span className="course-category">{course.category}</span>
        <h3>{course.title}</h3>
        <p>{course.description}</p>

        <ul className="course-meta light">
          <li>{course.level}</li>
          <li>{course.duration}</li>
          <li>{course.modality}</li>
          {course.certificate && <li>Con certificado</li>}
        </ul>

        <div className="featured-footer">
          <strong className="featured-price">{priceLabel(course)}</strong>
          <button type="button" className="primary-button" onClick={() => onOpen(course)}>
            Ver detalles
            <span>→</span>
          </button>
        </div>
      </div>
    </Reveal>
  );
}