import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  CreditCard,
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
  Star,
  User
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_URL = "https://spadodoguinho.com.br/api";
const DEFAULT_GOOGLE_CLIENT_ID = "453503592700-lu67c7lqje2cnla2mdj6111qrkluq2gu.apps.googleusercontent.com";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
const GOOGLE_SCRIPT_ID = "google-identity-services";
const heroImage = "/images/hero-doguinho-card.webp";

const socialProof = [
  "/images/galeria-pet-01.webp",
  "/images/galeria-pet-02.webp",
  "/images/galeria-pet-03.webp"
];

const supportBenefits = [
  {
    icon: ShieldCheck,
    title: "Dados protegidos",
    text: "Segurança total para suas informações."
  },
  {
    icon: CreditCard,
    title: "Pagamento seguro",
    text: "Ambiente protegido e certificado."
  },
  {
    icon: CalendarDays,
    title: "Agendamento online",
    text: "Rápido, fácil e a qualquer hora."
  },
  {
    icon: MessageCircle,
    title: "Atendimento humanizado",
    text: "Carinho e cuidado que seu pet merece."
  }
];

const heroStats = [
  {
    icon: PawPrint,
    value: "1.200+",
    label: "Pets atendidos"
  },
  {
    icon: Star,
    value: "4,9/5",
    label: "Avaliação média"
  },
  {
    icon: BadgeCheck,
    value: "8 anos",
    label: "De experiência"
  },
  {
    icon: Sparkles,
    value: "100%",
    label: "Carinho garantido"
  }
];

const accessHighlights = [
  {
    icon: PawPrint,
    title: "Pets cadastrados",
    text: "Dados do pet sempre organizados."
  },
  {
    icon: CalendarDays,
    title: "Agenda inteligente",
    text: "Horários e histórico em um só lugar."
  },
  {
    icon: CreditCard,
    title: "Pagamentos online",
    text: "Acompanhe valores e confirmações."
  },
  {
    icon: Camera,
    title: "Histórico com fotos",
    text: "Registros do cuidado sempre à mão."
  }
];

const trustHighlights = [
  [ShieldCheck, "Acesso seguro"],
  [MessageCircle, "WhatsApp integrado"],
  [CheckCircle2, "Atendimento acompanhado"]
];

const inputClass =
  "w-full bg-transparent text-[#12382f] outline-none placeholder:text-slate-400";
