import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MessageCircle,
  PawPrint,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Syringe,
  Wand2
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const photos = {
  hero: "/images/hero-doguinho-banho-compatible.svg",
  bath: "/images/banho-tosa.svg",
  vaccine: "/images/vacina-pet.svg",
  spa: "/images/spa-pet.svg",
  client: "/images/cliente-premium.svg"
};

const whatsappUrl =
  "https://wa.me/5518997493722?text=Olá! Gostaria de agendar um atendimento no SPA do Doguinho.";

const services = [
  {
    icon: Bath,
    title: "Banho Premium",
    text: "Higiene completa, produtos selecionados, secagem cuidadosa e finalização cheirosa.",
    price: "A partir de R$ 60",
    image: photos.bath
  },
  {
    icon: Scissors,
    title: "Tosa e Higiene",
    text: "Tosa conforme porte, pelagem e estilo, com acabamento limpo e delicado.",
    price: "Sob consulta",
    image: photos.bath
  },
  {
    icon: Sparkles,
    title: "Spa e Bem-estar",
    text: "Cuidado relaxante para deixar seu pet confortável, bonito e feliz.",
    price: "Pacotes especiais",
    image: photos.spa
  },
  {
    icon: Syringe,
    title: "Vacinas",
    text: "Organização do cuidado preventivo com segurança e histórico do pet.",
    price: "Consulte agenda",
    image: photos.vaccine
  }
];

const benefits = [
  ["Atendimento com amor", "Seu pet é recebido com carinho, paciência e respeito ao comportamento dele.", Heart],
  ["Ambiente seguro", "Espaço pensado para conforto, higiene e tranquilidade durante o atendimento.", ShieldCheck],
  ["Agendamento fácil", "Escolha serviço, porte, data e horário em poucos cliques pelo celular.", CalendarCheck]
];

const gallery = [photos.bath, photos.spa, photos.vaccine, photos.client];

