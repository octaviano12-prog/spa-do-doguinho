import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
    const text = encodeURIComponent(
      `Olá! Gostaria de falar com o SPA do Doguinho.\n\nNome: ${form.name || ""}\nTelefone: ${form.phone || ""}\nPet: ${form.pet || ""}\nServiço: ${form.service || ""}\nMensagem: ${form.message || ""}`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [form]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative bg-[#e7f4ed] px-5 py-16 md:px-8">
          <div className="mx-auto grid max-w-[1680px] gap-10 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-2 text-sm font-black text-emerald-900 shadow-sm">
                <MessageCircle size={18} />
                Atendimento rápido e humanizado
              </span>

              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[.96] md:text-7xl">
                Fale com a gente e agende o cuidado do seu pet.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Tire dúvidas, escolha o melhor horário e receba orientação para banho, tosa, vacinação e cuidados especiais.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/agendamento" className="flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-8 py-4 font-black text-white shadow-[0_20px_45px_rgba(13,107,84,.22)] transition hover:bg-[#095642]">
                  <CalendarDays size={20} />
                  Agendar online
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[#e2eadf] bg-white px-8 py-4 font-black text-[#12382f] shadow-sm transition hover:border-[#0d6b54]">
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["Resposta rápida", "WhatsApp direto", MessageCircle],
                  ["Agenda organizada", "Horários práticos", CalendarDays],
                  ["Cuidado premium", "Seu pet seguro", ShieldCheck]
                ].map(([title, text, Icon]) => (
                  <div key={title} className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <Icon className="mb-4 text-[#0d6b54]" size={32} />
                    <div className="font-black">{title}</div>
                    <div className="mt-1 text-sm text-slate-500">{text}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[36px] bg-white p-6 shadow-2xl ring-1 ring-black/5 md:p-8">
              <img src="/images/sobre-cta.webp" alt="Contato SPA do Doguinho" className="mb-7 h-[290px] w-full rounded-[28px] object-cover" />

              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                  <PawPrint size={34} />
                </div>
                <div>
                  <h2 className="text-3xl font-black">Contato rápido</h2>
                  <p className="text-slate-500">Preencha e envie direto pelo WhatsApp</p>
                </div>
              </div>

              <div className="grid gap-4">
                <input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Seu nome" className="input-premium" />
                <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Seu telefone" className="input-premium" />
                <input value={form.pet} onChange={(event) => updateField("pet", event.target.value)} placeholder="Nome do pet" className="input-premium" />

                <select value={form.service} onChange={(event) => updateField("service", event.target.value)} className="input-premium">
                  <option>Banho</option>
                  <option>Tosa</option>
                  <option>Vacina</option>
                  <option>Spa Relaxante</option>
                  <option>Outro serviço</option>
                </select>

                <textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} rows={5} placeholder="Conte o que seu pet precisa" className="input-premium" />

                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] py-5 text-lg font-black text-white transition hover:bg-[#095642]">
                  <Send size={20} />
                  Enviar pelo WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-6 px-5 py-16 md:px-8 lg:grid-cols-3">
          <div className="rounded-[36px] bg-white p-8 shadow-xl ring-1 ring-black/5 md:p-10 lg:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 font-black text-emerald-900">
              <MapPin size={18} />
              Onde estamos
            </span>

            <h2 className="mt-6 text-4xl font-black md:text-5xl">
              Atendimento em Sud Mennucci - SP
            </h2>

            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Um espaço preparado para receber seu pet com segurança, organização, higiene e muito carinho.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[
                [Phone, "+55 18 99749-3722", "WhatsApp para agendamentos"],
                [Mail, "contato@spadodoguinho.com.br", "Contato comercial"],
                [MapPin, "Rua Marco Antonio M.J Franco Nº 606", "Sud Mennucci - SP"],
                [Clock, "Terça a sábado", "Horários práticos para tutores"]
              ].map(([Icon, title, text]) => (
                <div key={title} className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                  <Icon className="mb-4 text-[#0d6b54]" size={32} />
                  <div className="font-black">{title}</div>
                  <div className="mt-1 text-slate-500">{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] bg-[#10231a] p-8 text-white shadow-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 font-black">
              <Clock size={18} />
              Funcionamento
            </span>

            <div className="mt-8 space-y-4">
              {[
                ["Terça a Sexta", "08:00 às 18:00"],
                ["Sábado", "08:00 às 14:00"],
                ["Domingo", "Fechado"],
                ["Segunda", "Fechado"]
              ].map(([day, time]) => (
                <div key={day} className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                  <span className="text-white/75">{day}</span>
                  <strong>{time}</strong>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-[#0d6b54] p-6">
              <div className="mb-3 flex gap-1 text-yellow-300">
                {[1, 2, 3, 4, 5].map((item) => <Star key={item} size={18} fill="currentColor" />)}
              </div>
              <h3 className="text-2xl font-black">Atendimento 5 estrelas</h3>
              <p className="mt-2 text-white/80">Cuidado premium para pets e tutores.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] px-5 pb-20 md:px-8">
          <div className="rounded-[36px] bg-white p-8 shadow-xl ring-1 ring-black/5 md:p-10">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                [CheckCircle, "Confirmação rápida", "Você recebe retorno pelo WhatsApp."],
                [Sparkles, "Experiência premium", "Ambiente limpo, bonito e organizado."],
                [Heart, "Cuidado com amor", "Seu pet tratado como parte da família."]
              ].map(([Icon, title, text]) => (
                <div key={title} className="rounded-3xl bg-slate-50 p-6">
                  <Icon className="mb-4 text-[#0d6b54]" size={34} />
                  <h3 className="text-2xl font-black">{title}</h3>
                  <p className="mt-2 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
