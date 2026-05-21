import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  Dog,
  GalleryHorizontalEnd,
  Package,
  PawPrint,
  Scissors,
  Settings,
  ShieldCheck,
  Syringe,
  Users,
  WalletCards,
} from "lucide-react";

const items = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/pets", label: "Pets", icon: PawPrint },
  { to: "/admin/servicos", label: "Serviços", icon: Scissors },
  { to: "/admin/agendamentos", label: "Agenda", icon: CalendarDays },
  { to: "/admin/financeiro", label: "Financeiro", icon: WalletCards },
  { to: "/admin/caixa", label: "Caixa", icon: ShieldCheck },
  { to: "/admin/estoque", label: "Estoque", icon: Package },
  { to: "/admin/vacinas", label: "Vacinas", icon: Syringe },
  { to: "/admin/galeria", label: "Galeria", icon: GalleryHorizontalEnd },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar premiumSidebar ${open ? "open" : ""}`}>
      <motion.div
        className="brand premiumBrand"
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="brandIcon">
          <Dog size={24} />
        </div>

        <div>
          <strong>SPA do Doguinho</strong>
          <small>Painel premium</small>
        </div>
      </motion.div>

      <nav>
        {items.map(({ to, label, icon: Icon }, index) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.28,
              delay: index * 0.035,
            }}
          >
            <NavLink
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `navItem ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="sidebarFooter">
        <span>Sistema online</span>
        <strong>MySQL + Node API</strong>
      </div>
    </aside>
  );
}
import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  Dog,
  GalleryHorizontalEnd,
  Package,
  PawPrint,
  Scissors,
  Settings,
  ShieldCheck,
  Syringe,
  Users,
  WalletCards,
} from "lucide-react";

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
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar premiumSidebar ${open ? "open" : ""}`}>
      <motion.div
        className="brand premiumBrand"
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="brandIcon">
          <Dog size={24} />
        </div>

        <div>
          <strong>SPA do Doguinho</strong>
          <small>Painel premium</small>
        </div>
      </motion.div>

      <nav>
        {items.map(({ to, label, icon: Icon }, index) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.28,
              delay: index * 0.035,
            }}
          >
            <NavLink
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `navItem ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="sidebarFooter">
        <span>Sistema online</span>
        <strong>MySQL + Node API</strong>
      </div>
    </aside>
  );
}
