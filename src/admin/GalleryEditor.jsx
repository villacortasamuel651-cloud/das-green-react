import ObjectEditor from "./ObjectEditor";
import ListEditor from "./ListEditor";
import { gallery, gallerySection } from "../data/gallery";

const HEADER_FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto", type: "textarea" },
];

const FIELDS = [
  {
    key: "image",
    label: "Ruta de la imagen (ej. /images/gallery/foto-1.jpg)",
  },
  { key: "title", label: "Título de la foto" },
  { key: "caption", label: "Descripción corta" },
];

export default function GalleryEditor() {
  return (
    <>
      <ObjectEditor
        sectionId="gallerySection"
        title="Galería · encabezado"
        local={gallerySection}
        fields={HEADER_FIELDS}
      />

      <ListEditor
        sectionId="gallery"
        title="Fotos de la galería"
        localItems={gallery}
        fields={FIELDS}
        itemTitle={(item) => item.title}
        addLabel="Agregar foto"
      />
    </>
  );
}