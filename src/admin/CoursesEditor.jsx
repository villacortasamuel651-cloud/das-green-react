import ObjectEditor from "./ObjectEditor";
import ListEditor from "./ListEditor";
import { coursesEditable, coursesSection } from "../data/courses";

const HEADER_FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto", type: "textarea" },
];

const FIELDS = [
  { key: "title", label: "Título del curso" },
  { key: "isFree", label: "Curso gratuito", type: "checkbox" },
  { key: "price", label: "Precio en soles (solo cursos pagados, ej. 149)" },
  { key: "category", label: "Categoría (ej. LIDERAZGO)" },
  { key: "level", label: "Nivel", type: "select", options: ["Básico", "Intermedio", "Avanzado"] },
  { key: "duration", label: "Duración (ej. 12 horas)" },
  { key: "modality", label: "Modalidad" },
  { key: "certificate", label: "Incluye certificado", type: "checkbox" },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "learn", label: "Lo que aprenderás (uno por línea)", type: "textarea" },
  { key: "syllabus", label: "Temario (uno por línea)", type: "textarea" },
  { key: "audience", label: "Dirigido a", type: "textarea" },
];

export default function CoursesEditor() {
  return (
    <>
      <ObjectEditor sectionId="coursesSection" title="Cursos · encabezado" local={coursesSection} fields={HEADER_FIELDS} />
      <ListEditor
        sectionId="courses"
        title="Cursos"
        localItems={coursesEditable}
        fields={FIELDS}
        addLabel="Agregar curso"
      />
    </>
  );
}
