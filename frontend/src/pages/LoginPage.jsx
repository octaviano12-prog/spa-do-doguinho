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
  ["Agenda inteligente", "Agendamentos online e controle completo."],
  ["Gestão de pets", "Histórico, vacinas e cuidados em um só lugar."],
  ["Financeiro e PIX", "Controle de caixa, pagamentos e recebimentos."],
  ["Estoque inteligente", "Produtos, insumos e alertas de estoque."],
  ["Vacinas e protocolos", "Lembretes, carteirinha e acompanhamento."],
  ["Dashboard gerencial", "Relatórios e indicadores em tempo real."]
];

const trustItems = [
  ["Sistema 100% seguro", "Dados protegidos com criptografia SSL."],
  ["Acesso de qualquer lugar", "Entre no painel com segurança onde estiver."],
  ["Backup automático", "Informações sempre salvas e disponíveis."],
  ["Suporte especializado", "Equipe pronta para ajudar quando precisar."]
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
        className="absolute inset-0 scale-105 bg-cover bg-center opacity-85 blur-[1px]"
        style={{ backgroundImage: `url(${adminLoginBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#02120c]/95 via-[#032717]/80 to-[#071707]/58" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(74,222,128,0.23),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(245,158,11,0.18),transparent_24%),linear-gradient(180deg,rgba(2,19,13,0.12),rgba(2,19,13,0.9))]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1760px] flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-white to-green-200 text-emerald-900 shadow-2xl shadow-black/25 transition group-hover:scale-105">
              <PawPrint size={42} />
            </div>
            <div>
              <p className="text-2xl font-black leading-none sm:text-3xl">SPA do</p>
              <p className="text-3xl font-black leading-none sm:text-5xl">Doguinho</p>
              <p className="mt-2 text-xs font-black uppercase text-amber-300 sm:text-base">Banho • Tosa • SPA Pet</p>
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
              Gestão completa do SPA do <span className="text-green-300">Doguinho</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-green-50/90 sm:text-2xl">
              Controle clientes, pets, agendamentos, estoque, vacinas, caixa, pagamentos e relatórios em um único sistema.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {featureCards.map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/18 bg-[#031f13]/72 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-[#06351f]/82"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-300/12 text-green-200 ring-1 ring-green-200/20">
                    <CheckCircle size={24} />
                  </div>
                  <h2 className="text-xl font-black text-white">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-green-50/78">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[34px] border border-white bg-white p-6 text-slate-900 shadow-2xl shadow-black/35 sm:p-8 lg:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-emerald-800 shadow-xl shadow-emerald-900/10">
                <ShieldCheck size={48} />
              </div>
              <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-emerald-800">Área administrativa</p>
              <h2 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">Entrar no Sistema</h2>
              <p className="mx-auto mt-4 max-w-sm text-lg leading-relaxed text-slate-600">
                Acesse o painel administrativo para gerenciar o SPA do Doguinho.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block font-black text-slate-800">E-mail</label>
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
                <label className="mb-2 block font-black text-slate-800">Senha</label>
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
                  className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-center text-xs font-black text-emerald-900 shadow-sm"
                >
                  <ShieldCheck className="mx-auto mb-2 text-emerald-700" size={24} />
                  {item}
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="grid gap-4 rounded-3xl border border-white/18 bg-[#031f13]/72 p-4 text-sm text-green-50/82 shadow-2xl shadow-black/20 backdrop-blur-xl md:grid-cols-4 md:p-5">
          {trustItems.map(([title, description]) => (
            <div key={title} className="flex gap-3 md:border-r md:border-white/10 md:last:border-r-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-300/12 text-green-200 ring-1 ring-green-200/20">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="font-black text-white">{title}</p>
                <p className="mt-1 leading-relaxed text-green-50/72">{description}</p>
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
