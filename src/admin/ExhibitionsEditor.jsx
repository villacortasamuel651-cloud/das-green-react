import ObjectEditor from "./ObjectEditor";
import ListEditor from "./ListEditor";
import { exhibitionsEditable, exhibitionsSection } from "../data/exhibitions";

const HEADER_FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto", type: "textarea" },
];

const FIELDS = [
  { key: "type", label: "Tipo (ej. CONFERENCIA)" },
  { key: "year", label: "Año" },
  { key: "title", label: "Título" },
  { key: "description", label: "Descripción corta", type: "textarea" },
  { key: "place", label: "Lugar" },
  { key: "modality", label: "Modalidad" },
  { key: "summary", label: "Resumen de la ventana", type: "textarea" },
  { key: "body", label: "Texto completo (un párrafo por línea)", type: "textarea" },
  { key: "tags", label: "Temas (separados por comas)" },
];

export default function ExhibitionsEditor() {
  return (
    <>
      <ObjectEditor
        sectionId="exhibitionsSection"
        title="Exposiciones · encabezado"
        local={exhibitionsSection}
        fields={HEADER_FIELDS}
      />
      <ListEditor
        sectionId="exhibitions"
        title="Exposiciones"
        localItems={exhibitionsEditable}
        fields={FIELDS}
        itemTitle={(item) => `${item.year} · ${item.title}`}
        addLabel="Agregar exposición"
      />
    </>
  );
}
