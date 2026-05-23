import React, { useEffect, useMemo, useState } from "react";
import {
  Bath,
  Clock,
  DollarSign,
  PawPrint,
  Plus,
  RefreshCw,
  Search,
  Scissors,
  Sparkles,
  Syringe,
  Trash2
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  duration_minutes: 60,
  category: "Banho",
  benefits: "",
  active: 1
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getIcon(name = "", category = "") {
  const text = `${name} ${category}`.toLowerCase();
  if (text.includes("tosa")) return Scissors;
  if (text.includes("vacina")) return Syringe;
  if (text.includes("spa")) return Sparkles;
  if (text.includes("banho")) return Bath;
  return PawPrint;
}

export default function ServicosPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadServices() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/services");
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar serviços.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadServices(); }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const text = `${service.name || ""} ${service.description || ""} ${service.category || ""}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [services, query]);

  const summary = useMemo(() => {
    const active = services.filter((item) => Number(item.active ?? 1) === 1).length;
    const avgPrice = services.length ? services.reduce((sum, item) => sum + Number(item.price || 0), 0) / services.length : 0;
    const avgDuration = services.length ? services.reduce((sum, item) => sum + Number(item.duration_minutes || 0), 0) / services.length : 0;
    return { total: services.length, active, avgPrice, avgDuration };
  }, [services]);

  function updateForm(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiRequest("/services", { method: "POST", body: JSON.stringify(form) });
      setForm(emptyForm);
      await loadServices();
    } catch (err) {
      setError(err.message || "Erro ao salvar serviço.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Excluir este serviço?");
    if (!confirmed) return;
    try {
      await apiRequest(`/services/${id}`, { method: "DELETE" });
      await loadServices();
    } catch (err) {
      setError(err.message || "Erro ao excluir serviço.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><Sparkles size={18} /> Catálogo de serviços</span>
            <h1 className="text-5xl font-black text-white mt-5">Serviços</h1>
            <p className="text-green-100/80 mt-3 max-w-3xl">Gerencie banho, tosa, vacinas, spa e pacotes exibidos no site público e usados no agendamento.</p>
          </div>
          <button type="button" onClick={loadServices} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button>
        </div>

        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}

        <div className="grid md:grid-cols-4 gap-6">
          {[["Serviços", summary.total, Sparkles], ["Ativos", summary.active, PawPrint], ["Preço médio", formatCurrency(summary.avgPrice), DollarSign], ["Duração média", `${Math.round(summary.avgDuration || 0)} min`, Clock]].map(([label, value, Icon]) => (
            <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0"><div className="text-slate-500 font-bold">{label}</div><div className="text-2xl 2xl:text-3xl font-black text-slate-900 mt-2 break-words">{value}</div></div>
                <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center shrink-0"><Icon size={30} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-[430px_1fr] gap-6">
          <form onSubmit={handleCreate} className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center"><Plus size={30} /></div>
              <div><h2 className="text-2xl font-black text-slate-900">Novo serviço</h2><p className="text-slate-500">Aparece no site público e no agendamento.</p></div>
            </div>
            <div className="grid gap-4">
              <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Nome do serviço" required className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"><option>Banho</option><option>Tosa</option><option>Vacina</option><option>Spa</option><option>Pacote</option><option>Outro</option></select>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" step="0.01" value={form.price} onChange={(e) => updateForm("price", e.target.value)} placeholder="Preço" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 min-w-0" />
                <input type="number" value={form.duration_minutes} onChange={(e) => updateForm("duration_minutes", Number(e.target.value))} placeholder="Duração" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 min-w-0" />
              </div>
              <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={4} placeholder="Descrição do serviço" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              <textarea value={form.benefits} onChange={(e) => updateForm("benefits", e.target.value)} rows={3} placeholder="Benefícios" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              <button disabled={saving} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"><Plus size={20} /> {saving ? "Salvando..." : "Adicionar serviço"}</button>
            </div>
          </form>

          <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0">
            <label className="relative block mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar serviço, categoria ou descrição..." className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900" />
            </label>

            <div className="grid md:grid-cols-2 gap-5">
              {loading && [1, 2, 3, 4].map((item) => <div key={item} className="h-[310px] rounded-3xl bg-white/50 animate-pulse" />)}
              {!loading && filteredServices.length === 0 && <div className="md:col-span-2 bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhum serviço encontrado.</div>}

              {!loading && filteredServices.map((service) => {
                const Icon = getIcon(service.name, service.category);
                return (
                  <div key={service.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm min-w-0 overflow-hidden">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shrink-0"><Icon size={28} /></div>
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black break-words text-right">{service.category || "Serviço"}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mt-5 break-words leading-snug">{service.name}</h3>
                    <p className="text-slate-500 mt-3 min-h-[70px] break-words">{service.description || "Sem descrição."}</p>
                    <div className="grid grid-cols-2 gap-4 mt-5">
                      <div className="bg-slate-50 rounded-2xl p-4 min-w-0"><div className="text-xs text-slate-400 font-bold">PREÇO</div><div className="font-black text-green-700 break-words">{formatCurrency(service.price)}</div></div>
                      <div className="bg-slate-50 rounded-2xl p-4 min-w-0"><div className="text-xs text-slate-400 font-bold">DURAÇÃO</div><div className="font-black text-slate-900 break-words">{service.duration_minutes || 60} min</div></div>
                    </div>
                    {service.benefits && <div className="bg-green-50 rounded-2xl p-4 mt-4 text-green-900 text-sm break-words"><strong>Benefícios:</strong> {service.benefits}</div>}
                    <button onClick={() => handleDelete(service.id)} className="mt-5 w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-2xl font-black flex items-center justify-center gap-2 transition"><Trash2 size={18} /> Excluir</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
