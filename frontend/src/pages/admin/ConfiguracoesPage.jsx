import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle,
  Clock,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { apiRequest } from "../../lib/api";

const emptyProfile = {
  site_name: "SPA do Doguinho",
  tagline: "Estética Animal Premium",
  contact_phone: "+55 18 99749-3722",
  contact_whatsapp: "5518997493722",
  contact_email: "contato@spadodoguinho.com.br",
  contact_address: "Rua Marco Antonio M.J Franco Nº 606 - Sud Mennucci/SP",
  instagram: "",
  facebook: "",
  primary_color: "#16a34a",
  secondary_color: "#f59e0b",
  logo_url: "",
  hero_image_url: "",
  opening_hours: "Terça a sexta das 08:00 às 18:00 • Sábado das 08:00 às 14:00"
};

export default function ConfiguracoesPage() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentProfile = useMemo(() => profiles[0] || null, [profiles]);

  async function loadSettings() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiRequest("/siteProfile");
      const list = Array.isArray(data) ? data : [];
      setProfiles(list);

      if (list[0]) {
        setForm({ ...emptyProfile, ...list[0] });
      }
    } catch (err) {
      setError(err.message || "Erro ao carregar configurações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveSettings(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (currentProfile?.id) {
        await apiRequest(`/siteProfile/${currentProfile.id}`, {
          method: "PUT",
          body: JSON.stringify(form)
        });
      } else {
        await apiRequest("/siteProfile", {
          method: "POST",
          body: JSON.stringify(form)
        });
      }

      setSuccess("Configurações salvas com sucesso.");
      await loadSettings();
    } catch (err) {
      setError(err.message || "Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 text-green-100 font-black">
              <Settings size={18} />
              Personalização do site
            </span>

            <h1 className="text-5xl font-black text-white mt-5">Configurações</h1>

            <p className="text-green-100/80 mt-3 max-w-3xl">
              Ajuste identidade visual, contatos, endereço, horários, redes sociais e informações exibidas no site público.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSettings}
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

        {success && (
          <div className="bg-green-500/15 border border-green-400/30 text-green-100 rounded-3xl p-5 font-bold flex items-center gap-3">
            <CheckCircle />
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6">
          {[
            ["Site", form.site_name, Globe],
            ["WhatsApp", form.contact_whatsapp, MessageCircle],
            ["Endereço", "Sud Mennucci/SP", MapPin],
            ["Status", loading ? "Carregando" : "Ativo", ShieldCheck]
          ].map(([label, value, Icon]) => (
            <div key={label} className="glass rounded-[30px] p-6 border border-white/30 shadow-2xl">
              <Icon className="text-green-700 mb-4" size={34} />
              <div className="text-slate-500 font-bold">{label}</div>
              <div className="text-xl font-black text-slate-900 mt-2 truncate">{value}</div>
            </div>
          ))}
        </div>

        <form onSubmit={saveSettings} className="grid xl:grid-cols-[1fr_420px] gap-6">
          <div className="space-y-6">
            <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl">
              <div className="flex items-center gap-4 mb-7">
                <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center">
                  <Building2 size={30} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Identidade</h2>
                  <p className="text-slate-500">Nome, slogan e apresentação do negócio.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input value={form.site_name || ""} onChange={(e) => updateForm("site_name", e.target.value)} placeholder="Nome do site" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
                <input value={form.tagline || ""} onChange={(e) => updateForm("tagline", e.target.value)} placeholder="Slogan" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
                <input value={form.logo_url || ""} onChange={(e) => updateForm("logo_url", e.target.value)} placeholder="URL do logo" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
                <input value={form.hero_image_url || ""} onChange={(e) => updateForm("hero_image_url", e.target.value)} placeholder="URL imagem hero" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              </div>
            </div>

            <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl">
              <div className="flex items-center gap-4 mb-7">
                <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center">
                  <Phone size={30} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Contato</h2>
                  <p className="text-slate-500">Dados usados em páginas, footer e WhatsApp.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input value={form.contact_phone || ""} onChange={(e) => updateForm("contact_phone", e.target.value)} placeholder="Telefone" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
                <input value={form.contact_whatsapp || ""} onChange={(e) => updateForm("contact_whatsapp", e.target.value)} placeholder="WhatsApp com DDI" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
                <input value={form.contact_email || ""} onChange={(e) => updateForm("contact_email", e.target.value)} placeholder="E-mail" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
                <input value={form.contact_address || ""} onChange={(e) => updateForm("contact_address", e.target.value)} placeholder="Endereço" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
                <input value={form.instagram || ""} onChange={(e) => updateForm("instagram", e.target.value)} placeholder="Instagram" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
                <input value={form.facebook || ""} onChange={(e) => updateForm("facebook", e.target.value)} placeholder="Facebook" className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
              </div>
            </div>

            <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl">
              <div className="flex items-center gap-4 mb-7">
                <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center">
                  <Clock size={30} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Funcionamento</h2>
                  <p className="text-slate-500">Texto exibido para clientes.</p>
                </div>
              </div>

              <textarea value={form.opening_hours || ""} onChange={(e) => updateForm("opening_hours", e.target.value)} rows={4} placeholder="Horários de funcionamento" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-[32px] p-8 border border-white/30 shadow-2xl sticky top-6">
              <div className="flex items-center gap-4 mb-7">
                <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center">
                  <Palette size={30} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Prévia</h2>
                  <p className="text-slate-500">Visual do site.</p>
                </div>
              </div>

              <div className="rounded-[30px] bg-[#06150d] p-6 text-white overflow-hidden relative">
                <div className="absolute right-[-50px] top-[-50px] w-40 h-40 rounded-full bg-green-500/30 blur-2xl" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center mb-5">
                    {form.logo_url ? <ImageIcon /> : <Globe />}
                  </div>
                  <h3 className="text-3xl font-black">{form.site_name}</h3>
                  <p className="text-green-100/80 mt-2">{form.tagline}</p>
                  <div className="mt-6 bg-white/10 rounded-2xl p-4 text-sm">
                    <div className="flex items-center gap-2"><Phone size={16} /> {form.contact_phone}</div>
                    <div className="flex items-center gap-2 mt-2"><Mail size={16} /> {form.contact_email}</div>
                    <div className="flex items-center gap-2 mt-2"><MapPin size={16} /> {form.contact_address}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <label className="grid gap-2 text-slate-700 font-bold">
                  Cor principal
                  <input type="color" value={form.primary_color || "#16a34a"} onChange={(e) => updateForm("primary_color", e.target.value)} className="h-14 w-full rounded-2xl border border-slate-200" />
                </label>
                <label className="grid gap-2 text-slate-700 font-bold">
                  Cor secundária
                  <input type="color" value={form.secondary_color || "#f59e0b"} onChange={(e) => updateForm("secondary_color", e.target.value)} className="h-14 w-full rounded-2xl border border-slate-200" />
                </label>
              </div>

              <button disabled={saving} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition disabled:opacity-60">
                <Save size={20} />
                {saving ? "Salvando..." : "Salvar configurações"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
