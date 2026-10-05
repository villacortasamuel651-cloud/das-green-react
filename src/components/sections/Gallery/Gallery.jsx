import { useState } from "react";
import {
  gallery as localGallery,
  gallerySection,
  normalizeGallery,
} from "../../../data/gallery";
import useContent from "../../../hooks/useContent";
import useListContent from "../../../hooks/useListContent";
import SectionHeader from "../../ui/SectionHeader/SectionHeader";
import ImagePlaceholder from "../../ui/ImagePlaceholder/ImagePlaceholder";
import Reveal from "../../ui/Reveal/Reveal";
import Modal from "../../ui/Modal/Modal";
import "./Gallery.css";

function resolveGalleryImage(src) {
  if (!src || /^(https?:|data:|blob:)/i.test(src)) {
    return src ?? "";
  }

  const base = import.meta.env.BASE_URL;
  const cleanBase = base.replace(/^\/+|\/+$/g, "");
  const cleanSrc = src.replace(/^\/+/, "");

  if (cleanBase && cleanSrc.startsWith(`${cleanBase}/`)) {
    return `/${cleanSrc}`;
  }

  return `${base}${cleanSrc}`;
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);

  const items = useListContent("gallery", localGallery)
    .map(normalizeGallery)
    .map((item) => ({
      ...item,
      image: resolveGalleryImage(item.image),
    }));

  const header = {
    ...gallerySection,
    ...(useContent("gallerySection") ?? {}),
  };

  const active = activeIndex !== null ? items[activeIndex] : null;

  const go = (step) => {
    setActiveIndex((index) => (index + step + items.length) % items.length);
  };

  return (
    <section className="gallery-section" id="galeria">
      <div className="container">
        <SectionHeader
          label={header.label}
          title={header.title}
          text={header.text}
        />

        <div className="gallery-grid">
          {items.map((item, i) => (
            <Reveal as="div" delay={i * 80} key={item.id}>
              <button
                type="button"
                className="gallery-item"
                onClick={() => setActiveIndex(i)}
                aria-label={`Ampliar: ${item.title}`}
              >
                <ImagePlaceholder src={item.image} alt={item.title} />

                <span className="gallery-overlay">
                  <strong>{item.title}</strong>
                  <small>{item.caption}</small>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <Modal
          onClose={() => setActiveIndex(null)}
          titleId="gallery-title"
        >
          <div className="gallery-viewer">
            <div className="gallery-viewer-image">
              <ImagePlaceholder src={active.image} alt={active.title} />
            </div>

            <div className="gallery-viewer-info">
              <h2 id="gallery-title">{active.title}</h2>
              <p>{active.caption}</p>

              <div className="gallery-nav">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Anterior"
                >
                  ←
                </button>

                <span>
                  {activeIndex + 1} / {items.length}
                </span>

                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Siguiente"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}