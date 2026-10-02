import { useCallback, useState } from "react";
import { exhibitions, exhibitionsSection } from "../../../data/exhibitions";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import "./Exhibitions.css";
import Reveal from "../../ui/Reveal/Reveal";
import ExhibitionModal from "./ExhibitionModal";

export default function Exhibitions() {
  const [active, setActive] = useState(null);
  const closeModal = useCallback(() => setActive(null), []);

  return (
    <section className="exhibitions" id="exposiciones">
      <div className="container">
        <SectionHeader
          label={exhibitionsSection.label}
          title={exhibitionsSection.title}
          text={exhibitionsSection.text}
        />

        <div className="exhibitions-grid">
          {exhibitions.map((item, i) => (
            <Reveal as="article" className="exhibition-card" delay={i * 120} key={item.title}>
              <div className="exhibition-image">
                <ImagePlaceholder src={item.image} alt={item.title} tone="light" />
                <span className="event-type">{item.type}</span>
              </div>

              <div className="exhibition-content">
                <span className="card-date">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button type="button" className="exhibition-link" onClick={() => setActive(item)}>
                  Ver exposición →
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {active && <ExhibitionModal item={active} onClose={closeModal} />}
    </section>
  );
}
s
