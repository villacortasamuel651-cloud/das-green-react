import { useEffect, useState } from "react";
import FieldInput, { emptyValue } from "./FieldInput";
import ImageUploadField from "./ImageUploadField";
import "./editor-kit.css";

const newId = () =>
  `new-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

const withLocalIds = (items) =>
  items.map((item, i) => ({
    ...item,
    id: `local-${i}`,
  }));

const pick = (item, fields) => ({
  id: item.id,
  ...Object.fromEntries(
    fields.map((f) => [
      f.key,
      item[f.key] ?? emptyValue(f),
    ])
  ),
});

export default function ListEditor({
  sectionId,
  title,
  localItems,
  fields,
  itemTitle,
  addLabel = "Agregar elemento",
}) {
  const [items, setItems] = useState(() =>
    withLocalIds(localItems).map((item) =>
      pick(item, fields)
    )
  );

  const [status, setStatus] = useState({
    type: "",
    text: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/content/${encodeURIComponent(sectionId)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        const remote = result?.content?.items;

        if (!Array.isArray(remote)) return;

        const local = withLocalIds(localItems);

        setItems(
          remote.map((item) =>
            pick(
              {
                ...local.find((l) => l.id === item.id),
                ...item,
              },
              fields
            )
          )
        );
      })
      .catch(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  const update = (id, key, value) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );

  const add = () =>
    setItems((prev) => [
      ...prev,
      pick(
        {
          id: newId(),
        },
        fields
      ),
    ]);

  const remove = (id) => {
    if (
      window.confirm(
        "¿Eliminar este elemento? Se aplicará al guardar los cambios."
      )
    ) {
      setItems((prev) =>
        prev.filter((item) => item.id !== id)
      );
    }
  };

  const move = (index, direction) =>
    setItems((prev) => {
      const target = index + direction;

      if (
        target < 0 ||
        target >= prev.length
      ) {
        return prev;
      }

      const next = [...prev];

      [next[index], next[target]] = [
        next[target],
        next[index],
      ];

      return next;
    });

  const save = async () => {
    setSaving(true);

    setStatus({
      type: "",
      text: "Guardando...",
    });

    try {
      const response = await fetch(`/api/content/${encodeURIComponent(sectionId)}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ items }),
      });
      if (!response.ok) throw new Error("No se pudo guardar el contenido.");

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

  const labelFor = (item) => {
    const text = itemTitle
      ? itemTitle(item)
      : item[fields[0].key];

    return String(
      text || "Nuevo elemento"
    ).slice(0, 70);
  };

  return (
    <section className="admin-card">
      <h2>{title}</h2>

      {items.length === 0 && (
        <p>
          No hay elementos todavía. Usa «{addLabel}».
        </p>
      )}

      {items.map((item, index) => (
        <fieldset
          key={item.id}
          className="admin-item"
        >
          <legend>{labelFor(item)}</legend>

          {fields.map((field) => {
            if (field.type === "image") {
              return (
                <ImageUploadField
                  key={field.key}
                  id={`${sectionId}-${item.id}-${field.key}`}
                  label={field.label}
                  value={item[field.key]}
                  onChange={(value) =>
                    update(
                      item.id,
                      field.key,
                      value
                    )
                  }
                  uploadOptions={
                    field.uploadOptions
                  }
                />
              );
            }

            return (
              <FieldInput
                key={field.key}
                id={`${sectionId}-${item.id}-${field.key}`}
                field={field}
                value={item[field.key]}
                onChange={(value) =>
                  update(
                    item.id,
                    field.key,
                    value
                  )
                }
              />
            );
          })}

          <div className="admin-item-actions">
            <button
              type="button"
              onClick={() =>
                move(index, -1)
              }
              disabled={index === 0}
            >
              ↑ Subir
            </button>

            <button
              type="button"
              onClick={() =>
                move(index, 1)
              }
              disabled={
                index === items.length - 1
              }
            >
              ↓ Bajar
            </button>

            <button
              type="button"
              className="danger"
              onClick={() =>
                remove(item.id)
              }
            >
              Eliminar
            </button>
          </div>
        </fieldset>
      ))}

      <div className="admin-item-actions">
        <button
          type="button"
          onClick={add}
        >
          + {addLabel}
        </button>

        <button
          type="button"
          onClick={save}
          disabled={saving}
        >
          Guardar cambios
        </button>

        {status.text && (
          <span
            className={`admin-status ${status.type}`}
          >
            {status.text}
          </span>
        )}
      </div>
    </section>
  );
}

