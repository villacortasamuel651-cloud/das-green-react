import { useEffect, useState } from "react";

// Lee el contenido de la API. Mientras carga, o si falla o no existe,
// devuelve null y el componente usa sus datos locales.
export default function useContent(id) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/content/${encodeURIComponent(id)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (!cancelled && result?.content) setData(result.content);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [id]);

  return data;
}
