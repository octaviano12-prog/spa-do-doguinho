import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, PawPrint } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@spadodoguinho.com.br");
  const [password, setPassword] = useState("admin123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem("spa_token", data.token);
      localStorage.setItem("spa_user", JSON.stringify(data.user));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-5">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
            <PawPrint size={42} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Admin SPA</h1>
          <p className="text-gray-500 mt-1">Acesse o painel do Doguinho</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-2xl px-4 py-3 text-sm font-semibold">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-bold text-gray-700">E-mail</span>
          <div className="mt-2 flex items-center gap-2 border rounded-2xl px-4 py-3">
            <Mail size={20} className="text-gray-400" />
            <input
              className="w-full outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-gray-700">Senha</span>
          <div className="mt-2 flex items-center gap-2 border rounded-2xl px-4 py-3">
            <Lock size={20} className="text-gray-400" />
            <input
              className="w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
        </label>

        <button
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-black flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={20} />}
          Entrar
        </button>
      </form>
    </main>
  );
}
