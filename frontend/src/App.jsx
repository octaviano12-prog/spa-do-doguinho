import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ClientesPage from "./pages/admin/ClientesPage";
import PetsPage from "./pages/admin/PetsPage";
import ServicosPage from "./pages/admin/ServicosPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("spa_token");

  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/clientes"
          element={
            <PrivateRoute>
              <ClientesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/pets"
          element={
            <PrivateRoute>
              <PetsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/servicos"
          element={
            <PrivateRoute>
              <ServicosPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
