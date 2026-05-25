import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  CalendarDays,
  CheckCircle,
  Clock,
  MessageCircle,
  PawPrint,
  Scissors,
  Sparkles,
  Syringe
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

export default function ServicosPublicPage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(`${API_PUBLIC}/services`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setServices(data.filter((item) => Number(item.active ?? 1) === 1));
        }
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
        <section className="relative h-[calc(100vh-96px)] min-h-[620px] overflow-hidden bg-[#e7f4ed]">
          <img src={heroImage} alt="Serviços premium do SPA do Doguinho" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e7f4ed]/96 via-[#e7f4ed]/76 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto grid h-full max-w-[1880px] gap-10 px-6 py-5 md:px-10 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl -translate-y-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/85 px-5 py-2 text-sm font-black text-emerald-900 shadow-sm backdrop-blur">
                <Sparkles size={18} />
                Serviços boutique
              </span>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[.92] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.45rem] 2xl:text-[4.85rem]">
                Banho, tosa e bem-estar com acabamento premium.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base lg:text-lg">
                Escolha o cuidado ideal para o seu pet com valores claros, atendimento organizado e uma experiência calma do início ao fim.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/agendamento" className="flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-[0_20px_45px_rgba(13,107,84,.22)] transition hover:bg-[#095642]">
                  <CalendarDays size={20} />
                  Agendar agora
                  <ArrowRight size={18} />
                </Link>

                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[#e2eadf] bg-white/90 px-6 py-3 font-black text-[#12382f] shadow-sm backdrop-blur transition hover:border-[#0d6b54]">
                  <MessageCircle size={20} />
                  Tirar dúvidas
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-6 px-5 py-12 md:grid-cols-3 md:px-8">
          {[
            ["Banho Premium", "/images/banho-pet-home.webp", "Higiene, hidratação e perfume na medida."],
            ["Tosa Boutique", "/images/galeria-pet-02.webp", "Acabamento bonito e adequado para cada pelagem."],
            ["Spa Pet", "/images/galeria-pet-03.webp", "Bem-estar, pele e pelagem com carinho."]
          ].map(([title, image, text]) => (
            <article key={title} className="overflow-hidden rounded-[30px] bg-white shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1">
              <img src={image} alt={title} className="h-[280px] w-full object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-2 text-slate-600">{text}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-14 md:px-8">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-900">Serviços ativos</span>
              <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">Escolha e agende com praticidade.</h2>
              <p className="mt-3 max-w-3xl text-lg text-slate-600">Compare cuidados, duração e valores antes de reservar o melhor horário.</p>
            </div>

            <div className="rounded-2xl border border-[#e2eadf] bg-white px-6 py-4 font-black text-[#0d6b54] shadow-sm">
              {services.length} serviços ativos
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {isLoading && [1, 2, 3, 4].map((item) => <div key={item} className="h-[420px] animate-pulse rounded-[30px] bg-white" />)}

            {!isLoading && services.length === 0 && (
              <div className="rounded-[30px] bg-white p-10 text-center text-slate-500 shadow-xl md:col-span-2 xl:col-span-4">
                Nenhum serviço ativo encontrado.
              </div>
            )}

            {!isLoading && services.map((service, index) => {
              const Icon = getServiceIcon(service.name, service.category);
              const image = getServiceImage(service);

              return (
                <motion.article
                  key={service.id || service.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group overflow-hidden rounded-[30px] bg-white shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1"
                >
                  <div className="relative h-[230px] overflow-hidden">
                    <img src={image} alt={service.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-xl">
                      <Icon size={26} />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      {service.category || "Serviço"}
                    </div>
                    <h3 className="mt-5 text-2xl font-black">{service.name}</h3>
                    <p className="mt-3 min-h-[82px] text-slate-600">{service.description || "Serviço especial para seu pet."}</p>

                    {service.benefits && (
                      <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                        <div className="mb-1 font-black">Benefícios</div>
                        {service.benefits}
                      </div>
                    )}

                    <div className="mt-5 flex items-center gap-2 text-slate-500">
                      <Clock size={18} />
                      {service.duration_minutes || 60} minutos
                    </div>

                    <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="text-xs font-bold text-slate-400">A partir de</div>
                        <div className="text-2xl font-black text-emerald-800">{formatCurrency(service.price)}</div>
                      </div>
                      <CheckCircle className="text-emerald-600" />
                    </div>

                    <Link to="/agendamento" className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0d6b54] py-4 font-black text-white transition hover:bg-[#095642]">
                      <CalendarDays size={19} />
                      Agendar
                    </Link>
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
