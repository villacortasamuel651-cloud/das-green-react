import { timeline as localTimeline, timelineSection } from "../../../data/timeline";
import useContent from "../../../hooks/useContent";
import useListContent from "../../../hooks/useListContent";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import "./Timeline.css";
import Reveal from "../../ui/Reveal/Reveal";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  GraduationCap,
  Presentation,
} from "lucide-react";
import { normalizeTimelineIcon } from "../../../data/iconOptions";

const ICONS = {
  presentation: Presentation,
  graduation: GraduationCap,
  book: BookOpen,
  analytics: ChartNoAxesCombined,
  award: Award,
  business: BriefcaseBusiness,
  organization: Building2,
};
const FALLBACK_ICONS = [Presentation, GraduationCap, ChartNoAxesCombined, Award];

function MilestoneGlyph({ name, index }) {
  const Icon = ICONS[normalizeTimelineIcon(name)] || FALLBACK_ICONS[index % FALLBACK_ICONS.length];
  return <Icon size={23} strokeWidth={1.7} />;
}

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

        <Reveal className="timeline-track">
          <div className="timeline">
            {timeline.map((item, i) => (
              <Reveal as="article" className="timeline-item" delay={i * 120} key={item.id}>
                <span className="timeline-icon" aria-hidden="true">
                  <MilestoneGlyph name={item.icon} index={i} />
                </span>
                <span className="timeline-year">{item.year}</span>
                <div className="timeline-copy">
                  <h3 className="timeline-role">{item.role}</h3>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
