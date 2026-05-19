import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  PawPrint,
  Plus,
  Scissors,
  Syringe,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import client from "../api/client";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const emptyData = {
  cards: {},
  byStatus: [],
  cashFlow: [],
  recentAppointments: [],
  popularServices: [],
  nextAppointment: null,
};

export default function Dashboard() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await client.get("/dashboard/summary");

        if (active) {
          setData({
            ...emptyData,
            ...res.data,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        if (active) setData(emptyData);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const statusData = useMemo(() => {
    return (data.byStatus || []).filter((item) => Number(item.value || 0) > 0);
  }, [data.byStatus]);

  const popularServices = useMemo(() => {
    return (data.popularServices || []).filter((item) => Number(item.count || 0) > 0);
  }, [data.popularServices]);

  const cards = data.cards || {};
  const pieColors = ["#d8b45a", "#38bdf8", "#22c55e", "#ef4444"];

  return (
    <>
      <PageHeader
        title="Visão Geral"
        subtitle="Acompanhe os principais indicadores do SPA do Doguinho"
      />

      <div className="grid cards">
        <StatCard title="Clientes" value={cards.customers || 0} icon={Users} />
        <StatCard title="Pets" value={cards.pets || 0} icon={PawPrint} />
        <StatCard title="Agendamentos" value={cards.appointments || 0} icon={CalendarDays} />
        <StatCard title="Hoje" value={cards.todayAppointments || 0} icon={Clock} />
        <StatCard title="Faturamento" value={money(cards.revenue)} icon={Wallet} />
        <StatCard title="Estoque baixo" value={cards.lowStock || 0} icon={AlertTriangle} />
      </div>

      <div className="grid charts">
        <div className="card chart premiumPanel">
          <div className="panelTitle">
            <div>
              <h2>Fluxo de caixa</h2>
              <p>Entradas e saídas recentes</p>
            </div>
            <Wallet size={22} />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.cashFlow || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="entradas" stroke="#d8b45a" fill="#d8b45a" fillOpacity={0.18} />
              <Area type="monotone" dataKey="saidas" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart premiumPanel">
          <div className="panelTitle">
            <div>
              <h2>Agendamentos por status</h2>
              <p>Distribuição dos atendimentos</p>
            </div>
            <CheckCircle2 size={22} />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            {statusData.length > 0 ? (
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <div className="emptyChart">Sem dados suficientes</div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid charts">
        <div className="card chart premiumPanel">
          <div className="panelTitle">
            <div>
              <h2>Serviços mais populares</h2>
              <p>Top serviços por quantidade</p>
            </div>
            <Scissors size={22} />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            {popularServices.length > 0 ? (
              <BarChart data={popularServices} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={130} />
                <Tooltip />
                <Bar dataKey="count" fill="#1db56a" radius={[0, 10, 10, 0]} />
              </BarChart>
            ) : (
              <div className="emptyChart">Sem dados suficientes</div>
            )}
          </ResponsiveContainer>
        </div>

        <div className="card premiumPanel quickPanel">
          <div className="panelTitle">
            <div>
              <h2>Resumo de hoje</h2>
              <p>Movimento do dia</p>
            </div>
            <CalendarDays size={22} />
          </div>

          <div className="summaryList">
            <div>
              <span>Agendamentos hoje</span>
              <strong>{cards.todayAppointments || 0}</strong>
            </div>
            <div>
              <span>Pendentes</span>
              <strong>{cards.pending || 0}</strong>
            </div>
            <div>
              <span>Confirmados</span>
              <strong>{cards.confirmed || 0}</strong>
            </div>
            <div>
              <span>Vacinas</span>
              <strong>{cards.vaccines || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid dashboardBottom">
        <div className="card premiumPanel">
          <div className="panelTitle">
            <div>
              <h2>Próximo atendimento</h2>
              <p>Agenda mais próxima</p>
            </div>
            <Clock size={22} />
          </div>

          {data.nextAppointment ? (
            <div className="nextBox">
              <h3>{data.nextAppointment.petName || "Pet não informado"}</h3>
              <p>Cliente: {data.nextAppointment.clientName || "Não informado"}</p>
              <p>Serviço: {data.nextAppointment.serviceName || "Não informado"}</p>
              <strong>{data.nextAppointment.dateLabel || "Data não informada"}</strong>
            </div>
          ) : (
            <p className="mutedText">Nenhum próximo atendimento encontrado.</p>
          )}
        </div>

        <div className="card premiumPanel">
          <div className="panelTitle">
            <div>
              <h2>Ações rápidas</h2>
              <p>Cadastros e operações</p>
            </div>
            <Plus size={22} />
          </div>

          <div className="quickActions">
            <button><CalendarDays size={18} /> Novo agendamento</button>
            <button><Users size={18} /> Novo cliente</button>
            <button><PawPrint size={18} /> Novo pet</button>
            <button><Syringe size={18} /> Nova vacina</button>
          </div>
        </div>

        <div className="card premiumPanel">
          <div className="panelTitle">
            <div>
              <h2>Status do sistema</h2>
              <p>Ambiente online</p>
            </div>
            <AlertCircle size={22} />
          </div>

          <div className="summaryList">
            <div>
              <span>API</span>
              <strong>Online</strong>
            </div>
            <div>
              <span>Banco</span>
              <strong>Conectado</strong>
            </div>
            <div>
              <span>Usuário</span>
              <strong>Administrador</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card premiumPanel">
        <div className="panelTitle">
          <div>
            <h2>Últimos agendamentos</h2>
            <p>Acompanhe os registros mais recentes</p>
          </div>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Pet</th>
                <th>Serviço</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Carregando dados...</td>
                </tr>
              ) : (data.recentAppointments || []).length === 0 ? (
                <tr>
                  <td colSpan="5">Nenhum agendamento recente.</td>
                </tr>
              ) : (
                data.recentAppointments.map((item) => (
                  <tr key={item.id}>
                    <td>{item.dateLabel || "-"}</td>
                    <td>{item.clientName || "-"}</td>
                    <td>{item.petName || "-"}</td>
                    <td>{item.serviceName || "-"}</td>
                    <td>
                      <span className={`statusPill ${item.status || "pending"}`}>
                        {item.status || "pendente"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
