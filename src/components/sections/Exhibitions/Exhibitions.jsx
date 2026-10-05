import { useCallback, useState } from "react";
import { exhibitions as localExhibitions, exhibitionsSection, normalizeExhibition } from "../../../data/exhibitions";
import useContent from "../../../hooks/useContent";
import useListContent from "../../../hooks/useListContent";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import "./Exhibitions.css";
import Reveal from "../../ui/Reveal/Reveal";
import ExhibitionModal from "./ExhibitionModal";

export default function Exhibitions() {
  const [active, setActive] = useState(null);
  const exhibitions = useListContent("exhibitions", localExhibitions).map(normalizeExhibition);
  const header = { ...exhibitionsSection, ...(useContent("exhibitionsSection") ?? {}) };
  const closeModal = useCallback(() => setActive(null), []);

  return (
    <section className="exhibitions" id="exposiciones">
      <div className="container">
        <SectionHeader
          label={header.label}
          title={header.title}
          text={header.text}
        />

        <div className="exhibitions-grid">
          {exhibitions.map((item, i) => (
            <Reveal as="article" className="exhibition-card" delay={i * 120} key={item.id}>
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

