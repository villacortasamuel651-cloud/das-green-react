import ObjectEditor from "./ObjectEditor";
import ListEditor from "./ListEditor";
import { timeline, timelineSection } from "../data/timeline";

const HEADER_FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto", type: "textarea" },
];

const FIELDS = [
  { key: "year", label: "Años (ej. 2015 – 2018)" },
  { key: "role", label: "Cargo / Empresa" },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "icon", label: "Icono (emoji o símbolo)" },
];

export default function TimelineEditor() {
  return (
    <>
      <ObjectEditor sectionId="timelineSection" title="Trayectoria · encabezado" local={timelineSection} fields={HEADER_FIELDS} />
      <ListEditor
        sectionId="timeline"
        title="Trayectoria"
        localItems={timeline}
        fields={FIELDS}
        itemTitle={(item) => `${item.year} · ${item.role}`}
        addLabel="Agregar etapa"
      />
    </>
  );
}
