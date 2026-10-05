import { useCallback, useEffect, useState } from "react";
import { privacy } from "../../../data/privacy";
import Modal from "../../ui/Modal/Modal";
import "./PrivacyPolicy.css";

const HASH = "#privacidad";

export default function PrivacyPolicy() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === HASH);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  if (!open) return null;

  return (
    <Modal onClose={close} titleId="privacy-title">
      <div className="legal">
        <span className="section-label">LEGAL</span>
        <h2 id="privacy-title">{privacy.title}</h2>
        <p className="legal-updated">Última actualización: {privacy.updated}</p>
        <p className="legal-intro">{privacy.intro}</p>

        {privacy.sections.map((s, i) => (
          <section key={s.title}>
            <h3>
              {i + 1}. {s.title}
            </h3>
            {s.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.items && (
              <ul>
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {s.after && <p>{s.after}</p>}
          </section>
        ))}

        <button type="button" className="primary-button" onClick={close}>
          Entendido
        </button>
      </div>
    </Modal>
  );
}