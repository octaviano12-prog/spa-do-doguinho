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

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clientes" element={<Customers />} />
                <Route path="/pets" element={<Pets />} />
                <Route path="/servicos" element={<Services />} />
                <Route path="/agendamentos" element={<Appointments />} />
                <Route path="/financeiro" element={<Finance />} />
                <Route path="/caixa" element={<Cash />} />
                <Route path="/estoque" element={<Stock />} />
                <Route path="/vacinas" element={<Vaccines />} />
                <Route path="/galeria" element={<Gallery />} />
                <Route path="/configuracoes" element={<Settings />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}
