import { experience as localExperience, experienceSection } from "../../../data/experience";
import useContent from "../../../hooks/useContent";
import useListContent from "../../../hooks/useListContent";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import "./Experience.css";
import Reveal from "../../ui/Reveal/Reveal";

export default function Experience() {
  const experience = useListContent("experience", localExperience);
  const header = { ...experienceSection, ...(useContent("experienceSection") ?? {}) };

  return (
    <section className="experience" id="experiencia">
      <div className="container">
        <SectionHeader
          label={header.label}
          title={header.title}
          text={header.text}
        />

        <div className="experience-grid">
          {experience.map((item, i) => (
            <Reveal as="article" className="experience-card" delay={i * 100} key={item.id}>
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}