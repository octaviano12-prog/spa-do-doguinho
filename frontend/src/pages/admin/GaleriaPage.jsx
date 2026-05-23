import React, { useEffect, useMemo, useState } from "react";
import {
  Camera,
  CheckCircle,
  Eye,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyForm = {
  title: "",
  description: "",
  image_url: "",
  category: "Antes e depois",
  active: 1
};

export default function GaleriaPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadGallery() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/gallery");
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erro ao carregar galeria.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const text = `${item.title || ""} ${item.description || ""} ${item.category || ""}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [items, query]);

  const activeCount = useMemo(
    () => items.filter((item) => Number(item.active ?? 1) === 1).length,
    [items]
  );

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveItem(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await apiRequest("/gallery", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setForm(emptyForm);
      await loadGallery();
    } catch (err) {
      setError(err.message || "Erro ao salvar imagem.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id) {
    const confirmed = window.confirm("Deseja remover esta imagem da galeria?");
    if (!confirmed) return;

    setError("");

    try {
      await apiRequest(`/gallery/${id}`, {
        method: "DELETE"
      });

      await loadGallery();
    } catch (err) {
      setError(err.message || "Erro ao remover imagem.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black">
              <Camera size={18} />
              Conteúdo visual do site
            </span>

            <h1 className="text-5xl font-black text-white mt-5">Galeria</h1>

            <p className="text-green-100/80 mt-3 max-w-3xl">
              Cadastre imagens, resultados e registros do SPA para aparecerem na página pública de galeria.
            </p>
          </div>

          <button
            type="button"
            onClick={loadGallery}
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
            ["Total", items.length, ImageIcon],
            ["Ativas", activeCount, CheckCircle],
            ["Público", "Site", Eye]
          ].map(([label, value, Icon]) => (
            <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-slate-500 font-bold">{label}</div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{value}</div>
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
            onSubmit={saveItem}
            className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center">
                <Plus size={30} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Nova imagem</h2>
                <p className="text-slate-500">Use URL da imagem por enquanto.</p>
              </div>
            </div>

            <div className="grid gap-4">
              <input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                placeholder="Título"
                required
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <input
                value={form.image_url}
                onChange={(event) => updateForm("image_url", event.target.value)}
                placeholder="URL da imagem"
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              <select
                value={form.category}
                onChange={(event) => updateForm("category", event.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              >
                <option>Antes e depois</option>
                <option>Banho</option>
                <option>Tosa</option>
                <option>Spa</option>
                <option>Vacinas</option>
                <option>Ambiente</option>
              </select>

              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                rows={4}
                placeholder="Descrição"
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900"
              />

              {form.image_url && (
                <div
                  className="h-[180px] rounded-3xl bg-cover bg-center border border-slate-200"
                  style={{ backgroundImage: `url('${form.image_url}')` }}
                />
              )}

              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60"
              >
                <Sparkles size={20} />
                {saving ? "Salvando..." : "Publicar na galeria"}
              </button>
            </div>
          </form>

          <div className="glass rounded-[32px] p-6 border border-white/30 shadow-2xl">
            <div className="mb-6">
              <label className="relative block">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por título, categoria ou descrição..."
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 outline-none text-slate-900"
                />
              </label>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {loading && [1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-[260px] rounded-3xl bg-white/50 animate-pulse" />
              ))}

              {!loading && filteredItems.length === 0 && (
                <div className="md:col-span-2 xl:col-span-3 bg-white rounded-2xl p-8 text-center text-slate-500 border">
                  Nenhuma imagem cadastrada.
                </div>
              )}

              {!loading && filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                  {item.image_url ? (
                    <div
                      className="h-[190px] bg-cover bg-center"
                      style={{ backgroundImage: `url('${item.image_url}')` }}
                    />
                  ) : (
                    <div className="h-[190px] bg-gradient-to-br from-green-400 to-emerald-800 flex items-center justify-center text-white">
                      <ImageIcon size={74} />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="text-xs font-black uppercase text-green-600">
                      {item.category || "Galeria"}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      {item.title || "Imagem"}
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                      {item.description || "Sem descrição."}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-2xl font-black flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 size={18} />
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
