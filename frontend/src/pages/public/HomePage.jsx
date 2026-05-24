import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Syringe,
  Trophy,
  Users,
  Wand2
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const photos = {
  hero: "/images/hero-doguinho-banho-compatible.svg",
  bath: "/images/banho-tosa.svg",
  vaccine: "/images/vacina-pet.svg",
  spa: "/images/spa-pet.svg",
  client: "/images/cliente-premium.svg"
};

const whatsappUrl =
  "https://wa.me/5518997493722?text=Olá! Gostaria de agendar um atendimento no SPA do Doguinho.";

const services = [
  {
    icon: Bath,
    title: "Banho Premium",
    text: "Higiene completa, produtos de qualidade, secagem cuidadosa e finalização cheirosa.",
    image: photos.bath
  },
  {
    icon: Scissors,
    title: "Tosa Boutique",
    text: "Acabamento personalizado conforme porte, pelagem e estilo do seu doguinho.",
    image: photos.bath
  },
  {
    icon: Sparkles,
    title: "Spa Relaxante",
    text: "Cuidado especial para o pet relaxar, ficar confortável e sair ainda mais feliz.",
    image: photos.spa
  },
  {
    icon: Syringe,
    title: "Vacinação",
    text: "Organização e controle para cuidar da saúde do seu pet com segurança.",
    image: photos.vaccine
  }
];

const benefits = [
  ["Ambiente seguro", "Rotina pensada para reduzir estresse e deixar o pet confortável.", ShieldCheck],
  ["Atendimento com carinho", "Cuidado humanizado, respeitando o tempo e o comportamento de cada pet.", Heart],
  ["Agendamento online", "Escolha data e horário pelo site, sem complicação.", CalendarCheck],
  ["Gestão moderna", "Histórico, financeiro, estoque e agenda integrados ao sistema.", Trophy]
];

const steps = [
  ["1", "Escolha o serviço", "Banho, tosa, spa, vacinação ou outro atendimento disponível."],
  ["2", "Selecione o pet", "O tutor escolhe o pet cadastrado ou cria um novo cadastro."],
  ["3", "Defina data e horário", "O sistema mostra apenas horários disponíveis conforme a agenda."],
  ["4", "Confirme o atendimento", "O agendamento fica salvo para o cliente e para o painel administrativo."]
];

const packages = [
  ["Pequeno", "R$ 60", "~1h", "Ideal para pets pequenos e banho rápido."],
  ["Médio", "R$ 80", "~1h30", "Mais tempo de cuidado e secagem completa."],
  ["Grande", "R$ 100", "~2h", "Atendimento reforçado para pelagens maiores."],
  ["Gigante", "R$ 120", "~2h30", "Cuidado especial para pets de grande porte."]
];

