// Ayudas para convertir entre los datos del sitio (arreglos) y lo que edita el panel (texto).
// En el panel, las listas de frases se escriben una por línea y las etiquetas separadas por comas.

export const toLines = (value) =>
  Array.isArray(value)
    ? value
    : String(value ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

export const fromLines = (value) => (Array.isArray(value) ? value.join("\n") : (value ?? ""));

export const toTags = (value) =>
  Array.isArray(value)
    ? value
    : String(value ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

export const fromTags = (value) => (Array.isArray(value) ? value.join(", ") : (value ?? ""));
