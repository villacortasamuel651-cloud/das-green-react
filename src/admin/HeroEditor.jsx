import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { heroSlides as localSlides } from "../data/hero";

const FIELDS = [
  { key: "eyebrow", label: "Etiqueta superior" },
  { key: "title", label: "Título" },
  { key: "highlight", label: "Título destacado" },
  { key: "text", label: "Texto", multiline: true },
  { key: "ctaLabel", label: "Texto del botón" },
];

const toEditable = (base, remote = {}) => ({
  eyebrow: remote.eyebrow ?? base.eyebrow,
  title: remote.title ?? base.title,
  highlight: remote.highlight ?? base.highlight,
  text: remote.text ?? base.text,
  ctaLabel: remote.ctaLabel ?? base.cta.label,
});

export default function HeroEditor() {
  const [slides, setSlides] = useState(localSlides.map((s) => toEditable(s)));
  const [status, setStatus] = useState("");

  useEffect(() => {
    getDoc(doc(db, "content", "hero")).then((snap) => {
      if (snap.exists()) {
        const remote = snap.data().slides ?? [];
        setSlides(localSlides.map((s, i) => toEditable(s, remote[i])));
      }
    });
  }, []);

  const update = (i, key, value) =>
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));

  const save = async () => {
    setStatus("Guardando...");
    try {
      await setDoc(doc(db, "content", "hero"), { slides });
      setStatus("Guardado ✓");
    } catch {
      setStatus("Error al guardar");
    }
  };

  return (
    <section className="admin-card">
      <h2>Inicio (Hero)</h2>

      {slides.map((slide, i) => (
        <fieldset key={i}>
          <legend>Slide {i + 1}</legend>
          {FIELDS.map(({ key, label, multiline }) => (
            <div key={key}>
              <label>{label}</label>
              {multiline ? (
                <textarea rows={3} value={slide[key]} onChange={(e) => update(i, key, e.target.value)} />
              ) : (
                <input value={slide[key]} onChange={(e) => update(i, key, e.target.value)} />
              )}
            </div>
          ))}
        </fieldset>
      ))}

      <button onClick={save}>Guardar cambios</button>
      {status && <span className="admin-status">{status}</span>}
    </section>
  );
}