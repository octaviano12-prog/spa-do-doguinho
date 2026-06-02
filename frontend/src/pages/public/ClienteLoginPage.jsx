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
const heroImage = "/images/hero-doguinho-card.webp";

const accessHighlights = [
  {
    icon: PawPrint,
    title: "Pets cadastrados",
    text: "Dados do pet sempre organizados."
  },
  {
    icon: CalendarDays,
    title: "Agenda online",
    text: "Horários e histórico em um só lugar."
  },
  {
    icon: Sparkles,
    title: "Cuidado premium",
    text: "Acompanhamento com carinho."
  }
];

const trustHighlights = [
  [ShieldCheck, "Acesso seguro"],
  [MessageCircle, "WhatsApp integrado"],
  [BadgeCheck, "Atendimento acompanhado"]
];

const inputClass =
  "w-full bg-transparent text-[#12382f] outline-none placeholder:text-slate-400";
const inputWrapClass =
  "flex min-h-[58px] items-center rounded-[22px] border-2 border-[#d7eadf] bg-[#fbfffc] px-5 shadow-sm transition focus-within:border-[#0d6b54] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0d6b54]/10";

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
        <main className="relative min-h-[70vh] overflow-hidden bg-[#e9f6ee] px-5 py-16 text-[#12382f] md:px-8">
          <img src={heroImage} alt="SPA do Doguinho" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[#edf8f1]/88" />
          <section className="relative mx-auto flex max-w-3xl flex-col items-center rounded-[38px] border border-white/80 bg-white/90 p-10 text-center shadow-2xl backdrop-blur">
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
        <section className="relative min-h-[calc(100vh-128px)] overflow-hidden bg-[#e9f6ee]">
          <img src={heroImage} alt="Área do cliente SPA do Doguinho" className="home-hero-image absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#edf8f1]/98 via-[#edf8f1]/88 to-[#fffdf7]/72 xl:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto grid min-h-[calc(100vh-128px)] max-w-[1880px] items-center gap-9 px-6 py-10 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] xl:pr-[170px] 2xl:pr-[190px]">
            <div className="max-w-4xl py-4">
              <div className="home-animate-fade flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 py-3 font-black text-emerald-950 shadow-sm backdrop-blur transition hover:border-emerald-700 hover:text-emerald-700"
                >
                  <ArrowLeft size={18} />
                  Voltar ao site
                </Link>
                <span className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#d1f5df] px-5 py-3 text-sm font-black text-emerald-900 shadow-sm">
                  <ShieldCheck size={18} />
                  Área exclusiva para tutores
                </span>
              </div>

              <span className="home-animate-fade-delay-1 mt-10 inline-flex items-center gap-2 rounded-full bg-white/88 px-5 py-2 text-sm font-black uppercase tracking-[.12em] text-[#0d6b54] shadow-sm backdrop-blur">
                <KeyRound size={17} />
                Cliente SPA do Doguinho
              </span>

              <h1 className="home-animate-fade-delay-1 mt-5 max-w-4xl text-4xl font-black leading-[.92] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.5rem] 2xl:text-[5rem]">
                Entre, agende e acompanhe
                <span className="home-shimmer-text block font-serif italic tracking-normal">o cuidado do seu pet.</span>
              </h1>

              <p className="home-animate-fade-delay-2 mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base lg:text-lg">
                Sua área exclusiva reúne pets, horários, pagamentos e histórico em uma experiência simples, bonita e segura.
              </p>

              <div className="home-animate-fade-delay-3 mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="home-pulse-glow inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642]"
                >
                  <User size={20} /> Já sou cliente
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="inline-flex items-center gap-3 rounded-2xl border border-[#0d6b54]/25 bg-white/85 px-6 py-3 font-black text-[#0d6b54] shadow-sm backdrop-blur transition hover:-translate-y-1"
                >
                  <Sparkles size={20} /> Criar cadastro
                </button>
              </div>

              <div className="home-animate-fade-delay-3 mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
                {accessHighlights.map(({ icon: Icon, title, text }, index) => (
                  <div key={title} className="home-card-animate rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-lg backdrop-blur" style={{ animationDelay: `${index * 80}ms` }}>
                    <Icon className="mb-3 text-[#0d6b54]" size={25} />
                    <h3 className="text-base font-black text-[#12382f]">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-animate-fade-delay-2 w-full rounded-[38px] border border-white/80 bg-white/92 p-5 shadow-[0_28px_80px_rgba(20,56,47,.18)] backdrop-blur-xl md:p-7">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[#d1f5df] text-[#0d6b54] shadow-sm">
                  <PawPrint size={34} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-[.14em] text-[#0d6b54]">Área do cliente</span>
                  <h2 className="mt-1 text-3xl font-black leading-tight md:text-4xl">
                    {mode === "login" ? "Entrar" : "Criar conta"}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">Acesse o painel do tutor com segurança.</p>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-2 rounded-[24px] bg-[#eaf7ef] p-2 shadow-inner">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`min-h-[52px] rounded-[18px] px-4 font-black transition ${
                    mode === "login" ? "bg-[#0d6b54] text-white shadow-lg" : "text-slate-600 hover:bg-white"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`min-h-[52px] rounded-[18px] px-4 font-black transition ${
                    mode === "register" ? "bg-[#0d6b54] text-white shadow-lg" : "text-slate-600 hover:bg-white"
                  }`}
                >
                  Cadastro
                </button>
              </div>

              <div className="mb-5 rounded-[22px] border border-[#d7eadf] bg-white p-2 shadow-sm">
                <div
                  className={`flex min-h-[44px] items-center justify-center ${googleLoading ? "opacity-60" : ""}`}
                  ref={googleButtonRef}
                />
              </div>

              <div className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[.08em] text-slate-400">
                <span className="h-px flex-1 bg-[#e2eadf]" />
                ou use e-mail
                <span className="h-px flex-1 bg-[#e2eadf]" />
              </div>

              <form onSubmit={handleSubmit} className="grid gap-3.5">
                {mode === "register" && (
                  <div className={inputWrapClass}>
                    <User className="mr-3 shrink-0 text-slate-400" />
                    <input
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Nome completo"
                      required
                      className={inputClass}
                    />
                  </div>
                )}

                <div className={inputWrapClass}>
                  <Mail className="mr-3 shrink-0 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="E-mail"
                    required
                    className={inputClass}
                  />
                </div>

                {mode === "register" && (
                  <div className={inputWrapClass}>
                    <Phone className="mr-3 shrink-0 text-slate-400" />
                    <input
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      placeholder="Telefone / WhatsApp"
                      className={inputClass}
                    />
                  </div>
                )}

                <div className={inputWrapClass}>
                  <Lock className="mr-3 shrink-0 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    placeholder="Senha"
                    required
                    className={inputClass}
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
                  className="min-h-[60px] rounded-[22px] bg-[#0d6b54] px-6 text-lg font-black text-white shadow-xl shadow-emerald-900/18 transition hover:-translate-y-0.5 hover:bg-[#095642] disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? "Processando..." : mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}
                </button>
              </form>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {trustHighlights.map(([Icon, title]) => (
                  <div key={title} className="flex items-center justify-center gap-2 rounded-2xl bg-[#f4fbf6] px-3 py-3 text-center text-xs font-black text-[#0d6b54] ring-1 ring-[#d7eadf]">
                    <Icon size={16} />
                    <span>{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8">
          <div className="mx-auto grid max-w-[1760px] gap-5 rounded-[34px] bg-white p-5 shadow-xl ring-1 ring-[#e2eadf] md:grid-cols-3 md:p-6">
            {accessHighlights.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="home-card-animate flex items-center gap-4 rounded-[26px] bg-[#fffdf7] p-6 ring-1 ring-[#e2eadf]" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="home-icon-pop flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#d9eee3] text-[#0d6b54] ring-1 ring-[#c8e5d6]">
                  <Icon size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0d6b54]">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
