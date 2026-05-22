import React, { useState } from "react";

import {
  PawPrint,
  Mail,
  Lock,
  Loader2
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { apiRequest } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    "admin@spadodoguinho.com.br"
  );

  const [password, setPassword] = useState(
    "admin123456"
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      localStorage.setItem(
        "spa_token",
        data.token
      );

      localStorage.setItem(
        "spa_user",
        JSON.stringify(data.user)
      );

      navigate("/admin/dashboard");
    } catch (error) {
      setError(
        error.message ||
          "Erro ao entrar"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md glass rounded-[32px] border border-white/40 shadow-2xl p-8">

        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-green-500 to-emerald-700 text-white flex items-center justify-center mx-auto shadow-2xl">
            <PawPrint size={46} />
          </div>

          <h1 className="text-4xl font-black text-gray-900 mt-6">
            SPA DOGUINHO
          </h1>

          <p className="text-gray-600 mt-2">
            Painel Administrativo
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-200 text-red-700 rounded-2xl p-4 font-medium">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="text-sm font-bold text-gray-700">
              E-mail
            </label>

            <div className="mt-2 h-14 bg-white rounded-2xl border flex items-center px-4">
              <Mail
                size={20}
                className="text-gray-400"
              />

              <input
                type="email"
                className="flex-1 h-full px-3 outline-none bg-transparent"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              Senha
            </label>

            <div className="mt-2 h-14 bg-white rounded-2xl border flex items-center px-4">
              <Lock
                size={20}
                className="text-gray-400"
              />

              <input
                type="password"
                className="flex-1 h-full px-3 outline-none bg-transparent"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-[1.02] transition-all text-white font-black flex items-center justify-center gap-2 shadow-xl"
          >
            {loading && (
              <Loader2
                className="animate-spin"
                size={20}
              />
            )}

            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
