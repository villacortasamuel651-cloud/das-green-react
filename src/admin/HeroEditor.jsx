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
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  useEffect(() => () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
  }, [videoPreview]);

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

  const handleVideo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      setStatus("Selecciona un video MP4 o WebM.");
      event.target.value = "";
      return;
    }
    setVideoPreview(URL.createObjectURL(file));
    setSelectedVideo(file);
    setStatus("");
    event.target.value = "";
  };

  const uploadSelectedVideo = async () => {
    if (!selectedVideo) return;
    setUploading(true);
    setStatus("Subiendo video...");
    try {
      const media = await uploadVideo(selectedVideo);
      update("videoUrl", media.url);
      update("videoMimeType", media.mimeType);
      setSelectedVideo(null);
      setStatus("Video cargado. Guarda los cambios para publicarlo.");
    } catch (error) {
      setStatus(error.message || "No se pudo cargar el video.");
    } finally {
      setUploading(false);
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
        <p className="admin-help">Recomendado: video horizontal 16:9 (1920 × 1080 px), MP4 H.264 o WebM. El almacenamiento admite hasta 150 MiB por defecto.</p>
        {selectedVideo && videoPreview ? (
          <div className="admin-media-review">
            <span className="admin-media-review-title">Vista previa antes de subir</span>
            <video className="admin-video-preview" src={videoPreview} controls muted />
            <small>{selectedVideo.name} · {(selectedVideo.size / (1024 * 1024)).toFixed(1)} MB</small>
            <div className="admin-save-row">
              <button type="button" onClick={uploadSelectedVideo} disabled={uploading}>{uploading ? "Subiendo video…" : "Confirmar y subir video"}</button>
              <button type="button" className="admin-remove" onClick={() => setSelectedVideo(null)} disabled={uploading}>Cancelar</button>
            </div>
          </div>
        ) : values.videoUrl ? <video className="admin-video-preview" src={values.videoUrl} controls muted />
          : <p className="admin-help">No hay video cargado. La portada mostrará el espacio reservado.</p>}
        <input id="hero-video" type="file" accept="video/mp4,video/webm" onChange={handleVideo} disabled={uploading} />
        <small className="admin-help">Al confirmar, el archivo se guarda en el almacenamiento privado del servidor.</small>
        {values.videoUrl && <button type="button" className="admin-remove" onClick={() => { update("videoUrl", ""); update("videoMimeType", ""); }}>Quitar video al guardar</button>}
      </div>

      <div className="admin-save-row">
        <button type="button" onClick={save} disabled={saving || uploading}>Guardar cambios</button>
        {status && <span className="admin-status">{status}</span>}
      </div>
    </section>
  );
}
