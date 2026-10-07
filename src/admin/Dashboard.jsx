import { useState } from "react";
import HeroEditor from "./HeroEditor";
import AboutEditor from "./AboutEditor";
import TimelineEditor from "./TimelineEditor";
import ExperienceEditor from "./ExperienceEditor";
import ExhibitionsEditor from "./ExhibitionsEditor";
import GalleryEditor from "./GalleryEditor";
import NewsEditor from "./NewsEditor";
import CoursesEditor from "./CoursesEditor";
import TestimonialsEditor from "./TestimonialsEditor";
import QuoteEditor from "./QuoteEditor";
import BookingEditor from "./BookingEditor";
import ContactEditor from "./ContactEditor";
import "./admin.css";

const EDITORS = [
  { id: "hero", label: "Inicio", Component: HeroEditor },
  { id: "about", label: "Sobre mí", Component: AboutEditor },
  { id: "timeline", label: "Trayectoria", Component: TimelineEditor },
  { id: "experience", label: "Experiencia", Component: ExperienceEditor },
  { id: "exhibitions", label: "Exposiciones", Component: ExhibitionsEditor },
  { id: "gallery", label: "Galería", Component: GalleryEditor },
  { id: "news", label: "Noticias", Component: NewsEditor },
  { id: "courses", label: "Cursos", Component: CoursesEditor },
  { id: "testimonials", label: "Testimonios", Component: TestimonialsEditor },
  { id: "quote", label: "Cita", Component: QuoteEditor },
  { id: "booking", label: "Reunión", Component: BookingEditor },
  { id: "contact", label: "Contacto", Component: ContactEditor },
];

export default function Dashboard() {
  const [active, setActive] = useState(EDITORS[0].id);
  const { Component } = EDITORS.find((editor) => editor.id === active);

  const activeEditor = EDITORS.find((editor) => editor.id === active);

  return (
    <div className="admin-page admin-dashboard">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="#/admin"><span>DAS</span> GREEN<small>ADMINISTRACIÓN</small></a>
        <div className="admin-nav-label">CONTENIDO DEL SITIO</div>
        <nav className="admin-tabs" aria-label="Secciones del sitio">
          {EDITORS.map((editor) => (
            <button key={editor.id} type="button" className={editor.id === active ? "active" : ""}
              aria-current={editor.id === active ? "page" : undefined} onClick={() => setActive(editor.id)}>
              {editor.label}
            </button>
          ))}
        </nav>
        <a className="admin-sidebar-site" href="#/">← Ver sitio público</a>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-breadcrumb">Panel / Contenido</span><h1>{activeEditor.label}</h1></div>
          <div className="admin-topbar-actions">
            <a href="#/">Ver página</a>
            <button type="button" onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            window.location.hash = "#/login";
          }}>
            Cerrar sesión
            </button>
          </div>
        </header>
        <div className="admin-editor-content"><Component /></div>
      </main>
    </div>
  );
}
