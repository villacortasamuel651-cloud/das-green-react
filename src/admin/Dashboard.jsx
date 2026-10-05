import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
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

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Panel de administración</h1>

        <div>
          <a href="#/">Ver página</a>
          <button type="button" onClick={() => signOut(auth)}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        {EDITORS.map((editor) => (
          <button
            key={editor.id}
            type="button"
            className={editor.id === active ? "active" : ""}
            onClick={() => setActive(editor.id)}
          >
            {editor.label}
          </button>
        ))}
      </nav>

      <Component />
    </div>
  );
}