import { useEffect, useState } from "react";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      event.target.value = "";
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const url = await uploadImage(selectedFile, uploadOptions);
      onChange(url);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const aspect = uploadOptions.aspect || 4 / 3;
  const recommended = uploadOptions.recommendation || "4:3 · 1200 × 900 px";

  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>

      {value && (
        <div className="admin-image-preview">
          <img src={value} alt="Vista previa" />
        </div>
      )}

      <p className="admin-help">Formato recomendado: {recommended}. El recorte de vista previa muestra aproximadamente cómo se adaptará en la sección.</p>

      {selectedFile && previewUrl && (
        <div className="admin-media-review">
          <span className="admin-media-review-title">Vista previa antes de subir</span>
          <div className="admin-image-preview" style={{ aspectRatio: String(aspect) }}>
            <img src={previewUrl} alt={`Vista previa de ${selectedFile.name}`} />
          </div>
          <small>{selectedFile.name} · {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</small>
          <div className="admin-save-row">
            <button type="button" onClick={handleUpload} disabled={uploading}>
              {uploading ? "Subiendo imagen…" : "Confirmar y subir imagen"}
            </button>
            <button type="button" className="admin-remove" onClick={() => setSelectedFile(null)} disabled={uploading}>Cancelar</button>
          </div>
        </div>
      )}

      {value && (
        <button type="button" className="admin-remove" onClick={() => onChange("")}>Quitar imagen al guardar</button>
      )}

      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
      />

      {!selectedFile && value && (
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

