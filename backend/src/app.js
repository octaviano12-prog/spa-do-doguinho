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

import FinanceiroPage from "./pages/admin/FinanceiroPage";
import EstoquePage from "./pages/admin/EstoquePage";
import VacinasPage from "./pages/admin/VacinasPage";
import GaleriaPage from "./pages/admin/GaleriaPage";

import DisponibilidadePage from "./pages/admin/DisponibilidadePage";
import ConfiguracoesPage from "./pages/admin/ConfiguracoesPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("spa_token");

  return token
    ? children
    : <Navigate to="/login" replace />;
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
              <FinanceiroPage />
            </PrivateRoute>
          }
        />

        {/* ESTOQUE */}

        <Route
          path="/admin/estoque"
          element={
            <PrivateRoute>
              <EstoquePage />
            </PrivateRoute>
          }
        />

        {/* VACINAS */}

        <Route
          path="/admin/vacinas"
          element={
            <PrivateRoute>
              <VacinasPage />
            </PrivateRoute>
          }
        />

        {/* GALERIA */}

        <Route
          path="/admin/galeria"
          element={
            <PrivateRoute>
              <GaleriaPage />
            </PrivateRoute>
          }
        />

        {/* DISPONIBILIDADE */}

        <Route
          path="/admin/disponibilidade"
          element={
            <PrivateRoute>
              <DisponibilidadePage />
            </PrivateRoute>
          }
        />

        {/* CONFIGURAÇÕES */}

        <Route
          path="/admin/configuracoes"
          element={
            <PrivateRoute>
              <ConfiguracoesPage />
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
