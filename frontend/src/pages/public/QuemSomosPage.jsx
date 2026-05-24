import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  CalendarDays,
  CheckCircle,
  Heart,
  Home,
  MessageCircle,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "../../components/public/PublicLayout";
import { publicPhotos } from "../../data/publicPhotos";

const values = [
  { icon: Heart, title: "Carinho em primeiro lugar", text: "Cada pet é tratado com paciência, respeito e atenção aos detalhes." },
  { icon: ShieldCheck, title: "Segurança e higiene", text: "Ambiente organizado, limpo e preparado para um atendimento tranquilo." },
  { icon: Sparkles, title: "Acabamento premium", text: "Produtos adequados, cuidado com a pelagem e resultado bonito." },
  { icon: Users, title: "Tutor bem informado", text: "Atendimento claro, comunicação rápida e orientação sempre que necessário." }
];

const steps = [
  "Recepção cuidadosa do pet",
  "Avaliação rápida da pelagem e necessidade",
  "Banho, tosa ou cuidado especial com calma",
  "Finalização, perfume e orientação ao tutor"
];

export default function QuemSomosPage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fbf7ef] text-[#10231a]">
        <section className="relative bg-[#f5efe4] px-5 py-16 md:px-8">
          <div className="mx-auto grid max-w-[1680px] gap-10 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-2 text-sm font-black text-emerald-900 shadow-sm">
                <PawPrint size={18} />
                Sobre o SPA do Doguinho
              </span>

              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[.96] md:text-7xl">
                Um espaço boutique para cuidar do seu pet como família.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Unimos estética animal, bem-estar e atendimento humanizado em uma rotina moderna, segura e acolhedora para pets e tutores.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/agendamento" className="flex items-center gap-3 rounded-2xl bg-[#0f7a3b] px-8 py-4 font-black text-white shadow-[0_20px_45px_rgba(15,122,59,.22)] transition hover:bg-[#0b6631]">
                  <CalendarDays size={20} />
                  Agendar atendimento
                </Link>

                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-8 py-4 font-black text-[#10231a] shadow-sm transition hover:border-emerald-700">
                  <MessageCircle size={20} />
                  Falar no WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative min-h-[560px]">
              <img src={publicPhotos.heroBath} alt="SPA do Doguinho" className="absolute right-0 top-0 h-[440px] w-[84%] rounded-[42px] object-cover shadow-2xl" />
              <img src={publicPhotos.towel} alt="Spa pet relaxante" className="absolute bottom-0 left-0 hidden h-72 w-[44%] rounded-[32px] border-[10px] border-[#f5efe4] object-cover shadow-2xl md:block" />
              <div className="absolute bottom-8 right-10 grid w-[360px] grid-cols-3 gap-3 rounded-[28px] bg-white/90 p-4 shadow-2xl backdrop-blur">
                {[["+3.500", "pets"], ["5★", "avaliação"], ["100%", "carinho"]].map(([number, label]) => (
                  <div key={label} className="rounded-2xl bg-emerald-50 p-4 text-center">
                    <div className="text-xl font-black text-[#0f7a3b]">{number}</div>
                    <div className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-10 px-5 py-16 md:px-8 xl:grid-cols-[1.05fr_.95fr] xl:items-center">
          <div className="rounded-[36px] bg-white p-8 shadow-xl ring-1 ring-black/5 md:p-10">
            <img src={publicPhotos.salon} alt="Atendimento pet premium" className="mb-8 h-[360px] w-full rounded-[28px] object-cover" />

            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 font-black text-emerald-900">
              <Home size={18} />
              Nossa essência
            </span>

            <h2 className="mt-6 text-4xl font-black md:text-5xl">
              Mais do que banho e tosa: uma experiência de confiança.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Sabemos que o pet faz parte da família. Por isso, cada atendimento transmite segurança ao tutor e conforto ao animal, desde a chegada até a finalização.
            </p>

            <div className="mt-8 space-y-4">
              {steps.map((step) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <CheckCircle className="text-[#0f7a3b]" />
                  <span className="font-bold text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-[30px] bg-white p-7 shadow-xl ring-1 ring-black/5">
                  <Icon className="mb-5 text-[#0f7a3b]" size={38} />
                  <h3 className="text-2xl font-black">{item.title}</h3>
                  <p className="mt-3 text-slate-600">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] px-5 pb-20 md:px-8">
          <div className="relative overflow-hidden rounded-[36px] bg-[#10231a] p-10 text-white shadow-2xl md:p-14">
            <img src="/images/cliente-premium.svg" alt="Área do cliente" className="absolute bottom-0 right-0 hidden w-[340px] opacity-20 lg:block" />
            <div className="relative grid gap-8 lg:grid-cols-3 lg:items-center">
              <div className="lg:col-span-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 font-black">
                  <Award size={18} />
                  Diferenciais
                </span>

                <h2 className="mt-6 text-4xl font-black md:text-5xl">
                  Visual moderno, atendimento humano e cuidado profissional.
                </h2>

                <p className="mt-5 max-w-3xl text-lg text-white/80">
                  Do agendamento ao pós-atendimento, tudo foi pensado para tornar a experiência mais prática, bonita e segura.
                </p>
              </div>

              <div className="relative rounded-[30px] border border-white/15 bg-white/10 p-7">
                <div className="mb-4 flex gap-1 text-yellow-300">
                  {[1, 2, 3, 4, 5].map((item) => <Star key={item} size={20} fill="currentColor" />)}
                </div>
                <h3 className="text-2xl font-black">Seu pet merece esse carinho</h3>
                <p className="mt-3 text-white/80">Agende um horário e conheça nosso cuidado de perto.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
