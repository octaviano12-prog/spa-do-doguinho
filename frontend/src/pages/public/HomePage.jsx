import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bath, CalendarDays, CheckCircle, Clock, Heart, MessageCircle, PawPrint, Scissors, ShieldCheck, Sparkles, Star, Syringe } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const photos = {
  hero: "https://images.pexels.com/photos/6131158/pexels-photo-6131158.jpeg?auto=compress&cs=tinysrgb&w=1800",
  bath: "https://images.pexels.com/photos/19145888/pexels-photo-19145888.jpeg?auto=compress&cs=tinysrgb&w=1200",
  towel: "https://images.pexels.com/photos/6131162/pexels-photo-6131162.jpeg?auto=compress&cs=tinysrgb&w=1200",
  grooming: "https://images.pexels.com/photos/19145882/pexels-photo-19145882.jpeg?auto=compress&cs=tinysrgb&w=1200",
  care: "https://images.pexels.com/photos/4432261/pexels-photo-4432261.jpeg?auto=compress&cs=tinysrgb&w=1200",
  vet: "https://images.pexels.com/photos/7468980/pexels-photo-7468980.jpeg?auto=compress&cs=tinysrgb&w=1200",
  happy: "https://images.pexels.com/photos/6816863/pexels-photo-6816863.jpeg?auto=compress&cs=tinysrgb&w=1200"
};

const services = [
  { title: "Banho Premium", icon: Bath, image: photos.bath, text: "Higiene delicada, hidratação e perfume na medida.", price: "R$ 60" },
  { title: "Tosa Boutique", icon: Scissors, image: photos.grooming, text: "Acabamento bonito e seguro para cada pelagem.", price: "R$ 80" },
  { title: "Spa Relaxante", icon: Sparkles, image: photos.towel, text: "Bem-estar, pele e pelagem com cuidado especial.", price: "R$ 95" },
  { title: "Vacinação", icon: Syringe, image: photos.vet, text: "Prevenção e orientação para manter a saúde em dia.", price: "R$ 120" }
];

