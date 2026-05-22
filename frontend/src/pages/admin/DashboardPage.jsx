import React from "react";

import { useEffect, useState } from "react";

import {
  Calendar,
  Users,
  PawPrint,
  Wallet,
  TrendingUp,
  Clock
} from "lucide-react";

import { motion } from "framer-motion";

import AdminLayout from "../../components/admin/AdminLayout";

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
        const data =
          await getDashboardStats();

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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-white">
              Dashboard
            </h1>

            <p className="text-green-100 mt-2">
              Bem-vindo ao SPA do Doguinho 🐶
            </p>
          </div>

          <div className="glass rounded-3xl px-6 py-4 border border-white/30 text-white">
            <div className="flex items-center gap-3">
              <Clock size={22} />

              <div>
                <div className="text-sm opacity-70">
                  Sistema Online
                </div>

                <div className="font-black">
                  Node.js + MySQL
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.08
                }}
                className="glass rounded-[32px] p-7 border border-white/30 shadow-2xl card-hover"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <div className="text-gray-500 font-semibold">
                      {card.title}
                    </div>

                    <div className="text-4xl font-black mt-3 text-gray-900">
                      {card.value}
                    </div>
                  </div>

                  <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-green-500 to-emerald-700 text-white flex items-center justify-center shadow-xl">
                    <Icon size={34} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 glass rounded-[32px] p-8 border border-white/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-green-700" />

              <h2 className="text-2xl font-black">
                Resumo do Sistema
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {[
                "Sistema moderno",
                "MySQL integrado",
                "Dashboard em tempo real",
                "Agendamentos online",
                "Controle financeiro",
                "Controle de estoque"
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className="font-bold text-gray-800">
                    {item}
                  </div>
                </div>
              ))}

            </div>
          </div>

          <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">
              Atividades
            </h2>

            <div className="space-y-4">

              {[
                "Sistema iniciado",
                "API online",
                "Banco conectado",
                "Painel carregado"
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl p-4 border shadow-sm"
                >
                  {item}
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
