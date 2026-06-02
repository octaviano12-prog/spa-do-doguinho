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

const adminLoginBackground = "/images/hero-doguinho-card.webp";

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
    <div className="relative min-h-screen overflow-hidden bg-[#02120c] text-white">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[76%]">
        <img
          src={adminLoginBackground}
          alt=""
          className="h-full w-full object-cover object-center opacity-95"
          aria-hidden="true"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#02120c] via-[#02120c]/90 to-[#03140c]/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#02120c]/30 via-transparent to-[#02120c]/92" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(74,222,128,0.22),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(245,158,11,0.22),transparent_26%)]" />

      <div className="pointer-events-none absolute left-[37%] top-[9%] hidden w-[520px] rotate-[-1deg] rounded-[28px] border border-white/18 bg-white/76 p-5 text-slate-900 shadow-2xl shadow-black/35 backdrop-blur-xl xl:block">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase text-emerald-800">Dashboard</p>
            <p className="text-lg font-black">SPA do Doguinho</p>
          </div>
          <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">Hoje</div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {["28", "1.254", "R$ 48k", "312"].map((value, index) => (
            <div key={value} className="rounded-2xl bg-white/80 p-3 shadow-sm">
              <p className="text-[10px] font-black uppercase text-slate-500">
                {index === 0 && "Agenda"}
                {index === 1 && "Pets"}
                {index === 2 && "Caixa"}
                {index === 3 && "Serviços"}
              </p>
              <p className="mt-2 text-xl font-black text-emerald-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-[1fr_170px] gap-3">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <div className="mb-3 flex items-end gap-2">
              {[28, 44, 36, 58, 48, 72, 64, 82].map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className="block w-full rounded-t bg-emerald-600/80"
                  style={{ height }}
                />
              ))}
            </div>
            <p className="text-xs font-black text-slate-500">Faturamento mensal</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">Próximos</p>
            {[
              ["Buddy", "09:00"],
              ["Luna", "10:30"],
              ["Thor", "14:00"]
            ].map(([name, time]) => (
              <div key={name} className="mt-3 flex items-center justify-between gap-3 text-xs">
                <span className="font-black text-slate-800">{name}</span>
                <span className="text-slate-500">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-5 py-3 text-sm font-black text-green-50 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:bg-white/20 sm:text-base"
          >
            <ArrowLeft size={18} />
            Voltar ao site
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(430px,560px)] lg:gap-12 xl:gap-16">
          <section className="max-w-4xl">
            <div className="h-px w-full max-w-[640px] bg-gradient-to-r from-amber-300/80 via-white/20 to-transparent" />

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/12 px-4 py-2 text-sm font-black uppercase text-green-50 shadow-lg shadow-black/20 backdrop-blur-xl">
              <ShieldCheck size={17} className="text-green-300" />
              Painel administrativo seguro
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.04] text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
              Gestão completa do SPA do <span className="text-green-300">Doguinho</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-green-50 sm:text-2xl">
              Controle clientes, pets, agendamentos, estoque, vacinas, caixa, pagamentos e relatórios em um único sistema.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {featureCards.map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/22 bg-[#02160e]/68 p-5 shadow-2xl shadow-black/22 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-[#06351f]/78"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-300/12 text-green-200 ring-1 ring-green-200/20">
                    <CheckCircle size={24} />
                  </div>
                  <h2 className="text-xl font-black text-white">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-green-50/84">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[34px] border border-white bg-white/96 p-6 text-slate-900 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-8 lg:p-10">
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

        <footer className="grid gap-4 rounded-3xl border border-white/20 bg-[#031f13]/70 p-4 text-sm text-green-50/84 shadow-2xl shadow-black/20 backdrop-blur-xl md:grid-cols-4 md:p-5">
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
