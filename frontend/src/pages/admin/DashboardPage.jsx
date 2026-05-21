import AdminLayout from "../../components/admin/AdminLayout";
import {
  Calendar,
  Users,
  PawPrint,
  Wallet
} from "lucide-react";

const cards = [
  {
    title: "Agendamentos",
    value: "0",
    icon: Calendar
  },
  {
    title: "Clientes",
    value: "0",
    icon: Users
  },
  {
    title: "Pets",
    value: "0",
    icon: PawPrint
  },
  {
    title: "Faturamento",
    value: "R$ 0,00",
    icon: Wallet
  }
];

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Bem-vindo ao SPA do Doguinho 🐶
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-3xl p-6 shadow-sm border"
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
            Sistema online 🚀
          </h2>

          <p className="text-gray-500 mt-2">
            Backend Node.js + React + MySQL funcionando.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
