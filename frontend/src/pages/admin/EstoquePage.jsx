import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  DollarSign,
  Filter,
  Package,
  Plus,
  RefreshCw,
  Save,
  Search,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyForm = { name: "", category: "Higiene", quantity: "", min_quantity: "", sale_price: "", supplier: "" };

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function toNumber(value) {
  return Number(String(value || 0).replace(",", ".")) || 0;
}

export default function EstoquePage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadStock() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/stock").catch(() => apiRequest("/stock_items"));
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar estoque.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStock(); }, []);

  const summary = useMemo(() => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const lowStock = items.filter((item) => Number(item.quantity || 0) <= Number(item.min_quantity || item.minimum_quantity || 5)).length;
    const value = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.sale_price || item.price || 0), 0);
    return { totalItems, totalQuantity, lowStock, value };
  }, [items]);

  const filteredItems = useMemo(() => items.filter((item) => {
    const search = `${item.name || ""} ${item.category || ""} ${item.supplier || ""}`.toLowerCase();
    const quantity = Number(item.quantity || 0);
    const min = Number(item.min_quantity || item.minimum_quantity || 5);
    return search.includes(query.toLowerCase()) && (filter === "all" || (filter === "low" && quantity <= min) || (filter === "ok" && quantity > min));
  }), [items, query, filter]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      quantity: toNumber(form.quantity),
      min_quantity: toNumber(form.min_quantity),
      minimum_quantity: toNumber(form.min_quantity),
      sale_price: toNumber(form.sale_price),
      price: toNumber(form.sale_price),
      active: 1
    };
    try {
      await apiRequest("/stock", { method: "POST", body: JSON.stringify(payload) }).catch(() => apiRequest("/stock_items", { method: "POST", body: JSON.stringify(payload) }));
      setForm(emptyForm);
      await loadStock();
    } catch (err) {
      setError(err.message || "Erro ao salvar produto.");
    } finally {
      setSaving(false);
    }
  }

  async function moveStock(item, type) {
    const raw = window.prompt(type === "in" ? "Quantidade de entrada:" : "Quantidade de saída:", "1");
    if (!raw) return;
    const amount = toNumber(raw);
    if (amount <= 0) return;
    const current = Number(item.quantity || 0);
    const quantity = type === "in" ? current + amount : Math.max(0, current - amount);
    try {
      await apiRequest(`/stock/${item.id}`, { method: "PUT", body: JSON.stringify({ quantity }) }).catch(() => apiRequest(`/stock_items/${item.id}`, { method: "PUT", body: JSON.stringify({ quantity }) }));
      await loadStock();
    } catch (err) {
      setError(err.message || "Erro ao movimentar estoque.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div><span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black"><Boxes size={18} /> Controle de produtos</span><h1 className="text-5xl font-black text-white mt-5">Estoque</h1><p className="text-green-100/80 mt-3 max-w-3xl">Controle produtos, quantidades, estoque mínimo e valor estimado.</p></div>
          <button type="button" onClick={loadStock} className="bg-white/15 hover:bg-white/25 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/20 transition"><RefreshCw size={20} /> Atualizar</button>
        </div>
        {error && <div className="bg-red-500/15 border border-red-400/30 text-red-100 rounded-3xl p-5 font-bold">{error}</div>}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">{[["Produtos", summary.totalItems, Package], ["Qtd. total", summary.totalQuantity, Boxes], ["Estoque baixo", summary.lowStock, AlertTriangle], ["Valor estimado", formatCurrency(summary.value), DollarSign]].map(([label, value, Icon]) => <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl min-w-0"><div className="flex items-center justify-between gap-4"><div className="min-w-0"><div className="text-slate-500 font-bold">{label}</div><div className="text-2xl 2xl:text-3xl font-black text-slate-900 mt-2 break-words">{value}</div></div><div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center shrink-0"><Icon size={30} /></div></div></div>)}</div>

        <div className="grid xl:grid-cols-[390px_minmax(0,1fr)] gap-6 items-start">
          <form onSubmit={handleCreate} className="glass rounded-[32px] p-7 border border-white/30 shadow-2xl">
            <div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center"><Plus size={30} /></div><div><h2 className="text-2xl font-black text-slate-900">Novo produto</h2><p className="text-slate-500">Cadastro rápido de estoque.</p></div></div>
            <div className="grid gap-4">
              <input required value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Nome do produto" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"><option>Higiene</option><option>Perfume</option><option>Vacina</option><option>Acessório</option><option>Medicamento</option><option>Outro</option></select>
              <div className="grid grid-cols-2 gap-3"><input value={form.quantity} onChange={(e) => updateForm("quantity", e.target.value)} placeholder="Qtd." className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /><input value={form.min_quantity} onChange={(e) => updateForm("min_quantity", e.target.value)} placeholder="Mínimo" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" /></div>
              <input value={form.sale_price} onChange={(e) => updateForm("sale_price", e.target.value)} placeholder="Preço de venda" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              <input value={form.supplier} onChange={(e) => updateForm("supplier", e.target.value)} placeholder="Fornecedor" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              <button disabled={saving} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"><Save size={20} /> {saving ? "Salvando..." : "Salvar produto"}</button>
            </div>
          </form>

          <section className="space-y-6 min-w-0">
            <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0"><div className="grid lg:grid-cols-[1fr_auto] gap-4"><label className="relative min-w-0"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto, categoria ou fornecedor..." className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900" /></label><label className="relative min-w-0"><Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><select value={filter} onChange={(event) => setFilter(event.target.value)} className="w-full lg:w-[230px] bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900"><option value="all">Todos</option><option value="low">Estoque baixo</option><option value="ok">Estoque OK</option></select></label></div></div>
            <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl min-w-0"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"><h2 className="text-2xl font-black text-slate-900">Itens em estoque</h2><span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-black text-sm w-fit">{filteredItems.length} itens</span></div><div className="space-y-4">{loading && <div className="text-slate-500 p-5">Carregando estoque...</div>}{!loading && filteredItems.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border">Nenhum produto encontrado.</div>}{!loading && filteredItems.map((item) => { const quantity = Number(item.quantity || 0); const min = Number(item.min_quantity || item.minimum_quantity || 5); const isLow = quantity <= min; return <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden"><div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-5"><div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5 min-w-0 flex-1"><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Produto</div><div className="font-black text-slate-900 break-words leading-snug">{item.name || "Produto sem nome"}</div><div className="text-slate-500 text-sm mt-1 break-words">{item.category || "Sem categoria"}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Quantidade</div><div className="text-2xl font-black text-slate-900 break-words">{quantity}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Mínimo</div><div className="font-black text-slate-900 break-words">{min}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Preço</div><div className="font-black text-green-700 break-words">{formatCurrency(item.sale_price || item.price)}</div></div><div className="min-w-0"><div className="text-xs text-slate-400 font-bold uppercase">Status</div><div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full font-black text-sm ${isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{isLow ? <TrendingDown size={16} /> : <TrendingUp size={16} />}{isLow ? "Baixo" : "OK"}</div></div></div><div className="flex flex-wrap gap-3 2xl:justify-end shrink-0"><button onClick={() => moveStock(item, "in")} className="px-4 py-3 rounded-2xl bg-green-100 text-green-700 font-black hover:bg-green-200 transition">Entrada</button><button onClick={() => moveStock(item, "out")} className="px-4 py-3 rounded-2xl bg-yellow-100 text-yellow-800 font-black hover:bg-yellow-200 transition">Saída</button></div></div></div>; })}</div></div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
