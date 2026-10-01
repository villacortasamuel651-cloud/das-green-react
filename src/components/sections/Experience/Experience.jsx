import { experience, experienceSection } from "../../../data/experience";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import "./Experience.css";
import Reveal from "../../ui/Reveal/Reveal";

export default function Experience() {
  return (
    <section className="experience" id="experiencia">
      <div className="container">
        <SectionHeader
          label={experienceSection.label}
          title={experienceSection.title}
          text={experienceSection.text}
        />

        <div className="experience-grid">
          {experience.map((item, i) => (
            <Reveal as="article" className="experience-card" delay={i * 100} key={item.title}>
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