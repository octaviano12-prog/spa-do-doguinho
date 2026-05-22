import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, CalendarDays, Sparkles, ShieldCheck, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "../../components/public/PublicLayout";

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#22c55e55,transparent_35%),radial-gradient(circle_at_bottom_right,#10b98144,transparent_35%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-5 py-2 text-green-200 mb-6">
              <PawPrint size={18} />
              Experiência premium para pets
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Seu pet limpo, cheiroso e feliz.
            </h1>

            <p className="text-white/70 text-xl mt-6 max-w-xl">
              Banho, tosa, estética pet e atendimento com carinho, segurança e cuidado profissional.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/contato" className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl font-black shadow-xl">
                Agendar agora
              </Link>

              <Link to="/servicos" className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-black">
                Ver serviços
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="rounded-[44px] bg-white/10 border border-white/10 p-6 shadow-2xl">
              <div className="rounded-[36px] min-h-[460px] bg-gradient-to-br from-green-400 via-emerald-600 to-green-900 flex items-center justify-center">
                <PawPrint size={180} className="text-white drop-shadow-2xl" />
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 bg-white text-slate-900 rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <Star className="text-yellow-500 fill-yellow-500" />
                <div>
                  <p className="font-black">Atendimento 5 estrelas</p>
                  <p className="text-sm text-slate-500">Cuidado com amor</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-6">
        {[
          { icon: CalendarDays, title: "Agenda fácil", text: "Organize horários com praticidade." },
          { icon: Sparkles, title: "Higiene premium", text: "Produtos e acabamento de qualidade." },
          { icon: ShieldCheck, title: "Segurança", text: "Cuidado responsável com cada pet." },
          { icon: Heart, title: "Carinho", text: "Atendimento humanizado e acolhedor." }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white/10 border border-white/10 rounded-3xl p-7 hover:-translate-y-1 transition">
              <Icon size={40} className="text-green-300 mb-5" />
              <h3 className="text-2xl font-black">{item.title}</h3>
              <p className="text-white/60 mt-3">{item.text}</p>
            </div>
          );
        })}
      </section>
    </PublicLayout>
  );
}
