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

const heroImage = "/images/hero-doguinho-card.webp";

const featureCards = [
  ["Agenda inteligente", "Horários, confirmações e histórico em um painel só."],
  ["Gestão de pets", "Cadastros, vacinas e cuidados sempre organizados."],
  ["Financeiro e PIX", "Controle de recebimentos, caixa e pagamentos."],
  ["Painel seguro", "Acesso restrito para administrar com tranquilidade."]
];

const trustItems = [
  "Ambiente seguro",
  "Criptografia SSL",
  "Acesso restrito",
  "Backup automático"
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
    <div className="relative min-h-screen overflow-hidden bg-[#06170f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(68,210,135,0.28),transparent_28%),radial-gradient(circle_at_90%_12%,rgba(246,196,94,0.24),transparent_28%),linear-gradient(135deg,#02110b_0%,#08301f_52%,#04120c_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/35 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/8 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-5">
          <Link to="/" className="group flex items-center gap-3 sm:gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-green-200 text-emerald-900 shadow-xl shadow-black/20 transition group-hover:scale-105 sm:h-18 sm:w-18">
              <PawPrint size={36} />
            </div>
            <div>
              <p className="text-xl font-black leading-none sm:text-2xl">SPA do</p>
              <p className="text-3xl font-black leading-none sm:text-4xl">Doguinho</p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-amber-300 sm:text-sm">
                Banho • Tosa • SPA Pet
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/12 px-5 py-3 text-sm font-black text-green-50 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:bg-white/20 sm:text-base"
          >
            <ArrowLeft size={18} />
            Voltar ao site
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-6 py-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,520px)] xl:gap-8">
          <section className="relative min-h-[620px] overflow-hidden rounded-[36px] border border-white/12 bg-[#071e14] shadow-2xl shadow-black/35">
            <img
              src={heroImage}
              alt="SPA do Doguinho"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-82"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#03140c]/96 via-[#032015]/84 to-[#032015]/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03140c]/88 via-transparent to-transparent" />

            <div className="relative flex min-h-[620px] flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-wide text-green-50 shadow-lg shadow-black/20 backdrop-blur-xl sm:text-sm">
                  <ShieldCheck size={16} className="text-green-300" />
                  Área administrativa
                </div>

                <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.03] text-white drop-shadow-2xl sm:text-6xl xl:text-7xl">
                  Gestão premium para o SPA do{" "}
                  <span className="text-green-300">Doguinho.</span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-green-50/92 sm:text-xl xl:text-2xl">
                  Controle clientes, pets, agendamentos, serviços, pagamentos,
                  estoque, vacinas e disponibilidade em um painel moderno.
                </p>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {featureCards.map(([title, description]) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/16 bg-white/10 p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-300/14 text-green-200 ring-1 ring-green-200/20">
                      <CheckCircle size={24} />
                    </div>
                    <h2 className="text-lg font-black text-white">{title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-green-50/78">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[36px] bg-white p-6 text-slate-900 shadow-2xl shadow-black/35 sm:p-8 lg:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-100 to-green-200 text-emerald-800 shadow-xl shadow-emerald-900/10">
                <ShieldCheck size={48} />
              </div>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-800">
                <Sparkles size={15} />
                Área administrativa
              </div>
              <h2 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">
                Entrar no Sistema
              </h2>
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

            <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {trustItems.map((item) => (
                  <div key={item} className="text-center text-xs font-black text-emerald-900">
                    <ShieldCheck className="mx-auto mb-2 text-emerald-700" size={24} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-4 pb-3 text-center text-sm text-green-50/70 sm:justify-between">
          <span>© 2026 SPA do Doguinho. Todos os direitos reservados.</span>
          <span>Versão 2.0.0</span>
        </footer>
      </div>
    </div>
  );
}
