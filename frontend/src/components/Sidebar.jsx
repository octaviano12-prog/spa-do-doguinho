import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, CalendarDays, Dog, GalleryHorizontalEnd, Package, PawPrint, Scissors, Settings, ShieldCheck, Syringe, Users, WalletCards } from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/pets", label: "Pets", icon: PawPrint },
  { to: "/servicos", label: "Serviços", icon: Scissors },
  { to: "/agendamentos", label: "Agenda", icon: CalendarDays },
  { to: "/financeiro", label: "Financeiro", icon: WalletCards },
  { to: "/caixa", label: "Caixa", icon: ShieldCheck },
  { to: "/estoque", label: "Estoque", icon: Package },
  { to: "/vacinas", label: "Vacinas", icon: Syringe },
  { to: "/galeria", label: "Galeria", icon: GalleryHorizontalEnd },
  { to: "/configuracoes", label: "Configurações", icon: Settings }
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="brandIcon"><Dog size={24} /></div>
        <div>
          <strong>SPA do Doguinho</strong>
          <small>Painel premium</small>
        </div>
      </div>

      <nav>
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink to={to} key={to} onClick={onClose} className="navItem">
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
