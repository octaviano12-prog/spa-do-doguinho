import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Gift,
  PawPrint,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  User,
  XCircle
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyForm = {
  customer_id: "",
  pet_id: "",
  service_id: "",
  name: "",
  price: "",
  payment_method: "cash",
  payment_status: "pending",
  notes: ""
};

const emptySlot = { date: "", time: "08:00" };

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function dateLabel(value) {
  const text = String(value || "").slice(0, 10);
  if (!text) return "Sem data";
  const [year, month, day] = text.split("-");
  return year && month && day ? `${day}/${month}/${year}` : text;
}

function timeLabel(value) {
  return String(value || "").slice(0, 5);
}

function statusText(value) {
  const status = String(value || "active").toLowerCase();
  if (["active", "ativo"].includes(status)) return "Ativo";
  if (["inactive", "inativo"].includes(status)) return "Inativo";
  if (["canceled", "cancelado", "cancelled"].includes(status)) return "Cancelado";
  return value || "Ativo";
}

function paymentText(value) {
  const status = String(value || "pending").toLowerCase();
  if (["paid", "pago", "approved"].includes(status)) return "Pago";
  if (["canceled", "cancelado"].includes(status)) return "Cancelado";
  return "Pendente";
}

function methodText(value) {
  const method = String(value || "cash").toLowerCase();
  if (method === "pix") return "PIX";
  if (method === "card") return "Cartão";
  return "Dinheiro";
}

