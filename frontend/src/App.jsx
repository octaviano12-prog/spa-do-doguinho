import React, { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import HomePage from "./pages/public/HomePage";
import MobileHomePage from "./pages/public/MobileHomePage";
import QuemSomosPage from "./pages/public/QuemSomosPage";
import ServicosPublicPage from "./pages/public/ServicosPublicPage";
import GaleriaPublicPage from "./pages/public/GaleriaPublicPage";
import ContatoPage from "./pages/public/ContatoPage";
import AgendamentoPage from "./pages/public/AgendamentoPage";
import ClienteLoginPage from "./pages/public/ClienteLoginPage";
import ClienteDashboardPage from "./pages/public/ClienteDashboardPage";
import MobileLoginPage from "./pages/mobile/MobileLoginPage";
import MobileBookingPage from "./pages/mobile/MobileBookingPage";
import MobileAccountPage from "./pages/mobile/MobileAccountPage";

import DashboardPage from "./pages/admin/DashboardPage";
import ClientesPage from "./pages/admin/ClientesPage";
import PetsPage from "./pages/admin/PetsPage";
import ServicosPage from "./pages/admin/ServicosPage";
import AgendamentosPage from "./pages/admin/AgendamentosPage";
import FinanceiroPage from "./pages/admin/FinanceiroPage";
import CaixaPage from "./pages/admin/CaixaPage";
import EstoquePage from "./pages/admin/EstoquePage";
import VacinasPage from "./pages/admin/VacinasPage";
import GaleriaPage from "./pages/admin/GaleriaPage";
import DisponibilidadePage from "./pages/admin/DisponibilidadePage";
import ConfiguracoesPage from "./pages/admin/ConfiguracoesPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("spa_token");
  return token ? children : <Navigate to="/login" replace />;
}

function CustomerRoute({ children }) {
  const token = localStorage.getItem("spa_customer_token");
  return token ? children : <Navigate to="/cliente-login" replace />;
}

function MobileCustomerRoute({ children, next = "/mobile/conta" }) {
  const token = localStorage.getItem("spa_customer_token");
  return token ? children : <Navigate to={`/mobile/login?next=${next}`} replace />;
}

function PhoneRoute({ mobileTo, children }) {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  return isMobile ? <Navigate to={mobileTo} replace /> : children;
}

function HomeRoute() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateView = (event) => setIsMobile(event.matches);

    mediaQuery.addEventListener("change", updateView);
    return () => mediaQuery.removeEventListener("change", updateView);
  }, []);

  return isMobile ? <Navigate to="/mobile" replace /> : <HomePage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/mobile" element={<MobileHomePage />} />
        <Route path="/mobile/login" element={<MobileLoginPage />} />
        <Route path="/mobile/agendar" element={<MobileCustomerRoute next="/mobile/agendar"><MobileBookingPage /></MobileCustomerRoute>} />
        <Route path="/mobile/conta" element={<MobileCustomerRoute><MobileAccountPage /></MobileCustomerRoute>} />
        <Route path="/quem-somos" element={<QuemSomosPage />} />
        <Route path="/servicos" element={<ServicosPublicPage />} />
        <Route path="/galeria" element={<GaleriaPublicPage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/agendamento" element={<PhoneRoute mobileTo="/mobile/agendar"><CustomerRoute><MobileBookingPage /></CustomerRoute></PhoneRoute>} />
        <Route path="/cliente-login" element={<PhoneRoute mobileTo="/mobile/login"><ClienteLoginPage /></PhoneRoute>} />
        <Route path="/cliente" element={<PhoneRoute mobileTo="/mobile/conta"><CustomerRoute><ClienteDashboardPage /></CustomerRoute></PhoneRoute>} />
        <Route path="/cliente/agendar" element={<PhoneRoute mobileTo="/mobile/agendar"><CustomerRoute><MobileBookingPage /></CustomerRoute></PhoneRoute>} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/admin/clientes" element={<PrivateRoute><ClientesPage /></PrivateRoute>} />
        <Route path="/admin/pets" element={<PrivateRoute><PetsPage /></PrivateRoute>} />
        <Route path="/admin/servicos" element={<PrivateRoute><ServicosPage /></PrivateRoute>} />
        <Route path="/admin/agendamentos" element={<PrivateRoute><AgendamentosPage /></PrivateRoute>} />
        <Route path="/admin/financeiro" element={<PrivateRoute><FinanceiroPage /></PrivateRoute>} />
        <Route path="/admin/caixa" element={<PrivateRoute><CaixaPage /></PrivateRoute>} />
        <Route path="/admin/estoque" element={<PrivateRoute><EstoquePage /></PrivateRoute>} />
        <Route path="/admin/vacinas" element={<PrivateRoute><VacinasPage /></PrivateRoute>} />
        <Route path="/admin/galeria" element={<PrivateRoute><GaleriaPage /></PrivateRoute>} />
        <Route path="/admin/disponibilidade" element={<PrivateRoute><DisponibilidadePage /></PrivateRoute>} />
        <Route path="/admin/configuracoes" element={<PrivateRoute><ConfiguracoesPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
