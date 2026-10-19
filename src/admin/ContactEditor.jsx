import ObjectEditor from "./ObjectEditor";
import { contactSection } from "../data/contact";
import { site } from "../config/site";

const FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto", type: "textarea" },
  { key: "formTitle", label: "Título del formulario" },
  { key: "linkedin", label: "Usuario o ruta de LinkedIn" },
  { key: "linkedinUrl", label: "Enlace completo de LinkedIn" },
  { key: "email", label: "Correo de contacto" },
  { key: "location", label: "Ubicación" },
];

export default function ContactEditor() {
  const local = { ...contactSection, linkedin: site.linkedin, linkedinUrl: site.linkedinUrl, email: site.email, location: site.location };
  return <ObjectEditor sectionId="contact" title="Contacto" local={local} fields={FIELDS} />;
}
