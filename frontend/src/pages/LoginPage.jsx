import React, { useState } from "react";
import { Mail, Lock, PawPrint } from "lucide-react";

import { apiRequest } from "../lib/api";

export default function LoginPage() {
  const [email, setEmail] =
    useState("admin@spadodoguinho.com.br");

  const [password, setPassword] =
    useState("admin123456");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data =
        await apiRequest(
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

      window.location.href =
        "/admin/dashboard";

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-slate-950 p-6">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl p-10">

        <div className="flex flex-col items-center mb-10">

          <div className="w-24 h-24 rounded-3xl bg-green-600 flex items-center justify-center shadow-xl mb-6">

            <PawPrint
              size={48}
              className="text-white"
            />

          </div>

          <h1 className="text-5xl font-black text-slate-900">
            SPA DOGUINHO
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Painel Administrativo
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              E-mail
            </label>

            <div className="flex items-center bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm">

              <Mail className="text-slate-400 mr-3" />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full outline-none bg-transparent text-lg"
                placeholder="Seu e-mail"
              />

            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Senha
            </label>

            <div className="flex items-center bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm">

              <Lock className="text-slate-400 mr-3" />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full outline-none bg-transparent text-lg"
                placeholder="Sua senha"
              />

            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl p-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition-all text-white font-bold text-xl py-4 rounded-2xl shadow-xl"
          >

            {loading
              ? "Entrando..."
              : "Entrar"}

          </button>

        </form>

      </div>

    </div>
  );
}
