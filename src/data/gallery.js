export const gallerySection = {
  label: "GALERÍA",
  title: "Momentos que cuentan una historia.",
  text: "Un recorrido visual por eventos, conferencias y experiencias.",
};

export const gallery = [
  { id: 1, image: "/images/gallery/foto-1.jpg", title: "START SUMMIT 2024", caption: "St. Gallen, Suiza" },
  { id: 2, image: "/images/gallery/foto-2.jpg", title: "Hult Prize ESAN", caption: "Final Pitch Competition" },
  { id: 3, image: "/images/gallery/foto-3.jpg", title: "SUCommunity", caption: "Creciendo Juntos" },
  { id: 4, image: "/images/gallery/foto-4.jpg", title: "Conferencia", caption: "Liderazgo para nuevos desafíos" },
  { id: 5, image: "/images/gallery/foto-5.jpg", title: "Panel", caption: "Gestión y estrategia empresarial" },
  { id: 6, image: "/images/gallery/foto-6.jpg", title: "Evento", caption: "Innovación y crecimiento" },
];

export const normalizeGallery = (item) => ({
  id: item.id,
  image: item.image ?? "",
  title: item.title ?? "",
  caption: item.caption ?? "",
});