const steps = [["01", "Recepção", "Chegada calma e acolhimento."], ["02", "Avaliação", "Porte, pelagem e comportamento."], ["03", "Cuidado", "Banho, tosa ou spa premium."], ["04", "Entrega", "Finalização e orientação."]];
const packages = [{ name: "Pequeno", detail: "até 10 kg", price: "R$ 60", time: "~1h" }, { name: "Médio", detail: "10 a 25 kg", price: "R$ 80", time: "~1h30" }, { name: "Grande", detail: "25 a 40 kg", price: "R$ 100", time: "~2h" }, { name: "Gigante", detail: "acima de 40 kg", price: "R$ 120", time: "~2h30" }];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#edf6ed] text-[#102d27]">
        <section className="relative bg-[#dcefe3] px-5 pb-12 pt-8 md:px-8 2xl:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(25,83,78,.16),transparent_30%),radial-gradient(circle_at_86%_10%,rgba(255,244,220,.62),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-[1680px] gap-10 xl:grid-cols-[.82fr_1.18fr] xl:items-center">
            <div className="max-w-4xl py-10 xl:py-20">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#19534e]/10 bg-white/90 px-5 py-2 text-sm font-black text-[#19534e] shadow-sm"><Sparkles size={16} /> Pet boutique em Sud Mennucci</span>
              <h1 className="mt-7 text-5xl font-black leading-[.9] tracking-tight text-[#102d27] md:text-7xl 2xl:text-8xl">Cuidado premium para seu pet ficar impecável.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">Banho, tosa, spa e vacinação com rotina calma, produtos adequados e atendimento cheio de carinho.</p>
              <div className="mt-9 flex flex-wrap gap-4"><Link to="/agendamento" className="group inline-flex items-center gap-3 rounded-2xl bg-[#19534e] px-7 py-4 font-black text-white shadow-[0_20px_45px_rgba(25,83,78,.24)] transition hover:-translate-y-0.5 hover:bg-[#123f3b]"><CalendarDays size={19} /> Agendar agora <ArrowRight size={18} className="transition group-hover:translate-x-1" /></Link><a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#b7d7c2] bg-white px-7 py-4 font-black text-[#102d27] shadow-sm transition hover:-translate-y-0.5 hover:border-[#19534e]"><MessageCircle size={19} /> Falar no WhatsApp</a></div>
              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">{[["+3.500", "pets atendidos"], ["5★", "experiência"], ["online", "agenda fácil"]].map(([value, label]) => <div key={label} className="rounded-3xl bg-white/90 p-5 shadow-lg ring-1 ring-[#b7d7c2]/40"><div className="text-2xl font-black text-[#0d8b67]">{value}</div><div className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</div></div>)}</div>
            </div>
            <div className="relative min-h-[640px]">
              <div className="absolute inset-0 overflow-hidden rounded-[54px] bg-slate-200 shadow-2xl ring-1 ring-black/5"><img src={photos.hero} alt="Pet limpo enrolado em toalha" className="h-full w-full object-cover" /></div>
              <div className="absolute left-8 top-8 hidden rounded-[30px] bg-white/92 p-5 shadow-2xl backdrop-blur md:block"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f3ef] text-[#19534e]"><ShieldCheck size={28} /></div><div><div className="font-black text-[#102d27]">Rotina segura</div><p className="text-sm text-slate-500">Do banho à entrega.</p></div></div></div>
              <div className="absolute -bottom-8 left-8 hidden w-[360px] overflow-hidden rounded-[34px] border-[10px] border-[#dcefe3] bg-white shadow-2xl md:block"><img src={photos.bath} alt="Banho cuidadoso" className="h-56 w-full object-cover" /><div className="p-5"><div className="flex gap-1 text-[#f4c86a]">{[1, 2, 3, 4, 5].map((item) => <Star key={item} size={16} fill="currentColor" />)}</div><h3 className="mt-2 text-xl font-black">Banho cuidadoso</h3></div></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-12 md:px-8 2xl:px-10"><div className="grid gap-5 md:grid-cols-4">{[[CalendarDays, "Agenda prática", "Reserve pelo site."], [Sparkles, "Produtos premium", "Finalização adequada."], [ShieldCheck, "Ambiente seguro", "Higiene e organização."], [Heart, "Carinho real", "Calma e respeito."]].map(([Icon, title, text]) => <Feature key={title} Icon={Icon} title={title} text={text} />)}</div></section>

        <section className="mx-auto max-w-[1680px] px-5 py-10 md:px-8 2xl:px-10"><div className="rounded-[44px] bg-white p-6 shadow-xl ring-1 ring-[#b7d7c2]/40 md:p-8"><div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><span className="inline-flex rounded-full bg-[#dcefe3] px-5 py-2 text-sm font-black text-[#19534e]">Serviços</span><h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Escolha o cuidado ideal.</h2></div><Link to="/servicos" className="inline-flex items-center gap-2 font-black text-[#19534e]">Ver todos <ArrowRight size={18} /></Link></div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{services.map((service) => <ServiceCard key={service.title} {...service} />)}</div></div></section>

        <section className="px-5 py-14 md:px-8 2xl:px-10"><div className="mx-auto grid max-w-[1680px] gap-8 rounded-[42px] bg-[#19534e] p-8 text-white shadow-2xl md:p-12 xl:grid-cols-[.7fr_1.3fr] xl:items-center"><div><span className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-[#dcefe3]">Experiência</span><h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Simples, limpo e confiável.</h2><p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">O tutor entende cada etapa do cuidado.</p></div><div className="grid gap-4 md:grid-cols-4">{steps.map(([number, title, text]) => <StepCard key={number} number={number} title={title} text={text} />)}</div></div></section>

        <section className="mx-auto max-w-[1680px] px-5 py-10 md:px-8 2xl:px-10"><div className="grid gap-8 xl:grid-cols-[.9fr_1.1fr]"><div className="rounded-[36px] bg-white p-8 shadow-xl ring-1 ring-[#b7d7c2]/40"><span className="inline-flex rounded-full bg-[#dcefe3] px-5 py-2 text-sm font-black text-[#19534e]">Pacotes</span><h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">Preço por porte, sem complicar.</h2><p className="mt-4 text-slate-600">O valor e tempo mudam conforme porte e necessidade do pet.</p><img src={photos.care} alt="Kit de cuidado pet" className="mt-8 h-72 w-full rounded-[28px] object-cover" /></div><div className="grid gap-5 md:grid-cols-2">{packages.map((item) => <PackageCard key={item.name} {...item} />)}</div></div></section>

        <section className="mx-auto max-w-[1680px] px-5 py-16 md:px-8 2xl:px-10"><div className="grid gap-5 md:grid-cols-[1.1fr_.9fr_1fr]"><GalleryPhoto image={photos.grooming} title="Tosa com acabamento" /><GalleryPhoto image={photos.towel} title="Pós-banho confortável" tall /><GalleryPhoto image={photos.happy} title="Rotina com carinho" /></div></section>

        <section className="px-5 pb-16 md:px-8 2xl:px-10"><div className="mx-auto max-w-[1680px] overflow-hidden rounded-[40px] bg-[#0d8b67] shadow-2xl"><div className="grid gap-8 p-8 text-white md:p-10 xl:grid-cols-[1fr_auto] xl:items-center"><div><h2 className="text-4xl font-black md:text-5xl">Pronto para deixar seu pet impecável?</h2><p className="mt-3 max-w-3xl text-white/85">Agende banho, tosa ou spa e ofereça uma experiência premium para seu melhor amigo.</p></div><div className="flex flex-wrap gap-4"><Link to="/agendamento" className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-[#0d8b67] transition hover:bg-[#edf6ed]"><CalendarDays size={18} /> Agendar agora</Link><a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-7 py-4 font-black text-white transition hover:bg-white/10"><MessageCircle size={18} /> WhatsApp</a></div></div></div></section>
      </main>
    </PublicLayout>
  );
}

function Feature({ Icon, title, text }) { return <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-[#b7d7c2]/40 transition hover:-translate-y-1 hover:shadow-xl"><Icon className="text-[#19534e]" size={32} /><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p></div>; }
function ServiceCard({ title, icon: Icon, image, text, price }) { return <article className="group overflow-hidden rounded-[30px] bg-[#f7fbf7] ring-1 ring-[#dcefe3] transition hover:-translate-y-1 hover:shadow-xl"><div className="relative h-56 overflow-hidden"><img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#19534e] shadow-xl"><Icon size={24} /></div></div><div className="p-6"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 min-h-[66px] text-sm text-slate-600">{text}</p><div className="mt-5 flex items-end justify-between border-t border-[#dcefe3] pt-5"><span className="text-xs font-bold text-slate-400">A partir de</span><strong className="text-2xl text-[#0d8b67]">{price}</strong></div></div></article>; }
function StepCard({ number, title, text }) { return <div className="rounded-[28px] border border-white/10 bg-white/10 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4c86a] font-black text-[#102d27]">{number}</span><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-3 text-sm text-white/70">{text}</p></div>; }
function PackageCard({ name, detail, price, time }) { return <div className="rounded-[30px] bg-white p-6 shadow-xl ring-1 ring-[#b7d7c2]/40 transition hover:-translate-y-1"><div className="flex items-start justify-between gap-4"><div><h3 className="text-2xl font-black">{name}</h3><p className="mt-1 text-slate-500">{detail}</p></div><PawPrint className="text-[#19534e]" size={30} /></div><p className="mt-8 text-sm font-bold text-slate-400">Banho a partir de</p><div className="mt-1 text-4xl font-black text-[#0d8b67]">{price}</div><div className="mt-5 flex items-center gap-2 text-slate-600"><Clock size={18} />{time}</div><Link to="/agendamento" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#19534e] px-5 py-4 font-black text-white transition hover:bg-[#123f3b]">Agendar <ArrowRight size={18} /></Link></div>; }
function GalleryPhoto({ image, title, tall = false }) { return <div className={`group relative overflow-hidden rounded-[34px] bg-slate-200 shadow-xl ${tall ? "md:-mt-10" : ""}`}><img src={image} alt={title} className="h-[430px] w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-transparent" /><div className="absolute bottom-5 left-5 right-5"><div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-black text-[#102d27] shadow-lg"><CheckCircle size={17} className="text-[#19534e]" />{title}</div></div></div>; }
