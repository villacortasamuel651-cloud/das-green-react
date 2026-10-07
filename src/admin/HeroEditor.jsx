import { useEffect, useState } from "react";
import { heroContent } from "../data/hero";
import { uploadVideo } from "../utils/Uploadimage";

const fields = [
  { key: "eyebrow", label: "Etiqueta superior" },
  { key: "title", label: "Título principal" },
  { key: "highlight", label: "Título destacado" },
  { key: "text", label: "Texto", multiline: true },
  { key: "ctaLabel", label: "Texto del botón" },
  { key: "ctaHref", label: "Destino del botón" },
];

export default function HeroEditor() {
  const [values, setValues] = useState(heroContent);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/hero")
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!result?.content) return;
        const remote = result.content;
        const legacy = remote.slides?.[0] ?? {};
        setValues({
          ...heroContent,
          ...remote,
          eyebrow: remote.eyebrow ?? legacy.eyebrow ?? heroContent.eyebrow,
          title: remote.title ?? legacy.title ?? heroContent.title,
          highlight: remote.highlight ?? legacy.highlight ?? heroContent.highlight,
          text: remote.text ?? legacy.text ?? heroContent.text,
          ctaLabel: remote.ctaLabel ?? legacy.ctaLabel ?? legacy.cta?.label ?? heroContent.ctaLabel,
          ctaHref: remote.ctaHref ?? legacy.ctaHref ?? legacy.cta?.href ?? heroContent.ctaHref,
          videoUrl: remote.videoUrl ?? "",
          videoMimeType: remote.videoMimeType ?? "",
        });
      })
      .catch(() => setStatus("No se pudo cargar el contenido guardado."));
  }, []);

  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const handleVideo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("Subiendo video...");
    try {
      const media = await uploadVideo(file);
      update("videoUrl", media.url);
      update("videoMimeType", media.mimeType);
      setStatus("Video cargado. Guarda los cambios para publicarlo.");
    } catch (error) {
      setStatus(error.message || "No se pudo cargar el video.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const save = async () => {
    setSaving(true);
    setStatus("Guardando...");
    try {
      const response = await fetch("/api/content/hero", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(values),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "No se pudo guardar.");
      setStatus("Cambios guardados ✓");
    } catch (error) {
      setStatus(error.message || "Error al guardar.");
    } finally { setSaving(false); }
  };

  return (
    <section className="admin-card">
      <h2>Inicio · Hero</h2>
      <p className="admin-help">Administra el texto y el video de fondo de la portada.</p>
      {fields.map(({ key, label, multiline }) => (
        <div className="admin-field" key={key}>
          <label htmlFor={`hero-${key}`}>{label}</label>
          {multiline ? <textarea id={`hero-${key}`} rows={3} value={values[key]} onChange={(e) => update(key, e.target.value)} />
            : <input id={`hero-${key}`} value={values[key]} onChange={(e) => update(key, e.target.value)} />}
        </div>
      ))}

      <div className="admin-field">
        <label htmlFor="hero-video">Video de fondo · MP4 o WebM</label>
        {values.videoUrl ? <video className="admin-video-preview" src={values.videoUrl} controls muted />
          : <p className="admin-help">No hay video cargado. La portada mostrará el espacio reservado.</p>}
        <input id="hero-video" type="file" accept="video/mp4,video/webm" onChange={handleVideo} disabled={uploading} />
        <small className="admin-help">El archivo se guarda en almacenamiento privado del servidor. Límite configurable; por defecto 150 MB.</small>
        {values.videoUrl && <button type="button" className="admin-remove" onClick={() => { update("videoUrl", ""); update("videoMimeType", ""); }}>Quitar video al guardar</button>}
      </div>

      <div className="admin-save-row">
        <button type="button" onClick={save} disabled={saving || uploading}>Guardar cambios</button>
        {status && <span className="admin-status">{status}</span>}
      </div>
    </section>
  );
}
