import { useEffect, useState } from "react";
import { navLinks } from "../../../data/navigation";
import useScrollSpy from "../../../hooks/useScrollSpy";
import Logo from "../../ui/Logo/Logo";
import "./Navbar.css";

const sectionIds = navLinks.map((l) => l.href.slice(1));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onKey = (e) => e.key === "Escape" && setOpen(false);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        <Logo />

        <nav className={`nav-menu ${open ? "show" : ""}`}>
          {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={active === link.href.slice(1) ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}

          <a href="#agendar" className="nav-menu-cta" onClick={() => setOpen(false)}>
          Agendar reunión
          </a>
        </nav>

        <button
          className="menu-button"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}