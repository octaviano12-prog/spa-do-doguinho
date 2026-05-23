import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  QrCode,
  RefreshCw,
  Search,
  Wallet,
  XCircle
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalize(value) {
  return String(value || "pending").toLowerCase();
}

const methodLabels = { pix: "PIX", card: "Cartão", credit_card: "Cartão de crédito", debit_card: "Cartão de débito", presencial: "Presencial", dinheiro: "Dinheiro", cash: "Dinheiro" };
const statusLabels = { pending: "Pendente", pendente: "Pendente", paid: "Pago", pago: "Pago", approved: "Aprovado", canceled: "Cancelado", cancelado: "Cancelado", refunded: "Estornado", presencial: "Presencial" };

export default function PagamentosPage() {
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPayments() {
    setLoading(true);
    setError("");
    try {
      const [paymentsData, appointmentsData] = await Promise.all([
        apiRequest("/payments").catch(() => []),
        apiRequest("/appointments").catch(() => [])
      ]);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar pagamentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPayments(); }, []);

  const virtualPayments = useMemo(() => {
    const existingAppointmentIds = new Set(payments.map((item) => Number(item.appointment_id)).filter(Boolean));
    const generated = appointments
      .filter((item) => !existingAppointmentIds.has(Number(item.id)))
      .map((item) => ({
        id: `ag-${item.id}`,
        virtual: true,
        appointment_id: item.id,
        amount: item.price || item.total_price || item.service_price || 0,
        method: item.payment_method || "presencial",
        status: item.payment_status || "pending",
        customer_name: item.customer_name,
        pet_name: item.pet_name,
        service_name: item.service_name
      }));
    return [...payments, ...generated];
  }, [payments, appointments]);

  const filteredPayments = useMemo(() => virtualPayments.filter((item) => {
    const method = normalize(item.method || item.payment_method);
    const status = normalize(item.status || item.payment_status);
    const search = `${item.customer_name || ""} ${item.pet_name || ""} ${item.service_name || ""} ${method} ${status}`.toLowerCase();
    return search.includes(query.toLowerCase()) && (methodFilter === "all" || method === methodFilter) && (statusFilter === "all" || status === statusFilter);
  }), [virtualPayments, query, methodFilter, statusFilter]);

  const summary = useMemo(() => {
    const total = virtualPayments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const paid = virtualPayments.filter((item) => ["paid", "approved", "pago"].includes(normalize(item.status || item.payment_status))).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const pending = virtualPayments.filter((item) => ["pending", "pendente"].includes(normalize(item.status || item.payment_status))).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return { total, paid, pending, count: virtualPayments.length };
  }, [virtualPayments]);

  async function createPaymentFromAppointment(item, status = "pending") {
    if (!item.virtual) return item;
    const created = await apiRequest("/payments", {
      method: "POST",
      body: JSON.stringify({ appointment_id: item.appointment_id, amount: item.amount || 0, method: item.method || "presencial", status })
    });
    return created;
  }

  async function updateStatus(item, status) {
    setError("");
    try {
      if (item.virtual) {
        await createPaymentFromAppointment(item, status);
      } else {
        await apiRequest(`/payments/${item.id}`, { method: "PUT", body: JSON.stringify({ ...item, status }) });
      }
      await loadPayments();
    } catch (err) {
      setError(err.message || "Erro ao atualizar pagamento.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div><span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><Wallet size={18} /> Controle financeiro</span><h1 className="text-5xl font-black text-white mt-5">Pagamentos</h1><p className="text-green-100/80 mt-3 max-w-3xl">Acompanhe PIX, cartão e pagamentos presenciais vinculados aos agendamentos.</p></div>
          <button type="button" onClick={loadPayments} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button>
        </div>
        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}
        <div className="grid md:grid-cols-4 gap-6">{[["Total lançado", formatCurrency(summary.total), DollarSign], ["Pago", formatCurrency(summary.paid), CheckCircle], ["Pendente", formatCurrency(summary.pending), Clock], ["Registros", summary.count, CreditCard]].map(([label, value, Icon]) => <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl min-w-0"><div className="flex items-center justify-between gap-4"><div className="min-w-0"><div className="text-slate-500 font-bold">{label}</div><div className="text-2xl 2xl:text-3xl font-black text-slate-900 mt-2 break-words">{value}</div></div><div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center shrink-0"><Icon size={30} /></div></div></div>)}</div>
        <div className="grid lg:grid-cols-3 gap-6">{[[QrCode, "PIX", "Preparado para integração com Mercado Pago e QR Code."], [CreditCard, "Cartão", "Estrutura pronta para cartão online ou presencial."], [Wallet, "Presencial", "Controle para pagamentos feitos no balcão."]].map(([Icon, title, text]) => <div key={title} className="glass rounded-[32px] p-7 border border-white/30 shadow-2xl"><Icon className="text-green-700 mb-4" size={38} /><h2 className="text-2xl font-black text-slate-900">{title}</h2><p className="text-slate-500 mt-2">{text}</p></div>)}</div>
        <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0"><div className="grid lg:grid-cols-[1fr_auto_auto] gap-4"><label className="relative min-w-0"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por cliente, pet, serviço, método ou status..." className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900" /></label><label className="relative min-w-0"><Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><select value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)} className="w-full lg:w-[210px] bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900"><option value="all">Todos métodos</option><option value="pix">PIX</option><option value="card">Cartão</option><option value="presencial">Presencial</option><option value="cash">Dinheiro</option></select></label><label className="relative min-w-0"><Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full lg:w-[210px] bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900"><option value="all">Todos status</option><option value="pending">Pendente</option><option value="paid">Pago</option><option value="approved">Aprovado</option><option value="canceled">Cancelado</option><option value="refunded">Estornado</option></select></label></div></div>
        <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"><h2 className="text-2xl font-black text-slate-900">Histórico de pagamentos</h2><span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-black text-sm w-fit">{filteredPayments.length} registros</span></div><div className="space-y-4">{loading && <div className="text-slate-500 p-5">Carregando pagamentos...</div>}{!loading && filteredPayments.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhum pagamento encontrado.</div>}{!loading && filteredPayments.map((item) => { const method = normalize(item.method || item.payment_method); const status = normalize(item.status || item.payment_status); return <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden"><div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-5"><div className="grid sm:grid-cols-2 2xl:grid-cols-5 gap-5 min-w-0 flex-1"><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Valor</div><div className="text-2xl font-black text-green-700 break-words">{formatCurrency(item.amount)}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Cliente/Pet</div><div className="font-black text-slate-900 break-words">{item.customer_name || "Cliente"} • {item.pet_name || "Pet"}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Serviço</div><div className="font-black text-slate-900 break-words">{item.service_name || "Agendamento"}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Método</div><div className="font-black text-slate-900 break-words">{methodLabels[method] || method}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Status</div><div className="font-black text-slate-900 break-words">{statusLabels[status] || status}</div></div></div><div className="flex flex-wrap gap-3 2xl:justify-end shrink-0"><button type="button" onClick={() => updateStatus(item, "paid")} className="px-4 py-3 rounded-2xl bg-green-100 text-green-700 font-black hover:bg-green-200 transition flex items-center gap-2"><CheckCircle size={18} /> Pago</button><button type="button" onClick={() => updateStatus(item, "pending")} className="px-4 py-3 rounded-2xl bg-yellow-100 text-yellow-700 font-black hover:bg-yellow-200 transition flex items-center gap-2"><Clock size={18} /> Pendente</button><button type="button" onClick={() => updateStatus(item, "canceled")} className="px-4 py-3 rounded-2xl bg-red-100 text-red-700 font-black hover:bg-red-200 transition flex items-center gap-2"><XCircle size={18} /> Cancelar</button></div></div></div>; })}</div></div>
      </div>
    </AdminLayout>
  );
}
