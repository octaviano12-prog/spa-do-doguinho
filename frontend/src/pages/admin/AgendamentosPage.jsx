import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle, CreditCard, Eye, MessageCircle, PawPrint, RefreshCw, User, Wallet, XCircle } from "lucide-react";
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
  cancelled: "Cancelado",
  cancelado: "Cancelado"
};

const paymentLabels = {
  pix: "PIX",
  card: "Cartão",
  cartao: "Cartão",
  cartão: "Cartão",
  dinheiro: "Dinheiro",
  presencial: "Presencial",
  cash: "Dinheiro",
  pending: "Pendente",
  pendente: "Pendente",
  paid: "Pago",
  approved: "Pago",
  pago: "Pago",
  canceled: "Cancelado",
  cancelled: "Cancelado",
  cancelado: "Cancelado"
};

function normalize(value) {
  return String(value || "pending").toLowerCase();
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatLocalDateTime(dateValue, timeValue) {
  const dateText = String(dateValue || "").slice(0, 10);
  const timeText = String(timeValue || "00:00").slice(0, 5);
  const [year, month, day] = dateText.split("-");

  if (year && month && day) return `${day}/${month}/${year}, ${timeText}`;
  return `${dateText || "Data"}, ${timeText}`;
}

function formatDate(value, fallbackDate, fallbackTime) {
  if (fallbackDate && fallbackTime) return formatLocalDateTime(fallbackDate, fallbackTime);

  const raw = value || (fallbackDate ? `${fallbackDate}T${fallbackTime || "00:00"}` : null);
  if (!raw) return "Sem data";

  const text = String(raw).replace(" ", "T");
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}, ${match[4]}:${match[5]}`;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return `${fallbackDate || raw} ${fallbackTime || ""}`;
  return date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function statusClass(status) {
  const value = normalize(status);
  if (["confirmed", "confirmado"].includes(value)) return "bg-green-100 text-green-700";
  if (["completed", "concluido", "concluído"].includes(value)) return "bg-blue-100 text-blue-700";
  if (["canceled", "cancelled", "cancelado"].includes(value)) return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-800";
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const rows = useMemo(() => appointments, [appointments]);

  async function updateStatus(item, status) {
    setError("");
    try {
      await apiRequest(`/appointments/${item.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await loadAppointments();
    } catch (err) {
      setError(err.message || "Erro ao atualizar agendamento.");
    }
  }

  function openWhatsApp(item) {
    const phone = String(item.customer_phone || item.phone || "").replace(/\D/g, "");
    if (!phone) return;
    const finalPhone = phone.startsWith("55") ? phone : `55${phone}`;
    const text = encodeURIComponent(`Olá! Aqui é do SPA do Doguinho. Sobre o agendamento de ${item.pet_name || "seu pet"} para ${formatDate(item.scheduled_at, item.date, item.time)}.`);
    window.open(`https://wa.me/${finalPhone}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white">Histórico de agendamentos</h1>
            <p className="text-green-100/80 mt-3 text-lg">Acompanhe todos os agendamentos realizados.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-100 text-green-800 px-6 py-3 rounded-full font-black">{rows.length} registros</span>
            <button onClick={loadAppointments} className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-2xl font-black flex items-center gap-2 border border-white/20"><RefreshCw size={18} /> Atualizar</button>
          </div>
        </div>

        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}

        <div className="glass rounded-[32px] border border-white/30 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] table-fixed border-collapse bg-white">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs font-black uppercase">
                  <th className="text-left p-5 w-[190px]"><span className="inline-flex items-center gap-2"><User size={18} className="text-green-600" />Cliente</span></th>
                  <th className="text-left p-5 w-[120px]"><span className="inline-flex items-center gap-2"><PawPrint size={18} className="text-green-600" />Pet</span></th>
                  <th className="text-left p-5 w-[160px]"><span className="inline-flex items-center gap-2"><CalendarDays size={18} className="text-green-600" />Data</span></th>
                  <th className="text-left p-5 w-[130px]"><span className="inline-flex items-center gap-2"><CreditCard size={18} className="text-green-600" />Pagamento</span></th>
                  <th className="text-left p-5 w-[120px]"><span className="inline-flex items-center gap-2"><Wallet size={18} className="text-green-600" />Valor</span></th>
                  <th className="text-left p-5 w-[130px]">Status</th>
                  <th className="text-center p-5 w-[110px]">WhatsApp</th>
                  <th className="text-center p-5 w-[110px]">Confirmar</th>
                  <th className="text-center p-5 w-[110px]">Concluir</th>
                  <th className="text-center p-5 w-[110px]">Cancelar</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="10" className="p-10 text-center text-slate-500 font-bold">Carregando agendamentos...</td></tr>}
                {!loading && rows.length === 0 && <tr><td colSpan="10" className="p-10 text-center text-slate-500 font-bold">Nenhum agendamento encontrado.</td></tr>}
                {!loading && rows.map((item) => {
                  const status = normalize(item.status);
                  const payment = normalize(item.payment_method || item.payment_type || item.payment || "pix");
                  const price = item.price || item.total_price || item.service_price || 0;
                  return (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="p-5 align-middle"><div className="font-black text-slate-900 whitespace-normal break-words leading-snug">{item.customer_name || `Cliente #${item.customer_id || "-"}`}</div><div className="text-slate-500 text-sm mt-1 whitespace-normal break-words">{item.customer_phone || ""}</div></td>
                      <td className="p-5 align-middle font-black text-slate-900 whitespace-normal break-words">{item.pet_name || `Pet #${item.pet_id || "-"}`}</td>
                      <td className="p-5 align-middle font-bold text-slate-900 whitespace-normal leading-snug">{formatDate(item.scheduled_at, item.date, item.time)}</td>
                      <td className="p-5 align-middle font-black text-slate-900">{paymentLabels[payment] || payment}</td>
                      <td className="p-5 align-middle font-black text-green-700">{money(price)}</td>
                      <td className="p-5 align-middle"><span className={`inline-flex px-4 py-2 rounded-full font-black ${statusClass(status)}`}>{statusLabels[status] || item.status || "Pendente"}</span></td>
                      <td className="p-5 align-middle text-center"><button onClick={() => openWhatsApp(item)} disabled={!(item.customer_phone || item.phone)} className="mx-auto w-11 h-11 rounded-xl border border-green-300 text-green-700 flex items-center justify-center hover:bg-green-50 disabled:opacity-40"><MessageCircle size={21} /></button></td>
                      <td className="p-5 align-middle text-center"><button onClick={() => updateStatus(item, "confirmed")} className="mx-auto w-11 h-11 rounded-xl border border-green-300 text-green-700 flex items-center justify-center hover:bg-green-50"><CheckCircle size={22} /></button></td>
                      <td className="p-5 align-middle text-center"><button onClick={() => updateStatus(item, "completed")} className="mx-auto w-11 h-11 rounded-xl border border-blue-300 text-blue-700 flex items-center justify-center hover:bg-blue-50"><Eye size={22} /></button></td>
                      <td className="p-5 align-middle text-center"><button onClick={() => updateStatus(item, "canceled")} className="mx-auto w-11 h-11 rounded-xl border border-red-300 text-red-700 flex items-center justify-center hover:bg-red-50"><XCircle size={22} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-white px-6 py-5 border-t border-slate-100 flex items-center justify-between text-slate-600">
            <span>Mostrando {rows.length} registros</span>
            <span className="bg-green-50 text-green-700 w-10 h-10 rounded-full flex items-center justify-center font-black">1</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
