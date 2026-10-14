import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { site } from "../config/site";
import AdminIcon from "./AdminIcon";
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
  { id: "hero", label: "Inicio", description: "Texto de portada y video de fondo.", Component: HeroEditor },
  { id: "about", label: "Sobre mí", description: "Presentación, fotografía y datos destacados.", Component: AboutEditor },
  { id: "timeline", label: "Trayectoria", description: "Etapas y momentos de tu recorrido.", Component: TimelineEditor },
  { id: "experience", label: "Experiencia", description: "Áreas de trabajo y experiencia profesional.", Component: ExperienceEditor },
  { id: "exhibitions", label: "Exposiciones", description: "Participaciones, eventos e imágenes.", Component: ExhibitionsEditor },
  { id: "gallery", label: "Galería", description: "Fotografías y recuerdos para compartir.", Component: GalleryEditor },
  { id: "news", label: "Noticias", description: "Publicaciones, novedades y artículos.", Component: NewsEditor },
  { id: "courses", label: "Cursos", description: "Formación, programas y contenido de cursos.", Component: CoursesEditor },
  { id: "testimonials", label: "Testimonios", description: "Opiniones de quienes han trabajado contigo.", Component: TestimonialsEditor },
  { id: "quote", label: "Cita", description: "Una reflexión y su autor.", Component: QuoteEditor },
  { id: "booking", label: "Reunión", description: "Textos y detalles de la sección de reuniones.", Component: BookingEditor },
  { id: "contact", label: "Contacto", description: "Presentación y textos del formulario.", Component: ContactEditor },
];

