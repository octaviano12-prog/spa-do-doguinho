import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, PawPrint, Users, Wallet } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import client from "../api/client";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Dashboard() {
  const [data, setData] = useState({
    cards: {},
    byStatus: [],
    cashFlow: [],
  });

  useEffect(() => {
    client
      .get("/dashboard/summary")
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral do SPA do Doguinho" />

      <div className="grid cards">
        <StatCard title="Clientes" value={data.cards.customers || 0} icon={Users} />
        <StatCard title="Pets" value={data.cards.pets || 0} icon={PawPrint} />
        <StatCard title="Agendamentos" value={data.cards.appointments || 0} icon={CalendarDays} />
        <StatCard title="Faturamento" value={money(data.cards.revenue)} icon={Wallet} />
        <StatCard title="Estoque baixo" value={data.cards.lowStock || 0} icon={AlertTriangle} />
      </div>

      <div className="grid charts">
        <div className="card chart">
          <h2>Fluxo de caixa</h2>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.cashFlow}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="entradas" stroke="#d8b45a" fill="#d8b45a" fillOpacity={0.18} />
              <Area type="monotone" dataKey="saidas" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.12} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart">
          <h2>Agendamentos por status</h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.byStatus}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1db56a" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
