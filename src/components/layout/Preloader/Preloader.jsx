import { useEffect, useState } from "react";
import { site } from "../../../config/site";
import "./Preloader.css";

export default function Preloader({ onReveal }) {
  const [phase, setPhase] = useState("in"); // in → out → done

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const lift = setTimeout(() => {
      setPhase("out");
      onReveal?.();
    }, 1900);

    const finish = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 2800);

    return () => {
      clearTimeout(lift);
      clearTimeout(finish);
      document.body.style.overflow = "";
    };
  }, [onReveal]);

  if (phase === "done") return null;

  return (
    <div className={`preloader ${phase === "out" ? "hide" : ""}`} aria-hidden="true">
      <div className="preloader-brand">
        <span>{site.brand.main}</span>
        <small>{site.brand.sub}</small>
      </div>

      <div className="preloader-line">
        <i />
      </div>
    </div>
  );
}