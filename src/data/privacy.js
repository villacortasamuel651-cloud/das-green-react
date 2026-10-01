import { site } from "../config/site";

const owner = site.legalName || site.name;

/*
  TEXTO MODELO. Debe ser revisado por el responsable del sitio y por un asesor legal
  antes de publicar. Verificar que cada punto describa lo que realmente se hace.
*/
export const privacy = {
  title: "Política de privacidad",
  updated: "octubre de 2026",
  intro:
    "Esta política explica cómo se tratan los datos personales que compartes a través de este sitio web.",
  sections: [
    {
      title: "Responsable del tratamiento",
      paragraphs: [
        `${owner} (marca ${site.brand.main} ${site.brand.sub}), con ubicación en ${site.location}, es responsable de los datos personales que se recogen en este sitio.`,
        `Para cualquier consulta sobre esta política puedes escribir a ${site.email}.`,
      ],
    },
    {
      title: "Datos que recopilamos",
      paragraphs: ["Solo recopilamos los datos que tú nos entregas al completar un formulario:"],
      items: [
        "Nombre completo.",
        "Correo electrónico.",
        "Motivo de contacto y el contenido de tu mensaje.",
        "El curso de tu interés, cuando solicitas acceso a un curso gratuito.",
      ],
    },
    {
      title: "Para qué los usamos",
      items: [
        "Responder tus consultas y propuestas.",
        "Enviarte el acceso al curso gratuito que solicitaste.",
        "Coordinar reuniones que tú mismo agendes.",
        "Enviarte información relacionada con el curso solicitado o con nuestros contenidos, solo si aceptaste recibirla.",
      ],
    },
    {
      title: "Tu consentimiento",
      paragraphs: [
        "Al enviar un formulario y, cuando corresponde, marcar la casilla de aceptación, autorizas el tratamiento descrito en esta política.",
        `Puedes retirar tu consentimiento en cualquier momento escribiendo a ${site.email}.`,
      ],
    },
    {
      title: "Con quién compartimos tus datos",
      paragraphs: [
        "No vendemos tus datos personales. Para que el sitio funcione, usamos proveedores que procesan información por encargo nuestro:",
      ],
      items: [
        "Un servicio de formularios (Formspree), que recibe los mensajes que envías y nos los reenvía.",
        "Google, para el correo electrónico y la agenda de reuniones.",
      ],
      after:
        "Estos proveedores pueden almacenar información en servidores ubicados fuera del Perú.",
    },
    {
      title: "Cuánto tiempo conservamos tus datos",
      paragraphs: [
        "Conservamos tus datos durante el tiempo necesario para atender tu solicitud y, si aceptaste recibir comunicaciones, mientras no retires tu consentimiento.",
      ],
    },
    {
      title: "Tus derechos",
      paragraphs: [
        "Puedes solicitar el acceso, la rectificación, la cancelación de tus datos o la oposición a su tratamiento. Escribe a " +
          site.email +
          " indicando tu nombre y lo que necesitas; responderemos a la brevedad.",
        "También puedes presentar un reclamo ante la autoridad de protección de datos personales de tu país.",
      ],
    },
    {
      title: "Seguridad",
      paragraphs: [
        "Aplicamos medidas razonables para proteger tu información frente a accesos no autorizados, pérdida o uso indebido.",
      ],
    },
    {
      title: "Cookies y servicios externos",
      paragraphs: [
        "Este sitio no utiliza cookies publicitarias. Las tipografías se cargan desde Google Fonts, por lo que tu navegador se conecta a servidores de Google al abrir la página. Si en el futuro se incorporan herramientas de analítica, esta política se actualizará.",
      ],
    },
    {
      title: "Cambios en esta política",
      paragraphs: [
        "Podemos actualizar esta política para reflejar cambios en el sitio o en la normativa. La fecha de la última actualización aparece al inicio.",
      ],
    },
  ],
};