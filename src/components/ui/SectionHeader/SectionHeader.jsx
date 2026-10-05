import Reveal from "../Reveal/Reveal";
import "./SectionHeader.css";

export default function SectionHeader({ label, title, text, dark = false }) {
  return (
    <Reveal className={`section-header ${dark ? "dark" : ""}`}>
      <div>
        <span className="section-label">{label}</span>
        <h2>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </Reveal>
  );
}