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
          {site.linkedinUrl && (
            <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn de ${site.name} (se abre en una pestaña nueva)`}>in</a>
          )}
          {site.xUrl && (
            <a href={site.xUrl} target="_blank" rel="noopener noreferrer" aria-label={`X de ${site.name} (se abre en una pestaña nueva)`}>X</a>
          )}
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
