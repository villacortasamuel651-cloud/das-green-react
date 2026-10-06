
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../config/firebase";
import FieldInput, { emptyValue } from "./FieldInput";
import ImageUploadField from "./ImageUploadField";
import "./editor-kit.css";

const pick = (source = {}, fields) =>
  Object.fromEntries(
    fields.map((f) => [f.key, source[f.key] ?? emptyValue(f)])
  );

export default function ObjectEditor({
  sectionId,
  title,
  local,
  fields,
}) {
  const [values, setValues] = useState(() => pick(local, fields));
  const [status, setStatus] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "content", sectionId))
      .then((snap) => {
        if (snap.exists()) {
          setValues(
            pick(
              {
                ...local,
                ...snap.data(),
              },
              fields
            )
          );
        }
      })
      .catch(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  const update = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const save = async () => {
    setSaving(true);
    setStatus({
      type: "",
      text: "Guardando...",
    });

    try {
      await setDoc(doc(db, "content", sectionId), {
        ...values,
        updatedAt: serverTimestamp(),
      });

      setStatus({
        type: "ok",
        text: "Cambios guardados ✓",
      });
    } catch (err) {
      console.error(err);

      setStatus({
        type: "error",
        text: "No se pudo guardar. Revisa tu conexión o tus permisos.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-card">
      <h2>{title}</h2>

      {fields.map((field) => {
        if (field.type === "image") {
          return (
            <ImageUploadField
              key={field.key}
              id={`${sectionId}-${field.key}`}
              label={field.label}
              value={values[field.key]}
              onChange={(value) => update(field.key, value)}
              uploadOptions={field.uploadOptions}
            />
          );
        }

        return (
          <FieldInput
            key={field.key}
            id={`${sectionId}-${field.key}`}
            field={field}
            value={values[field.key]}
            onChange={(value) => update(field.key, value)}
          />
        );
      })}

      <div className="admin-item-actions">
        <button
          type="button"
          onClick={save}
          disabled={saving}
        >
          Guardar cambios
        </button>

        {status.text && (
          <span className={`admin-status ${status.type}`}>
            {status.text}
          </span>
        )}
      </div>
    </section>
  );
}

