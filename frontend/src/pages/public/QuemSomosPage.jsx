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

export default function QuemSomosPage() {
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

  return (
    <PublicLayout>
      <main className="relative overflow-hidden">
        <section className="relative bg-[#06150d] px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#22c55e55,transparent_30%),radial-gradient(circle_at_85%_15%,#f59e0b33,transparent_28%)]" />

          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 font-black">
                <PawPrint size={18} />
                Sobre o SPA do Doguinho
              </span>

              <h1 className="text-5xl md:text-7xl font-black text-white mt-7 leading-tight">
                Um espaço pensado para cuidar do seu pet como família.
              </h1>

              <p className="text-white/70 mt-6 text-xl leading-relaxed max-w-2xl">
                O SPA do Doguinho nasceu para unir estética animal, bem-estar, organização e atendimento humanizado em uma experiência moderna, segura e acolhedora para pets e tutores.
              </p>

              <div className="flex flex-wrap gap-4 mt-9">
                <Link to="/agendamento" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl transition">
                  <CalendarDays size={20} />
                  Agendar atendimento
                </Link>

                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/15 transition">
                  <MessageCircle size={20} />
                  Falar no WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 border border-white/10 rounded-[42px] p-4 shadow-2xl backdrop-blur-xl">
              <img src={publicPhotos.heroBath} alt="SPA do Doguinho" className="h-[420px] w-full rounded-[34px] object-cover shadow-2xl" />

              <div className="grid grid-cols-3 gap-4 mt-6">
                {[["+3.500", "pets"], ["5★", "avaliação"], ["100%", "carinho"]].map(([number, label]) => (
                  <div key={label} className="bg-black/20 rounded-3xl p-5 text-center text-white">
                    <div className="text-2xl font-black">{number}</div>
                    <div className="text-white/55 text-sm mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-[36px] p-8 md:p-10 shadow-2xl border border-green-100">
            <img src={publicPhotos.towel} alt="Spa pet relaxante" className="h-[360px] w-full rounded-[28px] object-cover mb-8" />

            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-5 py-2 font-black">
              <Home size={18} />
              Nossa essência
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6">
              Mais do que banho e tosa: uma experiência de confiança.
            </h2>

            <p className="text-slate-500 text-lg mt-5 leading-relaxed">
              Sabemos que o pet faz parte da família. Por isso, cada atendimento é pensado para transmitir segurança ao tutor e conforto ao animal, desde a chegada até a finalização.
            </p>

            <div className="space-y-4 mt-8">
              {steps.map((step) => (
                <div key={step} className="flex items-center gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <CheckCircle className="text-green-600" />
                  <span className="font-bold text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="bg-white/10 border border-white/10 rounded-3xl p-7 text-white shadow-2xl">
                  <Icon className="text-green-300 mb-5" size={38} />
                  <h3 className="text-2xl font-black">{item.title}</h3>
                  <p className="text-white/60 mt-3">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="rounded-[36px] bg-gradient-to-r from-green-700 to-emerald-500 p-10 md:p-14 text-white shadow-2xl grid lg:grid-cols-3 gap-8 items-center overflow-hidden relative">
            <img src="/images/cliente-premium.svg" alt="Área do cliente" className="absolute right-0 bottom-0 w-[340px] opacity-20 hidden lg:block" />
            <div className="lg:col-span-2 relative">
              <span className="inline-flex items-center gap-2 bg-white/15 rounded-full px-5 py-2 font-black">
                <Award size={18} />
                Diferenciais
              </span>

              <h2 className="text-4xl md:text-5xl font-black mt-6">
                Visual moderno, atendimento humano e cuidado profissional.
              </h2>

              <p className="text-white/85 mt-5 text-lg max-w-3xl">
                Nosso objetivo é entregar uma experiência bonita, prática e segura: do agendamento ao pós-atendimento.
              </p>
            </div>

            <div className="bg-white/15 border border-white/20 rounded-3xl p-7 relative">
              <div className="flex text-yellow-300 gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((item) => <Star key={item} size={20} fill="currentColor" />)}
              </div>
              <h3 className="text-2xl font-black">Seu pet merece esse carinho</h3>
              <p className="text-white/80 mt-3">Agende um horário e conheça nosso cuidado de perto.</p>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
