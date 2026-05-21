import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Pets from "./pages/Pets";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Finance from "./pages/Finance";
import Cash from "./pages/Cash";
import Stock from "./pages/Stock";
import Vaccines from "./pages/Vaccines";
import Gallery from "./pages/Gallery";
import Settings from "./pages/Settings";

import PublicHome from "./public/PublicHome";
import PublicBooking from "./public/PublicBooking";
import PublicServices from "./public/PublicServices";
import PublicGallery from "./public/PublicGallery";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0d211a",
            color: "#f4fff8",
            border: "1px solid rgba(255,255,255,.08)",
          },
        }}
      />

      <Routes>

        {/* SITE PUBLICO */}
        <Route path="/" element={<PublicHome />} />

        <Route path="/servicos-publico" element={<PublicServices />} />

        <Route path="/galeria-publica" element={<PublicGallery />} />

        <Route path="/contato" element={<PublicHome />} />

        <Route path="/agendar" element={<PublicBooking />} />

        <Route path="/agendamento" element={<PublicBooking />} />

        <Route path="/agendamento-mobile" element={<PublicBooking />} />

        <Route path="/login" element={<Login />} />

        <Route path="/admin/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />

                  <Route path="clientes" element={<Customers />} />

                  <Route path="pets" element={<Pets />} />

                  <Route path="servicos" element={<Services />} />

                  <Route path="agendamentos" element={<Appointments />} />

                  <Route path="financeiro" element={<Finance />} />

                  <Route path="caixa" element={<Cash />} />

                  <Route path="estoque" element={<Stock />} />

                  <Route path="vacinas" element={<Vaccines />} />

                  <Route path="galeria" element={<Gallery />} />

                  <Route path="configuracoes" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Pets from "./pages/Pets";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Finance from "./pages/Finance";
import Cash from "./pages/Cash";
import Stock from "./pages/Stock";
import Vaccines from "./pages/Vaccines";
import Gallery from "./pages/Gallery";
import Settings from "./pages/Settings";

import PublicHome from "./public/PublicHome";
import PublicBooking from "./public/PublicBooking";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0d211a",
            color: "#f4fff8",
            border: "1px solid rgba(255,255,255,.08)",
          },
        }}
      />

      <Routes>

        {/* SITE PUBLICO */}
        <Route path="/" element={<PublicHome />} />

        <Route path="/agendar" element={<PublicBooking />} />

        <Route path="/agendamento" element={<PublicBooking />} />

        <Route path="/agendamento-mobile" element={<PublicBooking />} />

        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />

                  <Route path="clientes" element={<Customers />} />

                  <Route path="pets" element={<Pets />} />

                  <Route path="servicos" element={<Services />} />

                  <Route path="agendamentos" element={<Appointments />} />

                  <Route path="financeiro" element={<Finance />} />

                  <Route path="caixa" element={<Cash />} />

                  <Route path="estoque" element={<Stock />} />

                  <Route path="vacinas" element={<Vaccines />} />

                  <Route path="galeria" element={<Gallery />} />

                  <Route path="configuracoes" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}
