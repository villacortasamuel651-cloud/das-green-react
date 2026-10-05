import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = aún cargando

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <p className="admin-msg">Cargando...</p>;
  return user ? children : <Navigate to="/login" replace />;
}