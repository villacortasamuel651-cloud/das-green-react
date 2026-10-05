import ObjectEditor from "./ObjectEditor";
import { bookingCard, bookingEditable } from "../data/booking";

const FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto", type: "textarea" },
  { key: "button", label: "Texto del botón" },
  { key: "note", label: "Nota bajo el botón" },
  { key: "cardEyebrow", label: "Tarjeta · etiqueta" },
  { key: "cardTitle", label: "Tarjeta · título" },
  ...bookingCard.details.map((d, i) => ({ key: `detail${i}`, label: `Tarjeta · ${d.label}` })),
  { key: "cardFooter", label: "Tarjeta · texto final" },
];

export default function BookingEditor() {
  return <ObjectEditor sectionId="booking" title="Reunión" local={bookingEditable} fields={FIELDS} />;
}
