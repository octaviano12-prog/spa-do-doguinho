import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Gift,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  Quote,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Syringe,
  Timer,
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const whatsappHref = "https://wa.me/5518997493722?text=Olá! Gostaria de agendar um atendimento no SPA do Doguinho.";

const services = [
  {
    title: "Banho & Tosa",
    icon: Scissors,
    image: "/images/banho-tosa.svg",
    desc: "Higiene completa, pelagem bem cuidada e acabamento profissional para cada porte.",
  },
  {
    title: "Vacinação Pet",
    icon: Syringe,
    image: "/images/vacina-pet.svg",
    desc: "Controle de vacinas e cuidados preventivos para manter seu melhor amigo protegido.",
  },
  {
    title: "Spa Relaxante",
    icon: Heart,
    image: "/images/spa-pet.svg",
    desc: "Uma experiência tranquila, carinhosa e confortável para o pet se sentir acolhido.",
  },
];

const benefits = [
  "Ambiente limpo, seguro e acolhedor.",
  "Produtos de qualidade para pele e pelagem.",
  "Atendimento humanizado para pets e tutores.",
  "Agendamento online simples e rápido.",
];

const sizes = [
  { label: "Pequeno", text: "Ideal para pets menores e banhos rápidos.", tag: "Sob consulta" },
  { label: "Médio", text: "Cuidado completo para rotina de banho e tosa.", tag: "Mais escolhido" },
  { label: "Grande", text: "Tempo e atenção especiais para pets maiores.", tag: "Avaliação" },
  { label: "Especial", text: "Pelagem densa, nós, comportamento ou cuidados extras.", tag: "Personalizado" },
];

