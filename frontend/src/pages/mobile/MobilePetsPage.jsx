import React, { useEffect, useMemo, useState } from "react";
import { Check, CreditCard, FileText, Heart, Loader2, PawPrint, Plus, RefreshCw, Save, ShieldCheck, Syringe, X } from "lucide-react";
import MobileShell from "../../components/mobile/MobileShell";

const API_URL = "https://spadodoguinho.com.br/api";

async function customerRequest(path, options = {}) {
  const token = localStorage.getItem("spa_customer_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Não foi possível carregar os dados.");
  return data;
}

function formatDate(value) {
  if (!value) return "A confirmar";
  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "A confirmar";
  return date.toLocaleDateString("pt-BR");
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function statusLabel(value) {
  const key = String(value || "pending").toLowerCase();
  if (["paid", "approved", "pago"].includes(key)) return "Pago";
  if (["canceled", "cancelado", "refunded"].includes(key)) return "Cancelado";
  if (["confirmed", "confirmado", "done", "completed", "concluido"].includes(key)) return "Confirmado";
  return "Pendente";
}

export default function MobilePetsPage() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", species: "Cachorro", breed: "", age: "", weight: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await customerRequest("/customer/pet-records");
      const list = Array.isArray(data) ? data : [];
      setPets(list);
      setSelectedPetId((current) => current && list.some((pet) => Number(pet.id) === Number(current)) ? current : list[0]?.id || null);
    } catch (err) {
      setError(err.message || "Erro ao carregar pets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const selectedPet = useMemo(() => pets.find((pet) => Number(pet.id) === Number(selectedPetId)) || pets[0], [pets, selectedPetId]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function createPet(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await customerRequest("/customer/pets", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setShowForm(false);
      setForm({ name: "", species: "Cachorro", breed: "", age: "", weight: "", notes: "" });
      await load();
      setSelectedPetId(created.id);
    } catch (err) {
      setError(err.message || "Erro ao cadastrar pet.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <MobileShell title="Meus Pets" active="pets" showBack={false}>
      <section className="mx-3 mt-3 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0d6b54] via-[#1b7f52] to-[#14532d] p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-lg ring-4 ring-white/10">
            <PawPrint size={34} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/75">Carteirinha</p>
            <h1 className="mt-1 text-3xl font-black leading-tight">Meus pets</h1>
            <p className="mt-1 text-sm text-white/85">Dados, vacinas e histórico por pet.</p>
          </div>
        </div>
      </section>

      <main className="space-y-5 px-4 py-5">
        <div className="flex gap-3">
          <button type="button" onClick={load} className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-white font-black text-[#183153] shadow-sm ring-1 ring-black/5">
            <RefreshCw size={18} />
            Atualizar
          </button>
          <button type="button" onClick={() => setShowForm((value) => !value)} className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0d6b54] font-black text-white shadow-md">
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Fechar" : "Novo pet"}
          </button>
        </div>

        {error && <p className="rounded-[24px] border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}

        {showForm && (
          <form onSubmit={createPet} className="space-y-3 rounded-[32px] border border-black/5 bg-white p-5 shadow-md">
            <h2 className="text-xl font-black text-[#183153]">Cadastrar pet</h2>
            <input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Nome do pet" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-700" />
            <select value={form.species} onChange={(event) => update("species", event.target.value)} className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-700">
              <option>Cachorro</option>
              <option>Gato</option>
              <option>Outro</option>
            </select>
            <input value={form.breed} onChange={(event) => update("breed", event.target.value)} placeholder="Raça" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-700" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.age} onChange={(event) => update("age", event.target.value)} placeholder="Idade" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-700" />
              <input value={form.weight} onChange={(event) => update("weight", event.target.value)} placeholder="Peso kg" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-700" />
            </div>
            <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} rows={3} placeholder="Observações" className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-green-700" />
            <button disabled={saving} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#0d6b54] font-black text-white disabled:opacity-60">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={19} />}
              Salvar pet
            </button>
          </form>
        )}

        {loading && <div className="flex min-h-[220px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-green-700" /></div>}

        {!loading && pets.length === 0 && !showForm && (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-8 text-center shadow-md">
            <PawPrint className="mx-auto mb-4 h-14 w-14 text-slate-300" />
            <h2 className="text-xl font-black text-[#183153]">Nenhum pet cadastrado</h2>
            <p className="mt-1 text-sm text-slate-500">Cadastre o primeiro pet para acompanhar tudo por aqui.</p>
          </div>
        )}

        {!loading && pets.length > 0 && (
          <>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {pets.map((pet) => {
                const active = Number(selectedPet?.id) === Number(pet.id);
                return (
                  <button key={pet.id} onClick={() => setSelectedPetId(pet.id)} className={`min-w-[150px] rounded-[28px] border p-4 text-left shadow-sm ${active ? "border-[#0d6b54] bg-green-50" : "border-black/5 bg-white"}`}>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[#0d6b54]"><PawPrint size={24} /></div>
                    <h3 className="truncate text-lg font-black text-[#183153]">{pet.name}</h3>
                    <p className="truncate text-xs font-bold text-slate-500">{pet.species || "Pet"}</p>
                    {active && <Check className="mt-2 text-[#0d6b54]" size={18} />}
                  </button>
                );
              })}
            </div>

            {selectedPet && <PetRecord pet={selectedPet} />}
          </>
        )}
      </main>
    </MobileShell>
  );
}

function PetRecord({ pet }) {
  const vaccinations = Array.isArray(pet.vaccinations) ? pet.vaccinations : [];
  const payments = Array.isArray(pet.payments) ? pet.payments : [];
  const history = Array.isArray(pet.service_history) ? pet.service_history : [];

  return (
    <section className="rounded-[34px] border border-black/5 bg-white p-5 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-[#0d6b54]"><Heart size={30} /></div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Carteirinha digital</p>
          <h2 className="truncate text-2xl font-black text-[#183153]">{pet.name}</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">{pet.species || "Pet"}{pet.breed ? ` • ${pet.breed}` : ""}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniStat icon={Syringe} label="Vacinas" value={vaccinations.length} />
        <MiniStat icon={CreditCard} label="Pagamentos" value={payments.length} />
        <MiniStat icon={FileText} label="Histórico" value={history.length} />
      </div>

      {(pet.age || pet.weight || pet.notes) && (
        <div className="mt-4 rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
          {pet.age && <p><strong>Idade:</strong> {pet.age}</p>}
          {pet.weight && <p><strong>Peso:</strong> {pet.weight} kg</p>}
          {pet.notes && <p><strong>Observações:</strong> {pet.notes}</p>}
        </div>
      )}

      <RecordSection title="Vacinas" empty="Nenhuma vacina registrada para este pet.">
        {vaccinations.slice(0, 4).map((item) => <RecordItem key={`${item.source_table || "v"}-${item.id}`} title={item.vaccine_name || "Vacina"} detail={`Aplicada em ${formatDate(item.date)} • Próxima: ${formatDate(item.next_dose_date)}`} />)}
      </RecordSection>

      <RecordSection title="Pagamentos" empty="Nenhum pagamento registrado para este pet.">
        {payments.slice(0, 4).map((item) => <RecordItem key={item.id} title={item.description || `Pagamento #${item.id}`} detail={`${formatCurrency(item.amount)} • ${statusLabel(item.status)}`} />)}
      </RecordSection>

      <RecordSection title="Histórico" empty="Nenhum atendimento registrado para este pet.">
        {history.slice(0, 4).map((item) => <RecordItem key={item.id} title={item.service_name || "Atendimento"} detail={`${formatDate(item.date)} • ${item.professional || "SPA do Doguinho"}`} />)}
      </RecordSection>
    </section>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[22px] bg-green-50 p-3 text-center">
      <Icon className="mx-auto mb-1 text-[#0d6b54]" size={20} />
      <div className="text-xl font-black text-[#183153]">{value}</div>
      <div className="text-[10px] font-black uppercase text-slate-400">{label}</div>
    </div>
  );
}

function RecordSection({ title, empty, children }) {
  const hasChildren = React.Children.count(children) > 0;
  return (
    <div className="mt-5 rounded-[24px] border border-slate-100 bg-slate-50 p-4">
      <h3 className="mb-3 flex items-center gap-2 font-black text-[#183153]"><ShieldCheck size={18} className="text-[#0d6b54]" />{title}</h3>
      {hasChildren ? <div className="space-y-2">{children}</div> : <p className="text-sm font-semibold text-slate-500">{empty}</p>}
    </div>
  );
}

function RecordItem({ title, detail }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <strong className="block text-sm text-[#183153]">{title}</strong>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p>
    </div>
  );
}
