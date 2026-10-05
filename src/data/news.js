import noticia1 from "../assets/images/news/summit.jpg";
import noticia2 from "../assets/images/news/team-event.jpg";
import noticia3 from "../assets/images/news/innovation-event.jpg";

import { fromLines, fromTags, toLines, toTags } from "../utils/content";

export const newsSection = {
  label: "NOTICIAS",
  title: "Actualidad, ideas y experiencias.",
  text: "Conoce las últimas novedades, participaciones y contenidos relacionados con mi trayectoria.",
};

export const news = [
  {
    date: "START SUMMIT 2024 · SUIZA",
    title: "Aprendizajes y conexiones en el START SUMMIT 2024",
    description:
      "Una experiencia en St. Gallen para conocer el ecosistema suizo de innovación y emprendimiento.",
    url: "https://www.linkedin.com/posts/diegozorrillagreen_startsummit2024-startglobal-startups-ugcPost-7177529373959323650-fFVp/",
    image: noticia1,
    article: {
      eyebrow: "EXPERIENCIA INTERNACIONAL",
      sourceLabel: "Ver publicación original en LinkedIn",
      paragraphs: [
        "Con muchas sorpresas, aprendizajes y energía... ¡de Suiza! 🌄 🚀 ¡De vuelta a casa después de una experiencia inolvidable en el START SUMMIT 2024 en St. Gallen, Suiza! 🔥",
        "He tenido el privilegio de expandir mi red de contactos en Europa, sumergirme en el vibrante ecosistema de innovación y emprendimiento suizo, y explorar la prestigiosa Universidad de St. Gallen. 🔝",
        "Durante estos días, he aprendido sobre diversos desafíos de sostenibilidad, historias de éxito y fracaso en startups, y modelos de negocios innovadores que han ampliado mi perspectiva sobre las oportunidades disponibles en el mundo. 🌎",
        "Más que nunca, estoy convencido de la importancia de conectar con otros en un mundo globalizado, aprender de cada ecosistema emprendedor y contribuir al crecimiento de nuestra comunidad. ¡Estamos rodeados de oportunidades, y es nuestra responsabilidad buscarlas y luchar por ellas! 🙌",
        "Quiero agradecer a START Global por esta increíble oportunidad y por permitirme conocer a personas inspiradoras y nuevos amigos, como Luis Elías, Maria Andrea Gonzales Castillo, Pedro Domínguez, Andrés Santiago Martínez Hernández, y más, que comparten mi pasión y misión por el emprendimiento en Europa y Latinoamérica. 🇵🇪🇨🇴🇲🇽🇪🇨🇨🇱",
        "¡Los invito a todos a estar pendientes de próximas publicaciones y a seguir creciendo en constante colaboración con nuestra comunidad! ✨",
      ],
      tags: [
        "START SUMMIT 2024",
        "START GLOBAL",
        "Startups",
        "Comunidad",
        "Emprendimiento",
        "Innovación",
        "Aprendizaje continuo",
      ],
    },
  },
  {
    date: "31 MAR 2024",
    title: "De una iniciativa social a SUCommunity",
    description:
      "La experiencia de “Creciendo Juntos” y el comienzo de un camino de liderazgo y emprendimiento.",
    url: "https://www.linkedin.com/in/diegozorrillagreen/",
    image: noticia2,
    article: {
      eyebrow: "MI HISTORIA · SUCOMMUNITY",
      sourceLabel: "Ver perfil de Diego en LinkedIn",
      paragraphs: [
        "Espero que hayan disfrutado de una feliz Semana Santa ✨",
        "Les escribo porque algunos me preguntaron, luego de mis últimas publicaciones, cómo logré publicar un artículo en El Comercio 📰 o participar del START Summit en Suiza. 🌍",
        "He estado ocupado académica y laboralmente durante los últimos meses y años, participando en distintos proyectos y realizando un programa de doble título en Francia que me ha traído grandes experiencias 🤓. Por eso también estuve desconectado de las redes sociales, pero pronto compartiré mi recorrido para aportar mis aprendizajes más recientes. 😎",
        "Pero, si alguien quiere saber desde ya un dato curioso y antiguo... 👇",
        "En 2018, motivado por la realidad nacional y asombrado por las capacidades de muchos compañeros, decidí emprender una iniciativa social 🛤️. El 12 de diciembre de ese año, junto con 30 compañeros de la Universidad ESAN, llevamos a cabo el proyecto “Creciendo Juntos”. Visitamos a niños del INSN en San Borja, realizamos actividades educativas y recreativas, entregamos víveres y regalos navideños y compartimos parábolas teatrales para enseñar la fe en Jesús. 🌠",
        "Desde ese día, el grupo “Sólo Una Cruz” comenzó a crecer y a realizar más proyectos, hasta convertirse en una comunidad conocida hoy como SUCommunity. Allí pude aprender mucho, conocer personas grandiosas y desarrollarme junto con ellas. Fue donde me transformé en líder y emprendedor; por eso, siempre seré su embajador. 🏁",
        "¿Por qué les cuento todo esto? Nunca imaginé que estas experiencias me llevarían a donde estoy hoy. Esta Semana Santa volvió a resonar en mi mente algo que aprendí: “Como son más altos los cielos que la tierra, así son mis caminos más altos que vuestros caminos, y mis pensamientos más que vuestros pensamientos”. Dice el Señor en Isaías 55:9 📖",
        "Es el último versículo de una de mis películas favoritas, que recomiendo ver incluso después de Semana Santa, porque nunca es tarde: God's Not Dead ❤️",
      ],
      tags: [
        "Creciendo Juntos",
        "ESAN",
        "SUCommunity",
        "Liderazgo",
        "Emprendimiento",
      ],
    },
  },
  {
    date: "10 ABR 2025",
    title: "Final Pitch Competition de Hult Prize ESAN",
    description:
      "Una final universitaria que conectó ideas de innovación social con estudiantes, jurados y aliados.",
    url: "https://www.linkedin.com/in/diegozorrillagreen/",
    image: noticia3,
    article: {
      eyebrow: "INNOVACIÓN · HULT PRIZE ESAN",
      sourceLabel: "Ver perfil de Diego en LinkedIn",
      paragraphs: [
        "Transformando ideas en acción, del campus al mundo empresarial 🚀. Final Pitch Competition de Hult Prize ESAN 🌲",
        "El pasado 28 de febrero, la Universidad ESAN fue testigo de una jornada inolvidable. Más que una competencia, fue un espacio donde la innovación social conectó a estudiantes visionarios con un jurado de alto nivel y una comunidad comprometida con cambiar el mundo desde el emprendimiento: Hult Prize Foundation 🌍.",
        "En esta final local, dos equipos fueron seleccionados para representarnos en la Final Nacional del 27 de abril:",
        "🥇 Primer puesto: Feynman, con Valeria Pamela Aliaga Flores y Paola Granda. 🥈 Segundo puesto: Kurani, con Jean Pierre Castro Acuña y Andrea Jimenez.",
        "Un agradecimiento especial a las managers: Alexsandra Urquiza Huaman, Deputy Campus Director; Milagros Soto Artica, Operations Manager; y Micaela Dula Flores Arana, Public Relationships Manager.",
        "También reconocemos al jurado: Guillermo Vargas, Founder & CEO de Blue Marketer; Alvaro Echevarría Córdova, Coordinador de Aceleración Innova ESAN; Giannina Castro Gamarra, CEO de Pratt & Castro Consultores; y Brizeth Quincho Cantoral, Founder & CEO de Santa Perucha Carbón.",
        "Agradecemos a nuestros aliados estratégicos: Innova ESAN como partner principal y SUCooperative como sponsor principal.",
        "Nuestra misión recién empieza: impulsar a nuestros primeros emprendedores mediante una experiencia internacional y formarlos como embajadores de innovación y emprendimiento para la comunidad de la Universidad ESAN 🌲.",
        "Seas de ESAN o no, súmate y crece con nuestra comunidad 🚀: https://lnkd.in/eBgqw3TV",
      ],
      tags: [
        "Innovación",
        "Emprendimiento",
        "Hult Prize ESAN",
        "ESAN",
        "SUCooperative",
      ],
    },
  },
];

// ---- Panel de administración: el cliente edita textos planos ----
export const newsEditable = news.map((n) => ({
  ...n,
  eyebrow: n.article?.eyebrow ?? "",
  body: fromLines(n.article?.paragraphs),
  tags: fromTags(n.article?.tags),
}));

// Reconstruye `article` (que usa el modal) a partir de los textos editados.
export const normalizeNews = (item) => {
  const base = item.article ?? {};
  const paragraphs = item.body !== undefined ? toLines(item.body) : (base.paragraphs ?? []);
  const tags = item.tags !== undefined ? toTags(item.tags) : (base.tags ?? []);
  return {
    ...item,
    article: {
      ...base,
      eyebrow: item.eyebrow ?? base.eyebrow ?? "",
      paragraphs: paragraphs.length ? paragraphs : [item.description ?? ""],
      tags,
    },
  };
};
