import Modal from "../../ui/Modal/Modal";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import Button from "../../ui/Button/Button";

export default function ExhibitionModal({ item, onClose }) {
  const { detail } = item;

  return (
    <Modal onClose={onClose} titleId="exhibition-title" className="exhibition-modal">
      <article>
        <div className="exhibition-modal-image">
          <ImagePlaceholder src={item.image} alt={item.title} tone="light" />
          <span className="event-type">{item.type}</span>
        </div>

        <div className="exhibition-modal-body">
          <span className="exhibition-modal-year">{item.year}</span>
          <h2 id="exhibition-title">{item.title}</h2>
          <p className="exhibition-modal-lead">{detail.summary}</p>

          <ul className="exhibition-modal-facts">
            <li><span>Tipo</span><strong>{item.type}</strong></li>
            <li><span>Año</span><strong>{item.year}</strong></li>
            <li><span>Lugar</span><strong>{detail.place}</strong></li>
            <li><span>Modalidad</span><strong>{detail.modality}</strong></li>
          </ul>

          <div className="exhibition-modal-copy">
            {detail.paragraphs.map((text) => <p key={text}>{text}</p>)}
          </div>

          <ul className="exhibition-modal-tags" aria-label="Temas de la exposición">
            {detail.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>

          <Button href="#contacto" onClick={onClose}>Invitar a mi evento</Button>
        </div>
      </article>
    </Modal>
  );
}