const inputWrapClass =
  "flex min-h-[58px] items-center rounded-[18px] border border-[#d7eadf] bg-white/88 px-4 shadow-sm backdrop-blur transition focus-within:border-[#0d6b54] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0d6b54]/10";

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
  const emailInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function focusLoginForm(nextMode = "login") {
    setMode(nextMode);
    window.setTimeout(() => emailInputRef.current?.focus(), 80);
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
        width: Math.min(390, googleButtonRef.current.clientWidth || 340)
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
        <section className="relative overflow-hidden bg-[#eef8f1]">
          <img src={heroImage} alt="Área de agendamento SPA do Doguinho" className="absolute inset-0 h-full w-full object-cover object-center opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_56%_42%,rgba(255,247,219,.16),transparent_28%),linear-gradient(90deg,rgba(255,253,247,.98)_0%,rgba(239,250,244,.88)_36%,rgba(255,253,247,.18)_68%,rgba(255,253,247,.78)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto max-w-[1880px] px-5 py-8 md:px-10 xl:pr-[240px] 2xl:pr-[270px]">
            <div className="grid min-h-[650px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(390px,470px)]">
              <div className="max-w-3xl py-8">
                <div className="home-animate-fade flex flex-wrap items-center gap-3">
                  <Link
                    to="/"
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/75 bg-white/82 px-5 py-3 font-black text-emerald-950 shadow-sm backdrop-blur-xl transition hover:border-emerald-700 hover:text-emerald-700"
                  >
                    <ArrowLeft size={18} />
                    Voltar ao site
                  </Link>
                  <span className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#d1f5df]/90 px-5 py-3 text-sm font-black text-emerald-900 shadow-sm backdrop-blur-xl">
                    <ShieldCheck size={18} />
                    Área exclusiva para tutores
                  </span>
                </div>

                <span className="home-animate-fade-delay-1 mt-9 inline-flex items-center gap-2 rounded-full border border-[#d7eadf] bg-white/78 px-5 py-2 text-xs font-black uppercase tracking-[.14em] text-[#0d6b54] shadow-sm backdrop-blur-xl">
                  <KeyRound size={16} />
                  Cliente SPA do Doguinho
                </span>

                <h1 className="home-animate-fade-delay-1 mt-5 max-w-3xl text-4xl font-black leading-[.9] tracking-[-.045em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.7rem]">
                  Seu pet merece
                  <span className="home-shimmer-text block font-serif italic tracking-normal">uma experiência</span>
                  especial
                </h1>

                <p className="home-animate-fade-delay-2 mt-5 max-w-xl text-sm leading-relaxed text-slate-700 md:text-base lg:text-lg">
                  Banho, tosa e acompanhamento completo em um único lugar, com carinho, segurança e tecnologia para seu pet.
                </p>

                <div className="home-animate-fade-delay-3 mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => focusLoginForm("login")}
                    className="home-pulse-glow inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642]"
                  >
                    <CalendarDays size={20} /> Agendar agora
                  </button>
                  <Link
                    to="/servicos"
                    className="inline-flex items-center gap-3 rounded-2xl border border-[#0d6b54]/25 bg-white/82 px-6 py-3 font-black text-[#0d6b54] shadow-sm backdrop-blur-xl transition hover:-translate-y-1"
                  >
                    <PawPrint size={20} /> Conhecer serviços
                  </Link>
                </div>

                <div className="home-animate-fade-delay-3 mt-8 flex flex-wrap items-center gap-4 rounded-[28px] border border-white/70 bg-white/72 p-4 shadow-lg backdrop-blur-xl sm:w-fit">
                  <div className="flex -space-x-3">
                    {socialProof.map((image, index) => (
                      <img
                        key={image}
                        src={image}
                        alt={`Cliente satisfeito ${index + 1}`}
                        className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-md"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[#d6a62d]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={17} fill="currentColor" />
                      ))}
                      <strong className="ml-2 text-sm text-[#12382f]">4,9/5</strong>
                    </div>
                    <p className="mt-1 text-sm font-bold text-slate-600">Mais de 1.200 clientes satisfeitos</p>
                  </div>
                </div>
              </div>

              <div className="home-animate-fade-delay-2 relative w-full overflow-hidden rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-[0_24px_70px_rgba(20,56,47,.22)] backdrop-blur-2xl md:p-7">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.92)_0%,rgba(255,255,255,.74)_58%,rgba(238,248,241,.68)_100%)]" />
                <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-[#f7df9b]/35 blur-3xl" />
                <div className="relative">
                  <div className="mb-5 flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[#d1f5df] text-[#0d6b54] shadow-sm">
                      <PawPrint size={34} />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-[.14em] text-[#0d6b54]">Área do cliente</span>
                      <h2 className="mt-1 text-3xl font-black leading-tight">
                        {mode === "login" ? "Entrar" : "Criar conta"}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        Bem-vindo de volta! Acompanhe seus agendamentos, pets e histórico.
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2 rounded-[20px] bg-[#eaf7ef]/85 p-2 shadow-inner backdrop-blur">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className={`min-h-[50px] rounded-[16px] px-4 font-black transition ${
                        mode === "login" ? "bg-[#0d6b54] text-white shadow-lg" : "text-slate-600 hover:bg-white"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className={`min-h-[50px] rounded-[16px] px-4 font-black transition ${
                        mode === "register" ? "bg-[#0d6b54] text-white shadow-lg" : "text-slate-600 hover:bg-white"
                      }`}
                    >
                      Cadastro
                    </button>
                  </div>

                  <div className="mb-4 rounded-[22px] border border-white/80 bg-white/72 p-3 shadow-lg shadow-emerald-900/5 backdrop-blur">
                    <div className="mb-2 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[.08em] text-slate-400">
                      <span className="h-px flex-1 bg-[#d7eadf]" />
                      Entrar com
                      <span className="h-px flex-1 bg-[#d7eadf]" />
                    </div>
                    <div
                      className={`flex min-h-[46px] items-center justify-center rounded-[18px] bg-white ${googleLoading ? "opacity-60" : ""}`}
                      ref={googleButtonRef}
                    />
                  </div>

                  <div className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[.08em] text-slate-400">
                    <span className="h-px flex-1 bg-[#d7eadf]" />
                    ou use seu e-mail
                    <span className="h-px flex-1 bg-[#d7eadf]" />
                  </div>

                  <form onSubmit={handleSubmit} className="grid gap-3">
                    {mode === "register" && (
                      <div className={inputWrapClass}>
                        <User className="mr-3 shrink-0 text-slate-400" size={22} />
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
                      <Mail className="mr-3 shrink-0 text-slate-400" size={22} />
                      <input
                        ref={emailInputRef}
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
                        <Phone className="mr-3 shrink-0 text-slate-400" size={22} />
                        <input
                          value={form.phone}
                          onChange={(event) => updateField("phone", event.target.value)}
                          placeholder="Telefone / WhatsApp"
                          className={inputClass}
                        />
                      </div>
                    )}

                    <div className={inputWrapClass}>
                      <Lock className="mr-3 shrink-0 text-slate-400" size={22} />
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
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>

                    {error && (
                      <div className="rounded-[18px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                        {error}
                      </div>
                    )}

                    <button
                      disabled={loading || googleLoading}
                      className="min-h-[58px] rounded-[18px] bg-[#0d6b54] px-6 text-base font-black text-white shadow-xl shadow-emerald-900/18 transition hover:-translate-y-0.5 hover:bg-[#095642] disabled:translate-y-0 disabled:opacity-60"
                    >
                      {loading ? "Processando..." : mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}
                    </button>
                  </form>

                  <div className="mt-4 rounded-[20px] border border-[#d7eadf] bg-[#f4fbf6]/86 p-3 backdrop-blur">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 shrink-0 text-[#0d6b54]" size={24} />
                      <div>
                        <strong className="text-sm font-black text-[#0d6b54]">Acesso seguro e criptografado</strong>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">Seus dados ficam protegidos com tecnologia de ponta.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {trustHighlights.map(([Icon, title]) => (
                      <div key={title} className="flex items-center justify-center gap-2 rounded-2xl bg-white/72 px-3 py-3 text-center text-xs font-black text-[#0d6b54] ring-1 ring-[#d7eadf]">
                        <Icon size={16} />
                        <span>{title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 -mt-3 grid gap-0 overflow-hidden rounded-[30px] border border-white/80 bg-white/78 shadow-xl backdrop-blur-2xl md:grid-cols-4">
              {supportBenefits.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className="flex items-center gap-4 border-[#d7eadf] p-5 md:border-l md:first:border-l-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#d1f5df] text-[#0d6b54] shadow-sm">
                    <Icon size={27} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#12382f]">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-5 grid overflow-hidden rounded-[30px] bg-gradient-to-r from-[#064231] via-[#0d6b54] to-[#064231] p-2 shadow-2xl shadow-emerald-950/25 md:grid-cols-4">
              {heroStats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center justify-center gap-4 border-white/15 px-6 py-5 text-white md:border-l md:first:border-l-0">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/14 text-[#f4d676] ring-1 ring-white/15">
                    <Icon size={32} />
                  </span>
                  <span>
                    <strong className="block text-2xl font-black leading-none md:text-3xl">{value}</strong>
                    <small className="mt-1 block text-sm font-bold text-white/80">{label}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
