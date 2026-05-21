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
import AgendamentosPage from "./pages/admin/AgendamentosPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("spa_token");

  return token
    ? children
    : <Navigate to="/login" replace />;
}

function PlaceholderPage({ title }) {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-black">
        {title}
      </h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* DASHBOARD */}

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* CLIENTES */}

        <Route
          path="/admin/clientes"
          element={
            <PrivateRoute>
              <ClientesPage />
            </PrivateRoute>
          }
        />

        {/* PETS */}

        <Route
          path="/admin/pets"
          element={
            <PrivateRoute>
              <PetsPage />
            </PrivateRoute>
          }
        />

        {/* SERVIÇOS */}

        <Route
          path="/admin/servicos"
          element={
            <PrivateRoute>
              <ServicosPage />
            </PrivateRoute>
          }
        />

        {/* AGENDAMENTOS */}

        <Route
          path="/admin/agendamentos"
          element={
            <PrivateRoute>
              <AgendamentosPage />
            </PrivateRoute>
          }
        />

        {/* FINANCEIRO */}

        <Route
          path="/admin/financeiro"
          element={
            <PrivateRoute>
              <PlaceholderPage title="Financeiro" />
            </PrivateRoute>
          }
        />

        {/* ESTOQUE */}

        <Route
          path="/admin/estoque"
          element={
            <PrivateRoute>
              <PlaceholderPage title="Estoque" />
            </PrivateRoute>
          }
        />

        {/* VACINAS */}

        <Route
          path="/admin/vacinas"
          element={
            <PrivateRoute>
              <PlaceholderPage title="Vacinas" />
            </PrivateRoute>
          }
        />

        {/* DISPONIBILIDADE */}

        <Route
          path="/admin/disponibilidade"
          element={
            <PrivateRoute>
              <PlaceholderPage title="Disponibilidade" />
            </PrivateRoute>
          }
        />

        {/* GALERIA */}

        <Route
          path="/admin/galeria"
          element={
            <PrivateRoute>
              <PlaceholderPage title="Galeria" />
            </PrivateRoute>
          }
        />

        {/* CONFIGURAÇÕES */}

        <Route
          path="/admin/configuracoes"
          element={
            <PrivateRoute>
              <PlaceholderPage title="Configurações" />
            </PrivateRoute>
          }
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
