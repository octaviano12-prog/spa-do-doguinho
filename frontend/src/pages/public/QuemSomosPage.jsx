import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Bath,
  CalendarDays,
  CheckCircle2,
  Heart,
  Image,
  LogIn,
  MessageCircle,
  PawPrint,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const whatsappUrl =
  "https://wa.me/5518997493722?text=Olá! Gostaria de conhecer melhor o SPA do Doguinho.";

const values = [
  { icon: Heart, title: "Carinho em primeiro lugar", text: "Cada pet é recebido com paciência, respeito e atenção aos sinais de conforto." },
  { icon: ShieldCheck, title: "Segurança e higiene", text: "Rotina organizada, ambiente limpo e cuidado com produtos adequados." },
  { icon: Sparkles, title: "Acabamento premium", text: "Banho, tosa e finalização com visual bonito e sensação de bem-estar." },
  { icon: Users, title: "Tutor bem informado", text: "Comunicação clara antes, durante e depois do atendimento." }
];

const steps = [
  "Recepção tranquila e identificação do pet",
  "Avaliação de porte, pelagem, pele e comportamento",
  "Banho, tosa ou cuidado especial com calma",
  "Finalização, perfume e orientação ao tutor"
];

function ImagePlaceholder({ title, subtitle = "Espaço reservado para nova imagem", className = "" }) {
  return (
    <div className={`relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[34px] border border-dashed border-[#0d6b54]/25 bg-[linear-gradient(135deg,#e6f5eb,#fff8e6)] p-8 text-center shadow-lg ring-1 ring-white/70 ${className}`}>
      <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-[#0d8b67]/10 blur-2xl" />
      <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#f4c86a]/25 blur-2xl" />
      <div className="relative">
        <div className="home-float mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-[#0d6b54] shadow-xl">
          <Image size={36} />
        </div>
        <h3 className="mt-5 text-2xl font-black text-[#12382f]">{title}</h3>
        <p className="mt-2 text-sm font-bold text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default function QuemSomosPage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative min-h-[560px] overflow-hidden bg-[linear-gradient(135deg,#e6f5eb,#fff8e6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(13,139,103,.18),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(244,200,106,.28),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto grid min-h-[560px] max-w-[1880px] gap-10 px-6 py-12 md:px-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div className="max-w-4xl">
              <span className="home-animate-fade inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-black text-[#0d6b54] shadow-sm backdrop-blur">
                <PawPrint size={16} /> Sobre o SPA do Doguinho
              </span>
              <h1 className="home-animate-fade-delay-1 mt-6 text-4xl font-black leading-[.95] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-7xl">
                Um espaço criado para cuidar do seu pet
                <span className="home-shimmer-text block font-serif italic">como parte da família.</span>
              </h1>
              <p className="home-animate-fade-delay-2 mt-6 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
                Unimos estética animal, bem-estar, segurança e atendimento humano em uma experiência bonita, tranquila e confiável para pets e tutores.
              </p>
              <div className="home-animate-fade-delay-3 mt-8 flex flex-wrap gap-4">
                <Link to="/cliente-login" className="home-pulse-glow inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642]"><LogIn size={20} /> Entrar para agendar</Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#e9fff2] px-6 py-4 font-black text-[#128c4b] shadow-sm transition hover:-translate-y-1"><MessageCircle size={20} /> Falar no WhatsApp</a>
              </div>
            </div>

            <ImagePlaceholder title="Imagem institucional" subtitle="Depois colocamos uma foto exclusiva da página Sobre Nós" className="min-h-[430px]" />
          </div>
        </section>

        <section className="relative -mt-8 px-5 md:px-8">
          <div className="mx-auto grid max-w-[1880px] gap-5 rounded-[34px] bg-white p-5 shadow-xl ring-1 ring-[#e2eadf] md:grid-cols-3 md:p-6">
            {[["+500", "pets felizes"], ["5★", "experiência premium"], ["100%", "cuidado com amor"]].map(([number, label], index) => (
              <div key={label} className="home-card-animate rounded-[26px] bg-[#fffdf7] p-7 text-center ring-1 ring-[#e2eadf]" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="text-4xl font-black text-[#0d6b54]">{number}</div>
                <div className="mt-2 text-sm font-black uppercase tracking-[.12em] text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto grid max-w-[1880px] gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <ImagePlaceholder title="Imagem da nossa essência" subtitle="Foto exclusiva para mostrar ambiente, equipe ou pet no atendimento" className="min-h-[520px]" />
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-5 py-2 text-sm font-black text-[#0d6b54]"><Award size={18} /> Nossa essência</span>
              <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-.04em] md:text-6xl">Mais do que banho e tosa: uma experiência de confiança.</h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
                Cada atendimento é pensado para transmitir segurança ao tutor e conforto ao animal, desde a chegada até a finalização.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {steps.map((step, index) => (
                  <div key={step} className="home-card-animate flex items-center gap-4 rounded-3xl border border-[#e2eadf] bg-white p-5 shadow-sm" style={{ animationDelay: `${index * 80}ms` }}>
                    <CheckCircle2 className="shrink-0 text-[#0d6b54]" />
                    <span className="font-bold text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto max-w-[1880px]">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-5 py-2 text-sm font-black text-[#0d6b54]"><Sparkles size={16} /> Nossos valores</span>
              <h2 className="mt-5 text-4xl font-black tracking-[-.04em] md:text-5xl">O cuidado que guia cada atendimento.</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {values.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="home-card-animate rounded-[30px] bg-white p-7 shadow-xl ring-1 ring-[#e2eadf]" style={{ animationDelay: `${index * 90}ms` }}>
                    <div className="home-icon-pop flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e7f4ed] text-[#0d6b54]"><Icon size={34} /></div>
                    <h3 className="mt-6 text-2xl font-black text-[#0d6b54]">{item.title}</h3>
                    <p className="mt-3 leading-relaxed text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto max-w-[1880px] rounded-[40px] bg-[#e7f4ed] p-7 md:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-black text-[#0d6b54]"><Bath size={16} /> Ambiente e carinho</span>
                <h2 className="mt-5 text-4xl font-black tracking-[-.04em] md:text-5xl">Uma experiência pensada para tranquilidade.</h2>
              </div>
              <p className="max-w-xl text-slate-600">Do banho ao acabamento, buscamos tornar o cuidado mais leve, bonito e seguro.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {["Imagem do ambiente", "Imagem do atendimento", "Imagem do cuidado"].map((title, index) => (
                <div key={title} className="home-card-animate" style={{ animationDelay: `${index * 90}ms` }}>
                  <ImagePlaceholder title={title} subtitle="Reservado para imagem exclusiva" className="min-h-[320px] bg-white/65" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto grid max-w-[1880px] gap-8 overflow-hidden rounded-[44px] bg-[#0b352b] p-8 text-white shadow-2xl md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-black text-[#f4c86a]"><Star size={16} fill="currentColor" /> SPA do Doguinho</span>
              <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-.04em] md:text-6xl">Seu pet merece esse carinho de perto.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">Entre na área do cliente ou fale conosco pelo WhatsApp para conhecer melhor nosso atendimento.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/cliente-login" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f7e7c4] px-8 py-4 font-black text-[#12382f] shadow-xl transition hover:-translate-y-1"><CalendarDays size={20} /> Entrar para agendar</Link>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1"><Phone size={20} /> WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
