import { useState } from "react";
import { uploadImage } from "../utils/Uploadimage";

export default function ImageUploadField({
  id,
  label,
  value,
  onChange,
  uploadOptions = {},
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const url = await uploadImage(file, uploadOptions);
      onChange(url);
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>

      {value && (
        <div className="admin-image-preview">
          <img src={value} alt="Vista previa" />
        </div>
      )}

      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
      />

      {uploading && (
        <span className="admin-status">
          Subiendo imagen...
        </span>
      )}

      {!uploading && value && (
        <span className="admin-status ok">
          Imagen cargada ✓
        </span>
      )}

      {error && (
        <span className="admin-status error">
          {error}
        </span>
      )}
    </div>
  );
}