const normalize = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const headingRef = useRef(null);
  const menuButtonRef = useRef(null);
  const navigate = useNavigate();
  const activeEditor = EDITORS.find((editor) => editor.id === active);
  const Component = activeEditor?.Component;
  const filteredEditors = EDITORS.filter((editor) => normalize(`${editor.label} ${editor.description}`).includes(normalize(query.trim())));

  const selectSection = (id) => {
    setActive(id);
    setMenuOpen(false);
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  };

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo cerrar la sesión. Inténtalo de nuevo.");
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("No se pudo cerrar la sesión. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="admin-page admin-dashboard">
      <a className="admin-skip-link" href="#admin-main" onClick={(event) => { event.preventDefault(); document.getElementById("admin-main")?.focus(); }}>Saltar al contenido</a>
      <aside className="admin-sidebar" onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}>
        <div className="admin-sidebar-heading">
          <a className="admin-brand" href="#/admin" onClick={(event) => { event.preventDefault(); selectSection("overview"); }}>
            <span>{site.brand.main}</span> {site.brand.sub}<small>PANEL DE ADMINISTRACIÓN</small>
          </a>
          <button className="admin-menu-toggle" type="button" ref={menuButtonRef} aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"} aria-expanded={menuOpen} aria-controls="admin-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <AdminIcon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
        <div id="admin-navigation" className={`admin-navigation ${menuOpen ? "is-open" : ""}`}>
          <nav className="admin-tabs" aria-label="Administración del sitio">
            <button type="button" className={active === "overview" ? "active" : ""} aria-current={active === "overview" ? "page" : undefined} onClick={() => selectSection("overview")}>
              <AdminIcon name="overview" />Resumen
            </button>
            <p className="admin-nav-label">CONTENIDO DEL SITIO</p>
            {EDITORS.map((editor) => (
              <button key={editor.id} type="button" className={editor.id === active ? "active" : ""} aria-current={editor.id === active ? "page" : undefined} onClick={() => selectSection(editor.id)}>
                <AdminIcon name={editor.id} />{editor.label}
              </button>
            ))}
          </nav>
          <div className="admin-sidebar-footer">
            <a href="#/" target="_blank" rel="noopener noreferrer">Ver sitio público<AdminIcon name="external" /><span className="admin-sr-only"> (se abre en una pestaña nueva)</span></a>
            <p>{site.name}</p>
          </div>
        </div>
      </aside>

      <main className="admin-main" id="admin-main" tabIndex={-1}>
        <header className="admin-topbar">
          <p className="admin-breadcrumb">Administración <span aria-hidden="true">/</span> <strong>{activeEditor?.label ?? "Resumen"}</strong></p>
          <div className="admin-topbar-actions">
            <a className="admin-preview-link" href="#/" target="_blank" rel="noopener noreferrer">Ver página<AdminIcon name="external" /><span className="admin-sr-only"> (se abre en una pestaña nueva)</span></a>
            <button className="admin-logout" type="button" onClick={logout} disabled={loggingOut}><AdminIcon name="logout" />{loggingOut ? "Cerrando…" : "Cerrar sesión"}</button>
          </div>
        </header>
        <div className="admin-editor-content">
          {logoutError && <p className="admin-alert" role="alert">{logoutError}</p>}
          <div className="admin-page-heading">
            <div>
              <span className="admin-eyebrow">TU ESPACIO DE TRABAJO</span>
              <h1 ref={headingRef} tabIndex={-1}>{activeEditor?.label ?? "Resumen del sitio"}</h1>
              <p>{activeEditor?.description ?? "Todo lo que necesitas para mantener tu contenido al día."}</p>
            </div>
            {activeEditor && <button className="admin-secondary" type="button" onClick={() => selectSection("overview")}><AdminIcon name="overview" />Ver secciones</button>}
          </div>

          {Component ? (
            <>
              <p className="admin-edit-note"><AdminIcon name="lock" />Guarda los cambios en cada editor antes de pasar a otra sección.</p>
              <Component />
            </>
          ) : (
            <>
              <section className="admin-welcome" aria-labelledby="admin-welcome-title">
                <div>
                  <span className="admin-welcome-label">{site.brand.main} {site.brand.sub} · SITIO PERSONAL</span>
                  <h2 id="admin-welcome-title">Tu próxima actualización<br />empieza aquí.</h2>
                  <p>Comparte una novedad, renueva tu presentación o dale una nueva imagen a la portada.</p>
                  <button type="button" onClick={() => selectSection("hero")}>Editar portada<AdminIcon name="arrow" /></button>
                </div>
                <div className="admin-welcome-art" aria-hidden="true"><span /><span /><span /><div><AdminIcon name="hero" /></div></div>
              </section>

              <section className="admin-section-directory" aria-labelledby="admin-directory-title">
                <div className="admin-directory-header">
                  <div><h2 id="admin-directory-title">¿Qué quieres actualizar?</h2><p>{EDITORS.length} secciones disponibles para editar</p></div>
                  <div className="admin-search">
                    <AdminIcon name="search" />
                    <label className="admin-sr-only" htmlFor="admin-section-search">Buscar una sección</label>
                    <input id="admin-section-search" type="search" placeholder="Buscar sección…" value={query} onChange={(event) => setQuery(event.target.value)} />
                  </div>
                </div>
                <p className="admin-sr-only" role="status">{filteredEditors.length} secciones encontradas</p>
                <div className="admin-section-grid">
                  {filteredEditors.map((editor) => (
                    <button className="admin-section-card" type="button" key={editor.id} onClick={() => selectSection(editor.id)}>
                      <span className="admin-section-icon"><AdminIcon name={editor.id} /></span>
                      <strong>{editor.label}</strong>
                      <span className="admin-section-description">{editor.description}</span>
                      <span className="admin-section-action">Editar sección<AdminIcon name="arrow" /></span>
                    </button>
                  ))}
                </div>
                {filteredEditors.length === 0 && <div className="admin-empty"><AdminIcon name="search" /><h3>No encontramos esa sección</h3><p>Prueba con «Inicio», «Galería» o «Contacto».</p><button className="admin-secondary" type="button" onClick={() => setQuery("")}>Mostrar todas las secciones</button></div>}
              </section>
              <p className="admin-overview-note">Edita una sección, guarda sus cambios y abre la página pública para revisar el resultado.</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
