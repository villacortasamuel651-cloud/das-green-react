// import curso1 from "../assets/images/cursos/curso-1.jpg";
import c1 from "../assets/images/cursos/c1.jpg"; 
import c2 from "../assets/images/cursos/c2.jpg";
import c3 from "../assets/images/cursos/c3.jpg";
import c4 from "../assets/images/cursos/c4.jpg";
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

/*
  TEXTOS DE EJEMPLO: reemplazar por los datos reales de cada curso.
  - type: "free" | "paid"   (price solo en los pagados, en soles)
  - featured: true  → es el curso destacado (usar en uno solo)
  - enrollUrl: enlace de inscripción o pago. Si queda vacío, lleva al formulario de contacto.
*/
export const courses = [
  {
    id: "fundamentos-liderazgo",
    type: "free",
    category: "LIDERAZGO",
    level: "Básico",
    duration: "3 horas",
    modality: "Online · grabado",
    certificate: false,
    title: "Fundamentos del liderazgo",
    description: "Aprende los principios fundamentales para liderar equipos.",
    learn: [
      "Qué distingue a un líder de un jefe",
      "Cómo comunicar una visión al equipo",
      "Bases para delegar y dar seguimiento",
      "Hábitos de un liderazgo sostenible",
    ],
    syllabus: [
      "Qué es liderar hoy",
      "Comunicación y visión",
      "Delegación y confianza",
      "Plan de acción personal",
    ],
    audience: "Profesionales que inician en roles de coordinación o jefatura.",
    enrollUrl: "",
    image: c2,
  },
  {
    id: "introduccion-gestion",
    type: "free",
    category: "GESTIÓN",
    level: "Básico",
    duration: "2 horas",
    modality: "Online · grabado",
    certificate: false,
    title: "Introducción a la gestión",
    description: "Conceptos esenciales para mejorar la gestión profesional.",
    learn: [
      "Conceptos clave de gestión de equipos",
      "Cómo priorizar tareas y recursos",
      "Indicadores básicos de seguimiento",
      "Errores frecuentes y cómo evitarlos",
    ],
    syllabus: [
      "Fundamentos de la gestión",
      "Planificación y prioridades",
      "Seguimiento con indicadores",
      "Buenas prácticas",
    ],
    audience: "Emprendedores y profesionales que quieren ordenar su forma de trabajar.",
    enrollUrl: "",
    image: c3,
  },
  {
    id: "gestion-estrategica",
    type: "paid",
    featured: true,
    badge: "MÁS RECOMENDADO",
    category: "ESTRATEGIA",
    level: "Intermedio",
    duration: "12 horas",
    modality: "Online · en vivo",
    certificate: true,
    title: "Gestión estratégica empresarial",
    description:
      "Programa completo para desarrollar estrategias, tomar mejores decisiones y convertir objetivos en resultados medibles.",
    learn: [
      "Diagnosticar la situación de una organización",
      "Definir objetivos y prioridades estratégicas",
      "Diseñar un plan de acción con indicadores",
      "Tomar decisiones con información y criterio",
    ],
    syllabus: [
      "Diagnóstico y análisis del entorno",
      "Objetivos y propuesta de valor",
      "Plan de acción y recursos",
      "Medición y mejora continua",
    ],
    audience: "Gerentes, líderes de área y dueños de negocio.",
    price: 149,
    enrollUrl: "",
    image: c1,
  },
  {
    id: "liderazgo-desarrollo",
    type: "paid",
    category: "LIDERAZGO",
    level: "Avanzado",
    duration: "16 horas",
    modality: "Online · grabado",
    certificate: true,
    title: "Liderazgo y desarrollo profesional",
    description: "Programa orientado al crecimiento profesional y a la formación de equipos de alto desempeño.",
    learn: [
      "Desarrollar el talento de tu equipo",
      "Gestionar conversaciones difíciles",
      "Liderar el cambio en la organización",
      "Construir tu plan de crecimiento profesional",
    ],
    syllabus: [
      "Liderazgo y autoconocimiento",
      "Desarrollo de personas",
      "Liderar el cambio",
      "Plan de carrera y legado",
    ],
    audience: "Líderes con experiencia que quieren dar el siguiente paso.",
    price: 199,
    enrollUrl: "",
    image: c4,
  },
];