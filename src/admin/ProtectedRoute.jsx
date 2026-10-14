import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAdminSession } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = aún cargando

  useEffect(() => {
    const controller = new AbortController();
    getAdminSession({ signal: controller.signal })
      .then(() => { if (!controller.signal.aborted) setUser(true); })
      .catch(() => { if (!controller.signal.aborted) setUser(null); });
    return () => controller.abort();
  }, []);

  if (user === undefined) return <p className="admin-msg">Cargando...</p>;
  return user ? children : <Navigate to="/login" replace />;
}
