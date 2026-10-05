import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./styles/variables.css";
import "./styles/global.css";

import App from "./App.jsx";
import Login from "./admin/Login.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import ProtectedRoute from "./admin/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Todo lo demás (incluidos #sobre-mi, #trayectoria...) muestra la landing */}
        <Route path="*" element={<App />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);