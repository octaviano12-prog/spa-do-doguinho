import { useEffect, useState } from "react";

import AdminLayout from "../../components/admin/AdminLayout";

import {
  Calendar,
  Users,
  PawPrint,
  Wallet
} from "lucide-react";

import { getDashboardStats } from "../../lib/dashboard";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    customers: 0,
    pets: 0,
    appointments: 0,
    revenue: 0
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  const cards = [
    {
      title: "Agendamentos",
      value: stats.appointments,
      icon: Calendar
    },
    {
      title: "Clientes",
      value: stats.customers,
      icon: Users
    },
    {
      title: "Pets",
      value: stats.pets,
      icon: PawPrint
    },
    {
      title: "Faturamento",
      value: `R$ ${Number(
        stats.revenue
      ).toFixed(2)}`,
      icon: Wallet
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Sistema online e integrado 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 font-medium">
                      {card.title}
                    </p>

                    <h2 className="text-3xl font-black mt-2">
                      {card.value}
                    </h2>
                  </div>

                  <div className="w-16 h-16 rounded-3xl bg-green-100 text-green-700 flex items-center justify-center">
                    <Icon size={30} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 border shadow-sm">
          <h2 className="text-2xl font-black text-gray-900">
            SPA do Doguinho 🐶
          </h2>

          <p className="text-gray-500 mt-2">
            Painel administrativo moderno com:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              "Agendamentos",
              "Financeiro",
              "Estoque",
              "Vacinas",
              "Clientes",
              "Dashboard"
            ].map((item) => (
              <div
                key={item}
                className="bg-gray-100 rounded-2xl p-4 font-bold text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
