import { about } from "../../../data/about";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import "./About.css";
import Reveal from "../../ui/Reveal/Reveal";

export default function About() {
  return (
    <section className="about" id="sobre-mi">
      <div className="container about-grid">
        <Reveal className="about-image"> 
          <ImagePlaceholder src={about.image} alt="Diego Alberto Sorrilla Green" tone="light" label="ESPACIO PARA IMAGEN" />
        </Reveal>

        <Reveal className="about-content" delay={150}>
          <span className="section-label">{about.label}</span>
          <h2>{about.title}</h2>

          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}

          <div className="stats">
            {about.stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat-icon">{s.icon}</div>
                <div>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}