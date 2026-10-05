import ObjectEditor from "./ObjectEditor";
import { aboutEditable } from "../data/about";

const FIELDS = [
  { key: "label", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "p1", label: "Primer párrafo", type: "textarea" },
  { key: "p2", label: "Segundo párrafo", type: "textarea" },
  { key: "s1Value", label: "Dato 1 · número" },
  { key: "s1Label", label: "Dato 1 · texto" },
  { key: "s2Value", label: "Dato 2 · número" },
  { key: "s2Label", label: "Dato 2 · texto" },
  { key: "s3Value", label: "Dato 3 · número" },
  { key: "s3Label", label: "Dato 3 · texto" },
];

export default function AboutEditor() {
  return <ObjectEditor sectionId="about" title="Sobre mí" local={aboutEditable} fields={FIELDS} />;
}
