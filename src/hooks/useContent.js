import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Lee content/{id} de Firestore. Mientras carga, o si falla
// o no existe, devuelve null y el componente usa sus datos locales.
export default function useContent(id) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getDoc(doc(db, "content", id))
      .then((snap) => {
        if (!cancelled && snap.exists()) setData(snap.data());
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [id]);

  return data;
}