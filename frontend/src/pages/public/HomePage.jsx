import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, CalendarDays, Sparkles, ShieldCheck } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="px-6 py-20 max-w-7xl mx-auto">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-green-200 mb-6">
              <PawPrint size={18} />
              Cuidado premium para seu pet
            </span>

            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              Seu doguinho tratado com amor, carinho e segurança.
            </h2>

            <p className="text-white/70 text-xl mt-6 max-w-xl">
              Banho, tosa, estética pet e atendimento especial para deixar seu
              melhor amigo limpo, cheiroso e feliz.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/contato"
                className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl font-bold shadow-xl"
              >
                Agendar atendimento
              </Link>

              <Link
                to="/servicos"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold"
              >
                Ver serviços
              </Link>
            </div>
          </div>

          <div className="bg-white/10 rounded-[40px] p-8 shadow-2xl">
            <div className="bg-gradient-to-br from-green-400 to-emerald-700 rounded-[32px] min-h-[420px] flex items-center justify-center">
              <PawPrint size={180} className="text-white/90" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[
            {
              title: "Agendamento fácil",
              icon: CalendarDays,
              text: "Organização rápida para banho, tosa e serviços pet."
            },
            {
              title: "Ambiente limpo",
              icon: Sparkles,
              text: "Cuidado especial com higiene, conforto e bem-estar."
            },
            {
              title: "Atendimento seguro",
              icon: ShieldCheck,
              text: "Seu pet acompanhado com responsabilidade e carinho."
            }
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="bg-white/10 rounded-3xl p-8">
                <Icon className="text-green-300 mb-5" size={40} />
                <h3 className="text-2xl font-black">{item.title}</h3>
                <p className="text-white/70 mt-3">{item.text}</p>
              </div>
            );
          })}
        </section>
      </main>
    </PublicLayout>
  );
}
