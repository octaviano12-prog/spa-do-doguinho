import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  EyeOff,
  Lock,
  Mail,
  PawPrint,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_URL = "https://spadodoguinho.com.br/api";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GOOGLE_SCRIPT_ID = "google-identity-services";

function getSafeNextPage() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/mobile")) return next;
  return "/cliente";
}

export default function ClienteLoginPage() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const googleButtonRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function finishCustomerLogin(data) {
    localStorage.setItem("spa_customer_token", data.token);
    localStorage.setItem("spa_customer", JSON.stringify(data.customer));
    window.location.replace(getSafeNextPage());
  }

  useEffect(() => {
    let cancelled = false;

    async function checkExistingSession() {
      const token = localStorage.getItem("spa_customer_token");

      if (!token) {
        setCheckingSession(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/customer/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.id) {
          throw new Error("Sessão inválida");
        }

        localStorage.setItem("spa_customer", JSON.stringify(data));
        if (!cancelled) window.location.replace(getSafeNextPage());
      } catch {
        localStorage.removeItem("spa_customer_token");
        localStorage.removeItem("spa_customer");
        if (!cancelled) {
          setError("Sua sessão expirou. Entre novamente para continuar.");
          setCheckingSession(false);
        }
      }
    }

    checkExistingSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGoogleCredential(response) {
    const credential = response?.credential;

    if (!credential) {
      setError("Não foi possível receber o login do Google.");
      return;
    }

    setGoogleLoading(true);
    setError("");

    try {
      const apiResponse = await fetch(`${API_URL}/auth/customer-google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential })
      });
      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || "Erro ao acessar com Google.");
      }

      await finishCustomerLogin(data);
    } catch (err) {
      setError(err.message || "Erro ao acessar com Google.");
    } finally {
      setGoogleLoading(false);
    }
  }

  useEffect(() => {
    if (checkingSession || !GOOGLE_CLIENT_ID || !googleButtonRef.current) return;

    let cancelled = false;

    function renderGoogleButton() {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        use_fedcm_for_prompt: true
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        shape: "pill",
        text: mode === "login" ? "signin_with" : "signup_with",
        logo_alignment: "left",
        width: Math.min(380, googleButtonRef.current.clientWidth || 340)
      });
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else if (existingScript) {
      existingScript.addEventListener("load", renderGoogleButton, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      script.onerror = () => setError("Não foi possível carregar o login do Google.");
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      existingScript?.removeEventListener("load", renderGoogleButton);
    };
  }, [mode, checkingSession]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "login" ? "/auth/customer-login" : "/auth/customer-register";
      const payload =
        mode === "login"
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

      await finishCustomerLogin(data);
    } catch (err) {
      setError(err.message || "Erro ao acessar área do cliente.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <PublicLayout>
        <main className="min-h-[70vh] bg-[#fffdf7] px-5 py-16 text-[#12382f] md:px-8">
          <section className="mx-auto flex max-w-3xl flex-col items-center rounded-[34px] bg-white p-10 text-center shadow-xl ring-1 ring-[#e2eadf]">
            <span className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#e7f4ed] text-[#0d6b54]">
              <RefreshCw className="animate-spin" size={38} />
            </span>
            <h1 className="mt-6 text-3xl font-black md:text-4xl">Verificando sua sessão</h1>
            <p className="mt-3 text-slate-500">Se você já estiver logado, vamos te levar direto para sua área.</p>
          </section>
        </main>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative bg-[#e7f4ed] px-5 py-16 md:px-8">
          <div className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-3 font-black text-emerald-900 shadow-sm transition hover:border-emerald-700"
              >
                <ArrowLeft size={18} />
                Voltar ao site
              </Link>

              <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-900">
                <ShieldCheck size={18} />
                Área exclusiva para tutores
              </span>

              <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[.96] md:text-7xl">
                Acompanhe o cuidado do seu pet em um só lugar.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Entre para ver seus pets, agendamentos, pagamentos e próximos atendimentos com praticidade.
              </p>

              <div className="mt-9 grid max-w-xl gap-4 sm:grid-cols-3">
                {[
                  [PawPrint, "Pets", "cadastro"],
                  [CalendarDays, "Agenda", "histórico"],
                  [Sparkles, "Cuidado", "premium"]
                ].map(([Icon, title, text]) => (
                  <div key={title} className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-[#e2eadf]">
                    <Icon className="mb-3 text-[#0d6b54]" />
                    <b>{title}</b>
                    <p className="mt-1 text-sm text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[.86fr_1fr] xl:items-stretch">
              <div className="hidden overflow-hidden rounded-[36px] bg-white shadow-2xl ring-1 ring-[#e2eadf] xl:block">
                <img
                  src="/images/sobre-hero.webp"
                  alt="Área do cliente SPA do Doguinho"
                  className="h-full min-h-[620px] w-full object-cover"
                />
              </div>

              <div className="rounded-[36px] bg-white p-8 shadow-2xl ring-1 ring-[#e2eadf] md:p-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                    <PawPrint size={34} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">
                      {mode === "login" ? "Entrar" : "Criar conta"}
                    </h2>
                    <p className="text-slate-500">Área exclusiva para tutores</p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-2">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`rounded-xl py-3 font-black transition ${
                      mode === "login" ? "bg-[#0d6b54] text-white shadow-sm" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`rounded-xl py-3 font-black transition ${
                      mode === "register" ? "bg-[#0d6b54] text-white shadow-sm" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Cadastro
                  </button>
                </div>

                <div className="mb-6">
                  {GOOGLE_CLIENT_ID ? (
                    <div
                      className={`flex min-h-[46px] items-center justify-center rounded-full border border-slate-200 bg-white ${
                        googleLoading ? "opacity-60" : ""
                      }`}
                      ref={googleButtonRef}
                    />
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 font-black text-slate-400"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-black text-slate-500">G</span>
                      Google em breve
                    </button>
                  )}

                  {!GOOGLE_CLIENT_ID && (
                    <p className="mt-3 text-center text-xs font-bold text-slate-400">
                      Configure VITE_GOOGLE_CLIENT_ID no site e GOOGLE_CLIENT_ID no servidor.
                    </p>
                  )}
                </div>

                <div className="mb-6 flex items-center gap-3 text-xs font-black uppercase text-slate-400">
                  <span className="h-px flex-1 bg-slate-100" />
                  ou use e-mail
                  <span className="h-px flex-1 bg-slate-100" />
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                  {mode === "register" && (
                    <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 focus-within:border-emerald-700">
                      <User className="mr-3 text-slate-400" />
                      <input
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        placeholder="Nome completo"
                        required
                        className="w-full bg-transparent text-slate-900 outline-none"
                      />
                    </div>
                  )}

                  <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 focus-within:border-emerald-700">
                    <Mail className="mr-3 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="E-mail"
                      required
                      className="w-full bg-transparent text-slate-900 outline-none"
                    />
                  </div>

                  {mode === "register" && (
                    <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 focus-within:border-emerald-700">
                      <Phone className="mr-3 text-slate-400" />
                      <input
                        value={form.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        placeholder="Telefone / WhatsApp"
                        className="w-full bg-transparent text-slate-900 outline-none"
                      />
                    </div>
                  )}

                  <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 focus-within:border-emerald-700">
                    <Lock className="mr-3 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      placeholder="Senha"
                      required
                      className="w-full bg-transparent text-slate-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={loading || googleLoading}
                    className="rounded-2xl bg-[#0d6b54] py-4 text-lg font-black text-white transition hover:bg-[#095642] disabled:opacity-60"
                  >
                    {loading ? "Processando..." : mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
