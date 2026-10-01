import { useCallback, useState } from "react";
import { courses, courseFilters, coursesSection } from "../../../data/courses";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import CourseCard from "./CourseCard";
import FeaturedCourse from "./FeaturedCourse";
import CourseModal from "./CourseModal";
import "./Courses.css";

const countBy = (value) =>
  value === "all" ? courses.length : courses.filter((c) => c.type === value).length;

export default function Courses() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const closeModal = useCallback(() => setSelected(null), []);

  const visible = filter === "all" ? courses : courses.filter((c) => c.type === filter);

  // El curso destacado solo se muestra aparte cuando no hay filtro
  const featured = filter === "all" ? courses.find((c) => c.featured) : null;
  const list = visible.filter((c) => c !== featured);

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
              <span className="filter-count">{countBy(f.value)}</span>
            </button>
          ))}
        </div>

        {featured && <FeaturedCourse course={featured} onOpen={setSelected} />}

        <div className="courses-grid">
          {list.map((course, i) => (
            <CourseCard key={course.id} course={course} onOpen={setSelected} delay={i * 100} />
          ))}
        </div>
      </div>

      {selected && <CourseModal course={selected} onClose={closeModal} />}
    </section>
  );
}