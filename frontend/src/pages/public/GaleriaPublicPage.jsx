import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, CalendarDays, CheckCircle2, Heart, Image as ImageIcon, MessageCircle, PawPrint, ShieldCheck, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "../../components/public/PublicLayout";
import { fallbackGallery } from "../../data/publicPhotos";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";
const whatsappUrl = "https://wa.me/5518997493722?text=Olá! Gostaria de conhecer a galeria e agendar um atendimento no SPA do Doguinho.";
const heroImage = "/images/galeria-pet-04.webp";

const highlights = [
  [ImageIcon, "Registros reais", "Fotos cadastradas pelo painel do SPA."],
  [Heart, "Pets felizes", "Banho, tosa e cuidado com carinho."],
  [ShieldCheck, "Confiança visual", "Veja o capricho antes de agendar."]
];

function GalleryImage({ item, index, className = "" }) {
  const title = item.title || `Atendimento #${index + 1}`;

  if (item.image_url?.endsWith(".svg")) {
    return (
      <div className={`flex items-center justify-center bg-[#f4f8f5] p-4 ${className}`}>
        <img src={item.image_url} alt={title} className="h-full w-full rounded-2xl object-contain" />
      </div>
    );
  }

  if (item.image_url) {
    return (
      <div className={`relative overflow-hidden bg-[#e6f5eb] ${className}`}>
        <img src={item.image_url} alt={title} className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b352b]/18 via-transparent to-white/5" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#d9eee3] via-[#0d6b54] to-[#12382f] ${className}`}>
      <PawPrint size={120} className="relative text-white drop-shadow-2xl" />
    </div>
  );
}

export default function GaleriaPublicPage() {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch(`${API_PUBLIC}/gallery`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const activeItems = data.filter((item) => Number(item.active ?? 1) === 1);
          setGallery(activeItems.length ? activeItems : fallbackGallery);
        }
      } catch (error) {
        console.error("Erro ao carregar galeria:", error);
        setGallery(fallbackGallery);
      } finally {
        setIsLoading(false);
      }
    }

    loadGallery();
  }, []);

  const totalItems = gallery.length || fallbackGallery.length;

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative h-[calc(100vh-128px)] min-h-[620px] overflow-hidden bg-[#e9f6ee]">
          <img src={heroImage} alt="Galeria SPA do Doguinho" className="home-hero-image absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#edf8f1]/96 via-[#edf8f1]/72 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1880px] items-center px-6 py-5 md:px-10">
            <div className="max-w-4xl -translate-y-1">
              <span className="home-animate-fade inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-black uppercase tracking-[.14em] text-[#0d6b54] shadow-sm backdrop-blur">
                <Camera size={16} /> Galeria premium
              </span>
              <h1 className="home-animate-fade-delay-1 mt-5 text-4xl font-black leading-[.92] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.65rem] 2xl:text-[5.15rem]">
                Momentos de cuidado
                <span className="home-shimmer-text block font-serif italic">que dão gosto de ver.</span>
              </h1>
              <p className="home-animate-fade-delay-2 mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base lg:text-lg">
                Registros de banho, tosa, spa e carinho para você sentir a experiência do SPA do Doguinho antes mesmo de agendar.
              </p>
              <div className="home-animate-fade-delay-3 mt-7 flex flex-wrap gap-3">
                <Link to="/agendamento" className="home-pulse-glow inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642]">
                  <CalendarDays size={20} /> Agendar agora
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#0d6b54]/35 bg-white/85 px-6 py-3 font-black text-[#0d6b54] shadow-sm backdrop-blur transition hover:-translate-y-1">
                  <MessageCircle size={20} /> Falar no WhatsApp
                </a>
              </div>
              <div className="home-animate-fade-delay-3 mt-6 flex flex-wrap items-center gap-4">
                <div className="flex gap-1 text-[#f4b942]">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} fill="currentColor" />)}</div>
                <p className="text-sm font-black text-slate-600">Fotos, carinho e acabamento premium</p>
              </div>
            </div>
          </div>

          <div className="home-float absolute bottom-8 right-8 hidden max-w-[300px] rounded-[26px] bg-[#0d6b54] p-5 text-white shadow-2xl xl:block">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><ImageIcon size={30} /></div>
              <div>
                <div className="font-black">{totalItems} registros</div>
                <p className="mt-1 text-xs text-white/75">Uma vitrine carinhosa dos pets que passaram por aqui.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-5 pt-8 pb-16 md:px-8">
          <div className="mx-auto grid max-w-[1880px] gap-5 rounded-[34px] bg-white p-5 shadow-xl ring-1 ring-[#e2eadf] md:grid-cols-3 md:p-6">
            {highlights.map(([Icon, title, text], index) => (
              <div key={title} className="home-card-animate flex items-center gap-4 rounded-[26px] bg-[#fffdf7] p-6 ring-1 ring-[#e2eadf]" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="home-icon-pop flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#d9eee3] text-[#0d6b54] ring-1 ring-[#c8e5d6]"><Icon size={32} /></div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-[.05em] text-[#0d6b54]">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1880px] px-5 py-14 md:px-8">
          <div className="home-animate-fade mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-5 py-2 text-sm font-black text-[#0d6b54]"><Sparkles size={16} /> Galeria</span>
              <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-.04em] text-[#0d6b54] md:text-5xl">Cuidado que fica bonito na foto.</h2>
              <p className="mt-3 max-w-3xl text-lg text-slate-600">Banho, tosa e bem-estar com acabamento caprichado e uma experiência acolhedora.</p>
            </div>
            <div className="rounded-2xl border border-[#e2eadf] bg-white px-6 py-4 font-black text-[#0d6b54] shadow-sm">{gallery.length} registros</div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoading && [1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[420px] animate-pulse rounded-[30px] bg-white shadow-sm" />)}

            {!isLoading && gallery.map((item, index) => (
              <motion.article key={item.id || index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="home-card-animate group overflow-hidden rounded-[30px] bg-white shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1" style={{ animationDelay: `${index * 70}ms` }}>
                <GalleryImage item={item} index={index} className="h-[340px]" />
                <div className="p-7">
                  <div className="mb-4 flex gap-1 text-[#f4b942]">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={17} fill="currentColor" />)}</div>
                  <h2 className="text-2xl font-black text-[#12382f]">{item.title || `Atendimento #${index + 1}`}</h2>
                  <p className="mt-3 min-h-[52px] text-slate-600">{item.description || "Resultado incrível para nossos clientes pets."}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="px-5 py-12 md:px-8">
          <div className="home-animate-fade mx-auto flex max-w-[1880px] flex-col gap-6 rounded-t-[90px] rounded-b-[28px] bg-[#0d6b54] p-8 text-white shadow-2xl md:flex-row md:items-center md:justify-between md:p-10">
            <div className="flex items-center gap-6">
              <div className="home-float flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/70"><PawPrint size={50} /></div>
              <div><h2 className="text-3xl font-black">Gostou do cuidado?</h2><p className="mt-2 text-white/75">Agende e deixe seu doguinho viver essa experiência.</p></div>
            </div>
            <Link to="/agendamento" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#f7e7c4] px-8 py-4 font-black text-[#12382f] shadow-xl transition hover:-translate-y-1"><CalendarDays size={20} /> Agendar agora</Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
