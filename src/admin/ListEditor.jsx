import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../config/firebase";
import FieldInput, { emptyValue } from "./FieldInput";
import "./editor-kit.css";

// Editor para secciones tipo lista: Noticias, Trayectoria, Exposiciones, Testimonios, Cursos...
// Permite agregar, editar, eliminar y reordenar elementos.
//
// Props:
//   sectionId  → id del documento en Firestore: content/<sectionId>  (guarda { items: [...] })
//   title      → título que se ve en el panel
//   localItems → el arreglo de data/<seccion>.js (respaldo y valores iniciales)
//   fields     → [{ key, label, type?, options? }]  (key = propiedad de primer nivel de cada elemento)
//   itemTitle  → (opcional) función (item) => texto que se muestra como título de cada elemento
//   addLabel   → (opcional) texto del botón de agregar
//
// IMPORTANTE:
//   - Define `fields` como constante FUERA del componente que lo usa.
//   - Solo se guardan los campos de `fields` (textos). Imágenes y enlaces siguen viniendo del código.
//   - Los elementos del archivo local reciben el id "local-<posición>". No reordenes
//     el archivo data/*.js cuando el cliente ya haya empezado a editar: agrega al final.

const newId = () => `new-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const withLocalIds = (items) => items.map((item, i) => ({ ...item, id: `local-${i}` }));

const pick = (item, fields) => ({
  id: item.id,
  ...Object.fromEntries(fields.map((f) => [f.key, item[f.key] ?? emptyValue(f)])),
});

export default function ListEditor({
  sectionId,
  title,
  localItems,
  fields,
  itemTitle,
  addLabel = "Agregar elemento",
}) {
  const [items, setItems] = useState(() => withLocalIds(localItems).map((item) => pick(item, fields)));
  const [status, setStatus] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "content", sectionId))
      .then((snap) => {
        const remote = snap.exists() ? snap.data().items : null;
        if (!Array.isArray(remote)) return;
        const local = withLocalIds(localItems);
        setItems(
          remote.map((item) => pick({ ...local.find((l) => l.id === item.id), ...item }, fields))
        );
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  const update = (id, key, value) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));

  const add = () => setItems((prev) => [...prev, pick({ id: newId() }, fields)]);

  const remove = (id) => {
    if (window.confirm("¿Eliminar este elemento? Se aplicará al guardar los cambios.")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const move = (index, direction) =>
    setItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const save = async () => {
    setSaving(true);
    setStatus({ type: "", text: "Guardando..." });
    try {
      await setDoc(doc(db, "content", sectionId), { items, updatedAt: serverTimestamp() });
      setStatus({ type: "ok", text: "Cambios guardados ✓" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: "No se pudo guardar. Revisa tu conexión o tus permisos." });
    } finally {
      setSaving(false);
    }
  };

  const labelFor = (item) => {
    const text = itemTitle ? itemTitle(item) : item[fields[0].key];
    return String(text || "Nuevo elemento").slice(0, 70);
  };

  return (
    <section className="admin-card">
      <h2>{title}</h2>

      {items.length === 0 && <p>No hay elementos todavía. Usa «{addLabel}».</p>}

      {items.map((item, index) => (
        <fieldset key={item.id} className="admin-item">
          <legend>{labelFor(item)}</legend>

          {fields.map((field) => (
            <FieldInput
              key={field.key}
              id={`${sectionId}-${item.id}-${field.key}`}
              field={field}
              value={item[field.key]}
              onChange={(value) => update(item.id, field.key, value)}
            />
          ))}

          <div className="admin-item-actions">
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>
              ↑ Subir
            </button>
            <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
              ↓ Bajar
            </button>
            <button type="button" className="danger" onClick={() => remove(item.id)}>
              Eliminar
            </button>
          </div>
        </fieldset>
      ))}

      <div className="admin-item-actions">
        <button type="button" onClick={add}>
          + {addLabel}
        </button>
        <button type="button" onClick={save} disabled={saving}>
          Guardar cambios
        </button>
        {status.text && <span className={`admin-status ${status.type}`}>{status.text}</span>}
      </div>
    </section>
  );
}
