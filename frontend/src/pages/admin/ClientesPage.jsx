import React, { useEffect, useMemo, useState } from "react";
import {
  Mail,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
  Users
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: ""
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadClientes() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/customers");
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClientes();
  }, []);

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const text = `${cliente.name || ""} ${cliente.email || ""} ${cliente.phone || ""} ${cliente.address || ""}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [clientes, query]);

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await apiRequest("/customers", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setForm(emptyForm);
      await loadClientes();
    } catch (err) {
      setError(err.message || "Erro ao cadastrar cliente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Excluir este cliente?");
    if (!confirmed) return;

    setError("");

    try {
      await apiRequest(`/customers/${id}`, {
        method: "DELETE"
      });

      await loadClientes();
    } catch (err) {
      setError(err.message || "Erro ao excluir cliente.");
    }
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black">
              <Users size={18} />
              Base de tutores
            </span>

            <h1 className="text-5xl font-black text-white mt-5">Clientes</h1>

            <p className="text-green-100/80 mt-3 max-w-3xl">
              Cadastre tutores, mantenha contatos atualizados e acompanhe o relacionamento com cada cliente.
            </p>
          </div>

          <button
            type="button"
            onClick={loadClientes}
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

        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Clientes", clientes.length, Users],
            ["Com e-mail", clientes.filter((item) => item.email).length, Mail],
            ["Com telefone", clientes.filter((item) => item.phone).length, Phone]
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
                <h2 className="text-2xl font-black text-slate-900">Novo cliente</h2>
                <p className="text-slate-500">Cadastro rápido de tutor.</p>
              </div>
            </div>

            <div className="grid gap-4">
              <input
                placeholder="Nome completo"
                required
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <input
                placeholder="E-mail"
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <input
                placeholder="Telefone / WhatsApp"
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <input
                placeholder="Endereço"
                value={form.address}
                onChange={(event) => updateForm("address", event.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <button
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"
              >
                <Plus size={20} />
                {saving ? "Salvando..." : "Adicionar cliente"}
              </button>
            </div>
          </form>

          <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl">
            <label className="relative block mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar cliente por nome, e-mail, telefone ou endereço..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900"
              />
            </label>

            <div className="space-y-4">
              {loading && <div className="text-slate-500 p-5">Carregando clientes...</div>}

              {!loading && filteredClientes.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">
                  Nenhum cliente encontrado.
                </div>
              )}

              {!loading && filteredClientes.map((cliente) => (
                <div key={cliente.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <div className="grid xl:grid-cols-[1fr_auto] gap-5 items-center">
                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="flex gap-3">
                        <User className="text-green-600 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Cliente</div>
                          <div className="font-black text-slate-900">{cliente.name || "Sem nome"}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Mail className="text-green-600 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">E-mail</div>
                          <div className="font-black text-slate-900">{cliente.email || "Não informado"}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone className="text-green-600 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Telefone</div>
                          <div className="font-black text-slate-900">{cliente.phone || "Não informado"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 xl:justify-end">
                      {cliente.phone && (
                        <a
                          href={`https://wa.me/55${String(cliente.phone).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-3 rounded-2xl bg-green-100 text-green-700 font-black hover:bg-green-200 transition flex items-center gap-2"
                        >
                          <MessageCircle size={18} />
                          WhatsApp
                        </a>
                      )}

                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="px-4 py-3 rounded-2xl bg-red-100 text-red-700 font-black hover:bg-red-200 transition flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Excluir
                      </button>
                    </div>
                  </div>

                  {cliente.address && (
                    <div className="mt-5 bg-slate-50 rounded-2xl p-4 text-slate-600">
                      <strong>Endereço:</strong> {cliente.address}
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
