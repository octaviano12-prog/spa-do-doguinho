import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bath, CalendarDays, CheckCircle, Clock, MessageCircle, PawPrint, Scissors, Sparkles, Syringe } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";
import { getPublicServicePhoto, publicPhotos } from "../../data/publicPhotos";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getServiceIcon(name = "", category = "") {
  const text = `${name} ${category}`.toLowerCase();
  if (text.includes("tosa")) return Scissors;
  if (text.includes("vacina")) return Syringe;
  if (text.includes("spa")) return Sparkles;
  if (text.includes("banho")) return Bath;
  return PawPrint;
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
      <main className="overflow-hidden bg-[#fbf7ef] text-[#10231a]">
        <section className="relative bg-[#f5efe4] px-5 py-16 md:px-8 md:py-24">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#06140f] to-transparent opacity-10" />
          <div className="relative mx-auto grid max-w-[1680px] gap-10 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-2 text-sm font-black text-emerald-900 shadow-sm"><Sparkles size={16} /> Serviços premium</span>
              <h1 className="mt-7 text-5xl font-black leading-[.95] md:text-7xl">Cuidado completo para seu melhor amigo.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">Banho, tosa, estética, vacina e bem-estar com atendimento profissional, organizado e carinhoso.</p>
              <div className="mt-9 flex flex-wrap gap-4"><Link to="/agendamento" className="inline-flex items-center gap-3 rounded-2xl bg-[#0f7a3b] px-7 py-4 font-black text-white shadow-[0_20px_45px_rgba(15,122,59,.24)] transition hover:bg-[#0b6631]">Agendar agora <ArrowRight size={20} /></Link><a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-7 py-4 font-black text-[#10231a] shadow-sm transition hover:border-emerald-700"><MessageCircle size={20} /> Tirar dúvidas</a></div>
            </div>
            <div className="rounded-[44px] bg-white p-4 shadow-2xl ring-1 ring-black/5"><img src={publicPhotos.bathCare} alt="Banho e tosa premium" className="h-[430px] w-full rounded-[34px] object-cover" /></div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-6 px-5 py-12 md:px-8 lg:grid-cols-3">
          {[["Banho & Tosa", publicPhotos.bathCare, "Higiene, beleza e acabamento premium."], ["Vacinação", publicPhotos.vet, "Prevenção, saúde e cuidado responsável."], ["Spa Pet", publicPhotos.towel, "Relaxamento e carinho para seu pet."]].map(([title, image, text]) => <div key={title} className="rounded-[32px] bg-white p-5 shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1"><img src={image} alt={title} className="h-[260px] w-full rounded-[26px] object-cover" /><div className="p-4"><h3 className="text-2xl font-black">{title}</h3><p className="mt-2 text-slate-600">{text}</p></div></div>)}
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-14 md:px-8">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><span className="inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-900">Catálogo</span><h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Serviços cadastrados</h2><p className="mt-4 text-lg text-slate-600">Serviços ativos para escolher, comparar e agendar sem complicação.</p></div><div className="rounded-2xl bg-white px-6 py-4 font-black text-emerald-800 shadow ring-1 ring-black/5">{services.length} serviços ativos</div></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {isLoading && [1, 2, 3, 4].map((item) => <div key={item} className="h-[420px] animate-pulse rounded-3xl bg-white" />)}
            {!isLoading && services.length === 0 && <div className="rounded-3xl bg-white p-10 text-center text-slate-600 shadow md:col-span-2 xl:col-span-4">Nenhum serviço ativo encontrado.</div>}
            {!isLoading && services.map((service) => {
              const Icon = getServiceIcon(service.name, service.category);
              const image = getPublicServicePhoto(service.name, service.category);
              return <article key={service.id || service.name} className="group rounded-[32px] bg-white p-5 shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1"><img src={image} alt={service.name} className="mb-5 h-[210px] w-full rounded-[24px] object-cover" /><div className="flex items-start justify-between gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 transition group-hover:bg-emerald-700 group-hover:text-white"><Icon size={28} /></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{service.category || "Serviço"}</span></div><h3 className="mt-6 text-2xl font-black">{service.name}</h3><p className="mt-4 min-h-[92px] text-slate-600">{service.description || "Serviço especial para seu pet."}</p>{service.benefits && <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900"><div className="mb-1 font-black">Benefícios</div>{service.benefits}</div>}<div className="mt-5 flex items-center gap-2 text-slate-500"><Clock size={18} />{service.duration_minutes || 60} minutos</div><div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-6"><div><div className="text-xs font-bold text-slate-400">A partir de</div><div className="text-2xl font-black text-emerald-800">{formatCurrency(service.price)}</div></div><CheckCircle className="text-emerald-600" /></div><Link to="/agendamento" className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#10231a] py-4 font-black text-white transition hover:bg-emerald-900"><CalendarDays size={19} /> Agendar</Link></article>;
            })}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
