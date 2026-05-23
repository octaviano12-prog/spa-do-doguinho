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
    <div className="min-h-screen bg-[#06150d] relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e55,transparent_30%),radial-gradient(circle_at_85%_10%,#f59e0b33,transparent_28%),linear-gradient(135deg,#06150d,#042413_55%,#020617)]" />
      <div className="absolute right-[-140px] top-20 h-[480px] w-[480px] rounded-full bg-green-400/20 blur-[100px]" />
      <div className="absolute left-[-160px] bottom-10 h-[380px] w-[380px] rounded-full bg-orange-300/20 blur-[100px]" />

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block text-white">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-3 text-green-100 font-black hover:bg-white/15 transition"
          >
            <ArrowLeft size={18} />
            Voltar ao site
          </Link>

          <div className="mt-12">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 font-black">
              <ShieldCheck size={18} />
              Painel seguro
            </span>

            <h1 className="text-6xl font-black leading-tight mt-7">
              Gestão premium para o SPA do Doguinho.
            </h1>

            <p className="text-white/70 text-xl mt-6 max-w-xl leading-relaxed">
              Controle agenda, clientes, pets, serviços, pagamentos, estoque,
              vacinas e disponibilidade em um painel moderno.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-10 max-w-xl">
              {[
                "Agenda inteligente",
                "Pagamentos e PIX",
                "Histórico completo",
                "Controle de disponibilidade"
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center gap-3 font-bold"
                >
                  <CheckCircle className="text-green-300" size={20} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-xl rounded-[36px] shadow-2xl p-8 md:p-10 border border-white/60">
          <div className="flex flex-col items-center mb-9 text-center">
            <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-green-500 to-emerald-800 flex items-center justify-center shadow-xl shadow-green-900/25 mb-6">
              <PawPrint size={48} className="text-white" />
            </div>

            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-black text-sm mb-4">
              <Sparkles size={16} />
              Área administrativa
            </span>

            <h2 className="text-4xl font-black text-slate-900">
              Entrar no painel
            </h2>
            <p className="text-slate-500 mt-3">
              Acesse com seu e-mail e senha para gerenciar o sistema.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-black text-slate-700">
                E-mail
              </label>
              <div className="flex items-center bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm focus-within:border-green-500 transition">
                <Mail className="text-slate-400 mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none bg-transparent text-lg text-slate-900"
                  placeholder="Seu e-mail"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-black text-slate-700">
                Senha
              </label>
              <div className="flex items-center bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm focus-within:border-green-500 transition">
                <Lock className="text-slate-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none bg-transparent text-lg text-slate-900"
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-slate-400 hover:text-slate-700 transition"
                  aria-label="Mostrar ou ocultar senha"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl p-4 text-sm font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 transition-all text-white font-black text-xl py-4 rounded-2xl shadow-xl disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar no painel"}
            </button>

            <Link
              to="/"
              className="lg:hidden flex items-center justify-center gap-2 text-slate-500 hover:text-green-700 font-bold transition"
            >
              <ArrowLeft size={18} />
              Voltar ao site
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
