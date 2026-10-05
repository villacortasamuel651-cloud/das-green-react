export const bookingCard = {
  eyebrow: "REUNIÓN INICIAL",
  title: "Conversemos sobre tu proyecto",
  details: [
    { label: "Duración", value: "30 minutos" },
    { label: "Modalidad", value: "Videollamada por Google Meet" },
    { label: "Confirmación", value: "Invitación a tu correo" },
    { label: "Disponibilidad", value: "Lunes a viernes, 9:00 – 17:00 (hora de Lima)" },
  ],
  footer: "Elige tu horario en la página de reservas.",
};

export const bookingSection = {
  label: "AGENDEMOS UNA REUNIÓN",
  title: "¿Hablamos sobre tu próximo proyecto?",
  text: "Agenda un espacio en mi calendario y conversemos sobre nuevas oportunidades, proyectos o alianzas.",
  button: "Agendar reunión",
  note: "Elige un horario disponible y recibirás la invitación por correo.",
};

// ---- Panel de administración ----
export const bookingEditable = {
  ...bookingSection,
  cardEyebrow: bookingCard.eyebrow,
  cardTitle: bookingCard.title,
  cardFooter: bookingCard.footer,
  ...Object.fromEntries(bookingCard.details.map((d, i) => [`detail${i}`, d.value])),
};

export const mergeBooking = (remote) => {
  const r = remote ?? {};
  return {
    section: Object.fromEntries(Object.keys(bookingSection).map((k) => [k, r[k] ?? bookingSection[k]])),
    card: {
      eyebrow: r.cardEyebrow ?? bookingCard.eyebrow,
      title: r.cardTitle ?? bookingCard.title,
      footer: r.cardFooter ?? bookingCard.footer,
      details: bookingCard.details.map((d, i) => ({ ...d, value: r[`detail${i}`] ?? d.value })),
    },
  };
};
