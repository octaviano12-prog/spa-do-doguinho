import React, { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  User,
  Users,
  X
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyForm = { name: "", email: "", phone: "", address: "", cpf: "", city: "", state: "", notes: "" };

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadClientes() {
    setLoading(true); setError("");
    try { const data = await apiRequest("/customers"); setClientes(Array.isArray(data) ? data : []); }
    catch (err) { setError(err.message || "Erro ao carregar clientes."); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadClientes(); }, []);

  const filteredClientes = useMemo(() => clientes.filter((cliente) => `${cliente.name || ""} ${cliente.email || ""} ${cliente.phone || ""} ${cliente.address || ""} ${cliente.city || ""} ${cliente.notes || ""}`.toLowerCase().includes(query.toLowerCase())), [clientes, query]);

  function updateForm(field, value) { setForm((current) => ({ ...current, [field]: value })); }
  function startEdit(cliente) { setEditingId(cliente.id); setForm({ ...emptyForm, ...cliente }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function cancelEdit() { setEditingId(null); setForm(emptyForm); }

  async function handleSubmit(event) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (editingId) await apiRequest(`/customers/${editingId}`, { method: "PUT", body: JSON.stringify(form) });
      else await apiRequest("/customers", { method: "POST", body: JSON.stringify(form) });
      cancelEdit(); await loadClientes();
    } catch (err) { setError(err.message || "Erro ao salvar cliente."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Excluir este cliente?");
    if (!confirmed) return;
    setError("");
    try { await apiRequest(`/customers/${id}`, { method: "DELETE" }); await loadClientes(); }
    catch (err) { setError(err.message || "Erro ao excluir cliente."); }
  }

  function whatsappLink(phone) {
    const digits = String(phone || "").replace(/\D/g, "");
    if (!digits) return "#";
    return `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6"><div><span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><Users size={18} /> Base de tutores</span><h1 className="text-5xl font-black text-white mt-5">Clientes</h1><p className="text-green-100/80 mt-3 max-w-3xl">Cadastre, edite e mantenha contatos de tutores sempre atualizados.</p></div><button type="button" onClick={loadClientes} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button></div>
        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}
        <div className="grid md:grid-cols-3 gap-6">{[["Clientes", clientes.length, Users], ["Com e-mail", clientes.filter((item) => item.email).length, Mail], ["Com telefone", clientes.filter((item) => item.phone).length, Phone]].map(([label, value, Icon]) => <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl"><div className="flex items-center justify-between gap-4"><div><div className="text-slate-500 font-bold">{label}</div><div className="text-4xl font-black text-slate-900 mt-2">{value}</div></div><div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center"><Icon size={30} /></div></div></div>)}</div>
        <div className="grid xl:grid-cols-[470px_1fr] gap-6"><form onSubmit={handleSubmit} className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl"><div className="flex items-center gap-4 mb-7"><div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center">{editingId ? <Edit3 size={30} /> : <Plus size={30} />}</div><div><h2 className="text-2xl font-black text-slate-900">{editingId ? "Editar cliente" : "Novo cliente"}</h2><p className="text-slate-500">Cadastro completo de tutor.</p></div></div><div className="grid gap-4"><input placeholder="Nome completo" required value={form.name || ""} onChange={(e) => updateForm("name", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /><input placeholder="E-mail" type="email" value={form.email || ""} onChange={(e) => updateForm("email", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /><input placeholder="Telefone / WhatsApp" value={form.phone || ""} onChange={(e) => updateForm("phone", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /><input placeholder="CPF" value={form.cpf || ""} onChange={(e) => updateForm("cpf", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /><input placeholder="Endereço" value={form.address || ""} onChange={(e) => updateForm("address", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /><div className="grid grid-cols-2 gap-3"><input placeholder="Cidade" value={form.city || ""} onChange={(e) => updateForm("city", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /><input placeholder="UF" value={form.state || ""} onChange={(e) => updateForm("state", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /></div><textarea placeholder="Observações" value={form.notes || ""} onChange={(e) => updateForm("notes", e.target.value)} rows={3} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /><button disabled={saving} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"><Save size={20} /> {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar cliente"}</button>{editingId && <button type="button" onClick={cancelEdit} className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-black flex items-center justify-center gap-3"><X size={20} /> Cancelar edição</button>}</div></form>
          <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0"><label className="relative block mb-6"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente por nome, e-mail, telefone, endereço ou observação..." className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900" /></label><div className="space-y-4">{loading && <div className="text-slate-500 p-5">Carregando clientes...</div>}{!loading && filteredClientes.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhum cliente encontrado.</div>}{!loading && filteredClientes.map((cliente) => <div key={cliente.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden"><div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-5"><div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-5 min-w-0 flex-1"><div className="flex gap-3 min-w-0"><User className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Cliente</div><div className="font-black text-slate-900 break-words leading-snug">{cliente.name || "Sem nome"}</div></div></div><div className="flex gap-3 min-w-0"><Mail className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">E-mail</div><div className="font-black text-slate-900 break-all leading-snug">{cliente.email || "Não informado"}</div></div></div><div className="flex gap-3 min-w-0"><Phone className="text-green-600 shrink-0" /><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Telefone</div><div className="font-black text-slate-900 break-words leading-snug">{cliente.phone || "Não informado"}</div></div></div></div><div className="flex flex-wrap gap-3 2xl:justify-end shrink-0">{cliente.phone && <a href={whatsappLink(cliente.phone)} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-2xl bg-green-100 text-green-700 font-black hover:bg-green-200 transition flex items-center gap-2"><MessageCircle size={18} /> WhatsApp</a>}<button onClick={() => startEdit(cliente)} className="px-4 py-3 rounded-2xl bg-blue-100 text-blue-700 font-black hover:bg-blue-200 transition flex items-center gap-2"><Edit3 size={18} /> Editar</button><button onClick={() => handleDelete(cliente.id)} className="px-4 py-3 rounded-2xl bg-red-100 text-red-700 font-black hover:bg-red-200 transition flex items-center gap-2"><Trash2 size={18} /> Excluir</button></div></div>{(cliente.address || cliente.city || cliente.notes) && <div className="mt-5 bg-slate-50 rounded-2xl p-4 text-slate-600 break-words">{cliente.address && <div><strong>Endereço:</strong> {cliente.address}</div>}{(cliente.city || cliente.state) && <div><strong>Cidade:</strong> {cliente.city || ""}/{cliente.state || ""}</div>}{cliente.notes && <div><strong>Obs.:</strong> {cliente.notes}</div>}</div>}</div>)}</div></div></div>
      </div>
    </AdminLayout>
  );
}
