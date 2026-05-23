import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Filter,
  MessageCircle,
  PawPrint,
  RefreshCw,
  Search,
  User,
  Wallet,
  XCircle
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const statusLabels = {
  pending: "Pendente",
  pendente: "Pendente",
  confirmed: "Confirmado",
  confirmado: "Confirmado",
  completed: "Concluído",
  concluido: "Concluído",
  concluído: "Concluído",
  canceled: "Cancelado",
  cancelado: "Cancelado"
};

const paymentLabels = {
  pix: "PIX",
  card: "Cartão",
  dinheiro: "Dinheiro",
  presencial: "Presencial",
  cash: "Dinheiro",
  pending: "Pendente",
  paid: "Pago",
  canceled: "Cancelado"
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value, fallbackDate, fallbackTime) {
  const raw = value || (fallbackDate ? `${fallbackDate}T${fallbackTime || "00:00"}` : null);
  if (!raw) return "Sem data";
  const date = new Date(String(raw).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return `${fallbackDate || raw} ${fallbackTime || ""}`;
  return date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function normalizeStatus(value) {
  return String(value || "pending").toLowerCase();
}

function onlyDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState("");

  async function loadAppointments() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/appointments");
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar agendamentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAppointments(); }, []);

  const filteredAppointments = useMemo(() => appointments.filter((item) => {
    const search = `${item.customer_name || ""} ${item.customer_phone || ""} ${item.pet_name || ""} ${item.service_name || ""} ${item.status || ""} ${item.payment_status || ""}`.toLowerCase();
    const status = normalizeStatus(item.status);
    const date = onlyDate(item.date || item.scheduled_at);
    return search.includes(query.toLowerCase()) && (statusFilter === "all" || status === statusFilter) && (!dateFilter || date === dateFilter);
  }), [appointments, query, statusFilter, dateFilter]);

  const summary = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter((item) => ["pending", "pendente"].includes(normalizeStatus(item.status))).length,
    confirmed: appointments.filter((item) => ["confirmed", "confirmado"].includes(normalizeStatus(item.status))).length,
    completed: appointments.filter((item) => ["completed", "concluido", "concluído"].includes(normalizeStatus(item.status))).length,
    paid: appointments.filter((item) => ["paid", "approved", "pago"].includes(normalizeStatus(item.payment_status))).length
  }), [appointments]);

  async function updateStatus(item, status) {
    setError("");
    try {
      await apiRequest(`/appointments/${item.id}`, { method: "PUT", body: JSON.stringify({ status }) });
      await loadAppointments();
    } catch (err) {
      setError(err.message || "Erro ao atualizar agendamento.");
    }
  }

  function openWhatsApp(item) {
    const phone = String(item.customer_phone || item.phone || "").replace(/\D/g, "");
    const finalPhone = phone.startsWith("55") ? phone : `55${phone}`;
    const text = encodeURIComponent(`Olá! Aqui é do SPA do Doguinho. Sobre o agendamento de ${item.pet_name || "seu pet"} para ${formatDate(item.scheduled_at, item.date, item.time)}.`);
    if (!phone) return;
    window.open(`https://wa.me/${finalPhone}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div><span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><CalendarDays size={18} /> Agenda operacional</span><h1 className="text-5xl font-black text-white mt-5">Agendamentos</h1><p className="text-green-100/80 mt-3 max-w-3xl">Controle atendimentos, status, pagamentos e comunicação com clientes.</p></div>
          <button type="button" onClick={loadAppointments} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button>
        </div>
        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}
        <div className="grid md:grid-cols-5 gap-6">{[["Total", summary.total, CalendarDays], ["Pendentes", summary.pending, Clock], ["Confirmados", summary.confirmed, CheckCircle], ["Concluídos", summary.completed, Eye], ["Pagos", summary.paid, Wallet]].map(([label, value, Icon]) => <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl min-w-0"><div className="flex items-center justify-between gap-4"><div className="min-w-0"><div className="text-slate-500 font-bold">{label}</div><div className="text-4xl font-black text-slate-900 mt-2">{value}</div></div><div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center shrink-0"><Icon size={26} /></div></div></div>)}</div>
        <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0"><div className="grid lg:grid-cols-[1fr_auto_auto] gap-4"><label className="relative min-w-0"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por cliente, telefone, pet, serviço, status..." className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900" /></label><label className="relative min-w-0"><Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full lg:w-[230px] bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900"><option value="all">Todos os status</option><option value="pending">Pendentes</option><option value="confirmed">Confirmados</option><option value="completed">Concluídos</option><option value="canceled">Cancelados</option></select></label><input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full lg:w-[210px] bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /></div></div>
        <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"><h2 className="text-2xl font-black text-slate-900">Histórico de agendamentos</h2><span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-black text-sm w-fit">{filteredAppointments.length} registros</span></div><div className="space-y-4">{loading && <div className="text-slate-500 p-5">Carregando agendamentos...</div>}{!loading && filteredAppointments.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhum agendamento encontrado.</div>}{!loading && filteredAppointments.map((item) => { const status = normalizeStatus(item.status); const paymentMethod = normalizeStatus(item.payment_method || item.payment_type || item.payment || "pending"); const paymentStatus = normalizeStatus(item.payment_status || "pending"); const price = item.price || item.total_price || item.service_price || 0; return <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden"><div className="flex flex-col 2xl:flex-row 2xl:items-start 2xl:justify-between gap-5"><div className="grid sm:grid-cols-2 2xl:grid-cols-5 gap-5 min-w-0 flex-1"><div className="flex gap-3 min-w-0"><User className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Cliente</div><div className="font-black text-slate-900 break-words leading-snug">{item.customer_name || `Cliente #${item.customer_id || "-"}`}</div><div className="text-slate-500 text-sm break-words">{item.customer_phone || "Sem telefone"}</div></div></div><div className="flex gap-3 min-w-0"><PawPrint className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Pet</div><div className="font-black text-slate-900 break-words leading-snug">{item.pet_name || `Pet #${item.pet_id || "-"}`}</div></div></div><div className="flex gap-3 min-w-0"><CalendarDays className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Data</div><div className="font-black text-slate-900 break-words leading-snug">{formatDate(item.scheduled_at, item.date, item.time)}</div></div></div><div className="flex gap-3 min-w-0"><CreditCard className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Pagamento</div><div className="font-black text-slate-900 break-words leading-snug">{paymentLabels[paymentMethod] || paymentMethod} • {paymentLabels[paymentStatus] || paymentStatus}</div></div></div><div className="flex gap-3 min-w-0"><Wallet className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Valor</div><div className="font-black text-green-700 break-words leading-snug">{formatCurrency(price)}</div></div></div></div><div className="flex flex-wrap items-center gap-3 2xl:justify-end shrink-0"><span className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-black">{statusLabels[status] || item.status || "Pendente"}</span><button type="button" onClick={() => openWhatsApp(item)} disabled={!(item.customer_phone || item.phone)} className="px-4 py-3 rounded-2xl bg-emerald-100 text-emerald-700 font-black hover:bg-emerald-200 transition flex items-center gap-2 disabled:opacity-40"><MessageCircle size={18} /> WhatsApp</button><button type="button" onClick={() => updateStatus(item, "confirmed")} className="px-4 py-3 rounded-2xl bg-green-100 text-green-700 font-black hover:bg-green-200 transition flex items-center gap-2"><CheckCircle size={18} /> Confirmar</button><button type="button" onClick={() => updateStatus(item, "completed")} className="px-4 py-3 rounded-2xl bg-blue-100 text-blue-700 font-black hover:bg-blue-200 transition flex items-center gap-2"><Eye size={18} /> Concluir</button><button type="button" onClick={() => updateStatus(item, "canceled")} className="px-4 py-3 rounded-2xl bg-red-100 text-red-700 font-black hover:bg-red-200 transition flex items-center gap-2"><XCircle size={18} /> Cancelar</button></div></div>{(item.service_name || item.notes || item.observations) && <div className="mt-5 bg-slate-50 rounded-2xl p-4 text-slate-600 break-words"><strong>Serviço:</strong> {item.service_name || `#${item.service_id || "-"}`}{(item.notes || item.observations) && <span> • {item.notes || item.observations}</span>}</div>}</div>; })}</div></div>
      </div>
    </AdminLayout>
  );
}
