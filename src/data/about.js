// import aboutImg from "../assets/images/about/perfil.jpg";
import aboutImg from "../assets/images/about/profile.jpg";

export const about = {
  image: aboutImg,
  label: "SOBRE MÍ",
  title: "Una trayectoria construida sobre experiencia, visión y resultados.",
  paragraphs: [
    "Soy Diego Alberto Sorrilla Green, un profesional apasionado por el liderazgo, la gestión y la innovación.",
    "A lo largo de mi trayectoria he tenido la oportunidad de liderar proyectos, formar equipos y generar soluciones que buscan crear un impacto positivo.",
  ],
  stats: [
    { icon: "👥", value: "+10", label: "Años de experiencia" },
    { icon: "◈", value: "+20", label: "Proyectos liderados" },
    { icon: "◎", value: "+XX", label: "Clientes y aliados" },
  ],
};

// ---- Panel de administración: campos de texto editables ----
export const aboutEditable = {
  label: about.label,
  title: about.title,
  p1: about.paragraphs[0] ?? "",
  p2: about.paragraphs[1] ?? "",
  s1Value: about.stats[0]?.value ?? "",
  s1Label: about.stats[0]?.label ?? "",
  s2Value: about.stats[1]?.value ?? "",
  s2Label: about.stats[1]?.label ?? "",
  s3Value: about.stats[2]?.value ?? "",
  s3Label: about.stats[2]?.label ?? "",
};

// Mezcla lo guardado en Firebase con los datos locales (imagen e iconos siempre locales)
export const mergeAbout = (base, remote) => {
  if (!remote) return base;
  return {
    ...base,
    label: remote.label ?? base.label,
    title: remote.title ?? base.title,
    paragraphs: [remote.p1 ?? base.paragraphs[0], remote.p2 ?? base.paragraphs[1]].filter(Boolean),
    stats: base.stats.map((s, i) => ({
      ...s,
      value: remote[`s${i + 1}Value`] ?? s.value,
      label: remote[`s${i + 1}Label`] ?? s.label,
    })),
  };
};
