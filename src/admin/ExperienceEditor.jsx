import ObjectEditor from "./ObjectEditor";
import ListEditor from "./ListEditor";
import { experience, experienceSection } from "../data/experience";

const HEADER_FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto", type: "textarea" },
];

const FIELDS = [
  { key: "title", label: "Título" },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "icon", label: "Icono (emoji o símbolo)" },
];

export default function ExperienceEditor() {
  return (
    <>
      <ObjectEditor sectionId="experienceSection" title="Experiencia · encabezado" local={experienceSection} fields={HEADER_FIELDS} />
      <ListEditor
        sectionId="experience"
        title="Áreas de experiencia"
        localItems={experience}
        fields={FIELDS}
        addLabel="Agregar área"
      />
    </>
  );
}