export default function FidelidadePage() {
  const [packages, setPackages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [slot, setSlot] = useState(emptySlot);
  const [slots, setSlots] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const [packageData, customerData, petData, serviceData] = await Promise.all([
        apiRequest("/loyaltyPackages").catch(() => []),
        apiRequest("/customers"),
        apiRequest("/pets"),
        apiRequest("/services")
      ]);
      setPackages(Array.isArray(packageData) ? packageData : []);
      setCustomers(Array.isArray(customerData) ? customerData : []);
      setPets(Array.isArray(petData) ? petData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar pacotes fidelidade.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const selectedCustomer = useMemo(() => customers.find((item) => Number(item.id) === Number(form.customer_id)), [customers, form.customer_id]);
  const customerPets = useMemo(() => pets.filter((pet) => Number(pet.customer_id) === Number(form.customer_id)), [pets, form.customer_id]);
  const selectedPet = useMemo(() => pets.find((item) => Number(item.id) === Number(form.pet_id)), [pets, form.pet_id]);
  const selectedService = useMemo(() => services.find((item) => Number(item.id) === Number(form.service_id)), [services, form.service_id]);

  const filteredPackages = useMemo(() => {
    const needle = query.toLowerCase();
    return packages.filter((item) => `${item.name || ""} ${item.customer_name || ""} ${item.pet_name || ""} ${item.service_name || ""} ${item.status || ""}`.toLowerCase().includes(needle));
  }, [packages, query]);

  const summary = useMemo(() => ({
    total: packages.length,
    active: packages.filter((item) => ["active", "ativo"].includes(String(item.status || "active").toLowerCase())).length,
    paid: packages.filter((item) => ["paid", "pago", "approved"].includes(String(item.payment_status || "pending").toLowerCase())).length,
    revenue: packages.filter((item) => ["paid", "pago", "approved"].includes(String(item.payment_status || "pending").toLowerCase())).reduce((sum, item) => sum + Number(item.price || 0), 0)
  }), [packages]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleCustomerChange(value) {
    setForm((current) => ({ ...current, customer_id: value, pet_id: "" }));
  }

  function handleServiceChange(value) {
    const service = services.find((item) => Number(item.id) === Number(value));
    setForm((current) => ({
      ...current,
      service_id: value,
      price: current.price || (service?.price ? String(service.price).replace(".", ",") : "")
    }));
  }

  function addSlot() {
    setError("");
    if (!slot.date || !slot.time) {
      setError("Informe data e horário antes de adicionar.");
      return;
    }
    const exists = slots.some((item) => item.date === slot.date && item.time === slot.time);
    if (exists) {
      setError("Este horário já foi adicionado ao pacote.");
      return;
    }
    setSlots((current) => [...current, { ...slot }].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)));
    setSlot(emptySlot);
  }

  function removeSlot(index) {
    setSlots((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.customer_id || !form.pet_id || !form.service_id) throw new Error("Selecione cliente, pet e serviço.");
      if (!slots.length) throw new Error("Adicione pelo menos uma data e horário.");
      if (!form.price) throw new Error("Informe o preço especial do pacote.");

      await apiRequest("/loyaltyPackages", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          name: form.name || `Pacote ${selectedService?.name || "fidelidade"} - ${selectedPet?.name || "pet"}`,
          price: String(form.price).replace(",", "."),
          slots
        })
      });

      setForm(emptyForm);
      setSlot(emptySlot);
      setSlots([]);
      setSuccess("Pacote fidelidade criado e horários reservados.");
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao salvar pacote fidelidade.");
    } finally {
      setSaving(false);
    }
  }

  async function updatePackageStatus(item, status) {
    setError("");
    setSuccess("");
    try {
      await apiRequest(`/loyaltyPackages/${item.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setSuccess(status === "canceled" ? "Pacote cancelado e horários liberados." : "Pacote atualizado.");
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao atualizar pacote.");
    }
  }

  async function cancelPackage(item) {
    if (!window.confirm("Cancelar este pacote e liberar os horários?")) return;
    setError("");
    setSuccess("");
    try {
      await apiRequest(`/loyaltyPackages/${item.id}`, { method: "DELETE" });
      setSuccess("Pacote cancelado e horários liberados.");
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao cancelar pacote.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><Gift size={18} /> Pacotes de serviço</span>
            <h1 className="text-5xl font-black text-white mt-5">Fidelidade</h1>
            <p className="text-green-100/80 mt-3 max-w-3xl">Cadastre pacotes com preço especial, cliente, pet, serviço e horários reservados. Esses horários deixam de aparecer para outros clientes.</p>
          </div>
          <button type="button" onClick={loadData} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button>
        </div>

        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}
        {success && <div className="bg-emerald-500/15 border border-emerald-300/30 text-emerald-50 rounded-3xl p-5 font-bold">{success}</div>}

        <div className="grid md:grid-cols-4 gap-6">
          {[["Pacotes", summary.total, Gift], ["Ativos", summary.active, ShieldCheck], ["Pagos", summary.paid, CheckCircle], ["Recebido", money(summary.revenue), DollarSign]].map(([label, value, Icon]) => (
            <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0"><div className="text-slate-500 font-bold">{label}</div><div className="text-3xl font-black text-slate-900 mt-2 break-words">{value}</div></div>
                <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center shrink-0"><Icon size={30} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-[480px_minmax(0,1fr)] gap-6 items-start">
          <form onSubmit={handleSubmit} className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl min-w-0">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center shrink-0"><Plus size={30} /></div>
              <div><h2 className="text-2xl font-black text-slate-900">Novo pacote</h2><p className="text-slate-500">Selecione cliente e pet já cadastrados.</p></div>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Cliente</span><select required value={form.customer_id} onChange={(e) => handleCustomerChange(e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"><option value="">Selecione o cliente</option>{customers.map((item) => <option key={item.id} value={item.id}>{item.name} {item.phone ? `- ${item.phone}` : ""}</option>)}</select></label>
              <label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Pet do cliente</span><select required value={form.pet_id} onChange={(e) => setField("pet_id", e.target.value)} disabled={!form.customer_id} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 disabled:bg-slate-100"><option value="">{form.customer_id ? "Selecione o pet" : "Escolha o cliente primeiro"}</option>{customerPets.map((item) => <option key={item.id} value={item.id}>{item.name} {item.size_category ? `- ${item.size_category}` : ""}</option>)}</select></label>
              <label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Serviço</span><select required value={form.service_id} onChange={(e) => handleServiceChange(e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"><option value="">Selecione o serviço</option>{services.map((item) => <option key={item.id} value={item.id}>{item.name} - {money(item.price)}</option>)}</select></label>
              <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Nome do pacote, ex: Banho semanal Apollo" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />

              <div className="grid sm:grid-cols-3 gap-3">
                <input required value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="Preço especial" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 min-w-0" />
                <select value={form.payment_method} onChange={(e) => setField("payment_method", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 min-w-0"><option value="cash">Dinheiro</option><option value="card">Cartão</option><option value="pix">PIX</option></select>
                <select value={form.payment_status} onChange={(e) => setField("payment_status", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 min-w-0"><option value="pending">Pendente</option><option value="paid">Pago</option></select>
              </div>

              <div className="bg-white/80 border border-slate-100 rounded-3xl p-4">
                <div className="font-black text-slate-900 mb-3">Horários reservados</div>
                <div className="grid sm:grid-cols-[1fr_130px_auto] gap-3">
                  <input type="date" value={slot.date} onChange={(e) => setSlot((current) => ({ ...current, date: e.target.value }))} className="bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none text-slate-900 min-w-0" />
                  <input type="time" value={slot.time} onChange={(e) => setSlot((current) => ({ ...current, time: e.target.value }))} className="bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none text-slate-900 min-w-0" />
                  <button type="button" onClick={addSlot} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-black flex items-center justify-center gap-2"><Plus size={18} /> Adicionar</button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {slots.length === 0 && <span className="text-slate-500 text-sm">Nenhum horário adicionado.</span>}
                  {slots.map((item, index) => (
                    <span key={`${item.date}-${item.time}`} className="inline-flex items-center gap-2 bg-green-50 text-green-800 border border-green-100 rounded-2xl px-3 py-2 text-sm font-black">
                      <CalendarCheck size={15} /> {dateLabel(item.date)} às {timeLabel(item.time)}
                      <button type="button" onClick={() => removeSlot(index)} className="text-red-600"><XCircle size={16} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <textarea value={form.notes} onChange={(e) => setField("notes", e.target.value)} rows={3} placeholder="Observações do pacote" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />

              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 text-emerald-900 text-sm">
                {selectedCustomer && selectedPet && selectedService ? <><b>Resumo:</b> {selectedCustomer.name}, pet {selectedPet.name}, serviço {selectedService.name}, {slots.length} horário(s) reservado(s).</> : "Selecione cliente, pet e serviço para montar o pacote."}
              </div>

              <button disabled={saving} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"><Save size={20} /> {saving ? "Salvando..." : "Salvar pacote fidelidade"}</button>
            </div>
          </form>

          <section className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0">
            <label className="relative block mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por cliente, pet, serviço ou pacote..." className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900" />
            </label>

            <div className="space-y-4">
              {loading && <div className="text-slate-500 p-5">Carregando pacotes...</div>}
              {!loading && filteredPackages.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhum pacote fidelidade cadastrado.</div>}
              {!loading && filteredPackages.map((item) => {
                const active = ["active", "ativo"].includes(String(item.status || "active").toLowerCase());
                return (
                  <article key={item.id} className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm">
                    <div className="flex flex-col 2xl:flex-row 2xl:items-start 2xl:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{statusText(item.status)}</span>
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-600">{paymentText(item.payment_status)}</span>
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-700">{methodText(item.payment_method)}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 break-words">{item.name || `Pacote #${item.id}`}</h3>
                        <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
                          <div className="bg-slate-50 rounded-2xl p-3"><div className="text-slate-400 font-black uppercase flex items-center gap-1"><User size={14} />Cliente</div><b>{item.customer_name || `Cliente #${item.customer_id}`}</b></div>
                          <div className="bg-slate-50 rounded-2xl p-3"><div className="text-slate-400 font-black uppercase flex items-center gap-1"><PawPrint size={14} />Pet</div><b>{item.pet_name || `Pet #${item.pet_id}`}</b></div>
                          <div className="bg-slate-50 rounded-2xl p-3"><div className="text-slate-400 font-black uppercase flex items-center gap-1"><CreditCard size={14} />Valor</div><b className="text-green-700">{money(item.price)}</b></div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button type="button" onClick={() => updatePackageStatus(item, active ? "inactive" : "active")} className="bg-blue-50 text-blue-700 px-4 py-3 rounded-2xl font-black">{active ? "Pausar" : "Ativar"}</button>
                        <button type="button" onClick={() => cancelPackage(item)} className="bg-red-50 text-red-700 px-4 py-3 rounded-2xl font-black flex items-center gap-2"><Trash2 size={18} /> Cancelar</button>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {(item.slots || []).length === 0 && <span className="text-slate-500 text-sm">Nenhum horário listado.</span>}
                      {(item.slots || []).map((slotItem) => (
                        <span key={slotItem.id} className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl px-3 py-2 text-sm font-black"><Clock size={15} /> {dateLabel(slotItem.date)} às {timeLabel(slotItem.time)}</span>
                      ))}
                    </div>

                    {item.notes && <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-600">{item.notes}</div>}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
