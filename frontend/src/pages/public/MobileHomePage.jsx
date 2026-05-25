import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  CalendarDays,
  Heart,
  LogIn,
  MessageCircle,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/5518997493722?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20atendimento%20no%20SPA%20do%20Doguinho.";

const quickServices = [
  [Bath, "Banho Premium", "A partir de R$ 70"],
  [Scissors, "Tosa", "A partir de R$ 80"],
  [Sparkles, "Spa", "A partir de R$ 90"]
];

export default function MobileHomePage() {
  const isLoggedIn = Boolean(localStorage.getItem("spa_customer_token"));
  const bookingUrl = isLoggedIn ? "/agendamento" : "/cliente-login";
  const bookingLabel = isLoggedIn ? "Agendar agora" : "Entrar para agendar";

  return (
    <main className="min-h-screen bg-[#fffdf7] pb-28 text-[#12382f]">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e2eadf] bg-[#fffdf7]/95 px-5 py-4 backdrop-blur">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f4ed] text-[#0d6b54]">
            <PawPrint size={27} />
          </span>
          <span>
            <strong className="block text-lg font-black leading-none">SPA do Doguinho</strong>
            <small className="mt-1 block font-bold text-[#0d6b54]">Banho, Tosa e Veterinária</small>
          </span>
        </Link>
        <Link
          to="/cliente-login"
          aria-label="Minha conta"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e2eadf] bg-white text-[#0d6b54]"
        >
          <UserRound size={23} />
        </Link>
      </header>

      <section className="px-5 pt-5">
        <div className="overflow-hidden rounded-[30px] bg-[#e7f4ed] shadow-sm ring-1 ring-[#e2eadf]">
          <div className="relative h-[310px]">
            <img
              src="/images/hero-doguinho-card.webp"
              alt="Pet pronto para banho no SPA do Doguinho"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f29]/65 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#0d6b54] shadow">
              <Star size={14} fill="currentColor" />
              Cuidado 5 estrelas
            </span>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h1 className="text-[2.05rem] font-black leading-[1.04]">
                Seu pet limpo,
                <br />
                cheiroso e feliz.
              </h1>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              Reserve banho, tosa ou spa em poucos passos com acompanhamento na sua conta.
            </p>

            <Link
              to={bookingUrl}
              className="mt-5 flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] px-5 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/15 transition active:scale-[.98]"
            >
              {isLoggedIn ? <CalendarDays size={21} /> : <LogIn size={21} />}
              {bookingLabel}
              <ArrowRight size={19} />
            </Link>

            {!isLoggedIn && (
              <p className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-[#0d6b54]">
                <ShieldCheck size={15} />
                É necessário entrar para reservar horário
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="px-5 pt-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="text-xs font-black uppercase text-[#0d6b54]">Escolha rápida</span>
            <h2 className="mt-1 text-2xl font-black">Serviços</h2>
          </div>
          <Link to="/servicos" className="text-sm font-black text-[#0d6b54]">Ver todos</Link>
        </div>
        <div className="grid gap-3">
          {quickServices.map(([Icon, title, price]) => (
            <Link
              to={bookingUrl}
              key={title}
              className="flex min-h-[76px] items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e2eadf]"
            >
              <span className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7f4ed] text-[#0d6b54]">
                  <Icon size={25} />
                </span>
                <span>
                  <strong className="block text-base font-black">{title}</strong>
                  <small className="font-bold text-slate-500">{price}</small>
                </span>
              </span>
              <ArrowRight size={18} className="text-[#0d6b54]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pt-6">
        <h2 className="text-2xl font-black">Agende com tranquilidade</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            [ShieldCheck, "Conta segura", "Seu histórico protegido"],
            [CalendarDays, "Agenda fácil", "Horário em poucos passos"],
            [Heart, "Carinho", "Atendimento cuidadoso"],
            [MessageCircle, "WhatsApp", "Suporte rápido"]
          ].map(([Icon, title, text]) => (
            <div key={title} className="min-h-[126px] rounded-2xl bg-[#e7f4ed] p-4">
              <Icon size={24} className="text-[#0d6b54]" />
              <strong className="mt-3 block text-sm font-black">{title}</strong>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="mx-5 mt-7 flex min-h-[58px] items-center justify-center gap-3 rounded-2xl border border-[#0d6b54]/20 bg-white px-5 py-4 font-black text-[#0d6b54]"
      >
        <MessageCircle size={21} />
        Falar no WhatsApp
      </a>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e2eadf] bg-white px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
        <Link
          to={bookingUrl}
          className="flex min-h-[58px] items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] px-5 py-4 font-black text-white shadow-xl"
        >
          <CalendarDays size={21} />
          {bookingLabel}
        </Link>
      </nav>
    </main>
  );
}
