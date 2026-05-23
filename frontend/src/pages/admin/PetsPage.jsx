import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Heart,
  PawPrint,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  User
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyForm = {
  name: "",
  species: "Cachorro",
  breed: "",
  customer_id: "",
  birth_date: "",
  notes: ""
};

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
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

  useEffect(() => {
    loadData();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const text = `${pet.name || ""} ${pet.species || ""} ${pet.breed || ""} ${pet.customer_name || ""}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [pets, query]);

  const summary = useMemo(() => {
    return {
      total: pets.length,
      dogs: pets.filter((pet) => String(pet.species || "").toLowerCase().includes("cachorro")).length,
      cats: pets.filter((pet) => String(pet.species || "").toLowerCase().includes("gato")).length,
      withTutor: pets.filter((pet) => pet.customer_id || pet.customer_name).length
    };
  }, [pets]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await apiRequest("/pets", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao cadastrar pet.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Excluir este pet?");
    if (!confirmed) return;

    setError("");

    try {
      await apiRequest(`/pets/${id}`, {
        method: "DELETE"
      });

      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao excluir pet.");
    }
  }

  function tutorName(pet) {
    if (pet.customer_name) return pet.customer_name;
    const customer = customers.find((item) => Number(item.id) === Number(pet.customer_id));
    return customer?.name || (pet.customer_id ? `Cliente #${pet.customer_id}` : "Sem tutor");
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black">
              <PawPrint size={18} />
              Cadastro pet
            </span>

            <h1 className="text-5xl font-black text-white mt-5">Pets</h1>

            <p className="text-green-100/80 mt-3 max-w-3xl">
              Controle pets vinculados aos tutores, histórico, raça, espécie e observações importantes para atendimento.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
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
            ["Pets", summary.total, PawPrint],
            ["Cachorros", summary.dogs, Heart],
            ["Gatos", summary.cats, ShieldCheck],
            ["Com tutor", summary.withTutor, User]
          ].map(([label, value, Icon]) => (
            <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
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

        <div className="grid xl:grid-cols-[430px_1fr] gap-6">
          <form
            onSubmit={handleCreate}
            className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center">
                <Plus size={30} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Novo pet</h2>
                <p className="text-slate-500">Vincule o pet ao tutor.</p>
              </div>
            </div>

            <div className="grid gap-4">
              <input
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Nome do pet"
                required
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <select
                value={form.customer_id}
                onChange={(event) => updateForm("customer_id", event.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              >
                <option value="">Selecione o tutor</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>

              <select
                value={form.species}
                onChange={(event) => updateForm("species", event.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              >
                <option>Cachorro</option>
                <option>Gato</option>
                <option>Outro</option>
              </select>

              <input
                value={form.breed}
                onChange={(event) => updateForm("breed", event.target.value)}
                placeholder="Raça"
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <input
                type="date"
                value={form.birth_date}
                onChange={(event) => updateForm("birth_date", event.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <textarea
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
                rows={4}
                placeholder="Observações: alergias, comportamento, cuidados especiais..."
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <button
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"
              >
                <Plus size={20} />
                {saving ? "Salvando..." : "Adicionar pet"}
              </button>
            </div>
          </form>

          <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl">
            <label className="relative block mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por pet, tutor, espécie ou raça..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900"
              />
            </label>

            <div className="space-y-4">
              {loading && <div className="text-slate-500 p-5">Carregando pets...</div>}

              {!loading && filteredPets.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">
                  Nenhum pet encontrado.
                </div>
              )}

              {!loading && filteredPets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <div className="grid xl:grid-cols-[1fr_auto] gap-5 items-center">
                    <div className="grid md:grid-cols-4 gap-5">
                      <div className="flex gap-3">
                        <PawPrint className="text-green-600 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Pet</div>
                          <div className="font-black text-slate-900">{pet.name || "Sem nome"}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Tutor</div>
                        <div className="font-black text-slate-900">{tutorName(pet)}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Espécie/Raça</div>
                        <div className="font-black text-slate-900">{pet.species || "-"} {pet.breed ? `• ${pet.breed}` : ""}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Nascimento</div>
                        <div className="font-black text-slate-900 flex items-center gap-2">
                          <CalendarDays size={16} />
                          {pet.birth_date || "Não informado"}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="px-4 py-3 rounded-2xl bg-red-100 text-red-700 font-black hover:bg-red-200 transition flex items-center gap-2 xl:justify-self-end"
                    >
                      <Trash2 size={18} />
                      Excluir
                    </button>
                  </div>

                  {pet.notes && (
                    <div className="mt-5 bg-slate-50 rounded-2xl p-4 text-slate-600">
                      <strong>Observações:</strong> {pet.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
