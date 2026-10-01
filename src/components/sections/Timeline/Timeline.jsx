import { timeline, timelineSection } from "../../../data/timeline";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import "./Timeline.css";
import Reveal from "../../ui/Reveal/Reveal";


export default function Timeline() {
  return (
    <section className="timeline-section" id="trayectoria">
      <div className="container">
        <SectionHeader
          dark
          label={timelineSection.label}
          title={timelineSection.title}
          text={timelineSection.text}
        />

        <div className="timeline">
          {timeline.map((item, i) => (
            <Reveal className="timeline-item" delay={i * 150} key={item.year}>
            <div className="timeline-item" key={item.year}>
              <div className="timeline-icon">{item.icon}</div>
              <span className="timeline-year">{item.year}</span>
              <span className="timeline-role">{item.role}</span>
              <p>{item.description}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}