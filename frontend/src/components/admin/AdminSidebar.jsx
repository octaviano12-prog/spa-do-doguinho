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
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/pets", label: "Pets", icon: PawPrint },
  { to: "/admin/servicos", label: "Serviços", icon: Scissors },
  { to: "/admin/agendamentos", label: "Agendamentos", icon: Calendar },
  { to: "/admin/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/admin/estoque", label: "Estoque", icon: Package },
  { to: "/admin/vacinas", label: "Vacinas", icon: Syringe },
  { to: "/admin/disponibilidade", label: "Disponibilidade", icon: Clock },
  { to: "/admin/galeria", label: "Galeria", icon: Image },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings }
];

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-[#052e16] text-white min-h-screen p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-black">
          SPA DOGUINHO
        </h1>

        <p className="text-green-200 text-sm mt-1">
          Painel Administrativo
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "hover:bg-green-800 text-green-100"
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
