import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  PawPrint,
  Plus,
  RefreshCw,
  Scissors,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value, fallbackDate, fallbackTime) {
  const raw = value || (fallbackDate ? `${fallbackDate}T${fallbackTime || "00:00"}` : null);
  if (!raw) return "Sem data";
  const date = new Date(String(raw).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return String(raw);
  return date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function normalize(value) {
  return String(value || "pending").toLowerCase();
}

function translateStatus(value) {
  const status = normalize(value);
  const labels = {
    pending: "Pendente",
    pendente: "Pendente",
    confirmed: "Confirmado",
    confirmado: "Confirmado",
    completed: "Concluído",
    concluido: "Concluído",
    concluído: "Concluído",
    canceled: "Cancelado",
    cancelled: "Cancelado",
    cancelado: "Cancelado",
    paid: "Pago",
    approved: "Pago",
    pago: "Pago"
  };
  return labels[status] || value || "Pendente";
}

export default function DashboardPage() {
  const [data, setData] = useState({ customers: [], pets: [], appointments: [], payments: [], stock: [], vaccines: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiOnline, setApiOnline] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const health = await fetch("https://spadodoguinho.com.br/api/health").then((res) => res.json()).catch(() => null);
      setApiOnline(Boolean(health?.ok));
      const [customers, pets, appointments, payments, stock, vaccines] = await Promise.all([
        apiRequest("/customers").catch(() => []),
        apiRequest("/pets").catch(() => []),
        apiRequest("/appointments").catch(() => []),
        apiRequest("/payments").catch(() => []),
        apiRequest("/stock_items").catch(() => apiRequest("/stock").catch(() => [])),
        apiRequest("/vaccinations").catch(() => apiRequest("/vaccines").catch(() => []))
      ]);
      setData({ customers: Array.isArray(customers) ? customers : [], pets: Array.isArray(pets) ? pets : [], appointments: Array.isArray(appointments) ? appointments : [], payments: Array.isArray(payments) ? payments : [], stock: Array.isArray(stock) ? stock : [], vaccines: Array.isArray(vaccines) ? vaccines : [] });
    } catch (err) { setError(err.message || "Erro ao carregar dashboard."); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadDashboard(); }, []);

  const summary = useMemo(() => {
    const revenue = data.payments.filter((item) => ["paid", "approved", "pago"].includes(normalize(item.status || item.payment_status))).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const pendingPayments = data.payments.filter((item) => ["pending", "pendente"].includes(normalize(item.status || item.payment_status))).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const lowStock = data.stock.filter((item) => Number(item.quantity || 0) <= Number(item.min_quantity || item.minimum_quantity || 5)).length;
    const pendingAppointments = data.appointments.filter((item) => ["pending", "pendente"].includes(normalize(item.status))).length;
    const confirmedAppointments = data.appointments.filter((item) => ["confirmed", "confirmado"].includes(normalize(item.status))).length;
    const completedAppointments = data.appointments.filter((item) => ["completed", "concluido", "concluído"].includes(normalize(item.status))).length;
    return { revenue, pendingPayments, lowStock, pendingAppointments, confirmedAppointments, completedAppointments };
  }, [data]);

  const recentAppointments = useMemo(() => data.appointments.slice(0, 6), [data.appointments]);
  const todayAppointments = useMemo(() => { const today = new Date().toISOString().slice(0, 10); return data.appointments.filter((item) => String(item.date || item.scheduled_at || "").slice(0, 10) === today).length; }, [data.appointments]);
  const cards = [ { title: "Clientes", value: data.customers.length, icon: Users }, { title: "Pets", value: data.pets.length, icon: PawPrint }, { title: "Hoje", value: todayAppointments, icon: CalendarDays }, { title: "Faturamento", value: formatCurrency(summary.revenue), icon: Wallet } ];
  const actions = [ { title: "Agenda", text: "Gerenciar atendimentos", to: "/admin/agendamentos", icon: CalendarDays }, { title: "Clientes", text: "Novo tutor", to: "/admin/clientes", icon: Users }, { title: "Serviços", text: "Preços e duração", to: "/admin/servicos", icon: Scissors }, { title: "Disponibilidade", text: "Horários e bloqueios", to: "/admin/disponibilidade", icon: Clock }, { title: "Pagamentos", text: "PIX e financeiro", to: "/admin/financeiro", icon: CreditCard }, { title: "Estoque", text: "Produtos e alertas", to: "/admin/estoque", icon: Wallet } ];
  const alerts = [ summary.pendingAppointments > 0 ? `${summary.pendingAppointments} agendamento(s) pendente(s)` : null, summary.pendingPayments > 0 ? `${formatCurrency(summary.pendingPayments)} em pagamentos pendentes` : null, summary.lowStock > 0 ? `${summary.lowStock} produto(s) com estoque baixo` : null, apiOnline ? null : "API ou banco de dados fora do ar" ].filter(Boolean);

  return <AdminLayout><div className="space-y-8"><div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6"><div><span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><TrendingUp size={18} /> Painel de controle</span><h1 className="text-5xl font-black text-white mt-5">Dashboard</h1><p className="text-green-100/80 mt-3 max-w-3xl">Visão executiva do SPA do Doguinho: agenda, financeiro, clientes, estoque e alertas.</p></div><button type="button" onClick={loadDashboard} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button></div>{error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}{alerts.length > 0 && <div className="grid md:grid-cols-3 gap-4">{alerts.map((alert) => <div key={alert} className="bg-yellow-50 border border-yellow-100 rounded-3xl p-5 text-yellow-800 font-black flex items-center gap-3"><AlertTriangle className="shrink-0" />{alert}</div>)}</div>}<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">{cards.map((card, index) => { const Icon = card.icon; return <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="glass rounded-[32px] p-7 border border-white/30 shadow-2xl card-hover min-w-0"><div className="flex items-center justify-between gap-4"><div className="min-w-0"><div className="text-slate-500 font-bold">{card.title}</div><div className="text-2xl 2xl:text-3xl font-black mt-3 text-slate-900 break-words">{loading ? "..." : card.value}</div></div><div className="w-18 h-18 rounded-[26px] bg-gradient-to-br from-green-500 to-emerald-700 text-white flex items-center justify-center shadow-xl p-5 shrink-0"><Icon size={34} /></div></div></motion.div>; })}</div><div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl"><div className="flex items-center justify-between gap-4 mb-6"><div><h2 className="text-2xl font-black text-slate-900">Ações rápidas</h2><p className="text-slate-500">Atalhos para operar o sistema.</p></div><Plus className="text-green-700" /></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{actions.map((action) => { const Icon = action.icon; return <Link key={action.title} to={action.to} className="bg-white hover:bg-green-50 rounded-3xl p-5 border border-slate-100 transition shadow-sm flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shrink-0"><Icon size={24} /></div><div><div className="font-black text-slate-900">{action.title}</div><div className="text-slate-500 text-sm">{action.text}</div></div></Link>; })}</div></div><div className="grid xl:grid-cols-3 gap-6"><div className="xl:col-span-2 glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0"><div className="flex items-center gap-3 mb-7"><CalendarDays className="text-green-700 shrink-0" size={32} /><div className="min-w-0"><h2 className="text-2xl font-black text-slate-900">Últimos agendamentos</h2><p className="text-slate-500">Agenda operacional recente.</p></div></div><div className="space-y-4">{loading && <div className="text-slate-500">Carregando agenda...</div>}{!loading && recentAppointments.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhum agendamento encontrado.</div>}{!loading && recentAppointments.map((item) => <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-100 grid sm:grid-cols-2 2xl:grid-cols-5 gap-4 items-center overflow-hidden"><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Cliente</div><div className="font-black text-slate-900 break-words leading-snug">{item.customer_name || `Cliente #${item.customer_id || "-"}`}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Pet</div><div className="font-black text-slate-900 break-words leading-snug">{item.pet_name || `Pet #${item.pet_id || "-"}`}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Serviço</div><div className="font-black text-slate-900 break-words leading-snug">{item.service_name || "-"}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Data</div><div className="font-black text-slate-900 break-words leading-snug">{formatDate(item.scheduled_at, item.date, item.time)}</div></div><div className="2xl:text-right"><span className="inline-flex px-4 py-2 rounded-full bg-green-100 text-green-700 font-black break-words">{translateStatus(item.status)}</span></div></div>)}</div></div><div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0"><div className="flex items-center gap-3 mb-7"><ShieldCheck className="text-green-700 shrink-0" size={32} /><div><h2 className="text-2xl font-black text-slate-900">Operação</h2><p className="text-slate-500">Resumo rápido.</p></div></div><div className="space-y-4"><div className={`rounded-2xl p-5 border font-bold flex items-center gap-3 ${apiOnline ? "bg-green-50 text-green-800 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>{apiOnline ? <CheckCircle /> : <AlertTriangle />}API + MySQL {apiOnline ? "online" : "offline"}</div><div className="bg-white rounded-2xl p-5 border border-slate-100 font-bold text-slate-700"><Clock className="text-green-600 inline mr-2" />{summary.confirmedAppointments} confirmado(s)</div><div className="bg-white rounded-2xl p-5 border border-slate-100 font-bold text-slate-700"><CheckCircle className="text-green-600 inline mr-2" />{summary.completedAppointments} concluído(s)</div><div className="bg-white rounded-2xl p-5 border border-slate-100 font-bold text-slate-700"><CreditCard className="text-green-600 inline mr-2" />{formatCurrency(summary.pendingPayments)} pendente(s)</div></div></div></div></div></AdminLayout>;
}
