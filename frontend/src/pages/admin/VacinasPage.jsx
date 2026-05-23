import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  Clock,
  PawPrint,
  RefreshCw,
  Search,
  ShieldCheck,
  Syringe,
  User
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

function formatDate(value) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

function daysUntil(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function VacinasPage() {
  const [vaccinations, setVaccinations] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadVaccines() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/vaccinations");
      setVaccinations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar vacinas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadVaccines(); }, []);

  const summary = useMemo(() => {
    const dueSoon = vaccinations.filter((item) => {
      const days = daysUntil(item.next_dose_date || item.next_date);
      return days !== null && days >= 0 && days <= 30;
    }).length;
    const overdue = vaccinations.filter((item) => {
      const days = daysUntil(item.next_dose_date || item.next_date);
      return days !== null && days < 0;
    }).length;
    const ok = vaccinations.length - dueSoon - overdue;
    return { total: vaccinations.length, dueSoon, overdue, ok };
  }, [vaccinations]);

  const filtered = useMemo(() => {
    return vaccinations.filter((item) => {
      const text = `${item.vaccine_name || ""} ${item.pet_name || ""} ${item.customer_name || ""} ${item.status || ""}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [vaccinations, query]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><Syringe size={18} /> Saúde pet</span>
            <h1 className="text-5xl font-black text-white mt-5">Vacinas</h1>
            <p className="text-green-100/80 mt-3 max-w-3xl">Controle aplicações, próximas doses, pets em atraso e lembretes para tutores.</p>
          </div>
          <button type="button" onClick={loadVaccines} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button>
        </div>

        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}

        <div className="grid md:grid-cols-4 gap-6">
          {[["Registros", summary.total, Syringe, "bg-green-600"], ["Em dia", summary.ok, CheckCircle, "bg-emerald-700"], ["Próx. 30 dias", summary.dueSoon, Clock, "bg-yellow-500"], ["Atrasadas", summary.overdue, AlertTriangle, "bg-red-600"]].map(([label, value, Icon, color]) => (
            <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0"><div className="text-slate-500 font-bold">{label}</div><div className="text-4xl font-black text-slate-900 mt-2 break-words">{value}</div></div>
                <div className={`w-16 h-16 rounded-2xl ${color} text-white flex items-center justify-center shrink-0`}><Icon size={30} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0">
          <label className="relative block">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por vacina, pet, tutor ou status..." className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900" />
          </label>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black text-slate-900">Carteirinha de vacinas</h2>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-black text-sm w-fit">{filtered.length} registros</span>
            </div>
            <div className="space-y-4">
              {loading && <div className="text-slate-500 p-5">Carregando vacinas...</div>}
              {!loading && filtered.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhuma vacina encontrada.</div>}
              {!loading && filtered.map((item) => {
                const days = daysUntil(item.next_dose_date || item.next_date);
                const isOverdue = days !== null && days < 0;
                const isDueSoon = days !== null && days >= 0 && days <= 30;
                return (
                  <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-5">
                      <div className="grid sm:grid-cols-2 2xl:grid-cols-4 gap-5 min-w-0 flex-1">
                        <div className="flex gap-3 min-w-0"><Syringe className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Vacina</div><div className="font-black text-slate-900 break-words leading-snug">{item.vaccine_name || item.name || "Vacina"}</div></div></div>
                        <div className="flex gap-3 min-w-0"><PawPrint className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Pet</div><div className="font-black text-slate-900 break-words leading-snug">{item.pet_name || `Pet #${item.pet_id || "-"}`}</div></div></div>
                        <div className="flex gap-3 min-w-0"><User className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Tutor</div><div className="font-black text-slate-900 break-words leading-snug">{item.customer_name || `Cliente #${item.customer_id || "-"}`}</div></div></div>
                        <div className="flex gap-3 min-w-0"><CalendarDays className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Próxima dose</div><div className="font-black text-slate-900 break-words leading-snug">{formatDate(item.next_dose_date || item.next_date)}</div></div></div>
                      </div>
                      <div className="flex 2xl:justify-end shrink-0"><span className={`px-4 py-3 rounded-2xl font-black ${isOverdue ? "bg-red-100 text-red-700" : isDueSoon ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{isOverdue ? "Atrasada" : isDueSoon ? "Próxima" : "Em dia"}</span></div>
                    </div>
                    <div className="mt-5 bg-slate-50 rounded-2xl p-4 text-slate-600 break-words"><strong>Aplicação:</strong> {formatDate(item.date || item.applied_at)}{item.notes && <span> • {item.notes}</span>}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
            <ShieldCheck className="text-green-700 mb-5" size={42} />
            <h2 className="text-2xl font-black text-slate-900">Lembretes inteligentes</h2>
            <p className="text-slate-500 mt-3">Esta tela está preparada para enviar lembretes de próximas doses por WhatsApp ou notificação.</p>
            <div className="space-y-4 mt-7">
              {["Vacinas próximas do vencimento", "Histórico por pet", "Tutor responsável", "Próxima dose automática", "Alertas no dashboard"].map((item) => <div key={item} className="bg-white rounded-2xl p-4 border border-slate-100 font-bold text-slate-700 break-words">{item}</div>)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
