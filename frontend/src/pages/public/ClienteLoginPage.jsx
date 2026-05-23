import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  PawPrint,
  Phone,
  User
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_URL = "https://spadodoguinho.com.br/api";

export default function ClienteLoginPage() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "login" ? "/auth/customer-login" : "/auth/customer-register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : form;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao acessar área do cliente.");
      }

      localStorage.setItem("spa_customer_token", data.token);
      localStorage.setItem("spa_customer", JSON.stringify(data.customer));
      window.location.href = "/cliente";
    } catch (err) {
      setError(err.message || "Erro ao acessar área do cliente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#06150d] px-6 py-24 min-h-[calc(100vh-80px)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e55,transparent_30%),radial-gradient(circle_at_85%_10%,#f59e0b33,transparent_30%)]" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <Link to="/" className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-3 text-green-100 font-black hover:bg-white/15 transition">
              <ArrowLeft size={18} />
              Voltar ao site
            </Link>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mt-8">
              Área do cliente do SPA do Doguinho.
            </h1>

            <p className="text-white/70 text-xl mt-6 max-w-xl leading-relaxed">
              Acesse sua conta para acompanhar pets, histórico de agendamentos, pagamentos e próximos atendimentos.
            </p>
          </div>

          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-2xl border border-green-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                <PawPrint size={34} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  {mode === "login" ? "Entrar" : "Criar conta"}
                </h2>
                <p className="text-slate-500">Área exclusiva para tutores</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`py-3 rounded-2xl font-black transition ${mode === "login" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`py-3 rounded-2xl font-black transition ${mode === "register" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                Cadastro
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              {mode === "register" && (
                <div className="flex items-center bg-slate-50 rounded-2xl px-5 py-4 border border-slate-200 focus-within:border-green-500">
                  <User className="text-slate-400 mr-3" />
                  <input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Nome completo" required className="w-full outline-none bg-transparent text-slate-900" />
                </div>
              )}

              <div className="flex items-center bg-slate-50 rounded-2xl px-5 py-4 border border-slate-200 focus-within:border-green-500">
                <Mail className="text-slate-400 mr-3" />
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="E-mail" required className="w-full outline-none bg-transparent text-slate-900" />
              </div>

              {mode === "register" && (
                <div className="flex items-center bg-slate-50 rounded-2xl px-5 py-4 border border-slate-200 focus-within:border-green-500">
                  <Phone className="text-slate-400 mr-3" />
                  <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Telefone / WhatsApp" className="w-full outline-none bg-transparent text-slate-900" />
                </div>
              )}

              <div className="flex items-center bg-slate-50 rounded-2xl px-5 py-4 border border-slate-200 focus-within:border-green-500">
                <Lock className="text-slate-400 mr-3" />
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateField("password", e.target.value)} placeholder="Senha" required className="w-full outline-none bg-transparent text-slate-900" />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl p-4 text-sm font-bold">
                  {error}
                </div>
              )}

              <button disabled={loading} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black text-lg transition disabled:opacity-60">
                {loading ? "Processando..." : mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
