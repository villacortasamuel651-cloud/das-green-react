// import curso1 from "../assets/images/cursos/curso-1.jpg";

export const coursesSection = {
  label: "CURSOS",
  title: "Aprende y desarrolla nuevas habilidades.",
  text: "Encuentra contenidos y programas diseñados para ayudarte a crecer profesionalmente.",
};

export const courseFilters = [
  { value: "all", label: "Todos" },
  { value: "free", label: "Gratuitos" },
  { value: "paid", label: "Pagados" },
];

export const courses = [
  {
    type: "free",
    category: "LIDERAZGO",
    title: "Fundamentos del liderazgo",
    description: "Aprende los principios fundamentales para liderar equipos.",
    url: "#",
    image: null, // curso1
  },
  {
    type: "free",
    category: "GESTIÓN",
    title: "Introducción a la gestión",
    description: "Conceptos esenciales para mejorar la gestión profesional.",
    url: "#",
    image: null,
  },
  {
    type: "paid",
    category: "ESTRATEGIA",
    title: "Gestión estratégica empresarial",
    description: "Programa completo para desarrollar estrategias.",
    price: 149,
    url: "#",
    image: null,
  },
  {
    type: "paid",
    category: "LIDERAZGO",
    title: "Liderazgo y desarrollo profesional",
    description: "Programa orientado al crecimiento profesional.",
    price: 199,
    url: "#",
    image: null,
  },
];