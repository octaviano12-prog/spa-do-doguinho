import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "../../components/public/PublicLayout";

const WHATSAPP_NUMBER = "5518997493722";

export default function ContatoPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pet: "",
    service: "Banho",
    message: ""
  });

  const whatsappUrl = useMemo(() => {
    const text = `Olá! Gostaria de agendar um atendimento no SPA do Doguinho.%0A%0ANome: ${form.name || ""}%0ATelefone: ${form.phone || ""}%0APet: ${form.pet || ""}%0AServiço: ${form.service || ""}%0AMensagem: ${form.message || ""}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [form]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <PublicLayout>
      <main className="relative overflow-hidden">
        <section className="relative bg-[#06150d] px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e55,transparent_30%),radial-gradient(circle_at_85%_10%,#f59e0b33,transparent_30%)]" />

          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2 text-green-100 font-black">
                <MessageCircle size={18} />
                Atendimento rápido e humanizado
              </span>

              <h1 className="text-5xl md:text-7xl font-black text-white mt-7 leading-tight">
                Fale com a gente e agende o cuidado do seu pet.
              </h1>

              <p className="text-white/70 mt-6 text-xl leading-relaxed max-w-2xl">
                Tire dúvidas, escolha o melhor horário e receba orientação para banho, tosa, vacinação e cuidados especiais.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mt-10">
                {[
                  ["Resposta rápida", "WhatsApp direto", MessageCircle],
                  ["Agenda organizada", "Horários práticos", CalendarDays],
                  ["Cuidado premium", "Seu pet seguro", ShieldCheck]
                ].map(([title, text, Icon]) => (
                  <div key={title} className="bg-white/10 border border-white/10 rounded-3xl p-5 text-white">
                    <Icon className="text-green-300 mb-4" size={32} />
                    <div className="font-black">{title}</div>
                    <div className="text-white/55 text-sm mt-1">{text}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl border border-green-100"
            >
              <div className="flex items-center gap-4 mb-7">
                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                  <PawPrint size={34} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Agendamento rápido</h2>
                  <p className="text-slate-500">Preencha e envie direto pelo WhatsApp</p>
                </div>
              </div>

              <div className="grid gap-4">
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Seu nome"
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500"
                />

                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Seu telefone"
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500"
                />

                <input
                  value={form.pet}
                  onChange={(event) => updateField("pet", event.target.value)}
                  placeholder="Nome do pet"
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500"
                />

                <select
                  value={form.service}
                  onChange={(event) => updateField("service", event.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500"
                >
                  <option>Banho</option>
                  <option>Tosa</option>
                  <option>Vacina</option>
                  <option>Spa Relaxante</option>
                  <option>Outro serviço</option>
                </select>

                <textarea
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={5}
                  placeholder="Conte o que seu pet precisa"
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-900 focus:border-green-500"
                />

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition"
                >
                  <Send size={20} />
                  Enviar pelo WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-[36px] p-8 md:p-10 shadow-2xl border border-green-100">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-5 py-2 font-black">
              <MapPin size={18} />
              Onde estamos
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6">
              Atendimento em Sud Mennucci - SP
            </h2>

            <p className="text-slate-500 text-lg mt-4 max-w-2xl">
              Um espaço preparado para receber seu pet com segurança, organização, higiene e muito carinho.
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-8">
              {[
                [Phone, "+55 18 99749-3722", "WhatsApp para agendamentos"],
                [Mail, "contato@spadodoguinho.com.br", "Contato comercial"],
                [MapPin, "Rua Marco Antonio M.J Franco Nº 606", "Sud Mennucci - SP"],
                [Clock, "Terça a sábado", "Horários práticos para tutores"]
              ].map(([Icon, title, text]) => (
                <div key={title} className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <Icon className="text-green-600 mb-4" size={32} />
                  <div className="font-black text-slate-900">{title}</div>
                  <div className="text-slate-500 mt-1">{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#10251a] rounded-[36px] p-8 text-white shadow-2xl border border-white/10">
            <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 font-black">
              <Clock size={18} />
              Funcionamento
            </span>

            <div className="space-y-4 mt-8">
              {[
                ["Terça a Sexta", "08:00 às 18:00"],
                ["Sábado", "08:00 às 14:00"],
                ["Domingo", "Fechado"],
                ["Segunda", "Fechado"]
              ].map(([day, time]) => (
                <div key={day} className="flex items-center justify-between bg-white/10 rounded-2xl p-4">
                  <span className="text-white/75">{day}</span>
                  <strong>{time}</strong>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6">
              <div className="flex text-yellow-300 gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} size={18} fill="currentColor" />
                ))}
              </div>
              <h3 className="text-2xl font-black">Atendimento 5 estrelas</h3>
              <p className="text-white/80 mt-2">Cuidado premium para pets e tutores.</p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="rounded-[36px] bg-white/10 border border-white/10 p-8 md:p-10 text-white shadow-2xl">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                [CheckCircle, "Confirmação rápida", "Você recebe retorno pelo WhatsApp."],
                [Sparkles, "Experiência premium", "Ambiente limpo, bonito e organizado."],
                [Heart, "Cuidado com amor", "Seu pet tratado como parte da família."]
              ].map(([Icon, title, text]) => (
                <div key={title} className="bg-black/20 rounded-3xl p-6">
                  <Icon className="text-green-300 mb-4" size={34} />
                  <h3 className="text-2xl font-black">{title}</h3>
                  <p className="text-white/60 mt-2">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
