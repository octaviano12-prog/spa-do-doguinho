import React, { useEffect, useState } from "react";
import { Camera, Heart, Image as ImageIcon, PawPrint, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "../../components/public/PublicLayout";
import { fallbackGallery, publicPhotos } from "../../data/publicPhotos";

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
      <main className="relative overflow-hidden">
        <section className="relative bg-[#06150d] px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#22c55e55,transparent_30%),radial-gradient(circle_at_85%_10%,#f59e0b33,transparent_30%)]" />

          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 font-black">
                <Camera size={18} />
                Galeria de momentos felizes
              </span>

              <h1 className="text-5xl md:text-7xl font-black text-white mt-7 leading-tight">
                Cada atendimento conta uma história de cuidado.
              </h1>

              <p className="text-white/70 mt-6 text-xl leading-relaxed max-w-3xl">
                Veja registros, resultados e detalhes do carinho que entregamos em cada banho, tosa e cuidado especial.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 border border-white/10 rounded-[42px] p-4 shadow-2xl backdrop-blur-xl">
              <img src={publicPhotos.towel} alt="Galeria SPA do Doguinho" className="h-[420px] w-full rounded-[34px] object-cover shadow-2xl" />
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              ["Fotos selecionadas", "Visual acolhedor", ImageIcon],
              ["Pets felizes", "Cuidado com carinho", Heart],
              ["Resultado premium", "Acabamento especial", Sparkles]
            ].map(([title, text, Icon], index) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="bg-white/10 border border-white/10 rounded-3xl p-7 text-white shadow-2xl">
                <Icon className="text-green-300 mb-4" size={36} />
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="text-white/60 mt-2">{text}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white">Galeria</h2>
              <p className="text-white/60 mt-3">Registros do painel e fotos de apoio para manter a página sempre bonita.</p>
            </div>

            <div className="hidden md:block bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white">
              <strong>{gallery.length}</strong> registros
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading && [1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[420px] rounded-3xl bg-white/10 animate-pulse" />)}

            {!isLoading && gallery.map((item, index) => (
              <motion.article key={item.id || index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group bg-white rounded-[32px] overflow-hidden shadow-2xl border border-green-100 hover:-translate-y-2 transition">
                {item.image_url ? (
                  item.image_url.endsWith(".svg") ? (
                    <div className="h-[300px] bg-slate-50 flex items-center justify-center p-4">
                      <img src={item.image_url} alt={item.title || "Galeria"} className="w-full h-full object-contain rounded-2xl" />
                    </div>
                  ) : (
                    <div className="h-[300px] bg-cover bg-center" style={{ backgroundImage: `url('${item.image_url}')` }} />
                  )
                ) : (
                  <div className="h-[300px] bg-gradient-to-br from-green-400 via-emerald-600 to-green-950 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#ffffff55,transparent_24%),radial-gradient(circle_at_75%_70%,#fbbf2455,transparent_30%)]" />
                    <PawPrint size={120} className="relative text-white drop-shadow-2xl" />
                  </div>
                )}

                <div className="p-7">
                  <div className="flex text-yellow-400 gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={17} fill="currentColor" />)}
                  </div>

                  <h2 className="text-2xl font-black text-slate-900">{item.title || `Atendimento #${index + 1}`}</h2>
                  <p className="text-slate-500 mt-3">{item.description || "Resultado incrível para nossos clientes pets."}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
