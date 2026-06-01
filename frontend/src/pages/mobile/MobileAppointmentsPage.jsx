import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CalendarPlus, Clock, Loader2, PawPrint, RefreshCw } from "lucide-react";
import MobileShell from "../../components/mobile/MobileShell";

const API_URL = "https://spadodoguinho.com.br/api";

async function getData(path) {
  const token = localStorage.getItem("spa_customer_token");
  const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Não foi possível carregar os dados.");
  return data;
}

function parseDate(item) {
  const value = item?.scheduled_at || (item?.date && item?.time ? `${item.date}T${item.time}` : item?.date);
  if (!value) return null;
  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(item) {
  const date = parseDate(item);
  if (!date) return "A confirmar";
  return date.toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function statusLabel(value) {
  const key = String(value || "pending").toLowerCase();
  const labels = {
    pending: "Pendente",
    pendente: "Pendente",
    confirmed: "Confirmado",
    confirmado: "Confirmado",
    done: "Concluído",
    completed: "Concluído",
    concluido: "Concluído",
    canceled: "Cancelado",
    cancelado: "Cancelado"
  };
  return labels[key] || String(value || "Pendente");
}

function statusClass(value) {
  const key = String(value || "pending").toLowerCase();
  if (["confirmed", "confirmado", "done", "completed", "concluido"].includes(key)) return "bg-green-50 text-green-700";
  if (["canceled", "cancelado"].includes(key)) return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export default function MobileAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getData("/customer/appointments");
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar agendamentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => (parseDate(b)?.getTime() || 0) - (parseDate(a)?.getTime() || 0));
  }, [appointments]);

  return (
    <MobileShell title="Agenda" active="agenda" showBack={false}>
      <section className="mx-3 mt-3 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0d6b54] via-[#1b7f52] to-[#14532d] p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-lg ring-4 ring-white/10">
            <CalendarDays size={32} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/75">SPA do Doguinho</p>
            <h1 className="mt-1 text-3xl font-black leading-tight">Meus horários</h1>
            <p className="mt-1 text-sm text-white/85">Histórico e próximos atendimentos.</p>
          </div>
        </div>
      </section>

      <main className="space-y-4 px-4 py-5">
        <div className="flex gap-3">
          <button type="button" onClick={load} className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-white font-black text-[#183153] shadow-sm ring-1 ring-black/5">
            <RefreshCw size={18} />
            Atualizar
          </button>
          <Link to="/mobile/agendar" className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0d6b54] font-black text-white shadow-md">
            <CalendarPlus size={18} />
            Novo
          </Link>
        </div>

        {error && <p className="rounded-[24px] border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
        {loading && <div className="flex min-h-[220px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-green-700" /></div>}

        {!loading && sortedAppointments.length === 0 && (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-8 text-center shadow-md">
            <CalendarDays className="mx-auto mb-4 h-14 w-14 text-slate-300" />
            <h2 className="text-xl font-black text-[#183153]">Nenhum agendamento ainda</h2>
            <p className="mt-1 text-sm text-slate-500">Escolha um serviço e reserve seu horário.</p>
          </div>
        )}

        {!loading && sortedAppointments.map((item) => (
          <article key={item.id} className="rounded-[28px] border border-black/5 bg-white p-5 shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>{statusLabel(item.status)}</span>
                <h2 className="mt-3 truncate text-xl font-black text-[#183153]">{item.service_name || "Atendimento"}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-500"><PawPrint size={16} />{item.pet_name || "Seu pet"}</p>
                <p className="mt-3 flex items-center gap-2 text-base font-black text-[#0d6b54]"><Clock size={17} />{formatDate(item)}</p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-[#0d6b54]">
                <CalendarDays size={26} />
              </div>
            </div>
          </article>
        ))}
      </main>
    </MobileShell>
  );
}
