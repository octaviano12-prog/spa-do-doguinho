import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Cat,
  Dog,
  Edit3,
  Heart,
  PawPrint,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  User,
  Weight,
  X
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyForm = {
  name: "",
  species: "Cachorro",
  breed: "",
  customer_id: "",
  birth_date: "",
  age: "",
  sex: "",
  weight: "",
  color: "",
  photo_url: "",
  allergies: "",
  behavior: "",
  notes: ""
};

function petImage(pet) {
  if (pet.photo_url) return pet.photo_url;
  const species = String(pet.species || "").toLowerCase();
  if (species.includes("gato")) return "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80";
  return "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80";
}

function formatDate(value) {
  if (!value) return "Não informado";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [petsData, customersData] = await Promise.all([
        apiRequest("/pets"),
        apiRequest("/customers").catch(() => [])
      ]);
      setPets(Array.isArray(petsData) ? petsData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar pets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filteredPets = useMemo(() => pets.filter((pet) => {
    const text = `${pet.name || ""} ${pet.species || ""} ${pet.breed || ""} ${pet.customer_name || ""} ${pet.allergies || ""} ${pet.behavior || ""} ${pet.color || ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [pets, query]);

  const summary = useMemo(() => ({
    total: pets.length,
    dogs: pets.filter((pet) => String(pet.species || "").toLowerCase().includes("cachorro")).length,
    cats: pets.filter((pet) => String(pet.species || "").toLowerCase().includes("gato")).length,
    withTutor: pets.filter((pet) => pet.customer_id || pet.customer_name).length
  }), [pets]);

  function tutorName(pet) {
    if (pet.customer_name) return pet.customer_name;
    const customer = customers.find((item) => Number(item.id) === Number(pet.customer_id));
    return customer?.name || (pet.customer_id ? `Cliente #${pet.customer_id}` : "Sem tutor");
  }

  function updateForm(field, value) { setForm((current) => ({ ...current, [field]: value })); }
  function startEdit(pet) { setEditingId(pet.id); setForm({ ...emptyForm, ...pet }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function cancelEdit() { setEditingId(null); setForm(emptyForm); }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, weight: form.weight === "" ? null : form.weight };
      if (editingId) await apiRequest(`/pets/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      else await apiRequest("/pets", { method: "POST", body: JSON.stringify(payload) });
      cancelEdit();
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao salvar pet.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Excluir este pet?")) return;
    setError("");
    try {
      await apiRequest(`/pets/${id}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao excluir pet.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pets-page">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><PawPrint size={18} /> Cadastro pet</span>
            <h1 className="text-5xl font-black text-white mt-5">Pets</h1>
            <p className="text-green-100/80 mt-3 max-w-3xl">Controle pets, tutores, alergias, comportamento e observações importantes.</p>
          </div>
          <button type="button" onClick={loadData} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button>
        </div>

        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}

        <div className="grid md:grid-cols-4 gap-6">
          {[["Pets", summary.total, PawPrint], ["Cachorros", summary.dogs, Heart], ["Gatos", summary.cats, ShieldCheck], ["Com tutor", summary.withTutor, User]].map(([label, value, Icon]) => (
            <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div><div className="text-slate-500 font-bold">{label}</div><div className="text-4xl font-black text-slate-900 mt-2">{value}</div></div>
                <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center"><Icon size={30} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-[430px_minmax(0,1fr)] gap-6 items-start">
          <form onSubmit={handleSubmit} className="glass rounded-[32px] p-7 border border-white/30 shadow-2xl min-w-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center shrink-0">{editingId ? <Edit3 size={30} /> : <Plus size={30} />}</div>
              <div><h2 className="text-2xl font-black text-slate-900">{editingId ? "Editar pet" : "Novo pet"}</h2><p className="text-slate-500">Cadastro completo do animal.</p></div>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Nome do pet</span><input value={form.name || ""} onChange={(e) => updateForm("name", e.target.value)} placeholder="Digite o nome do pet" required className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /></label>
              <label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Selecione o tutor</span><select value={form.customer_id || ""} onChange={(e) => updateForm("customer_id", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"><option value="">Selecione o tutor</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
              <div className="grid grid-cols-2 gap-3"><label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Espécie</span><select value={form.species || "Cachorro"} onChange={(e) => updateForm("species", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"><option>Cachorro</option><option>Gato</option><option>Outro</option></select></label><label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Sexo</span><select value={form.sex || ""} onChange={(e) => updateForm("sex", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"><option value="">Selecione</option><option>Macho</option><option>Fêmea</option></select></label></div>
              <label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Raça</span><input value={form.breed || ""} onChange={(e) => updateForm("breed", e.target.value)} placeholder="Digite a raça" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /></label>
              <div className="grid grid-cols-2 gap-3"><label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Nascimento</span><input type="date" value={form.birth_date || ""} onChange={(e) => updateForm("birth_date", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /></label><label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Peso kg</span><input value={form.weight || ""} onChange={(e) => updateForm("weight", e.target.value)} placeholder="0,0" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /></label></div>
              <label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">Cor/pelagem</span><input value={form.color || ""} onChange={(e) => updateForm("color", e.target.value)} placeholder="Digite a cor ou pelagem" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /></label>
              <label className="grid gap-2"><span className="text-xs font-black text-slate-500 uppercase">URL da foto</span><input value={form.photo_url || ""} onChange={(e) => updateForm("photo_url", e.target.value)} placeholder="Cole a URL da foto do pet" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /></label>
              <textarea value={form.allergies || ""} onChange={(e) => updateForm("allergies", e.target.value)} rows={2} placeholder="Alergias e restrições" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              <textarea value={form.behavior || ""} onChange={(e) => updateForm("behavior", e.target.value)} rows={2} placeholder="Comportamento" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              <button disabled={saving} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"><Save size={20} /> {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Salvar pet"}</button>
              {editingId && <button type="button" onClick={cancelEdit} className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-black flex items-center justify-center gap-3"><X size={20} /> Cancelar edição</button>}
            </div>
          </form>

          <section className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0">
            <label className="relative block mb-5">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por pet, tutor, espécie, raça, alergia ou comportamento..." className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900" />
            </label>

            <div className="space-y-5">
              {loading && <div className="text-slate-500 p-5">Carregando pets...</div>}
              {!loading && filteredPets.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhum pet encontrado.</div>}
              {!loading && filteredPets.map((pet) => {
                const isCat = String(pet.species || "").toLowerCase().includes("gato");
                const SpeciesIcon = isCat ? Cat : Dog;
                return (
                  <article key={pet.id} className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm hover:shadow-xl transition overflow-hidden">
                    <div className="grid lg:grid-cols-[120px_1fr] gap-5">
                      <div className="relative">
                        <img src={petImage(pet)} alt={pet.name || "Pet"} className="w-full lg:w-[120px] h-[150px] lg:h-[120px] object-cover rounded-3xl border border-slate-100" />
                        <div className="absolute -bottom-3 left-4 w-10 h-10 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg"><PawPrint size={22} /></div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{pet.name || "Sem nome"}</h3>
                            <p className="text-slate-500 font-bold mt-1">Tutor: {tutorName(pet)}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => startEdit(pet)} className="px-4 py-3 rounded-2xl bg-blue-50 text-blue-700 font-black hover:bg-blue-100 transition flex items-center gap-2"><Edit3 size={18} /> Editar</button>
                            <button onClick={() => handleDelete(pet.id)} className="px-4 py-3 rounded-2xl bg-red-50 text-red-700 font-black hover:bg-red-100 transition flex items-center gap-2"><Trash2 size={18} /> Excluir</button>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">
                          <div className="pet-info"><User size={17} /><span>Tutor</span><strong>{tutorName(pet)}</strong></div>
                          <div className="pet-info"><SpeciesIcon size={17} /><span>Espécie</span><strong>{pet.species || "Não informado"}</strong></div>
                          <div className="pet-info"><PawPrint size={17} /><span>Raça</span><strong>{pet.breed || "Não informado"}</strong></div>
                          <div className="pet-info"><CalendarDays size={17} /><span>Nascimento</span><strong>{formatDate(pet.birth_date)}</strong></div>
                          <div className="pet-info"><ShieldCheck size={17} /><span>Sexo</span><strong>{pet.sex || "Não informado"}</strong></div>
                          <div className="pet-info"><Weight size={17} /><span>Peso</span><strong>{pet.weight ? `${pet.weight} kg` : "-"}</strong></div>
                          <div className="pet-info xl:col-span-3"><Heart size={17} /><span>Cor/Pelagem</span><strong>{pet.color || "Não informado"}</strong></div>
                        </div>

                        {(pet.allergies || pet.behavior || pet.notes) && <div className="mt-4 bg-green-50 border border-green-100 rounded-2xl p-4 text-green-900 text-sm space-y-1">{pet.allergies && <div><strong>Alergias:</strong> {pet.allergies}</div>}{pet.behavior && <div><strong>Comportamento:</strong> {pet.behavior}</div>}{pet.notes && <div><strong>Observações:</strong> {pet.notes}</div>}</div>}
                      </div>
                    </div>
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
