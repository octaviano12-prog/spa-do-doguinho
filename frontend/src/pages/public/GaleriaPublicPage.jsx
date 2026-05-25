import React, { useEffect, useState } from "react";
import { Camera, Heart, Image as ImageIcon, PawPrint, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "../../components/public/PublicLayout";
import { fallbackGallery } from "../../data/publicPhotos";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";

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

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative bg-[#e7f4ed] px-5 py-16 md:px-8">
          <div className="mx-auto grid max-w-[1680px] gap-10 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-2 text-sm font-black text-emerald-900 shadow-sm">
                <Camera size={18} />
                Galeria premium
              </span>

              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[.96] md:text-7xl">
                Momentos bonitos de pets limpos, cheirosos e felizes.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Registros de banho, tosa, spa e cuidados especiais para mostrar a experiência que seu pet recebe por aqui.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative min-h-[560px]">
              <img src="/images/galeria-pet-04.webp" alt="Galeria SPA do Doguinho" className="absolute right-0 top-0 h-[440px] w-[84%] rounded-[42px] object-cover shadow-2xl" />
              <img src="/images/galeria-pet-01.webp" alt="Tosa e cuidado pet" className="absolute bottom-0 left-0 hidden h-72 w-[44%] rounded-[32px] border-[10px] border-[#e7f4ed] object-cover shadow-2xl md:block" />
              <div className="absolute bottom-8 right-10 rounded-[28px] bg-white/90 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                    <ImageIcon size={28} />
                  </div>
                  <div>
                    <div className="font-black">{gallery.length || fallbackGallery.length} registros</div>
                    <p className="mt-1 text-sm text-slate-500">Fotos para inspirar confiança antes de agendar.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-12 md:px-8">
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              ["Fotos selecionadas", "Visual acolhedor", ImageIcon],
              ["Pets felizes", "Cuidado com carinho", Heart],
              ["Resultado premium", "Acabamento especial", Sparkles]
            ].map(([title, text, Icon], index) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-[30px] bg-white p-7 shadow-xl ring-1 ring-black/5">
                <Icon className="mb-4 text-[#0d6b54]" size={36} />
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-2 text-slate-600">{text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-900">Galeria</span>
              <h2 className="mt-5 text-4xl font-black md:text-5xl">Cuidado que dá gosto de ver.</h2>
              <p className="mt-3 text-slate-600">Banho, tosa e bem-estar com acabamento caprichado.</p>
            </div>

            <div className="hidden rounded-2xl border border-[#e2eadf] bg-white px-6 py-4 font-black text-[#0d6b54] shadow-sm md:block">
              {gallery.length} registros
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoading && [1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[420px] animate-pulse rounded-[30px] bg-white" />)}

            {!isLoading && gallery.map((item, index) => (
              <motion.article key={item.id || index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="group overflow-hidden rounded-[30px] bg-white shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1">
                {item.image_url ? (
                  item.image_url.endsWith(".svg") ? (
                    <div className="flex h-[320px] items-center justify-center bg-slate-50 p-4">
                      <img src={item.image_url} alt={item.title || "Galeria"} className="h-full w-full rounded-2xl object-contain" />
                    </div>
                  ) : (
                    <div className="h-[320px] bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${item.image_url}')` }} />
                  )
                ) : (
                  <div className="relative flex h-[320px] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-300 via-emerald-600 to-emerald-950">
                    <PawPrint size={120} className="relative text-white drop-shadow-2xl" />
                  </div>
                )}

                <div className="p-7">
                  <div className="mb-4 flex gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={17} fill="currentColor" />)}
                  </div>

                  <h2 className="text-2xl font-black">{item.title || `Atendimento #${index + 1}`}</h2>
                  <p className="mt-3 text-slate-600">{item.description || "Resultado incrível para nossos clientes pets."}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
