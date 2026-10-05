import ListEditor from "./ListEditor";
import { testimonials } from "../data/testimonials";

const FIELDS = [
  { key: "name", label: "Nombre" },
  { key: "role", label: "Cargo / Empresa" },
  { key: "text", label: "Testimonio", type: "textarea" },
];

export default function TestimonialsEditor() {
  return (
    <ListEditor
      sectionId="testimonials"
      title="Testimonios"
      localItems={testimonials}
      fields={FIELDS}
      itemTitle={(item) => item.name}
      addLabel="Agregar testimonio"
    />
  );
}
