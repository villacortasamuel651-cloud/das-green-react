export const timelineIconOptions = [
  { value: "presentation", label: "Presentación" },
  { value: "graduation", label: "Formación" },
  { value: "book", label: "Conocimiento" },
  { value: "analytics", label: "Análisis" },
  { value: "award", label: "Reconocimiento" },
  { value: "business", label: "Empresa" },
  { value: "organization", label: "Organización" },
];

export const experienceIconOptions = [
  { value: "leadership", label: "Liderazgo" },
  { value: "operations", label: "Operaciones" },
  { value: "strategy", label: "Estrategia" },
  { value: "innovation", label: "Innovación" },
  { value: "growth", label: "Crecimiento" },
];

const timelineAliases = {
  "📷": "presentation", "📸": "presentation", "🎓": "graduation",
  "📚": "book", "📖": "book", "📊": "analytics", "★": "award",
  "⭐": "award", "💼": "business",
};

const experienceAliases = {
  "👥": "leadership", "◫": "operations", "↗": "strategy",
  "💡": "innovation", "♧": "growth", "💼": "leadership",
};

const normalize = (value, options, aliases) => {
  const candidate = aliases[value] ?? value;
  return options.some((option) => option.value === candidate) ? candidate : options[0].value;
};

export const normalizeTimelineIcon = (value) => normalize(value, timelineIconOptions, timelineAliases);
export const normalizeExperienceIcon = (value) => normalize(value, experienceIconOptions, experienceAliases);