const testimonials = [
  ["Atendimento maravilhoso, meu doguinho voltou cheiroso e super tranquilo.", "Cliente SPA"],
  ["Amei o agendamento online. Muito prático e o atendimento foi excelente.", "Tutora feliz"],
  ["Ambiente bonito, organizado e com muito carinho pelos pets.", "Cliente premium"]
];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#edf6ed] text-[#102d27]">
        <section className="relative overflow-hidden bg-[#dcefe3] px-5 pb-0 pt-7 md:px-8 2xl:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(13,139,103,.18),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(244,200,106,.28),transparent_28%),linear-gradient(180deg,rgba(255,255,255,.38),transparent)]" />

          <div className="relative mx-auto grid min-h-[calc(100vh-132px)] max-w-[1840px] gap-8 xl:grid-cols-[.72fr_1.28fr] xl:items-center">
            <div className="z-10 max-w-3xl py-6 xl:py-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#19534e]/10 bg-white/90 px-4 py-2 text-xs font-black text-[#19534e] shadow-sm md:text-sm">
                <Sparkles size={15} /> Boutique pet premium em Sud Mennucci
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[.96] tracking-tight text-[#102d27] sm:text-5xl md:text-6xl 2xl:text-7xl">
                Mais que banho,
                <br />
                <span className="text-[#0d8b67]">um momento de carinho.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
                No SPA do Doguinho, seu pet recebe cuidado especial, segurança e muito amor.
                Agende online e deixe seu melhor amigo se sentir em casa.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/agendamento"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-[#19534e] px-6 py-3.5 font-black text-white shadow-[0_20px_45px_rgba(25,83,78,.24)] transition hover:-translate-y-0.5 hover:bg-[#123f3b]"
                >
                  <CalendarDays size={18} />
                  Agendar agora
                  <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/servicos"
                  className="inline-flex items-center gap-3 rounded-2xl border border-[#b7d7c2] bg-white px-6 py-3.5 font-black text-[#102d27] shadow-sm transition hover:-translate-y-0.5 hover:border-[#19534e]"
                >
                  <Heart size={18} />
                  Nossos serviços
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-3">
                  {[photos.bath, photos.spa, photos.vaccine, photos.client].map((photo, index) => (
                    <div key={index} className="h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-[#dcefe3] shadow-md">
                      <img src={photo} alt="Cliente feliz" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex gap-1 text-[#f4c86a]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-600">Mais de 500 pets felizes!</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[430px] md:min-h-[500px] xl:min-h-[calc(100vh-168px)]">
              <div className="absolute inset-y-0 right-0 w-full overflow-hidden rounded-[42px] bg-[#c9ead8] shadow-2xl ring-1 ring-black/5 xl:w-[104%] 2xl:rounded-[54px]">
                <img
                  src={photos.hero}
                  alt="SPA do Doguinho"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#dcefe3]/18 via-transparent to-transparent" />
              </div>

              <div className="absolute right-5 bottom-6 hidden max-w-[280px] rounded-[24px] bg-white/88 p-4 shadow-2xl backdrop-blur md:block">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f3ef] text-[#19534e]">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <div className="font-black text-[#102d27]">Ambiente seguro e climatizado</div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">Conforto e bem-estar para o seu melhor amigo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto -mt-2 grid max-w-[1840px] gap-5 rounded-t-[48px] bg-white/72 px-5 py-8 shadow-[0_-18px_50px_rgba(25,83,78,.08)] ring-1 ring-white/70 backdrop-blur md:grid-cols-4 md:px-8 2xl:px-10">
            {[
              [Bath, "Banho Premium", "Produtos de qualidade e muito carinho."],
              [Scissors, "Tosa e Higiene", "Tosas personalizadas e cuidados especiais."],
              [Sparkles, "Spa e Bem-estar", "Hidratação, relaxamento e conforto."],
              [MessageCircle, "Agende Online", "Escolha horário pelo site ou WhatsApp."]
            ].map(([Icon, title, text]) => (
              <div key={title} className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#edf6ed] text-[#19534e] shadow-inner ring-1 ring-[#b7d7c2]/50">
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#102d27]">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1840px] gap-5 px-5 py-12 md:grid-cols-4 md:px-8 2xl:px-10">
          {benefits.map(([title, text, Icon]) => (
            <div
              key={title}
              className="rounded-[30px] bg-white p-7 shadow-xl ring-1 ring-[#b7d7c2]/40 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <Icon className="text-[#19534e]" size={34} />
              <h3 className="mt-5 text-2xl font-black">{title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </section>

        <section className="px-5 py-10 md:px-8 2xl:px-10">
          <div className="mx-auto max-w-[1840px]">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e0f2e8] px-5 py-2 text-sm font-black text-[#19534e]">
                  <Wand2 size={16} /> Serviços
                </span>
                <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                  Tudo para o bem-estar do seu pet.
                </h2>
              </div>

              <Link
                to="/servicos"
                className="inline-flex items-center gap-2 font-black text-[#19534e] hover:text-[#0d8b67]"
              >
                Ver todos os serviços <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {services.map(({ icon: Icon, title, text, image }) => (
                <div
                  key={title}
                  className="group overflow-hidden rounded-[34px] bg-white shadow-xl ring-1 ring-[#b7d7c2]/40 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-52 overflow-hidden bg-[#dcefe3]">
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-[#19534e] shadow-lg backdrop-blur">
                      <Icon size={28} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-black">{title}</h3>
                    <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1840px] gap-8 rounded-[42px] bg-[#19534e] p-8 text-white shadow-2xl md:grid-cols-2 md:p-12 xl:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-[#dcefe3]">
                Pacotes por porte
              </span>
              <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                Preço claro antes de agendar.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
                Valores separados por porte para facilitar o atendimento e calcular
                melhor tempo, produto e cuidado necessário.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {packages.map(([name, price, time, desc]) => (
                <div
                  key={name}
                  className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-white">{name}</h3>
                      <p className="mt-1 text-white/60">Banho a partir de</p>
                    </div>
                    <PawPrint className="text-[#f4c86a]" size={28} />
                  </div>

                  <div className="mt-5 text-4xl font-black text-[#f4c86a]">{price}</div>
                  <div className="mt-4 flex items-center gap-2 text-white/70">
                    <Clock size={18} />
                    {time}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8 2xl:px-10">
          <div className="mx-auto max-w-[1840px] rounded-[42px] bg-white p-8 shadow-xl ring-1 ring-[#b7d7c2]/40 md:p-12">
            <div className="grid gap-10 xl:grid-cols-[.8fr_1.2fr] xl:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e0f2e8] px-5 py-2 text-sm font-black text-[#19534e]">
                  <CalendarCheck size={16} /> Como funciona
                </span>
                <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                  Agendar ficou simples.
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">
                  O cliente escolhe serviço, pet, data e horário. O painel administrativo
                  recebe tudo organizado para facilitar sua rotina.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {steps.map(([number, title, text]) => (
                  <div key={number} className="rounded-[28px] bg-[#f5fbf6] p-6 ring-1 ring-[#b7d7c2]/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#19534e] text-lg font-black text-white">
                      {number}
                    </div>
                    <h3 className="mt-5 text-xl font-black">{title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1840px] gap-8 xl:grid-cols-[1.05fr_.95fr] xl:items-center">
            <div className="overflow-hidden rounded-[42px] bg-[#dcefe3] p-8 shadow-xl ring-1 ring-[#b7d7c2]/40 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-black text-[#19534e]">
                <Users size={16} /> Para tutores exigentes
              </span>
              <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                Mais carinho, menos preocupação.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
                O SPA do Doguinho une estética, organização e tecnologia para entregar
                um atendimento mais seguro, bonito e eficiente.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  "Histórico do pet organizado",
                  "Controle de agenda e horários",
                  "Atendimento por porte",
                  "Comunicação fácil pelo WhatsApp"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 font-bold text-[#102d27]">
                    <CheckCircle2 className="text-[#0d8b67]" size={22} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[42px] bg-white shadow-xl ring-1 ring-[#b7d7c2]/40">
              <img src={photos.client} alt="Cliente premium" className="h-[460px] w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8 2xl:px-10">
          <div className="mx-auto max-w-[1840px]">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e0f2e8] px-5 py-2 text-sm font-black text-[#19534e]">
                <Star size={16} fill="currentColor" /> Depoimentos
              </span>
              <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                Quem conhece, recomenda.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map(([text, name]) => (
                <div key={text} className="rounded-[34px] bg-white p-7 shadow-xl ring-1 ring-[#b7d7c2]/40">
                  <div className="flex gap-1 text-[#f4c86a]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={17} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 text-lg font-semibold leading-relaxed text-slate-700">
                    “{text}”
                  </p>
                  <div className="mt-6 font-black text-[#19534e]">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 pt-8 md:px-8 2xl:px-10">
          <div className="mx-auto overflow-hidden rounded-[46px] bg-[#071b12] p-8 text-white shadow-2xl md:p-12">
            <div className="grid gap-8 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-black text-[#f4c86a]">
                  <MapPin size={16} /> SPA do Doguinho
                </span>
                <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                  Pronto para deixar seu pet ainda mais lindo e feliz?
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
                  Clique abaixo e faça seu agendamento online ou fale direto pelo WhatsApp.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link
                  to="/agendamento"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f4c86a] px-8 py-4 font-black text-[#102d27] shadow-xl transition hover:-translate-y-0.5 hover:bg-[#ffd979]"
                >
                  <CalendarDays size={20} />
                  Agendar agora
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Phone size={20} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
