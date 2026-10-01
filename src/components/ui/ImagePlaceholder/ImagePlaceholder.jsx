import "./ImagePlaceholder.css";

export default function ImagePlaceholder({ src, alt = "", tone = "dark", label = "IMAGEN" }) {
  if (src) return <img className="media-img" src={src} alt={alt} loading="lazy" />;

  return (
    <div className={`image-placeholder ${tone}`}>
      <span>{label}</span>
    </div>
  );
}