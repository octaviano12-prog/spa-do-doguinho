import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Filter,
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
  confirmed: "Confirmado",
  completed: "Concluído",
  canceled: "Cancelado",
  cancelado: "Cancelado",
  concluido: "Concluído",
  confirmado: "Confirmado"
};

const paymentLabels = {
  pix: "PIX",
  card: "Cartão",
  dinheiro: "Dinheiro",
  presencial: "Presencial",
  pending: "Pendente"
};

function formatDate(value) {
  if (!value) return "Sem data";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function normalizeStatus(value) {
  return String(value || "pending").toLowerCase();
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const search = `${item.customer_name || ""} ${item.pet_name || ""} ${item.service_name || ""} ${item.status || ""}`.toLowerCase();
      const matchesQuery = search.includes(query.toLowerCase());
      const status = normalizeStatus(item.status);
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [appointments, query, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((item) => normalizeStatus(item.status) === "pending" || normalizeStatus(item.status) === "pendente").length,
      confirmed: appointments.filter((item) => ["confirmed", "confirmado"].includes(normalizeStatus(item.status))).length,
      completed: appointments.filter((item) => ["completed", "concluido", "concluído"].includes(normalizeStatus(item.status))).length
    };
  }, [appointments]);

  async function updateStatus(item, status) {
    setError("");

    try {
      await apiRequest(`/appointments/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...item,
          status
        })
      });

      await loadAppointments();
    } catch (err) {
      setError(err.message || "Erro ao atualizar agendamento.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black">
              <CalendarDays size={18} />
              Agenda operacional
            </span>

            <h1 className="text-5xl font-black text-white mt-5">
              Agendamentos
            </h1>

            <p className="text-green-100/80 mt-3 max-w-3xl">
              Acompanhe histórico, status, pagamentos e próximos atendimentos do SPA do Doguinho.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAppointments}
            className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"
          >
            <RefreshCw size={20} />
            Atualizar
          </button>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6">
          {[
            ["Total", summary.total, CalendarDays],
            ["Pendentes", summary.pending, Clock],
            ["Confirmados", summary.confirmed, CheckCircle],
            ["Concluídos", summary.completed, Wallet]
          ].map(([label, value, Icon]) => (
            <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-500 font-bold">{label}</div>
                  <div className="text-4xl font-black text-slate-900 mt-2">{value}</div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center">
                  <Icon size={30} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl">
          <div className="grid lg:grid-cols-[1fr_auto_auto] gap-4">
            <label className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por cliente, pet, serviço ou status..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900"
              />
            </label>

            <label className="relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full lg:w-[230px] bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendentes</option>
                <option value="confirmed">Confirmados</option>
                <option value="completed">Concluídos</option>
                <option value="canceled">Cancelados</option>
              </select>
            </label>
          </div>
        </div>

        <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900">Histórico de agendamentos</h2>
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-black text-sm">
              {filteredAppointments.length} registros
            </span>
          </div>

          <div className="space-y-4">
            {loading && <div className="text-slate-500 p-5">Carregando agendamentos...</div>}

            {!loading && filteredAppointments.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">
                Nenhum agendamento encontrado.
              </div>
            )}

            {!loading && filteredAppointments.map((item) => {
              const status = normalizeStatus(item.status);
              const statusLabel = statusLabels[status] || item.status || "Pendente";
              const paymentMethod = item.payment_method || item.payment_type || item.payment || "pending";

              return (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <div className="grid xl:grid-cols-[1fr_auto] gap-5">
                    <div className="grid md:grid-cols-4 gap-5">
                      <div className="flex gap-3">
                        <User className="text-green-600 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Cliente</div>
                          <div className="font-black text-slate-900">{item.customer_name || `Cliente #${item.customer_id || "-"}`}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <PawPrint className="text-green-600 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Pet</div>
                          <div className="font-black text-slate-900">{item.pet_name || `Pet #${item.pet_id || "-"}`}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CalendarDays className="text-green-600 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Data</div>
                          <div className="font-black text-slate-900">{formatDate(item.scheduled_at || item.date)}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CreditCard className="text-green-600 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Pagamento</div>
                          <div className="font-black text-slate-900">{paymentLabels[paymentMethod] || paymentMethod}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                      <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-black">
                        {statusLabel}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateStatus(item, "confirmed")}
                        className="px-4 py-3 rounded-2xl bg-green-100 text-green-700 font-black hover:bg-green-200 transition flex items-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Confirmar
                      </button>

                      <button
                        type="button"
                        onClick={() => updateStatus(item, "completed")}
                        className="px-4 py-3 rounded-2xl bg-blue-100 text-blue-700 font-black hover:bg-blue-200 transition flex items-center gap-2"
                      >
                        <Eye size={18} />
                        Concluir
                      </button>

                      <button
                        type="button"
                        onClick={() => updateStatus(item, "canceled")}
                        className="px-4 py-3 rounded-2xl bg-red-100 text-red-700 font-black hover:bg-red-200 transition flex items-center gap-2"
                      >
                        <XCircle size={18} />
                        Cancelar
                      </button>
                    </div>
                  </div>

                  {(item.service_name || item.notes || item.observations) && (
                    <div className="mt-5 bg-slate-50 rounded-2xl p-4 text-slate-600">
                      <strong>Serviço:</strong> {item.service_name || `#${item.service_id || "-"}`}
                      {(item.notes || item.observations) && (
                        <span> • {item.notes || item.observations}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
