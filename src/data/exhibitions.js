// import expo1 from "../assets/images/exposiciones/expo-1.jpg";
import expo1 from "../assets/images/exhibitions/hult-prize.jpg";
import expo2 from "../assets/images/exhibitions/speaker.jpg";
import expo3 from "../assets/images/exhibitions/panel.jpg";

import { fromLines, fromTags, toLines, toTags } from "../utils/content";

export const exhibitionsSection = {
  label: "EXPOSICIONES",
  title: "Ideas que generan conversación y transformación.",
  text: "Conferencias, eventos y espacios donde compartir experiencias, conocimiento y nuevas perspectivas.",
};

export const exhibitions = [
  {
    type: "CONFERENCIA",
    year: "2026",
    title: "Liderazgo para nuevos desafíos",
    description: "Descripción breve de la exposición o conferencia.",
    url: "#",
    image: expo1,
    detail: {
      place: "Lima, Perú",
      modality: "Presencial",
      summary: "Una conferencia pensada para quienes lideran equipos en contextos de cambio.",
      paragraphs: [
        "Texto de ejemplo: describe aquí de qué trató la exposición, el público al que se dirigió y el mensaje principal.",
        "Texto de ejemplo: agrega los aprendizajes o conclusiones que se compartieron con los asistentes.",
      ],
      tags: ["Liderazgo", "Equipos", "Cambio"],
    },
  },
  {
    type: "EVENTO",
    year: "2026",
    title: "Innovación y crecimiento",
    description: "Descripción breve de la exposición o conferencia.",
    url: "#",
    image: expo2,
    detail: {
      place: "Lima, Perú",
      modality: "Presencial",
      summary: "Un espacio para conversar sobre innovación y nuevas oportunidades de crecimiento.",
      paragraphs: [
        "Texto de ejemplo: describe aquí el evento, quiénes participaron y cuál fue tu aporte.",
        "Texto de ejemplo: cuenta qué ideas se discutieron y qué resultados dejó la experiencia.",
      ],
      tags: ["Innovación", "Crecimiento", "Emprendimiento"],
    },
  },
  {
    type: "PANEL",
    year: "2025",
    title: "Gestión y estrategia empresarial",
    description: "Descripción breve de la exposición o conferencia.",
    url: "#",
    image: expo3,
    detail: {
      place: "Lima, Perú",
      modality: "Presencial",
      summary: "Un panel sobre gestión y estrategia con enfoque empresarial.",
      paragraphs: [
        "Texto de ejemplo: describe aquí el panel, los temas tratados y el rol que tuviste.",
        "Texto de ejemplo: resume las ideas clave que se llevó el público.",
      ],
      tags: ["Gestión", "Estrategia", "Empresas"],
    },
  },
];

// ---- Panel de administración ----
export const exhibitionsEditable = exhibitions.map((e) => ({
  ...e,
  place: e.detail?.place ?? "",
  modality: e.detail?.modality ?? "",
  summary: e.detail?.summary ?? "",
  body: fromLines(e.detail?.paragraphs),
  tags: fromTags(e.detail?.tags),
}));

export const normalizeExhibition = (item) => {
  const d = item.detail ?? {};
  return {
    ...item,
    detail: {
      ...d,
      place: item.place ?? d.place ?? "",
      modality: item.modality ?? d.modality ?? "",
      summary: item.summary ?? d.summary ?? "",
      paragraphs: item.body !== undefined ? toLines(item.body) : (d.paragraphs ?? []),
      tags: item.tags !== undefined ? toTags(item.tags) : (d.tags ?? []),
    },
  };
};
