import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

// Solo adapta los imports locales que Vite resuelve en el navegador.
// Las imágenes se convierten después a WebP; nunca se guardan bytes en JSON.
export async function loadLocalContent() {
  const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
      if (specifier.startsWith(".") && context.parentURL?.startsWith(pathToFileURL(projectRoot).href)) {
        if (!path.extname(specifier)) specifier += ".js";
      }
      return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
      if (/\.(jpg|jpeg|png|webp)$/i.test(url) && url.startsWith(pathToFileURL(projectRoot).href)) {
        const relative = path.relative(projectRoot, fileURLToPath(url)).split(path.sep).join("/");
        return { format: "module", shortCircuit: true, source: `export default ${JSON.stringify(`seed-file:${relative}`)};` };
      }
      return nextLoad(url, context);
    },
  });
  try {
    const [hero, about, timeline, experience, exhibitions, gallery, news, courses, testimonials, quote, booking, contact] = await Promise.all([
      import("../../src/data/hero.js"), import("../../src/data/about.js"),
      import("../../src/data/timeline.js"), import("../../src/data/experience.js"),
      import("../../src/data/exhibitions.js"), import("../../src/data/gallery.js"),
      import("../../src/data/news.js"), import("../../src/data/courses.js"),
      import("../../src/data/testimonials.js"), import("../../src/data/quote.js"),
      import("../../src/data/booking.js"), import("../../src/data/contact.js"),
    ]);
    const list = (items) => ({ items: items.map((item, index) => ({ ...item, id: `local-${index}` })) });
    return [
      { id: "hero", payload: hero.heroContent },
      { id: "about", payload: { ...about.aboutEditable, image: about.about.image } },
      { id: "timelineSection", payload: timeline.timelineSection }, { id: "timeline", payload: list(timeline.timeline) },
      { id: "experienceSection", payload: experience.experienceSection }, { id: "experience", payload: list(experience.experience) },
      { id: "exhibitionsSection", payload: exhibitions.exhibitionsSection }, { id: "exhibitions", payload: list(exhibitions.exhibitionsEditable) },
      { id: "gallerySection", payload: gallery.gallerySection }, { id: "gallery", payload: list(gallery.gallery) },
      { id: "newsSection", payload: news.newsSection }, { id: "news", payload: list(news.newsEditable) },
      { id: "coursesSection", payload: courses.coursesSection }, { id: "courses", payload: list(courses.coursesEditable) },
      { id: "testimonials", payload: list(testimonials.testimonials) }, { id: "quote", payload: quote.quote },
      { id: "booking", payload: booking.bookingEditable }, { id: "contact", payload: contact.contactSection },
    ];
  } finally {
    hooks.deregister();
  }
}
