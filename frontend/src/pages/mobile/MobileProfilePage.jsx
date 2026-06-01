import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarPlus, Loader2, LogOut, Mail, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
import MobileShell from "../../components/mobile/MobileShell";

const API_URL = "https://spadodoguinho.com.br/api";
const whatsappUrl = "https://wa.me/5518997493722?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20o%20SPA%20do%20Doguinho.";

async function getMe() {
  const token = localStorage.getItem("spa_customer_token");
  const response = await fetch(`${API_URL}/customer/me`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Não foi possível carregar o perfil.");
  return data;
}

export default function MobileProfilePage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem("spa_customer") || "null"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getMe();
        setCustomer(data);
        localStorage.setItem("spa_customer", JSON.stringify(data));
      } catch (err) {
        setError(err.message || "Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function logout() {
    localStorage.removeItem("spa_customer_token");
    localStorage.removeItem("spa_customer");
    navigate("/mobile/login", { replace: true });
  }

  if (loading) {
    return (
      <MobileShell title="Perfil" active="perfil" showBack={false}>
        <div className="flex min-h-[70dvh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-green-700" /></div>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="Perfil" active="perfil" showBack={false}>
      <section className="mx-3 mt-3 overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0d6b54] via-[#1b7f52] to-[#14532d] p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-lg ring-4 ring-white/10">
            <UserRound size={38} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/75">Minha conta</p>
            <h1 className="mt-1 truncate text-3xl font-black leading-tight">{customer?.name || "Cliente"}</h1>
            <p className="mt-1 text-sm text-white/85">Dados pessoais e acesso.</p>
          </div>
        </div>
      </section>

      <main className="space-y-5 px-4 py-5">
        {error && <p className="rounded-[24px] border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}

        <section className="space-y-3 rounded-[32px] border border-black/5 bg-white p-5 shadow-md">
          <h2 className="text-xl font-black text-[#183153]">Dados do cliente</h2>
          <ProfileRow icon={UserRound} label="Nome" value={customer?.name || "Não informado"} />
          <ProfileRow icon={Mail} label="E-mail" value={customer?.email || "Não informado"} />
          <ProfileRow icon={Phone} label="WhatsApp" value={customer?.phone || "Não informado"} />
          <ProfileRow icon={ShieldCheck} label="Status" value="Cliente ativo" />
        </section>

        <section className="grid gap-3">
          <Link to="/mobile/agendar" className="flex min-h-[58px] items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] font-black text-white shadow-md">
            <CalendarPlus size={20} />
            Novo agendamento
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex min-h-[58px] items-center justify-center gap-3 rounded-2xl bg-[#25D366] font-black text-white shadow-md">
            <MessageCircle size={20} />
            Falar no WhatsApp
          </a>
          <button type="button" onClick={logout} className="flex min-h-[58px] items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 font-black text-red-700">
            <LogOut size={20} />
            Sair da conta
          </button>
        </section>
      </main>
    </MobileShell>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#0d6b54]"><Icon size={20} /></div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase text-slate-400">{label}</p>
        <p className="truncate font-black text-[#183153]">{value}</p>
      </div>
    </div>
  );
}
