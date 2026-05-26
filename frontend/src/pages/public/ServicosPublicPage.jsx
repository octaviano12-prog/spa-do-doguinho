import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  CalendarDays,
  CheckCircle,
  Clock,
  Heart,
  MessageCircle,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Syringe,
  Truck
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "../../components/public/PublicLayout";
import { getPublicServicePhoto } from "../../data/publicPhotos";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";
const heroImage = "/images/servicos-hero.webp";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function getServiceIcon(name = "", category = "") {
  const text = `${name} ${category}`.toLowerCase();
  if (text.includes("tosa")) return Scissors;
  if (text.includes("vacina")) return Syringe;
  if (text.includes("spa")) return Sparkles;
  if (text.includes("banho")) return Bath;
  return PawPrint;
}

function getServiceImage(service) {
  return service.image_url || getPublicServicePhoto(service.name, service.category);
}

function ServicePhoto({ src, alt, className = "" }) {
  return (
    <div className={`group relative min-h-[220px] overflow-hidden rounded-[24px] bg-[#e6f5eb] shadow-lg ring-1 ring-[#e2eadf] ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b352b]/10 via-transparent to-white/5" />
    </div>
  );
}

export default function ServicosPublicPage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(`${API_PUBLIC}/services`);
        const data = await response.json();
        if (Array.isArray(data)) setServices(data.filter((item) => Number(item.active ?? 1) === 1));
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative h-[calc(100vh-128px)] min-h-[620px] overflow-hidden bg-[#e9f6ee]">
          <img src={heroImage} alt="Serviços premium do SPA do Doguinho" className="home-hero-image absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#edf8f1]/96 via-[#edf8f1]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1880px] items-center px-6 py-5 md:px-10">
            <div className="max-w-4xl -translate-y-1">
              <span className="home-animate-fade inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-black uppercase tracking-[.14em] text-[#0d6b54] shadow-sm backdrop-blur">
                <Sparkles size={16} /> Serviços premium
              </span>
              <h1 className="home-animate-fade-delay-1 mt-5 text-4xl font-black leading-[.92] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.65rem] 2xl:text-[5.15rem]">
                Banho, tosa e bem-estar
                <span className="home-shimmer-text block font-serif italic">com acabamento premium.</span>
              </h1>
              <p className="home-animate-fade-delay-2 mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base lg:text-lg">
                Escolha o cuidado ideal para o seu pet com valores claros, atendimento organizado e uma experiência calma do início ao fim.
              </p>
              <div className="home-animate-fade-delay-3 mt-7 flex flex-wrap gap-3">
                <Link to="/agendamento" className="home-pulse-glow flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642]">
                  <CalendarDays size={20} /> Agendar agora <ArrowRight size={18} />
                </Link>
                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[#0d6b54]/35 bg-white/85 px-6 py-3 font-black text-[#0d6b54] shadow-sm backdrop-blur transition hover:-translate-y-1">
                  <MessageCircle size={20} /> Tirar dúvidas
                </a>
              </div>
              <div className="home-animate-fade-delay-3 mt-6 flex flex-wrap items-center gap-4">
                <div className="flex gap-1 text-[#f4b942]">{[1,2,3,4,5].map((i) => <Star key={i} size={18} fill="currentColor" />)}</div>
                <p className="text-sm font-black text-slate-600">Cuidado, carinho e estética pet premium</p>
              </div>
            </div>
          </div>

          <div className="home-float absolute bottom-8 right-8 hidden max-w-[280px] rounded-[26px] bg-[#0d6b54] p-5 text-white shadow-2xl xl:block">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><ShieldCheck size={30} /></div>
              <div><div className="font-black">Serviço personalizado</div><p className="mt-1 text-xs text-white/75">Cuidados conforme porte, pelagem e necessidade.</p></div>
            </div>
          </div>
        </section>

        <section className="relative px-5 pt-8 pb-16 md:px-8">
          <div className="mx-auto grid max-w-[1880px] gap-6 md:grid-cols-3">
            {[
              ["Banho Premium", "/images/banho-pet-home.webp", "Higiene, hidratação e perfume na medida."],
              ["Tosa Boutique", "/images/galeria-pet-02.webp", "Acabamento bonito e adequado para cada pelagem."],
              ["Spa Pet", "/images/galeria-pet-03.webp", "Bem-estar, pele e pelagem com carinho."]
            ].map(([title, image, text], index) => (
              <article key={title} className="home-card-animate overflow-hidden rounded-[30px] bg-white shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1" style={{ animationDelay: `${index * 90}ms` }}>
                <ServicePhoto src={image} alt={title} className="h-[280px] rounded-none" />
                <div className="p-6"><h3 className="text-2xl font-black text-[#0d6b54]">{title}</h3><p className="mt-2 text-slate-600">{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1880px] px-5 py-14 md:px-8">
          <div className="home-animate-fade mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-[#e7f4ed] px-5 py-2 text-sm font-black text-[#0d6b54]">Serviços ativos</span>
              <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-.04em] text-[#0d6b54] md:text-5xl">Escolha e agende com praticidade.</h2>
              <p className="mt-3 max-w-3xl text-lg text-slate-600">Compare cuidados, duração e valores antes de reservar o melhor horário.</p>
            </div>
            <div className="rounded-2xl border border-[#e2eadf] bg-white px-6 py-4 font-black text-[#0d6b54] shadow-sm">{services.length} serviços ativos</div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {isLoading && [1,2,3,4].map((item) => <div key={item} className="h-[420px] animate-pulse rounded-[30px] bg-white" />)}
            {!isLoading && services.length === 0 && <div className="rounded-[30px] bg-white p-10 text-center text-slate-500 shadow-xl md:col-span-2 xl:col-span-4">Nenhum serviço ativo encontrado.</div>}
            {!isLoading && services.map((service, index) => {
              const Icon = getServiceIcon(service.name, service.category);
              const image = getServiceImage(service);
              return (
                <motion.article key={service.id || service.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="home-card-animate group overflow-hidden rounded-[30px] bg-white shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1" style={{ animationDelay: `${index * 70}ms` }}>
                  <div className="relative h-[230px] overflow-hidden"><img src={image} alt={service.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="home-icon-pop absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-xl"><Icon size={26} /></div></div>
                  <div className="p-6">
                    <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{service.category || "Serviço"}</div>
                    <h3 className="mt-5 text-2xl font-black">{service.name}</h3>
                    <p className="mt-3 min-h-[82px] text-slate-600">{service.description || "Serviço especial para seu pet."}</p>
                    {service.benefits && <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900"><div className="mb-1 font-black">Benefícios</div>{service.benefits}</div>}
                    <div className="mt-5 flex items-center gap-2 text-slate-500"><Clock size={18} />{service.duration_minutes || 60} minutos</div>
                    <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-6"><div><div className="text-xs font-bold text-slate-400">A partir de</div><div className="text-2xl font-black text-emerald-800">{formatCurrency(service.price)}</div></div><CheckCircle className="text-emerald-600" /></div>
                    <Link to="/agendamento" className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0d6b54] py-4 font-black text-white transition hover:bg-[#095642]"><CalendarDays size={19} />Agendar</Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
