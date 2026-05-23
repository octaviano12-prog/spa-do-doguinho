import React, { useEffect, useMemo, useState } from "react";
import {
  Ban,
  CalendarDays,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  Save,
  Trash2
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const weekdays = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" }
];

const emptyRule = { day_of_week: 2, start_time: "08:00", end_time: "18:00", interval_minutes: 60, active: 1 };
const emptyBlockedDate = { date: "", reason: "", active: 1 };

export default function DisponibilidadePage() {
  const [rules, setRules] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [ruleForm, setRuleForm] = useState(emptyRule);
  const [blockedForm, setBlockedForm] = useState(emptyBlockedDate);
  const [loading, setLoading] = useState(true);
  const [savingRule, setSavingRule] = useState(false);
  const [savingBlocked, setSavingBlocked] = useState(false);
  const [error, setError] = useState("");

  const activeRules = useMemo(() => rules.filter((item) => Number(item.active ?? 1) === 1), [rules]);
  const activeBlockedDates = useMemo(() => blockedDates.filter((item) => Number(item.active ?? 1) === 1), [blockedDates]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [availabilityData, blockedData] = await Promise.all([
        apiRequest("/availability"),
        apiRequest("/blockedDates")
      ]);
      setRules(Array.isArray(availabilityData) ? availabilityData : []);
      setBlockedDates(Array.isArray(blockedData) ? blockedData : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar disponibilidade.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function weekdayLabel(value) {
    return weekdays.find((item) => Number(item.value) === Number(value))?.label || value;
  }

  async function saveRule(event) {
    event.preventDefault();
    setSavingRule(true);
    setError("");
    try {
      await apiRequest("/availability", { method: "POST", body: JSON.stringify(ruleForm) });
      setRuleForm(emptyRule);
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao salvar regra.");
    } finally {
      setSavingRule(false);
    }
  }

  async function saveBlockedDate(event) {
    event.preventDefault();
    setSavingBlocked(true);
    setError("");
    try {
      await apiRequest("/blockedDates", { method: "POST", body: JSON.stringify(blockedForm) });
      setBlockedForm(emptyBlockedDate);
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao bloquear data.");
    } finally {
      setSavingBlocked(false);
    }
  }

  async function removeItem(endpoint, id) {
    const confirmed = window.confirm("Deseja realmente remover este item?");
    if (!confirmed) return;
    setError("");
    try {
      await apiRequest(`/${endpoint}/${id}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao remover item.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><CalendarDays size={18} /> Agenda e disponibilidade</span>
            <h1 className="text-5xl font-black text-white mt-5">Disponibilidade</h1>
            <p className="text-green-100/80 mt-3 max-w-3xl">Controle os dias da semana disponíveis, horários de atendimento e bloqueios por feriados, eventos ou imprevistos.</p>
          </div>
          <button type="button" onClick={loadData} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button>
        </div>

        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}

        <div className="grid xl:grid-cols-2 gap-6">
          <form onSubmit={saveRule} className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
            <div className="flex items-center gap-4 mb-7"><div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center shrink-0"><Clock size={30} /></div><div className="min-w-0"><h2 className="text-2xl font-black text-slate-900">Regra semanal</h2><p className="text-slate-500">Defina os horários normais de atendimento.</p></div></div>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="grid gap-2 font-bold text-slate-700 min-w-0">Dia da semana<select value={ruleForm.day_of_week} onChange={(event) => setRuleForm({ ...ruleForm, day_of_week: Number(event.target.value) })} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none min-w-0">{weekdays.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}</select></label>
              <label className="grid gap-2 font-bold text-slate-700 min-w-0">Intervalo em minutos<input type="number" min="15" value={ruleForm.interval_minutes} onChange={(event) => setRuleForm({ ...ruleForm, interval_minutes: Number(event.target.value) })} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none min-w-0" /></label>
              <label className="grid gap-2 font-bold text-slate-700 min-w-0">Horário inicial<input type="time" value={ruleForm.start_time} onChange={(event) => setRuleForm({ ...ruleForm, start_time: event.target.value })} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none min-w-0" /></label>
              <label className="grid gap-2 font-bold text-slate-700 min-w-0">Horário final<input type="time" value={ruleForm.end_time} onChange={(event) => setRuleForm({ ...ruleForm, end_time: event.target.value })} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none min-w-0" /></label>
            </div>
            <button type="submit" disabled={savingRule} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"><Save size={20} /> {savingRule ? "Salvando..." : "Salvar regra"}</button>
          </form>

          <form onSubmit={saveBlockedDate} className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
            <div className="flex items-center gap-4 mb-7"><div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0"><Ban size={30} /></div><div className="min-w-0"><h2 className="text-2xl font-black text-slate-900">Bloquear data</h2><p className="text-slate-500">Use para feriados, eventos ou imprevistos.</p></div></div>
            <div className="grid gap-4">
              <label className="grid gap-2 font-bold text-slate-700 min-w-0">Data bloqueada<input type="date" value={blockedForm.date} onChange={(event) => setBlockedForm({ ...blockedForm, date: event.target.value })} required className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none min-w-0" /></label>
              <label className="grid gap-2 font-bold text-slate-700 min-w-0">Motivo<input value={blockedForm.reason} onChange={(event) => setBlockedForm({ ...blockedForm, reason: event.target.value })} placeholder="Ex.: Feriado, evento interno, manutenção..." className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none min-w-0" /></label>
            </div>
            <button type="submit" disabled={savingBlocked} className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"><Plus size={20} /> {savingBlocked ? "Bloqueando..." : "Bloquear data"}</button>
          </form>
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"><h2 className="text-2xl font-black text-slate-900">Regras ativas</h2><span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-black text-sm w-fit">{activeRules.length} regras</span></div>
            <div className="space-y-4">
              {loading && <div className="text-slate-500">Carregando...</div>}
              {!loading && activeRules.length === 0 && <div className="bg-white rounded-2xl p-5 text-slate-500 border">Nenhuma regra semanal cadastrada.</div>}
              {!loading && activeRules.map((rule) => <div key={rule.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-4 overflow-hidden"><div className="min-w-0"><div className="font-black text-slate-900 flex items-center gap-2 break-words"><CheckCircle className="text-green-600 shrink-0" size={20} />{weekdayLabel(rule.day_of_week)}</div><div className="text-slate-500 mt-1 break-words">{rule.start_time} às {rule.end_time} • intervalo {rule.interval_minutes} min</div></div><button type="button" onClick={() => removeItem("availability", rule.id)} className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition shrink-0"><Trash2 size={19} /></button></div>)}
            </div>
          </div>

          <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"><h2 className="text-2xl font-black text-slate-900">Datas bloqueadas</h2><span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-black text-sm w-fit">{activeBlockedDates.length} bloqueios</span></div>
            <div className="space-y-4">
              {loading && <div className="text-slate-500">Carregando...</div>}
              {!loading && activeBlockedDates.length === 0 && <div className="bg-white rounded-2xl p-5 text-slate-500 border">Nenhuma data bloqueada.</div>}
              {!loading && activeBlockedDates.map((item) => <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-4 overflow-hidden"><div className="min-w-0"><div className="font-black text-slate-900 flex items-center gap-2 break-words"><Ban className="text-red-600 shrink-0" size={20} />{item.date}</div><div className="text-slate-500 mt-1 break-words">{item.reason || "Sem motivo informado"}</div></div><button type="button" onClick={() => removeItem("blockedDates", item.id)} className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition shrink-0"><Trash2 size={19} /></button></div>)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
