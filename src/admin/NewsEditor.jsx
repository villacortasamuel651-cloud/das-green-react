import ObjectEditor from "./ObjectEditor";
import ListEditor from "./ListEditor";
import { newsEditable, newsSection } from "../data/news";

const HEADER_FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto", type: "textarea" },
];

const FIELDS = [
  {
    key: "image",
    label: "Imagen de la noticia",
    type: "image",
    uploadOptions: {
      folder: "news",
      maxWidth: 1600,
      aspect: 16 / 10,
    },
  },
  { key: "date", label: "Fecha o etiqueta" },
  { key: "title", label: "Título" },
  { key: "description", label: "Descripción corta", type: "textarea" },
  { key: "eyebrow", label: "Etiqueta de la ventana" },
  {
    key: "body",
    label: "Texto completo (un párrafo por línea)",
    type: "textarea",
  },
  { key: "tags", label: "Temas (separados por comas)" },
];

export default function NewsEditor() {
  return (
    <>
      <ObjectEditor
        sectionId="newsSection"
        title="Noticias · encabezado"
        local={newsSection}
        fields={HEADER_FIELDS}
      />

      <ListEditor
        sectionId="news"
        title="Noticias"
        localItems={newsEditable}
        fields={FIELDS}
        addLabel="Agregar noticia"
      />
    </>
  );
}

