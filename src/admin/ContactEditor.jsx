import ObjectEditor from "./ObjectEditor";
import { contactSection } from "../data/contact";

const FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto", type: "textarea" },
  { key: "formTitle", label: "Título del formulario" },
];

export default function ContactEditor() {
  return <ObjectEditor sectionId="contact" title="Contacto" local={contactSection} fields={FIELDS} />;
}
