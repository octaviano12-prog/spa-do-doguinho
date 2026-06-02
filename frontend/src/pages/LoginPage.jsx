import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  PawPrint,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { apiRequest } from "../lib/api";

const adminLoginBackground =
  "data:image/jpeg;base64,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";

const featureCards = [
  {
    title: "Agenda inteligente",
    description: "Agendamentos online e controle completo."
  },
  {
    title: "Gestão de pets",
    description: "Histórico, vacinas e cuidados em um só lugar."
  },
  {
    title: "Financeiro e PIX",
    description: "Controle de caixa, pagamentos e recebimentos."
  },
  {
    title: "Estoque inteligente",
    description: "Produtos, insumos e alertas de estoque."
  },
  {
    title: "Vacinas e protocolos",
    description: "Lembretes, carteirinha e acompanhamento."
  },
  {
    title: "Dashboard gerencial",
    description: "Relatórios e indicadores em tempo real."
  }
];

const trustItems = [
  {
    title: "Sistema 100% seguro",
    description: "Dados protegidos com criptografia SSL."
  },
  {
    title: "Acesso de qualquer lugar",
    description: "Entre no painel com segurança onde estiver."
  },
  {
    title: "Backup automático",
    description: "Informações sempre salvas e disponíveis."
  },
  {
    title: "Suporte especializado",
    description: "Equipe pronta para ajudar quando precisar."
  }
];

const secureBadges = [
  "Ambiente seguro",
  "Criptografia SSL",
  "Acesso restrito",
  "Apenas autorizados"
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberAccess, setRememberAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("spa_admin_email");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberAccess(true);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (rememberAccess) {
        localStorage.setItem("spa_admin_email", email);
      } else {
        localStorage.removeItem("spa_admin_email");
      }

      localStorage.setItem("spa_token", data.token);
      localStorage.setItem("spa_user", JSON.stringify(data.user));
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.message || "Erro ao entrar no sistema.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02130d] text-white">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center opacity-90 blur-[1px]"
        style={{ backgroundImage: `url(${adminLoginBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#02120c]/95 via-[#032717]/82 to-[#051209]/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(74,222,128,0.23),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(245,158,11,0.25),transparent_24%),linear-gradient(180deg,rgba(2,19,13,0.12),rgba(2,19,13,0.9))]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1760px] flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-white to-green-200 text-emerald-900 shadow-2xl shadow-black/25 transition group-hover:scale-105">
              <PawPrint size={42} />
            </div>
            <div>
              <p className="text-2xl font-black leading-none sm:text-3xl">
                SPA do
              </p>
              <p className="text-3xl font-black leading-none sm:text-5xl">
                Doguinho
              </p>
              <p className="mt-2 text-xs font-black uppercase text-amber-300 sm:text-base">
                Banho • Tosa • SPA Pet
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-green-50 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:bg-white/15 sm:text-base"
          >
            <ArrowLeft size={18} />
            Voltar ao site
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(430px,560px)] lg:gap-12 xl:gap-16">
          <section className="max-w-4xl">
            <div className="h-px w-full max-w-[640px] bg-gradient-to-r from-amber-300/70 via-white/20 to-transparent" />

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black uppercase text-green-100 backdrop-blur-xl">
              <ShieldCheck size={17} className="text-green-300" />
              Painel administrativo seguro
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.04] text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
              Gestão completa do SPA do{" "}
              <span className="text-green-300">Doguinho</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-green-50/88 sm:text-2xl">
              Controle clientes, pets, agendamentos, estoque, vacinas, caixa,
              pagamentos e relatórios em um único sistema.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/14 bg-[#042817]/56 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-[#06351f]/70"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-300/12 text-green-200 ring-1 ring-green-200/20">
                    <CheckCircle size={24} />
                  </div>
                  <h2 className="text-xl font-black text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-green-50/76">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[34px] border border-white/70 bg-white/94 p-6 text-slate-900 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-emerald-800 shadow-xl shadow-emerald-900/10">
                <ShieldCheck size={48} />
              </div>
              <p className="mt-7 text-sm font-black uppercase text-emerald-800">
                Área administrativa
              </p>
              <h2 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">
                Entrar no Sistema
              </h2>
              <p className="mx-auto mt-4 max-w-sm text-lg leading-relaxed text-slate-600">
                Acesse o painel administrativo para gerenciar o SPA do Doguinho.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block font-black text-slate-800">
                  E-mail
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                  <Mail className="mr-3 text-slate-400" size={24} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="Digite seu e-mail"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-black text-slate-800">
                  Senha
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                  <Lock className="mr-3 text-slate-400" size={24} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Mostrar ou ocultar senha"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberAccess}
                  onChange={(e) => setRememberAccess(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 accent-emerald-700"
                />
                <span className="font-semibold">Lembrar meu acesso</span>
              </label>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-green-600 px-6 py-5 text-lg font-black text-white shadow-xl shadow-emerald-900/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-900/35 disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl"
              >
                <Lock size={22} />
                {loading ? "Entrando..." : "Acessar Painel Administrativo"}
              </button>
            </form>

            <div className="mt-9 flex items-center gap-4 text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-black uppercase">Ambiente seguro</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {secureBadges.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 text-center text-xs font-black text-emerald-900"
                >
                  <ShieldCheck className="mx-auto mb-2 text-emerald-700" size={24} />
                  {item}
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="grid gap-4 rounded-3xl border border-white/12 bg-[#052817]/64 p-4 text-sm text-green-50/80 shadow-2xl shadow-black/20 backdrop-blur-xl md:grid-cols-4 md:p-5">
          {trustItems.map((item) => (
            <div key={item.title} className="flex gap-3 md:border-r md:border-white/10 md:last:border-r-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-300/12 text-green-200 ring-1 ring-green-200/20">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="font-black text-white">{item.title}</p>
                <p className="mt-1 leading-relaxed text-green-50/72">{item.description}</p>
              </div>
            </div>
          ))}
        </footer>

        <div className="flex flex-wrap items-center justify-center gap-5 py-6 text-center text-sm text-green-50/65 sm:justify-between">
          <span>© 2026 SPA do Doguinho. Todos os direitos reservados.</span>
          <span>Versão 2.0.0</span>
        </div>
      </div>
    </div>
  );
}
