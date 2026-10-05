import ObjectEditor from "./ObjectEditor";
import { quote } from "../data/quote";

const FIELDS = [
  { key: "text", label: "Frase", type: "textarea" },
  { key: "author", label: "Autor" },
];

export default function QuoteEditor() {
  return <ObjectEditor sectionId="quote" title="Cita" local={quote} fields={FIELDS} />;
}
