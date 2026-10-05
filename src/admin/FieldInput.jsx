// Un campo de formulario según su "type": text (por defecto), textarea, select o checkbox.
// Lo usan ObjectEditor y ListEditor. Normalmente no hace falta tocar este archivo.

export const emptyValue = (field) => {
  if (field.type === "checkbox") return false;
  if (field.type === "select") return field.options?.[0] ?? "";
  return "";
};

export default function FieldInput({ field, value, onChange, id }) {
  const { type = "text", label, options = [] } = field;

  if (type === "checkbox") {
    return (
      <label className="admin-check">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    );
  }

  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>

      {type === "textarea" && (
        <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      )}

      {type === "select" && (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {type !== "textarea" && type !== "select" && (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
