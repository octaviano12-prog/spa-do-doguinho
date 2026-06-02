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
import PublicLayout from "../../components/public/PublicLayout";

const WHATSAPP_NUMBER = "5518997493722";
const heroImage = "/images/sobre-cta.webp";
const contactImage = "/images/sobre-ambiente-01.webp";

const quickBenefits = [
  [MessageCircle, "Resposta rápida", "Atendimento direto pelo WhatsApp."],
  [CalendarDays, "Agenda organizada", "Horários práticos para tutores."],
  [ShieldCheck, "Cuidado seguro", "Seu pet acompanhado com carinho."]
];

const contactItems = [
  [Phone, "+55 18 99749-3722", "WhatsApp para agendamentos"],
  [Mail, "contato@spadodoguinho.com.br", "Contato comercial"],
  [MapPin, "Rua Marco Antonio M.J Franco Nº 606", "Sud Mennucci - SP"],
  [Clock, "Terça a sábado", "Horários práticos para tutores"]
];

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
        <section className="relative h-[calc(100vh-128px)] min-h-[620px] overflow-hidden bg-[#e9f6ee]">
          <img src={heroImage} alt="Contato SPA do Doguinho" className="home-hero-image absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#edf8f1]/96 via-[#edf8f1]/72 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1880px] items-center px-6 py-5 md:px-10">
            <div className="max-w-4xl -translate-y-1">
              <span className="home-animate-fade inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-black uppercase tracking-[.14em] text-[#0d6b54] shadow-sm backdrop-blur">
                <MessageCircle size={16} /> Atendimento humanizado
              </span>
              <h1 className="home-animate-fade-delay-1 mt-5 text-4xl font-black leading-[.92] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.65rem] 2xl:text-[5.15rem]">
                Fale com a gente
                <span className="home-shimmer-text block font-serif italic">e agende com carinho.</span>
              </h1>
              <p className="home-animate-fade-delay-2 mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base lg:text-lg">
                Tire dúvidas, escolha o melhor horário e receba orientação para banho, tosa, spa e cuidados especiais do seu pet.
              </p>
              <div className="home-animate-fade-delay-3 mt-7 flex flex-wrap gap-3">
                <Link to="/agendamento" className="home-pulse-glow inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642]">
                  <CalendarDays size={20} /> Agendar online
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#e9fff2] px-6 py-3 font-black text-[#128c4b] shadow-sm backdrop-blur transition hover:-translate-y-1">
                  <MessageCircle size={20} /> WhatsApp
                </a>
              </div>
              <div className="home-animate-fade-delay-3 mt-6 flex flex-wrap items-center gap-4">
                <div className="flex gap-1 text-[#f4b942]">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} fill="currentColor" />)}</div>
                <p className="text-sm font-black text-slate-600">Atendimento rápido, claro e acolhedor</p>
              </div>
            </div>
          </div>

          <div className="home-float absolute bottom-8 right-8 hidden max-w-[300px] rounded-[26px] bg-[#0d6b54] p-5 text-white shadow-2xl xl:block">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><Phone size={30} /></div>
              <div>
                <div className="font-black">WhatsApp direto</div>
                <p className="mt-1 text-xs text-white/75">Converse com a equipe e organize o atendimento.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-5 pt-8 pb-16 md:px-8">
          <div className="mx-auto grid max-w-[1880px] gap-5 rounded-[34px] bg-white p-5 shadow-xl ring-1 ring-[#e2eadf] md:grid-cols-3 md:p-6">
            {quickBenefits.map(([Icon, title, text], index) => (
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

        <section className="px-5 py-16 md:px-8">
          <div className="home-animate-fade mx-auto grid max-w-[1880px] overflow-hidden rounded-[34px] bg-white shadow-xl ring-1 ring-[#e2eadf] lg:grid-cols-[.95fr_1.05fr]">
            <div className="relative min-h-[520px] overflow-hidden bg-[#e6f5eb]">
              <img src={contactImage} alt="Ambiente SPA do Doguinho" className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b352b]/25 via-transparent to-white/5" />
              <div className="absolute bottom-7 left-7 right-7 rounded-[26px] bg-white/88 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f4ed] text-[#0d6b54]"><PawPrint size={30} /></div>
                  <div>
                    <div className="text-xl font-black text-[#0d6b54]">Contato rápido</div>
                    <p className="mt-1 text-sm font-semibold text-slate-600">Preencha e envie direto pelo WhatsApp.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-7 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-5 py-2 text-sm font-black text-[#0d6b54]"><Send size={16} /> Envie sua mensagem</span>
              <h2 className="mt-5 text-4xl font-black tracking-[-.04em] text-[#0d6b54] md:text-5xl">Vamos cuidar do seu melhor amigo.</h2>
              <p className="mt-3 max-w-2xl text-slate-600">Conte o que seu pet precisa e a mensagem já vai pronta para nossa equipe.</p>

              <div className="mt-7 grid gap-4">
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

                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] px-6 text-lg font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#095642]">
                  <Send size={20} /> Enviar pelo WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1880px] gap-6 px-5 py-16 md:px-8 lg:grid-cols-[1.35fr_.85fr]">
          <div className="rounded-[36px] bg-white p-8 shadow-xl ring-1 ring-[#e2eadf] md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-5 py-2 font-black text-[#0d6b54]"><MapPin size={18} /> Onde estamos</span>
            <h2 className="mt-6 text-4xl font-black tracking-[-.04em] text-[#0d6b54] md:text-5xl">Atendimento em Sud Mennucci - SP</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">Um espaço preparado para receber seu pet com segurança, organização, higiene e muito carinho.</p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {contactItems.map(([Icon, title, text], index) => (
                <div key={title} className="home-card-animate rounded-3xl border border-[#e2eadf] bg-[#fffdf7] p-6" style={{ animationDelay: `${index * 70}ms` }}>
                  <Icon className="mb-4 text-[#0d6b54]" size={32} />
                  <div className="font-black text-[#12382f]">{title}</div>
                  <div className="mt-1 text-slate-500">{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] bg-[#12382f] p-8 text-white shadow-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 font-black"><Clock size={18} /> Funcionamento</span>
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
              <div className="mb-3 flex gap-1 text-[#f4c86a]">{[1, 2, 3, 4, 5].map((item) => <Star key={item} size={18} fill="currentColor" />)}</div>
              <h3 className="text-2xl font-black">Atendimento 5 estrelas</h3>
              <p className="mt-2 text-white/80">Cuidado premium para pets e tutores.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1880px] px-5 pb-20 md:px-8">
          <div className="rounded-[36px] bg-white p-8 shadow-xl ring-1 ring-[#e2eadf] md:p-10">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                [CheckCircle, "Confirmação rápida", "Você recebe retorno pelo WhatsApp."],
                [Sparkles, "Experiência premium", "Ambiente limpo, bonito e organizado."],
                [Heart, "Cuidado com amor", "Seu pet tratado como parte da família."]
              ].map(([Icon, title, text]) => (
                <div key={title} className="rounded-3xl bg-[#fffdf7] p-6 ring-1 ring-[#e2eadf]">
                  <Icon className="mb-4 text-[#0d6b54]" size={34} />
                  <h3 className="text-2xl font-black text-[#12382f]">{title}</h3>
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
