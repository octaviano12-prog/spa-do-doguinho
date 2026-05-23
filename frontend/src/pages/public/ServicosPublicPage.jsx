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

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";

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
      <main className="relative overflow-hidden">
        <section className="relative bg-[#06150d] px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#22c55e55,transparent_30%),radial-gradient(circle_at_80%_10%,#f59e0b33,transparent_32%)]" />

          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 font-black">
                <Sparkles size={18} />
                Serviços premium
              </span>

              <h1 className="text-5xl md:text-7xl font-black text-white mt-7 leading-tight">
                Cuidado completo para seu melhor amigo.
              </h1>

              <p className="text-white/70 mt-6 text-xl leading-relaxed max-w-2xl">
                Banho, tosa, estética, vacina e bem-estar com atendimento profissional, organizado e carinhoso.
              </p>

              <div className="flex flex-wrap gap-4 mt-9">
                <Link
                  to="/contato"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl transition"
                >
                  Agendar agora
                  <ArrowRight size={20} />
                </Link>

                <a
                  href="https://wa.me/5518997493722"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 border border-white/15 transition"
                >
                  <MessageCircle size={20} />
                  Tirar dúvidas
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 border border-white/10 rounded-[42px] p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="grid grid-cols-2 gap-5">
                {[
                  ["Banho", Bath],
                  ["Tosa", Scissors],
                  ["Vacina", Syringe],
                  ["Spa", Sparkles]
                ].map(([label, Icon]) => (
                  <div key={label} className="bg-black/20 rounded-3xl p-7 text-white">
                    <Icon className="text-green-300 mb-5" size={38} />
                    <div className="text-2xl font-black">{label}</div>
                    <div className="text-white/55 mt-2">Com carinho</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Serviços cadastrados
              </h2>
              <p className="text-white/60 mt-4 text-lg">
                Lista integrada com o MySQL do painel administrativo.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white">
              <strong>{services.length}</strong> serviços ativos
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {isLoading &&
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="h-[360px] rounded-3xl bg-white/10 animate-pulse" />
              ))}

            {!isLoading && services.length === 0 && (
              <div className="md:col-span-2 xl:col-span-4 bg-white/10 border border-white/10 rounded-3xl p-10 text-center text-white">
                Nenhum serviço ativo encontrado.
              </div>
            )}

            {!isLoading &&
              services.map((service, index) => {
                const Icon = getServiceIcon(service.name, service.category);

                return (
                  <motion.div
                    key={service.id || service.name}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="group bg-white rounded-[32px] p-7 shadow-2xl border border-green-100 hover:-translate-y-2 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition">
                        <Icon size={32} />
                      </div>

                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black">
                        {service.category || "Serviço"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mt-6">
                      {service.name}
                    </h3>

                    <p className="text-slate-500 mt-4 min-h-[92px]">
                      {service.description || "Serviço especial para seu pet."}
                    </p>

                    {service.benefits && (
                      <div className="bg-green-50 rounded-2xl p-4 mt-5 text-sm text-green-900">
                        <div className="font-black mb-1">Benefícios</div>
                        {service.benefits}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-500 mt-5">
                      <Clock size={18} />
                      {service.duration_minutes || 60} minutos
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

                    <Link
                      to="/contato"
                      className="mt-7 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition"
                    >
                      <CalendarDays size={19} />
                      Agendar
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
