import React, { useState } from "react";
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
import { publicPhotos } from "../data/publicPhotos";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbf7ef] p-6 text-[#10231a]">
      <div className="absolute inset-x-0 top-0 h-[58%] bg-[#f5efe4]" />
      <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-emerald-200/45 blur-3xl" />
      <div className="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-yellow-200/55 blur-3xl" />

      <div className="relative grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div className="hidden lg:block">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-3 font-black text-emerald-900 shadow-sm transition hover:border-emerald-700"
          >
            <ArrowLeft size={18} />
            Voltar ao site
          </Link>

          <div className="mt-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 font-black text-emerald-900">
              <ShieldCheck size={18} />
              Painel seguro
            </span>

            <h1 className="mt-7 max-w-3xl text-6xl font-black leading-[.96]">
              Gestão premium para o SPA do Doguinho.
            </h1>

            <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-600">
              Controle agenda, clientes, pets, serviços, pagamentos, estoque, vacinas e disponibilidade em um painel moderno.
            </p>

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
              {[
                "Agenda inteligente",
                "Pagamentos e PIX",
                "Histórico completo",
                "Controle de disponibilidade"
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 font-bold shadow-sm ring-1 ring-black/5"
                >
                  <CheckCircle className="text-[#0f7a3b]" size={20} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[.8fr_1fr] xl:items-stretch">
          <div className="hidden overflow-hidden rounded-[36px] bg-white shadow-2xl ring-1 ring-black/5 xl:block">
            <img src={publicPhotos.essentials} alt="Gestão SPA do Doguinho" className="h-full min-h-[620px] w-full object-cover" />
          </div>

          <div className="mx-auto w-full max-w-md rounded-[36px] border border-white/80 bg-white p-8 shadow-2xl md:p-10">
            <div className="mb-9 flex flex-col items-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[30px] bg-[#0f7a3b] shadow-xl shadow-emerald-900/20">
                <PawPrint size={48} className="text-white" />
              </div>

              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-900">
                <Sparkles size={16} />
                Área administrativa
              </span>

              <h2 className="text-4xl font-black">
                Entrar no painel
              </h2>
              <p className="mt-3 text-slate-500">
                Acesse com seu e-mail e senha para gerenciar o sistema.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block font-black text-slate-700">
                  E-mail
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition focus-within:border-emerald-700">
                  <Mail className="mr-3 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-lg text-slate-900 outline-none"
                    placeholder="Seu e-mail"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-black text-slate-700">
                  Senha
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition focus-within:border-emerald-700">
                  <Lock className="mr-3 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-lg text-slate-900 outline-none"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-slate-400 transition hover:text-slate-700"
                    aria-label="Mostrar ou ocultar senha"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#0f7a3b] py-4 text-xl font-black text-white shadow-xl transition hover:bg-[#0b6631] disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar no painel"}
              </button>

              <Link
                to="/"
                className="flex items-center justify-center gap-2 font-bold text-slate-500 transition hover:text-[#0f7a3b] lg:hidden"
              >
                <ArrowLeft size={18} />
                Voltar ao site
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
