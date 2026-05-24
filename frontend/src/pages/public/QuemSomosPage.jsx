import React from "react";
import { Link } from "react-router-dom";
import { Award, CalendarDays, CheckCircle, Heart, MessageCircle, PawPrint, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";
import { publicPhotos } from "../../data/publicPhotos";

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

export default function QuemSomosPage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fbf7ef] text-[#10231a]">
        <section className="relative bg-[#f5efe4] px-5 py-16 md:px-8 md:py-24">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#06140f] to-transparent opacity-10" />
          <div className="relative mx-auto grid max-w-[1680px] gap-10 xl:grid-cols-[.92fr_1.08fr] xl:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-2 text-sm font-black text-emerald-900 shadow-sm"><PawPrint size={16} /> Sobre o SPA do Doguinho</span>
              <h1 className="mt-7 text-5xl font-black leading-[.95] md:text-7xl">Um espaço pensado para cuidar do seu pet como família.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">Unimos estética animal, bem-estar, organização e atendimento humano em uma experiência segura para pets e tutores.</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/agendamento" className="inline-flex items-center gap-3 rounded-2xl bg-[#0f7a3b] px-7 py-4 font-black text-white shadow-[0_20px_45px_rgba(15,122,59,.24)] transition hover:bg-[#0b6631]"><CalendarDays size={19} /> Agendar atendimento</Link>
                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-7 py-4 font-black text-[#10231a] shadow-sm transition hover:border-emerald-700"><MessageCircle size={19} /> Falar no WhatsApp</a>
              </div>
            </div>
            <div className="rounded-[44px] bg-white p-4 shadow-2xl ring-1 ring-black/5">
              <img src={publicPhotos.heroBath} alt="SPA do Doguinho" className="h-[430px] w-full rounded-[34px] object-cover" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[["+3.500", "pets"], ["5★", "experiência"], ["100%", "carinho"]].map(([number, label]) => <div key={label} className="rounded-3xl bg-[#f5efe4] p-5 text-center"><div className="text-2xl font-black text-[#0f7a3b]">{number}</div><div className="mt-1 text-xs font-black uppercase text-slate-500">{label}</div></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-8 px-5 py-16 md:px-8 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[36px] bg-white p-8 shadow-xl ring-1 ring-black/5 md:p-10">
            <img src={publicPhotos.towel} alt="Spa pet relaxante" className="mb-8 h-[360px] w-full rounded-[28px] object-cover" />
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 font-black text-emerald-900"><Award size={18} /> Nossa essência</span>
            <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Mais do que banho e tosa: uma experiência de confiança.</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">Cada atendimento é pensado para transmitir segurança ao tutor e conforto ao animal, desde a chegada até a finalização.</p>
            <div className="mt-8 space-y-4">{steps.map((step) => <div key={step} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5"><CheckCircle className="text-emerald-700" /><span className="font-bold text-slate-700">{step}</span></div>)}</div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {values.map((item) => { const Icon = item.icon; return <div key={item.title} className="rounded-[30px] bg-white p-7 shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1"><Icon className="mb-5 text-emerald-700" size={38} /><h3 className="text-2xl font-black">{item.title}</h3><p className="mt-3 leading-relaxed text-slate-600">{item.text}</p></div>; })}
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto grid max-w-[1680px] gap-8 overflow-hidden rounded-[40px] bg-[#10231a] p-8 text-white shadow-2xl md:p-12 xl:grid-cols-[1fr_360px] xl:items-center">
            <div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 font-black text-emerald-100"><Sparkles size={18} /> Diferenciais</span><h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Visual moderno, atendimento humano e cuidado profissional.</h2><p className="mt-5 max-w-3xl text-lg text-white/70">Nosso objetivo é entregar uma experiência bonita, prática e segura: do agendamento ao pós-atendimento.</p></div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-7"><div className="mb-4 flex gap-1 text-yellow-300">{[1, 2, 3, 4, 5].map((item) => <Star key={item} size={20} fill="currentColor" />)}</div><h3 className="text-2xl font-black">Seu pet merece esse carinho</h3><p className="mt-3 text-white/75">Agende um horário e conheça nosso cuidado de perto.</p></div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
