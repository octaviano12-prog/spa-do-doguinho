import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  CalendarDays,
  Sparkles,
  ShieldCheck,
  Heart,
  Star,
  Clock,
  MessageCircle,
  CheckCircle,
  Scissors,
  Syringe,
  Bath,
  Gift,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "../../components/public/PublicLayout";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";

function formatCurrency(value) {
  const number = Number(value || 0);

  return number.toLocaleString("pt-BR", {
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

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(`${API_PUBLIC}/services`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setServices(data.filter((item) => Number(item.active ?? 1) === 1));
        }
      } catch (error) {
        console.error("Erro ao carregar serviços públicos:", error);
      } finally {
        setIsLoadingServices(false);
      }
    }

    loadServices();
  }, []);

  const highlights = [
    {
      icon: CalendarDays,
      title: "Agenda fácil",
      text: "Escolha o melhor horário com praticidade."
    },
    {
      icon: Sparkles,
      title: "Higiene premium",
      text: "Produtos selecionados e acabamento caprichado."
    },
    {
      icon: ShieldCheck,
      title: "Segurança",
      text: "Cuidado responsável e ambiente organizado."
    },
    {
      icon: Heart,
      title: "Carinho",
      text: "Atendimento humanizado para cada doguinho."
    }
  ];

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-[#06150d] min-h-[780px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e55,transparent_28%),radial-gradient(circle_at_80%_25%,#f59e0b33,transparent_30%),linear-gradient(135deg,#06150d,#042413_55%,#020617)]" />
        <div className="absolute right-[-160px] top-20 h-[520px] w-[520px] rounded-full bg-green-400/20 blur-[110px]" />
        <div className="absolute left-[-180px] bottom-10 h-[420px] w-[420px] rounded-full bg-orange-300/20 blur-[110px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 mb-7 shadow-xl backdrop-blur-xl">
              <PawPrint size={18} />
              Experiência premium para pets
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
              Seu pet limpo, cheiroso e feliz.
            </h1>

            <p className="text-white/75 text-xl mt-6 max-w-xl leading-relaxed">
              Banho, tosa, estética pet, vacinação e cuidado profissional com
              carinho, segurança e visual premium.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">
              <Link
                to="/contato"
                className="group bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl font-black shadow-xl shadow-green-600/30 text-white flex items-center gap-3 transition"
              >
                Agendar agora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </Link>

              <a
                href="https://wa.me/5518997493722"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-black text-white border border-white/15 flex items-center gap-3 transition"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-12">
              {[
                ["+3.500", "Pets atendidos"],
                ["5★", "Avaliação premium"],
                ["Online", "Agendamento fácil"]
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
                >
                  <div className="text-3xl font-black text-white">{number}</div>
                  <div className="text-green-100/80 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[44px] bg-white/10 border border-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="relative rounded-[36px] min-h-[460px] bg-gradient-to-br from-green-400 via-emerald-600 to-green-950 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#ffffff55,transparent_24%),radial-gradient(circle_at_75%_70%,#fbbf2455,transparent_30%)]" />
                <PawPrint size={180} className="relative text-white drop-shadow-2xl" />
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

      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-10 grid md:grid-cols-4 gap-6">
        {highlights.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="bg-[#10251a] border border-white/10 rounded-3xl p-7 hover:-translate-y-1 transition shadow-2xl"
            >
              <Icon size={40} className="text-green-300 mb-5" />
              <h3 className="text-2xl font-black text-white">{item.title}</h3>
              <p className="text-white/60 mt-3">{item.text}</p>
            </motion.div>
          );
        })}
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-5 py-2 rounded-full font-black">
            <Sparkles size={18} />
            Serviços reais do SPA
          </span>

          <h2 className="text-4xl md:text-6xl font-black text-white mt-6">
            Tudo que seu doguinho precisa em um só lugar
          </h2>

          <p className="text-white/60 text-lg mt-5">
            Os serviços abaixo vêm direto do banco MySQL e podem ser gerenciados
            pelo painel administrativo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-14">
          {isLoadingServices &&
            [1, 2, 3, 4].map((item) => (
              <div key={item} className="h-[320px] rounded-3xl bg-white/10 animate-pulse" />
            ))}

          {!isLoadingServices && services.length === 0 && (
            <div className="md:col-span-2 xl:col-span-4 bg-white/10 border border-white/10 rounded-3xl p-8 text-center text-white">
              Nenhum serviço ativo cadastrado ainda.
            </div>
          )}

          {!isLoadingServices &&
            services.map((service, index) => {
              const Icon = getServiceIcon(service.name, service.category);

              return (
                <motion.div
                  key={service.id || service.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group bg-white rounded-[32px] p-7 shadow-2xl hover:-translate-y-2 transition border border-green-100"
                >
                  <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition">
                    <Icon size={32} />
                  </div>

                  <div className="text-sm font-black text-green-600 uppercase tracking-wider">
                    {service.category || "Serviço"}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    {service.name}
                  </h3>

                  <p className="text-slate-500 mt-4 min-h-[78px]">
                    {service.description || "Cuidado especial para seu pet."}
                  </p>

                  <div className="flex items-center gap-2 text-slate-500 mt-4">
                    <Clock size={18} />
                    {service.duration_minutes || 60} min
                  </div>

                  <div className="flex items-end justify-between mt-6 pt-6 border-t border-slate-100">
                    <div>
                      <div className="text-xs text-slate-400 font-bold">A partir de</div>
                      <div className="text-2xl font-black text-green-700">
                        {formatCurrency(service.price)}
                      </div>
                    </div>

                    <CheckCircle className="text-green-500" />
                  </div>
                </motion.div>
              );
            })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-[36px] bg-gradient-to-r from-green-700 to-emerald-500 p-10 md:p-14 text-white shadow-2xl grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 px-5 py-2 rounded-full font-black">
              <Gift size={18} />
              Agendamento fácil
            </div>
            <h2 className="text-4xl md:text-5xl font-black mt-5">
              Pronto para mimar seu doguinho?
            </h2>
            <p className="text-white/85 mt-4 text-lg">
              Fale pelo WhatsApp ou agende pelo site em poucos cliques.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
            <Link
              to="/contato"
              className="bg-orange-400 hover:bg-orange-500 px-8 py-4 rounded-2xl font-black text-center transition"
            >
              Começar agendamento
            </Link>

            <a
              href="https://wa.me/5518997493722"
              target="_blank"
              rel="noreferrer"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-2xl font-black text-center border border-white/20 transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