const testimonials = [
  ["Meu doguinho voltou cheiroso, tranquilo e muito feliz. Atendimento impecável!", "Cliente SPA"],
  ["O agendamento online facilitou demais. Visual lindo e serviço excelente.", "Tutora feliz"],
  ["Ambiente organizado, bonito e com muito cuidado pelos pets.", "Cliente premium"]
];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fbf8ef] text-[#14382f]">
        <section className="relative overflow-hidden px-5 pb-12 pt-8 md:px-8 lg:pt-12 2xl:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(13,139,103,.18),transparent_30%),radial-gradient(circle_at_84%_14%,rgba(244,200,106,.28),transparent_28%),linear-gradient(135deg,#f7fbf1_0%,#e6f5eb_46%,#fff7e7_100%)]" />
          <div className="absolute left-10 top-24 hidden h-24 w-24 rounded-full border border-[#0d8b67]/20 md:block" />
          <div className="absolute bottom-14 right-10 hidden h-32 w-32 rounded-full bg-[#f4c86a]/20 blur-2xl md:block" />

          <div className="relative mx-auto grid min-h-[calc(100vh-130px)] max-w-[1760px] gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
            <div className="z-10 max-w-3xl py-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0d8b67]/15 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-[#0d8b67] shadow-sm backdrop-blur md:text-sm">
                <Sparkles size={16} /> Pet shop premium em Sud Mennucci
              </span>

              <h1 className="mt-6 text-5xl font-black leading-[.92] tracking-[-.05em] text-[#12382f] sm:text-6xl lg:text-7xl 2xl:text-8xl">
                Mais que um banho,
                <span className="mt-2 block text-[#0d8b67]">um momento de amor!</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-700 md:text-xl">
                Banho, tosa, vacinas e cuidados especiais para deixar seu doguinho lindo,
                cheiroso e feliz, com agendamento online em poucos cliques.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/agendamento"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#0d6b54] px-7 py-4 font-black text-white shadow-[0_22px_45px_rgba(13,107,84,.25)] transition hover:-translate-y-1 hover:bg-[#095642]"
                >
                  <CalendarDays size={20} /> Agende agora
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/servicos"
                  className="inline-flex items-center gap-3 rounded-full border border-[#b7d7c2] bg-white/85 px-7 py-4 font-black text-[#12382f] shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-[#0d6b54]"
                >
                  <Wand2 size={20} /> Nossos serviços
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <div className="flex -space-x-3">
                  {gallery.map((photo, index) => (
                    <div key={index} className="h-12 w-12 overflow-hidden rounded-full border-[3px] border-white bg-[#e6f5eb] shadow-md">
                      <img src={photo} alt="Pet feliz" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-1 text-[#f4b942]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-1 text-sm font-black text-slate-600">Mais de 500 pets felizes</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[470px] lg:min-h-[690px]">
              <div className="absolute inset-0 rounded-[44px] bg-white/55 shadow-[0_35px_90px_rgba(13,107,84,.18)] ring-1 ring-white/70 backdrop-blur" />
              <div className="absolute inset-5 overflow-hidden rounded-[38px] bg-[#dff3ea]">
                <img src={photos.hero} alt="Doguinho no banho" className="h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12382f]/10 via-transparent to-white/10" />
              </div>

              <div className="absolute left-2 top-8 hidden rounded-[26px] bg-white/90 p-4 shadow-2xl backdrop-blur md:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f5eb] text-[#0d6b54]"><Heart fill="currentColor" /></div>
                  <div>
                    <div className="font-black">Cuidado com carinho</div>
                    <div className="text-xs font-bold text-slate-500">Rotina tranquila para o pet</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-2 hidden max-w-[280px] rounded-[26px] bg-white/90 p-4 shadow-2xl backdrop-blur md:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3cf] text-[#b98212]"><ShieldCheck /></div>
                  <div>
                    <div className="font-black">Ambiente seguro</div>
                    <div className="text-xs font-bold text-slate-500">Higiene, conforto e proteção</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative -mt-8 px-5 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1760px] gap-5 rounded-[38px] bg-white p-5 shadow-[0_24px_70px_rgba(16,56,47,.10)] ring-1 ring-[#d7eadf] md:grid-cols-4 md:p-6">
            {services.map(({ icon: Icon, title, text, price, image }) => (
              <div key={title} className="group overflow-hidden rounded-[30px] bg-[#fbf8ef] p-4 ring-1 ring-[#d7eadf] transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                <div className="relative h-40 overflow-hidden rounded-[24px] bg-[#dff3ea]">
                  <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#0d6b54] shadow-lg">
                    <Icon size={25} />
                  </div>
                </div>
                <div className="p-2 pt-5">
                  <h3 className="text-xl font-black text-[#12382f]">{title}</h3>
                  <p className="mt-2 min-h-[72px] text-sm leading-relaxed text-slate-600">{text}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-[#0d6b54]">{price}</span>
                    <Link to="/agendamento" className="rounded-full bg-[#0d6b54] px-4 py-2 text-xs font-black text-white transition hover:bg-[#095642]">Agendar</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-16 md:px-8 2xl:px-10">
          <div className="mx-auto max-w-[1760px]">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f5eb] px-5 py-2 text-sm font-black text-[#0d6b54]"><PawPrint size={16} /> Por que escolher</span>
              <h2 className="mt-5 text-4xl font-black tracking-[-.04em] md:text-6xl">Seu pet merece esse cuidado.</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {benefits.map(([title, text, Icon]) => (
                <div key={title} className="rounded-[34px] bg-white p-8 text-center shadow-xl ring-1 ring-[#d7eadf] transition hover:-translate-y-1 hover:shadow-2xl">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e6f5eb] text-[#0d6b54]"><Icon size={32} /></div>
                  <h3 className="mt-6 text-2xl font-black">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-4 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1760px] overflow-hidden rounded-[44px] bg-white shadow-[0_28px_80px_rgba(16,56,47,.12)] ring-1 ring-[#d7eadf] lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative min-h-[360px] bg-[#dff3ea]">
              <img src={photos.client} alt="Agendamento pet" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12382f]/20 to-transparent" />
            </div>

            <div className="p-7 md:p-10 lg:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f5eb] px-5 py-2 text-sm font-black text-[#0d6b54]"><CalendarCheck size={16} /> Agendamento rápido</span>
              <h2 className="mt-5 text-4xl font-black tracking-[-.04em] md:text-5xl">Escolha o melhor horário pelo site.</h2>
              <p className="mt-4 text-slate-600">Simule o atendimento e siga para a página de agendamento para confirmar com segurança.</p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {["Escolher pet", "Porte do cachorro", "Serviço desejado", "Data e horário"].map((label) => (
                  <div key={label} className="rounded-2xl border border-[#d7eadf] bg-[#fbf8ef] px-5 py-4">
                    <div className="text-xs font-black uppercase tracking-[.12em] text-[#0d6b54]">{label}</div>
                    <div className="mt-2 flex items-center justify-between font-black text-[#12382f]">
                      Selecionar <ArrowRight size={17} />
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/agendamento" className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642] md:w-auto">
                Fazer agendamento <ArrowRight size={18} />
              </Link>

              <div className="mt-6 grid gap-3 text-sm font-bold text-slate-600 md:grid-cols-3">
                {["Confirmação rápida", "Sem complicação", "Lembrete pelo atendimento"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#0d6b54]" /> {item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-8 2xl:px-10">
          <div className="mx-auto max-w-[1760px]">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f5eb] px-5 py-2 text-sm font-black text-[#0d6b54]"><Sparkles size={16} /> Nossa galeria</span>
                <h2 className="mt-5 text-4xl font-black tracking-[-.04em] md:text-6xl">Pets lindos e felizes.</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Todos", "Banho", "Tosa", "Antes e depois"].map((filter) => (
                  <span key={filter} className="rounded-full border border-[#d7eadf] bg-white px-4 py-2 text-sm font-black text-slate-600">{filter}</span>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-4">
              {gallery.map((photo, index) => (
                <div key={index} className="group h-72 overflow-hidden rounded-[32px] bg-[#dff3ea] shadow-xl ring-1 ring-[#d7eadf]">
                  <img src={photo} alt="Galeria SPA do Doguinho" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8 2xl:px-10">
          <div className="mx-auto max-w-[1760px] rounded-[44px] bg-[#e6f5eb] p-7 md:p-12">
            <div className="mb-9 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-black text-[#0d6b54]"><Star size={16} fill="currentColor" /> Depoimentos</span>
              <h2 className="mt-5 text-4xl font-black tracking-[-.04em] md:text-6xl">Quem conhece, recomenda.</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map(([text, name]) => (
                <div key={text} className="rounded-[32px] bg-white p-7 shadow-lg ring-1 ring-[#d7eadf]">
                  <div className="flex gap-1 text-[#f4b942]">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={17} fill="currentColor" />)}</div>
                  <p className="mt-5 text-lg font-semibold leading-relaxed text-slate-700">“{text}”</p>
                  <div className="mt-6 font-black text-[#0d6b54]">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8 2xl:px-10">
          <div className="mx-auto overflow-hidden rounded-[46px] bg-[#0b352b] p-8 text-white shadow-2xl md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-black text-[#f4c86a]"><PawPrint size={16} /> SPA do Doguinho</span>
                <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-.04em] md:text-6xl">Seu pet merece cuidado, carinho e beleza.</h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">Faça seu agendamento online ou fale direto pelo WhatsApp.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/agendamento" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f4c86a] px-8 py-4 font-black text-[#12382f] shadow-xl transition hover:-translate-y-1 hover:bg-[#ffd979]"><CalendarDays size={20} /> Agendar agora</Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"><Phone size={20} /> WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
