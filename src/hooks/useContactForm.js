import { useState } from "react";
import { site } from "../config/site";

export default function useContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!site.formEndpoint) {
      setErrorMessage("Falta configurar formEndpoint en src/config/site.js");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (res.ok) {
        form.reset();
        setStatus("success");
        return;
      }

      const data = await res.json().catch(() => ({}));
      const detail = data.errors?.map((er) => er.message).join(", ") || `Error ${res.status}`;
      console.error("Formspree respondió con error:", res.status, data);
      setErrorMessage(detail);
      setStatus("error");
    } catch (err) {
      console.error("No se pudo conectar con Formspree:", err);
      setErrorMessage("No hubo conexión con el servicio de envío.");
      setStatus("error");
    }
  };

  return { status, errorMessage, submit };
}