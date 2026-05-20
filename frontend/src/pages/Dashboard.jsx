import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

const fadeUp = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const chartMotion = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chartTooltip premiumPanel">
      {label && <strong>{label}</strong>}
      {payload.map((item) => (
        <div key={item.dataKey || item.name} className="tooltipRow">
          <span>{item.name || item.dataKey}</span>
          <b>
            {item.dataKey === "entradas" || item.dataKey === "saidas"
              ? money(item.value)
              : item.value}
          </b>
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ text = "Sem dados suficientes" }) {
  return (
    <div className="emptyChart premiumEmpty">
      <AlertCircle size={22} />
      <span>{text}</span>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const cards = data.cards || {};

  const statusData = useMemo(() => {
    return (data.byStatus || [])
      .filter((item) => Number(item.value || 0) > 0)
      .map((item) => ({
        ...item,
        name: item.name || item.status || "Sem status",
        value: Number(item.value || 0),
      }));
  }, [data.byStatus]);

  const popularServices = useMemo(() => {
    return (data.popularServices || [])
      .filter((item) => Number(item.count || 0) > 0)
      .map((item) => ({
        ...item,
        name: item.name || "Serviço",
        count: Number(item.count || 0),
      }));
  }, [data.popularServices]);

  const cashFlow = useMemo(() => {
    return (data.cashFlow || []).map((item) => ({
      ...item,
      entradas: Number(item.entradas || 0),
      saidas: Number(item.saidas || 0),
    }));
  }, [data.cashFlow]);

  const pieColors = ["#d8b45a", "#1db56a", "#38bdf8", "#ef4444", "#a78bfa"];

  return (
    <motion.div
      className="dashboardPremiumPage"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <PageHeader
          title="Visão Geral"
          subtitle="Acompanhe os principais indicadores do SPA do Doguinho"
        />
      </motion.div>

      <motion.div className="grid cards" variants={stagger}>
        <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
          <StatCard title="Clientes" value={cards.customers || 0} icon={Users} />
        </motion.div>
        <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
          <StatCard title="Pets" value={cards.pets || 0} icon={PawPrint} />
        </motion.div>
        <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
          <StatCard title="Agendamentos" value={cards.appointments || 0} icon={CalendarDays} />
        </motion.div>
        <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
          <StatCard title="Hoje" value={cards.todayAppointments || 0} icon={Clock} />
        </motion.div>
        <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
          <StatCard title="Faturamento" value={money(cards.revenue)} icon={Wallet} />
        </motion.div>
        <motion.div variants={fadeUp} whileHover={{ y: -6 }}>
          <StatCard title="Estoque baixo" value={cards.lowStock || 0} icon={AlertTriangle} />
        </motion.div>
      </motion.div>

      <motion.div className="grid charts" variants={stagger}>
        <motion.div className="card chart premiumPanel animatedPanel" variants={chartMotion}>
          <div className="panelTitle">
            <div>
              <h2>Fluxo de caixa</h2>
              <p>Entradas e saídas recentes</p>
            </div>
            <Wallet size={22} />
          </div>

          <ResponsiveContainer width="100%" height={310}>
            {cashFlow.length > 0 ? (
              <AreaChart data={cashFlow} margin={{ top: 18, right: 14, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d8b45a" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#d8b45a" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" opacity={0.14} vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${v}`} />
                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="entradas"
                  name="Entradas"
                  stroke="#d8b45a"
                  fill="url(#goldGradient)"
                  strokeWidth={3}
                  fillOpacity={1}
                  activeDot={{ r: 7 }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="saidas"
                  name="Saídas"
                  stroke="#ff6b6b"
                  fill="url(#redGradient)"
                  strokeWidth={3}
                  fillOpacity={1}
                  activeDot={{ r: 7 }}
                  animationDuration={1700}
                  animationEasing="ease-out"
                />
              </AreaChart>
            ) : (
              <EmptyChart />
            )}
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card chart premiumPanel animatedPanel" variants={chartMotion}>
          <div className="panelTitle">
            <div>
              <h2>Agendamentos por status</h2>
              <p>Distribuição dos atendimentos</p>
            </div>
            <CheckCircle2 size={22} />
          </div>

          <ResponsiveContainer width="100%" height={310}>
            {statusData.length > 0 ? (
              <PieChart>
                <defs>
                  <filter id="pieGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={108}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name }) => name}
                  animationDuration={1400}
                  animationEasing="ease-out"
                  filter="url(#pieGlow)"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <EmptyChart />
            )}
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      <motion.div className="grid charts" variants={stagger}>
        <motion.div className="card chart premiumPanel animatedPanel" variants={chartMotion}>
          <div className="panelTitle">
            <div>
              <h2>Serviços mais populares</h2>
              <p>Top serviços por quantidade</p>
            </div>
            <Scissors size={22} />
          </div>

          <ResponsiveContainer width="100%" height={310}>
            {popularServices.length > 0 ? (
              <BarChart data={popularServices} layout="vertical" margin={{ top: 12, right: 18, left: 18, bottom: 4 }}>
                <defs>
                  <linearGradient id="greenBarGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1db56a" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#d8b45a" stopOpacity={0.95} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" opacity={0.14} horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" width={130} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  name="Quantidade"
                  fill="url(#greenBarGradient)"
                  radius={[0, 12, 12, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </BarChart>
            ) : (
              <EmptyChart />
            )}
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card premiumPanel quickPanel animatedPanel" variants={chartMotion}>
          <div className="panelTitle">
            <div>
              <h2>Resumo de hoje</h2>
              <p>Movimento do dia</p>
            </div>
            <CalendarDays size={22} />
          </div>

          <div className="summaryList premiumSummaryList">
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
        </motion.div>
      </motion.div>

      <motion.div className="grid dashboardBottom" variants={stagger}>
        <motion.div className="card premiumPanel animatedPanel" variants={fadeUp} whileHover={{ y: -5 }}>
          <div className="panelTitle">
            <div>
              <h2>Próximo atendimento</h2>
              <p>Agenda mais próxima</p>
            </div>
            <Clock size={22} />
          </div>

          {data.nextAppointment ? (
            <div className="nextBox premiumNextBox">
              <h3>{data.nextAppointment.petName || "Pet não informado"}</h3>
              <p>Cliente: {data.nextAppointment.clientName || "Não informado"}</p>
              <p>Serviço: {data.nextAppointment.serviceName || "Não informado"}</p>
              <strong>{data.nextAppointment.dateLabel || "Data não informada"}</strong>
            </div>
          ) : (
            <p className="mutedText">Nenhum próximo atendimento encontrado.</p>
          )}
        </motion.div>

        <motion.div className="card premiumPanel animatedPanel" variants={fadeUp} whileHover={{ y: -5 }}>
          <div className="panelTitle">
            <div>
              <h2>Ações rápidas</h2>
              <p>Cadastros e operações</p>
            </div>
            <Plus size={22} />
          </div>

          <div className="quickActions premiumQuickActions">
            <button type="button" onClick={() => navigate("/agendamentos")}>
              <CalendarDays size={18} /> Novo agendamento
            </button>
            <button type="button" onClick={() => navigate("/clientes")}>
              <Users size={18} /> Novo cliente
            </button>
            <button type="button" onClick={() => navigate("/pets")}>
              <PawPrint size={18} /> Novo pet
            </button>
            <button type="button" onClick={() => navigate("/vacinas")}>
              <Syringe size={18} /> Nova vacina
            </button>
          </div>
        </motion.div>

        <motion.div className="card premiumPanel animatedPanel" variants={fadeUp} whileHover={{ y: -5 }}>
          <div className="panelTitle">
            <div>
              <h2>Status do sistema</h2>
              <p>Ambiente online</p>
            </div>
            <AlertCircle size={22} />
          </div>

          <div className="summaryList premiumSummaryList">
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
        </motion.div>
      </motion.div>

      <motion.div className="card premiumPanel animatedPanel" variants={fadeUp}>
        <div className="panelTitle">
          <div>
            <h2>Últimos agendamentos</h2>
            <p>Acompanhe os registros mais recentes</p>
          </div>
        </div>

        <div className="tableWrap premiumTableWrap">
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
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`loading-${index}`}>
                    <td colSpan="5">
                      <span className="skeletonLine" />
                    </td>
                  </tr>
                ))
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
      </motion.div>
    </motion.div>
  );
}
