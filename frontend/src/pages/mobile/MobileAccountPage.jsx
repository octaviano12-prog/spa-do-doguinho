import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CalendarPlus, ChevronRight, Loader2, MessageCircle, PawPrint, Settings, Sparkles, UserRound } from "lucide-react";
import MobileShell from "../../components/mobile/MobileShell";

const API_URL = "https://spadodoguinho.com.br/api";
const whatsappUrl = "https://wa.me/5518997493722?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20o%20SPA%20do%20Doguinho.";

async function getData(path) {
  const token = localStorage.getItem("spa_customer_token");
  const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Não foi possível carregar os dados.");
  return data;
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateTime(value, fallbackDate, fallbackTime) {
  const date = parseDate(value || (fallbackDate && fallbackTime ? `${fallbackDate}T${fallbackTime}` : fallbackDate));
  if (!date) return "A confirmar";
  return date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
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

export default function MobileAccountPage() {
  const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem("spa_customer") || "null"));
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [me, petData, appointmentData] = await Promise.all([
        getData("/customer/me"),
        getData("/customer/pets"),
        getData("/customer/appointments")
      ]);
      setCustomer(me);
      setPets(Array.isArray(petData) ? petData : []);
      setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
      localStorage.setItem("spa_customer", JSON.stringify(me));
    } catch (err) {
      setError(err.message || "Erro ao carregar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const firstName = customer?.name?.split(" ")?.[0] || "Cliente";
  const pendingAppointments = appointments.filter((item) => ["pending", "pendente", "confirmed", "confirmado"].includes(String(item.status || "pending").toLowerCase()));
  const nextBooking = useMemo(() => {
    const now = new Date();
    return [...appointments]
      .filter((item) => {
        const date = parseDate(item.scheduled_at || (item.date && item.time ? `${item.date}T${item.time}` : item.date));
        return !date || date >= now;
      })
      .sort((a, b) => (parseDate(a.scheduled_at || a.date)?.getTime() || 0) - (parseDate(b.scheduled_at || b.date)?.getTime() || 0))[0];
  }, [appointments]);

  if (loading) {
    return (
      <MobileShell title="Meu Painel" showBack={false} active="home">
        <div className="flex min-h-[70dvh] items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-green-700" />
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="Meu Painel" showBack={false} active="home">
      <section className="relative mx-2 mt-3 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0d6b54] via-[#1b7f52] to-[#14532d] px-4 pb-4 pt-5 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-black/15 blur-2xl" />

        <div className="relative z-10 mb-5 flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg ring-4 ring-white/10">
            <UserRound size={32} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/80">Bem-vindo de volta</p>
            <h1 className="truncate text-2xl font-black leading-tight">Olá, {firstName}!</h1>
            <p className="mt-1 text-sm text-white/80">Seu painel mobile do SPA.</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              Cliente ativo
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-2.5">
          <StatBox icon={PawPrint} label="Meus pets" value={pets.length} />
          <StatBox icon={CalendarDays} label="Agenda" value={pendingAppointments.length} />
        </div>
      </section>

      <main className="space-y-4 px-2 py-4">
        {error && <p className="rounded-[24px] border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}

        {nextBooking ? (
          <section className="relative overflow-hidden rounded-[28px] border border-black/5 bg-white p-4 shadow-lg">
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#0d6b54]/20 blur-3xl" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-green-700">
                  <Sparkles size={14} />
                  Próximo agendamento
                </div>
                <h2 className="text-xl font-black leading-tight text-[#183153]">{nextBooking.pet_name || "Seu pet"}</h2>
                <p className="mt-1 text-sm text-slate-500">{nextBooking.service_name || "Atendimento"}</p>
                <p className="mt-3 text-lg font-black text-[#0d6b54]">
                  {formatDateTime(nextBooking.scheduled_at, nextBooking.date, nextBooking.time)}
                </p>
                <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{statusLabel(nextBooking.status)}</span>
              </div>
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#0d6b54] p-3 text-white shadow-lg">
                <CalendarDays size={26} />
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-[28px] border border-black/5 bg-white p-4 shadow-md">
            <h2 className="text-xl font-black text-[#183153]">Nenhum agendamento próximo</h2>
            <p className="mt-1 text-sm text-slate-500">Que tal marcar um horário para seu pet?</p>
            <Link to="/mobile/agendar" className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0d6b54] px-5 py-3 font-black text-white shadow-md active:scale-95">
              <CalendarPlus size={20} />
              Agendar agora
            </Link>
          </section>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-xl font-black text-[#183153]">Ações rápidas</h2>
            <span className="text-xs font-bold text-slate-400">Menu do cliente</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ActionCard to="/mobile/agendar" icon={CalendarPlus} title="Novo Agendamento" subtitle="Marque banho, tosa ou atendimento" colorClass="bg-green-100 text-green-700" />
            <ActionCard to="/mobile/agendamentos" icon={CalendarDays} title="Meus Agendamentos" subtitle="Histórico e próximos horários" colorClass="bg-blue-100 text-blue-700" />
            <ActionCard to="/mobile/pets" icon={PawPrint} title="Meus Pets" subtitle="Carteirinha e dados dos pets" colorClass="bg-amber-100 text-amber-700" />
            <ActionCard href={whatsappUrl} icon={MessageCircle} title="WhatsApp" subtitle="Fale direto com a equipe" colorClass="bg-emerald-100 text-emerald-700" />
            <ActionCard to="/mobile/perfil" icon={Settings} title="Meu Perfil" subtitle="Dados pessoais e sessão" colorClass="bg-slate-100 text-slate-700" />
          </div>
        </section>
      </main>
    </MobileShell>
  );
}

function StatBox({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[24px] border border-white/20 bg-white/15 p-3.5 shadow-sm backdrop-blur-xl">
      <div className="mb-1 flex items-center gap-2 text-white/80">
        <Icon size={16} />
        <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function ActionCard({ to, href, icon: Icon, title, subtitle, colorClass }) {
  const content = (
    <div className="group flex h-full min-h-[130px] flex-col justify-between rounded-[26px] border border-black/5 bg-white p-4 text-left shadow-md transition active:scale-95">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-black leading-tight text-[#183153]">{title}</h3>
          <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
        </div>
        <p className="mt-1 text-sm leading-snug text-slate-500">{subtitle}</p>
      </div>
    </div>
  );

  if (href) return <a href={href} target="_blank" rel="noreferrer" className="block">{content}</a>;
  return <Link to={to} className="block">{content}</Link>;
}
