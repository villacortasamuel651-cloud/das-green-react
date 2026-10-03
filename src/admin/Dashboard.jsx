import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import HeroEditor from "./HeroEditor";
import "./admin.css";

// Una línea por sección. Cada integrante agrega la suya.
const EDITORS = [
  { id: "hero", label: "Inicio", Component: HeroEditor },
  // { id: "about", label: "Sobre mí", Component: AboutEditor },
  // { id: "contact", label: "Contacto", Component: ContactEditor },
];

export default function Dashboard() {
  const [active, setActive] = useState(EDITORS[0].id);
  const { Component } = EDITORS.find((e) => e.id === active);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Panel de administración</h1>
        <div>
          <a href="#/">Ver página</a>
          <button onClick={() => signOut(auth)}>Cerrar sesión</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {EDITORS.map((e) => (
          <button
            key={e.id}
            className={e.id === active ? "active" : ""}
            onClick={() => setActive(e.id)}
          >
            {e.label}
          </button>
        ))}
      </nav>

      <Component />
    </div>
  );
}