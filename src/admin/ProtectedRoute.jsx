import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = aún cargando

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => setUser(response.ok ? true : null))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return <p className="admin-msg">Cargando...</p>;
  return user ? children : <Navigate to="/login" replace />;
}
