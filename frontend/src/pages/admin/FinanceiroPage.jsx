import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  CalendarDays,
  CheckCircle,
  Clock,
  DollarSign,
  RefreshCw,
  TrendingUp,
  Wallet
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalize(value) {
  return String(value || "pending").toLowerCase();
}

export default function FinanceiroPage() {
  const [payments, setPayments] = useState([]);
  const [cash, setCash] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFinancial() {
    setLoading(true);
    setError("");
    try {
      const [paymentsData, cashData, appointmentsData] = await Promise.all([
        apiRequest("/payments"),
        apiRequest("/cash").catch(() => []),
        apiRequest("/appointments").catch(() => [])
      ]);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setCash(Array.isArray(cashData) ? cashData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar financeiro.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFinancial(); }, []);

  const summary = useMemo(() => {
    const paid = payments.filter((item) => ["paid", "approved", "pago"].includes(normalize(item.status || item.payment_status))).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const pending = payments.filter((item) => ["pending", "pendente"].includes(normalize(item.status || item.payment_status))).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const cashIn = cash.filter((item) => ["in", "entrada", "income"].includes(normalize(item.type))).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const cashOut = cash.filter((item) => ["out", "saida", "expense"].includes(normalize(item.type))).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const total = paid + cashIn;
    const balance = total - cashOut;
    return { paid, pending, cashIn, cashOut, total, balance, appointments: appointments.length };
  }, [payments, cash, appointments]);

  const recentPayments = useMemo(() => payments.slice(0, 8), [payments]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><BarChart3 size={18} /> Gestão financeira</span>
            <h1 className="text-5xl font-black text-white mt-5">Financeiro</h1>
            <p className="text-green-100/80 mt-3 max-w-3xl">Visão geral das entradas, pagamentos pendentes, caixa e movimentações do SPA do Doguinho.</p>
          </div>
          <button type="button" onClick={loadFinancial} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button>
        </div>

        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[["Recebido", formatCurrency(summary.paid), CheckCircle, "bg-green-600"], ["Pendente", formatCurrency(summary.pending), Clock, "bg-yellow-500"], ["Saídas", formatCurrency(summary.cashOut), ArrowDownCircle, "bg-red-600"], ["Saldo", formatCurrency(summary.balance), Wallet, "bg-emerald-700"]].map(([label, value, Icon, color]) => (
            <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0"><div className="text-slate-500 font-bold">{label}</div><div className="text-2xl 2xl:text-3xl font-black text-slate-900 mt-2 break-words">{value}</div></div>
                <div className={`w-16 h-16 rounded-2xl ${color} text-white flex items-center justify-center shrink-0`}><Icon size={30} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
            <div className="flex items-center gap-3 mb-7">
              <TrendingUp className="text-green-700 shrink-0" size={30} />
              <div className="min-w-0"><h2 className="text-2xl font-black text-slate-900">Resumo operacional</h2><p className="text-slate-500">Indicadores principais do período atual.</p></div>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 min-w-0"><ArrowUpCircle className="text-green-600 mb-4" size={34} /><div className="text-slate-500 font-bold">Entradas de caixa</div><div className="text-2xl font-black text-slate-900 mt-2 break-words">{formatCurrency(summary.cashIn)}</div></div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 min-w-0"><DollarSign className="text-green-600 mb-4" size={34} /><div className="text-slate-500 font-bold">Total financeiro</div><div className="text-2xl font-black text-slate-900 mt-2 break-words">{formatCurrency(summary.total)}</div></div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 min-w-0"><CalendarDays className="text-green-600 mb-4" size={34} /><div className="text-slate-500 font-bold">Agendamentos</div><div className="text-2xl font-black text-slate-900 mt-2">{summary.appointments}</div></div>
            </div>
          </div>

          <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Próximos módulos</h2>
            <div className="space-y-4">
              {["PIX Mercado Pago", "QR Code automático", "Fechamento de caixa", "Relatório mensal", "Comprovantes"].map((item) => <div key={item} className="bg-white rounded-2xl p-4 border border-slate-100 font-bold text-slate-700 break-words">{item}</div>)}
            </div>
          </div>
        </div>

        <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-black text-slate-900">Pagamentos recentes</h2>
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-black text-sm w-fit">{payments.length} registros</span>
          </div>
          <div className="space-y-4">
            {loading && <div className="text-slate-500">Carregando financeiro...</div>}
            {!loading && recentPayments.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhum pagamento registrado.</div>}
            {!loading && recentPayments.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-0">
                <div className="min-w-0"><div className="font-black text-slate-900 break-words">Pagamento #{item.id}</div><div className="text-slate-500 mt-1 break-words">Método: {item.method || item.payment_method || "Não informado"} • Status: {item.status || item.payment_status || "Pendente"}</div></div>
                <div className="text-2xl font-black text-green-700 break-words shrink-0">{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
