import { timeline as localTimeline, timelineSection } from "../../../data/timeline";
import useContent from "../../../hooks/useContent";
import useListContent from "../../../hooks/useListContent";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import "./Timeline.css";
import Reveal from "../../ui/Reveal/Reveal";


export default function Timeline() {
  const timeline = useListContent("timeline", localTimeline);
  const header = { ...timelineSection, ...(useContent("timelineSection") ?? {}) };

  return (
    <section className="timeline-section" id="trayectoria">
      <div className="container">
        <SectionHeader
          dark
          label={header.label}
          title={header.title}
          text={header.text}
        />

        <div className="timeline">
          {timeline.map((item, i) => (
            <Reveal className="timeline-item" delay={i * 150} key={item.id}>
            <div className="timeline-item" key={item.id}>
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