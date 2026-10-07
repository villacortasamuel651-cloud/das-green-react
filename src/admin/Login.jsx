import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "No se pudo iniciar sesión.");
      navigate("/admin");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
    }
  };

  return (
    <div className="admin-page">
      <form className="admin-card" onSubmit={handleSubmit}>
        <h1>Panel de administración</h1>

        <label>Correo</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="admin-error">{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
