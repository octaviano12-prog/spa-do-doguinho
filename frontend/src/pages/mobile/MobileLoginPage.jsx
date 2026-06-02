import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, PawPrint, Phone, RefreshCw, ShieldCheck, User } from "lucide-react";
import MobileShell from "../../components/mobile/MobileShell";

const API_URL = "https://spadodoguinho.com.br/api";
const DEFAULT_GOOGLE_CLIENT_ID = "453503592700-lu67c7lqje2cnla2mdj6111qrkluq2gu.apps.googleusercontent.com";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
const GOOGLE_SCRIPT_ID = "google-identity-services";
const safeNextPages = ["/mobile/agendar", "/mobile/conta", "/mobile/agendamentos", "/mobile/pets", "/mobile/perfil"];

export default function MobileLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedNextPage = searchParams.get("next");
  const nextPage = safeNextPages.includes(requestedNextPage) ? requestedNextPage : "/mobile/conta";
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const googleButtonRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function finishLogin(data) {
    localStorage.setItem("spa_customer_token", data.token);
    localStorage.setItem("spa_customer", JSON.stringify(data.customer));
    navigate(nextPage, { replace: true });
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
        if (!cancelled) navigate(nextPage, { replace: true });
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
  }, [navigate, nextPage]);

  async function handleGoogleCredential(response) {
    if (!response?.credential) return setError("Não foi possível receber o login do Google.");
    setGoogleLoading(true);
    setError("");
    try {
      const apiResponse = await fetch(`${API_URL}/auth/customer-google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await apiResponse.json();
      if (!apiResponse.ok) throw new Error(data.error || "Erro ao acessar com Google.");
      finishLogin(data);
    } catch (err) {
      setError(err.message || "Erro ao acessar com Google.");
    } finally {
      setGoogleLoading(false);
    }
  }

  useEffect(() => {
    if (checkingSession || !GOOGLE_CLIENT_ID || !googleButtonRef.current) return;
    let cancelled = false;
    function renderButton() {
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
        shape: "pill",
        text: mode === "login" ? "signin_with" : "signup_with",
        width: Math.min(350, googleButtonRef.current.clientWidth || 320)
      });
    }
    const scriptFound = document.getElementById(GOOGLE_SCRIPT_ID);
    if (window.google?.accounts?.id) renderButton();
    else if (scriptFound) scriptFound.addEventListener("load", renderButton, { once: true });
    else {
      const script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderButton;
      script.onerror = () => setError("Não foi possível carregar o login do Google.");
      document.head.appendChild(script);
    }
    return () => {
      cancelled = true;
      scriptFound?.removeEventListener("load", renderButton);
    };
  }, [mode, checkingSession]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "login" ? "/auth/customer-login" : "/auth/customer-register";
      const payload = mode === "login" ? { email: form.email, password: form.password } : form;
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao acessar sua conta.");
      finishLogin(data);
    } catch (err) {
      setError(err.message || "Erro ao acessar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <MobileShell title="Sua conta" hideNav>
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e7f4ed] text-[#0d6b54]"><RefreshCw className="animate-spin" size={32} /></span>
          <h1 className="mt-5 text-2xl font-black">Verificando sua sessão</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Se você já estiver logado, vamos continuar automaticamente.</p>
        </section>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="Sua conta" hideNav>
      <section className="px-5 py-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7f4ed] text-[#0d6b54]"><PawPrint /></span>
          <div>
            <h1 className="text-2xl font-black">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
            <p className="text-sm font-semibold text-slate-500">Para agendar com segurança</p>
          </div>
        </div>
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-[#e7f4ed] p-1.5">
          {["login", "register"].map((item) => (
            <button key={item} onClick={() => setMode(item)} className={`min-h-[48px] rounded-lg font-black ${mode === item ? "bg-white text-[#0d6b54] shadow-sm" : "text-slate-500"}`}>
              {item === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>
        <div ref={googleButtonRef} className={`mb-5 flex min-h-[48px] justify-center ${googleLoading ? "opacity-60" : ""}`} />
        <div className="mb-5 flex items-center gap-3 text-xs font-black uppercase text-slate-400"><span className="h-px flex-1 bg-slate-200" />ou e-mail<span className="h-px flex-1 bg-slate-200" /></div>
        <form onSubmit={handleSubmit} className="grid gap-3">
          {mode === "register" && <Input icon={User} value={form.name} onChange={(value) => updateField("name", value)} placeholder="Nome completo" />}
          <Input icon={Mail} value={form.email} onChange={(value) => updateField("email", value)} type="email" placeholder="E-mail" />
          {mode === "register" && <Input icon={Phone} value={form.phone} onChange={(value) => updateField("phone", value)} placeholder="WhatsApp" required={false} />}
          <label className="flex min-h-[56px] items-center rounded-xl border border-[#e2eadf] bg-white px-4">
            <Lock size={19} className="mr-3 text-slate-400" />
            <input type={showPassword ? "text" : "password"} required value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Senha" className="min-w-0 flex-1 bg-transparent outline-none" />
            <button type="button" aria-label="Mostrar senha" onClick={() => setShowPassword((value) => !value)} className="text-slate-400">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
          </label>
          {error && <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
          <button disabled={loading || googleLoading} className="mt-2 min-h-[58px] rounded-xl bg-[#0d6b54] font-black text-white disabled:opacity-60">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar e continuar" : "Criar conta e continuar"}
          </button>
        </form>
        <p className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-500"><ShieldCheck size={15} />Seus dados ficam protegidos</p>
      </section>
    </MobileShell>
  );
}

function Input({ icon: Icon, value, onChange, placeholder, type = "text", required = true }) {
  return (
    <label className="flex min-h-[56px] items-center rounded-xl border border-[#e2eadf] bg-white px-4">
      <Icon size={19} className="mr-3 text-slate-400" />
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent outline-none" />
    </label>
  );
}
