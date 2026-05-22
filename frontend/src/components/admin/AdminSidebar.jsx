import React from "react";

import {
  LayoutDashboard,
  Users,
  PawPrint,
  Scissors,
  Calendar,
  Wallet,
  Package,
  Syringe,
  Image,
  Settings,
  Clock
} from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },

  {
    to: "/admin/clientes",
    label: "Clientes",
    icon: Users
  },

  {
    to: "/admin/pets",
    label: "Pets",
    icon: PawPrint
  },

  {
    to: "/admin/servicos",
    label: "Serviços",
    icon: Scissors
  },

  {
    to: "/admin/agendamentos",
    label: "Agendamentos",
    icon: Calendar
  },

  {
    to: "/admin/financeiro",
    label: "Financeiro",
    icon: Wallet
  },

  {
    to: "/admin/estoque",
    label: "Estoque",
    icon: Package
  },

  {
    to: "/admin/vacinas",
    label: "Vacinas",
    icon: Syringe
  },

  {
    to: "/admin/galeria",
    label: "Galeria",
    icon: Image
  },

  {
    to: "/admin/disponibilidade",
    label: "Disponibilidade",
    icon: Clock
  },

  {
    to: "/admin/configuracoes",
    label: "Configurações",
    icon: Settings
  }
];

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-[#052e16] to-[#14532d] text-white min-h-screen p-6 flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-black">
          SPA DOGUINHO
        </h1>

        <p className="text-green-200 mt-1 text-sm">
          Painel Administrativo
        </p>
      </div>

      <nav className="space-y-2 flex-1">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-green-900 shadow-xl"
                    : "hover:bg-green-800/70 text-green-100"
                }
                `
              }
            >
              <Icon size={20} />

              <span className="font-semibold">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 text-xs text-green-200">
        SPA do Doguinho © 2026
      </div>
    </aside>
  );
}
