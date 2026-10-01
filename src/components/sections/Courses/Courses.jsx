import { useState } from "react";
import { courses, courseFilters, coursesSection } from "../../../data/courses";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import "./Courses.css";
import Reveal from "../../ui/Reveal/Reveal";

export default function Courses() {
  const [filter, setFilter] = useState("all");

  const visible = filter === "all" ? courses : courses.filter((c) => c.type === filter);

  return (
    <section className="courses" id="cursos">
      <div className="container">
        <SectionHeader
          label={coursesSection.label}
          title={coursesSection.title}
          text={coursesSection.text}
        />

        <div className="course-filters">
          {courseFilters.map((f) => (
            <button
              key={f.value}
              className={`course-filter ${filter === f.value ? "active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="courses-grid">
          {visible.map((course, i) => {
            const free = course.type === "free";

            return (
             <Reveal as="article" className="course-card" delay={i * 100} key={course.title}>
                <div className="course-image">
                  <ImagePlaceholder src={course.image} alt={course.title} tone="light" />
                  <span className={`course-badge ${course.type}`}>
                    {free ? "GRATUITO" : "CURSO"}
                  </span>
                </div>

                <div className="course-content">
                  <span className="course-category">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="course-footer">
                    {free ? (
                      <strong className="free-price">GRATIS</strong>
                    ) : (
                      <strong className="course-price">S/ {course.price}</strong>
                    )}
                    <a href={course.url}>Ver curso →</a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}