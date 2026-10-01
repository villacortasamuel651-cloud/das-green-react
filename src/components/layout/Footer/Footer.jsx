import { site } from "../../../config/site";
import Logo from "../../ui/Logo/Logo";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <Logo />

        <p>
          {site.name} &nbsp;|&nbsp; {site.role}
        </p>

        <div className="socials">
          <a href={site.linkedinUrl} aria-label="LinkedIn">in</a>
          <a href={site.xUrl} aria-label="X">X</a>
          <a href={`mailto:${site.email}`} aria-label="Correo">✉</a>
        </div>
      </div>

      <div className="copyright">
  © {new Date().getFullYear()} {site.brand.main} {site.brand.sub}. Todos los derechos reservados.
      <span aria-hidden="true"> · </span>
      <a href="#privacidad">Política de privacidad</a>
  </div>
      </footer>
  );
}