const steps = [
  { title: "Escolha o serviço", text: "Selecione banho, tosa, vacina ou spa." },
  { title: "Informe o pet", text: "Cadastre ou escolha o doguinho que será atendido." },
  { title: "Escolha o horário", text: "Veja somente datas e horários disponíveis." },
  { title: "Confirme", text: "Finalize o agendamento pelo site ou WhatsApp." },
];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#edf6ed] text-[#102d27]">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-24 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#19534e] text-white shadow-2xl transition hover:scale-105"
          aria-label="Chamar no WhatsApp"
        >
          <MessageCircle size={28} />
        </a>

        <section className="relative min-h-[760px] overflow-hidden bg-[#dcefe3] px-5 pb-16 pt-10 md:px-8 2xl:px-10">
          <div className="absolute left-[-160px] top-[-140px] h-[420px] w-[420px] rounded-full bg-[#0d8b67]/18 blur-3xl" />
          <div className="absolute right-[-130px] top-[120px] h-[460px] w-[460px] rounded-full bg-[#f4c86a]/24 blur-3xl" />
          <div className="absolute bottom-[-160px] left-[35%] h-[420px] w-[420px] rounded-full bg-white/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1680px] gap-10 xl:grid-cols-[1.03fr_.97fr] xl:items-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="py-12 xl:py-24"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b7d7c2]/80 bg-white/85 px-5 py-2 text-sm font-black text-[#19534e] shadow-sm backdrop-blur">
                <Star size={16} fill="currentColor" /> Estética pet premium em Sud Mennucci
              </div>

              <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[.92] tracking-tight md:text-7xl 2xl:text-8xl">
                Banho, tosa e carinho para o seu <span className="text-[#0d8b67]">doguinho brilhar</span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl">
                Um espaço moderno para cuidar da higiene, beleza, saúde e bem-estar do seu pet com agenda online, atendimento acolhedor e experiência premium.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/agendamento"
                  className="inline-flex items-center gap-3 rounded-2xl bg-[#19534e] px-7 py-4 font-black text-white shadow-[0_22px_50px_rgba(25,83,78,.24)] transition hover:-translate-y-0.5 hover:bg-[#123f3b]"
                >
                  <CalendarCheck size={18} /> Agendar pelo site
                </Link>

                <Link
                  to="/agendamento-mobile"
                  className="inline-flex items-center gap-3 rounded-2xl border border-[#b7d7c2] bg-white/80 px-7 py-4 font-black text-[#102d27] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <PawPrint size={18} /> Agendar no celular
                </Link>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-2xl border border-[#b7d7c2] bg-white/80 px-7 py-4 font-black text-[#102d27] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Phone size={18} /> WhatsApp
                </a>
              </div>

              <div className="mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
                {[
                  { icon: ShieldCheck, title: "Ambiente seguro", text: "Conforto e cuidado em cada atendimento" },
                  { icon: Heart, title: "Equipe cuidadosa", text: "Seu pet tratado com carinho" },
                  { icon: Leaf, title: "Produtos premium", text: "Qualidade para pele e pelagem" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[28px] border border-[#b7d7c2]/70 bg-white/75 p-6 shadow-xl backdrop-blur">
                      <Icon className="text-[#0d8b67]" size={26} />
                      <strong className="mt-4 block text-lg font-black">{item.title}</strong>
                      <span className="mt-1 block text-sm text-slate-600">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto flex min-h-[560px] w-full max-w-[650px] items-center justify-center xl:min-h-[660px]"
            >
              <div className="absolute inset-6 rounded-full bg-white/55 blur-2xl" />
              <div className="absolute right-6 top-8 rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-2 text-[#19534e]">
                  <Timer size={20} />
                  <strong>Agenda online</strong>
                </div>
                <span className="mt-1 block text-xs font-bold text-slate-500">rápida e prática</span>
              </div>

              <div className="relative flex h-[440px] w-[440px] items-end justify-center overflow-hidden rounded-[54px] border border-white/80 bg-gradient-to-br from-white via-[#e6f3ef] to-[#b7d7c2] shadow-[0_34px_90px_rgba(25,83,78,.22)] md:h-[540px] md:w-[540px]">
                <img
                  src="/images/hero-doguinho-banho-compatible.svg"
                  alt="Cachorro feliz no SPA do Doguinho"
                  className="h-full w-full object-contain object-bottom p-4 md:p-6"
                />
              </div>

              <div className="absolute bottom-8 left-0 rounded-[30px] border border-[#b7d7c2]/70 bg-white/90 p-5 shadow-2xl backdrop-blur">
                <div className="flex gap-1 text-[#f4c86a]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <strong className="mt-3 block text-xl font-black">5.0 de avaliação</strong>
                <span className="text-sm text-slate-500">Clientes e pets felizes</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-5 px-5 py-12 md:grid-cols-4 md:px-8 2xl:px-10">
          {[
            { icon: PawPrint, value: "+3.500", label: "Pets atendidos" },
            { icon: Award, value: "5 anos", label: "De experiência" },
            { icon: Clock, value: "Online", label: "Agenda fácil" },
            { icon: Gift, value: "Premium", label: "Atendimento especial" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={value} className="rounded-[30px] bg-white p-6 text-center shadow-xl ring-1 ring-[#b7d7c2]/40">
              <Icon className="mx-auto text-[#19534e]" size={28} />
              <strong className="mt-4 block text-3xl font-black text-[#0d8b67]">{value}</strong>
              <span className="mt-1 block text-sm font-bold text-slate-500">{label}</span>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-12 md:px-8 2xl:px-10">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#dcefe3] px-5 py-2 text-sm font-black text-[#19534e]">
              <Sparkles size={16} /> Serviços especiais
            </span>
            <h2 className="mt-5 text-4xl font-black md:text-6xl">Tudo que seu pet precisa em um só lugar</h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-600">
              Serviços pensados para cada rotina, cada porte e cada necessidade do seu melhor amigo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map(({ title, icon: Icon, image, desc }) => (
              <motion.div key={title} whileHover={{ y: -8 }} className="overflow-hidden rounded-[34px] bg-white shadow-xl ring-1 ring-[#b7d7c2]/40">
                <div className="flex h-48 items-center justify-center bg-[#e7f4eb] p-6">
                  <img src={image} alt={title} className="h-full max-h-40 w-full object-contain" />
                </div>
                <div className="p-8">
                  <Icon className="text-[#19534e]" size={34} />
                  <strong className="mt-5 block text-2xl font-black">{title}</strong>
                  <p className="mt-3 text-slate-600">{desc}</p>
                  <Link to="/servicos" className="mt-7 inline-flex items-center gap-2 font-black text-[#0d8b67]">
                    Ver serviços <CheckCircle2 size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-12 md:px-8 2xl:px-10">
          <div className="grid gap-6 rounded-[42px] bg-white p-6 shadow-xl ring-1 ring-[#b7d7c2]/40 md:p-10 xl:grid-cols-[.8fr_1.2fr] xl:items-center">
            <div>
              <span className="text-sm font-black uppercase tracking-widest text-[#0d8b67]">Preços por porte</span>
              <h2 className="mt-4 text-4xl font-black md:text-5xl">Cada doguinho tem um cuidado especial</h2>
              <p className="mt-4 text-slate-600">
                O valor pode variar conforme porte, pelagem, comportamento, nós e tipo de serviço. A avaliação garante um atendimento justo e seguro.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {sizes.map((item) => (
                <div key={item.label} className="rounded-[28px] border border-[#b7d7c2]/70 bg-[#edf6ed] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-xl font-black">{item.label}</strong>
                    <span className="rounded-full bg-[#19534e] px-3 py-1 text-xs font-black text-white">{item.tag}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-14 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1680px] gap-8 rounded-[42px] bg-[#19534e] p-8 text-white shadow-2xl md:p-12 xl:grid-cols-[1fr_1fr] xl:items-center">
            <div>
              <span className="text-sm font-black uppercase tracking-widest text-[#f4c86a]">Como funciona?</span>
              <h2 className="mt-5 text-4xl font-black md:text-6xl">Agendar ficou simples, rápido e seguro</h2>
              <p className="mt-5 text-white/72">
                O tutor escolhe o serviço, pet, data e horário. O sistema mostra apenas opções disponíveis.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((item, index) => (
                <div key={item.title} className="flex gap-4 rounded-2xl bg-white/10 p-5 text-white/90">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4c86a] font-black text-[#19534e]">
                    {index + 1}
                  </span>
                  <div>
                    <strong className="block text-lg font-black text-white">{item.title}</strong>
                    <span className="text-sm text-white/70">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-12 md:px-8 2xl:px-10">
          <div className="grid gap-8 rounded-[42px] bg-[#102d27] p-8 text-white shadow-2xl md:p-12 xl:grid-cols-[1fr_1fr] xl:items-center">
            <div>
              <span className="text-sm font-black uppercase tracking-widest text-[#f4c86a]">Por que escolher a gente?</span>
              <h2 className="mt-5 text-4xl font-black md:text-6xl">Um atendimento pensado para o pet e para o tutor</h2>
              <p className="mt-5 text-white/72">
                Tecnologia, agendamento online e muito carinho para transformar cada visita em uma experiência especial.
              </p>
            </div>
            <div className="grid gap-4">
              {benefits.map((text) => (
                <div key={text} className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 font-bold text-white/90">
                  <CheckCircle2 className="text-[#f4c86a]" size={22} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-12 md:px-8 2xl:px-10">
          <div className="mb-10 text-center">
            <span className="inline-flex rounded-full bg-[#dcefe3] px-5 py-2 text-sm font-black text-[#19534e]">Depoimentos</span>
            <h2 className="mt-5 text-4xl font-black md:text-6xl">Quem conhece recomenda</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {["Meu pet voltou cheiroso, calmo e muito bem cuidado.", "Gostei muito do agendamento online. Rápido e fácil.", "Equipe atenciosa e espaço organizado. Recomendo!"].map((text, index) => (
              <div key={text} className="rounded-[30px] bg-white p-7 shadow-xl ring-1 ring-[#b7d7c2]/40">
                <Quote className="text-[#0d8b67]" size={28} />
                <p className="mt-5 text-lg text-slate-700">“{text}”</p>
                <strong className="mt-5 block">Cliente {index + 1}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1680px] gap-8 rounded-[42px] bg-[#0d8b67] p-8 text-white shadow-2xl md:p-12 xl:grid-cols-[1fr_auto] xl:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#f4c86a]">
                <MapPin size={15} /> Agendamento fácil
              </span>
              <h2 className="mt-4 text-4xl font-black md:text-5xl">Pronto para mimar seu doguinho?</h2>
              <p className="mt-3 text-white/80">Agende pelo site, pelo celular ou fale direto no WhatsApp.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/agendamento" className="rounded-2xl bg-white px-7 py-4 font-black text-[#0d8b67]">Começar agendamento</Link>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/30 px-7 py-4 font-black text-white">WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
