import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MessageCircle,
  PawPrint,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_URL = "https://spadodoguinho.com.br/api";
const DEFAULT_GOOGLE_CLIENT_ID = "453503592700-lu67c7lqje2cnla2mdj6111qrkluq2gu.apps.googleusercontent.com";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
const GOOGLE_SCRIPT_ID = "google-identity-services";

const accessHighlights = [
  {
    icon: PawPrint,
    title: "Pets",
    text: "Cadastro e dados sempre a mao."
  },
  {
    icon: CalendarDays,
    title: "Agenda",
    text: "Proximos horarios e historico."
  },
  {
    icon: Sparkles,
    title: "Cuidado",
    text: "Pagamentos e acompanhamento."
  }
];

const trustHighlights = [
  {
    icon: ShieldCheck,
    title: "Acesso seguro",
    text: "Sua area fica protegida por login."
  },
  {
    icon: MessageCircle,
    title: "Atendimento facil",
    text: "Fale com a equipe quando precisar."
  }
];

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
          throw new Error("Sessao invalida");
        }

        localStorage.setItem("spa_customer", JSON.stringify(data));
        if (!cancelled) window.location.replace(getSafeNextPage());
      } catch {
        localStorage.removeItem("spa_customer_token");
        localStorage.removeItem("spa_customer");
        if (!cancelled) {
          setError("Sua sessao expirou. Entre novamente para continuar.");
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
      setError("Nao foi possivel receber o login do Google.");
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
      script.onerror = () => setError("Nao foi possivel carregar o login do Google.");
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
        throw new Error(data.error || "Erro ao acessar area do cliente.");
      }

      await finishCustomerLogin(data);
    } catch (err) {
      setError(err.message || "Erro ao acessar area do cliente.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <PublicLayout>
        <main className="min-h-[70vh] bg-[#f0faf4] px-5 py-16 text-[#12382f] md:px-8">
          <section className="mx-auto flex max-w-3xl flex-col items-center rounded-[38px] border border-[#dbeade] bg-white p-10 text-center shadow-2xl">
            <span className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#e7f4ed] text-[#0d6b54]">
              <RefreshCw className="animate-spin" size={38} />
            </span>
            <h1 className="mt-6 text-3xl font-black md:text-4xl">Verificando sua sessao</h1>
            <p className="mt-3 text-slate-500">Se voce ja estiver logado, vamos te levar direto para sua area.</p>
          </section>
        </main>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative isolate min-h-[calc(100vh-128px)] overflow-hidden bg-[#eef8f1] px-5 py-10 md:px-8 lg:py-14">
          <div className="absolute inset-x-0 top-0 -z-10 h-36 bg-[#fffdf7]" />
          <div className="absolute left-0 top-24 -z-10 h-[440px] w-[440px] rounded-full bg-[#c8f4da]/50 blur-3xl" />
          <div className="absolute bottom-0 right-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#f6e3bd]/60 blur-3xl" />

          <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-[minmax(0,.95fr)_minmax(620px,1.05fr)] lg:items-center">
            <div className="py-4 lg:py-10 lg:pr-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-3 font-black text-emerald-950 shadow-sm transition hover:border-emerald-700 hover:text-emerald-700"
                >
                  <ArrowLeft size={18} />
                  Voltar ao site
                </Link>
                <span className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-emerald-100 px-5 py-3 text-sm font-black text-emerald-900">
                  <ShieldCheck size={18} />
                  Area exclusiva para tutores
                </span>
              </div>

              <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-black text-[#0d6b54] shadow-sm ring-1 ring-[#dbeade]">
                <KeyRound size={18} />
                Cliente SPA do Doguinho
              </span>

              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[.95] md:text-7xl xl:text-[86px]">
                Seu painel para cuidar do pet com carinho.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Entre para acompanhar seus pets, agendamentos, pagamentos e proximos atendimentos em uma experiencia simples e bonita.
              </p>

              <div className="mt-9 grid max-w-3xl gap-4 sm:grid-cols-3">
                {accessHighlights.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-[26px] border border-[#dbeade] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <Icon className="mb-4 text-[#0d6b54]" size={26} />
                    <b className="text-lg">{title}</b>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid max-w-3xl gap-3 md:grid-cols-2">
                {trustHighlights.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-center gap-4 rounded-[24px] border border-emerald-900/10 bg-white/70 p-4 shadow-sm backdrop-blur">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0d6b54] text-white">
                      <Icon size={22} />
                    </span>
                    <div>
                      <b>{title}</b>
                      <p className="text-sm text-slate-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[.88fr_1fr] xl:items-stretch">
              <div className="relative hidden min-h-[640px] overflow-hidden rounded-[42px] bg-white shadow-2xl ring-1 ring-[#dbeade] xl:block">
                <img
                  src="/images/sobre-hero.webp"
                  alt="Area do cliente SPA do Doguinho"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/55 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-[30px] border border-white/45 bg-white/86 p-5 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0d6b54] text-white">
                      <BadgeCheck size={28} />
                    </span>
                    <div>
                      <b className="text-lg text-[#12382f]">Atendimento acompanhado</b>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        Tudo que voce precisa para agendar e acompanhar o cuidado do seu pet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[38px] border border-[#dbeade] bg-white p-6 shadow-2xl md:p-8 xl:p-10">
                <div className="mb-8 flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                    <PawPrint size={34} />
                  </div>
                  <div>
                    <span className="text-sm font-black uppercase text-[#0d6b54]">Area do cliente</span>
                    <h2 className="mt-1 text-3xl font-black leading-tight md:text-4xl">
                      {mode === "login" ? "Entrar" : "Criar conta"}
                    </h2>
                    <p className="mt-1 text-slate-500">Acesse sua rotina no SPA do Doguinho.</p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-2 rounded-[22px] bg-[#eef8f1] p-2">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`min-h-[54px] rounded-[18px] px-4 font-black transition ${
                      mode === "login" ? "bg-[#0d6b54] text-white shadow-lg" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`min-h-[54px] rounded-[18px] px-4 font-black transition ${
                      mode === "register" ? "bg-[#0d6b54] text-white shadow-lg" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Cadastro
                  </button>
                </div>

                <div className="mb-6 rounded-[22px] border border-[#dbeade] bg-[#fbfffc] p-2">
                  <div
                    className={`flex min-h-[46px] items-center justify-center ${googleLoading ? "opacity-60" : ""}`}
                    ref={googleButtonRef}
                  />
                </div>

                <div className="mb-6 flex items-center gap-3 text-xs font-black uppercase text-slate-400">
                  <span className="h-px flex-1 bg-slate-100" />
                  ou use e-mail
                  <span className="h-px flex-1 bg-slate-100" />
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                  {mode === "register" && (
                    <div className="flex min-h-[62px] items-center rounded-[22px] border border-[#dbeade] bg-[#fbfffc] px-5 transition focus-within:border-[#0d6b54] focus-within:ring-4 focus-within:ring-emerald-100">
                      <User className="mr-3 shrink-0 text-slate-400" />
                      <input
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        placeholder="Nome completo"
                        required
                        className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  <div className="flex min-h-[62px] items-center rounded-[22px] border border-[#dbeade] bg-[#fbfffc] px-5 transition focus-within:border-[#0d6b54] focus-within:ring-4 focus-within:ring-emerald-100">
                    <Mail className="mr-3 shrink-0 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="E-mail"
                      required
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {mode === "register" && (
                    <div className="flex min-h-[62px] items-center rounded-[22px] border border-[#dbeade] bg-[#fbfffc] px-5 transition focus-within:border-[#0d6b54] focus-within:ring-4 focus-within:ring-emerald-100">
                      <Phone className="mr-3 shrink-0 text-slate-400" />
                      <input
                        value={form.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        placeholder="Telefone / WhatsApp"
                        className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  <div className="flex min-h-[62px] items-center rounded-[22px] border border-[#dbeade] bg-[#fbfffc] px-5 transition focus-within:border-[#0d6b54] focus-within:ring-4 focus-within:ring-emerald-100">
                    <Lock className="mr-3 shrink-0 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      placeholder="Senha"
                      required
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-800"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
                    </button>
                  </div>

                  {error && (
                    <div className="rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={loading || googleLoading}
                    className="min-h-[62px] rounded-[22px] bg-[#0d6b54] px-6 text-lg font-black text-white shadow-xl shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#095642] disabled:translate-y-0 disabled:opacity-60"
                  >
                    {loading ? "Processando..." : mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}
                  </button>
                </form>

                <div className="mt-6 flex items-start gap-3 rounded-[22px] bg-[#f4fbf6] p-4 text-sm leading-relaxed text-slate-600 ring-1 ring-[#dbeade]">
                  <ShieldCheck className="mt-0.5 shrink-0 text-[#0d6b54]" size={20} />
                  <p>
                    {mode === "login"
                      ? "Use o mesmo e-mail do cadastro para continuar direto para sua area do cliente."
                      : "Depois do cadastro voce ja entra logado e pode agendar o primeiro atendimento."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
