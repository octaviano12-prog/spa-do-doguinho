import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Heart,
  PawPrint,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Syringe,
  Truck,
  UserPlus,
  LogIn,
  Dog
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const whatsappUrl =
  "https://wa.me/5518997493722?text=Olá! Gostaria de agendar um atendimento no SPA do Doguinho.";

const heroImage = "/images/hero-doguinho-card.webp";
const bookingImage = "/images/banho-pet-home.webp";

const homeGalleryImages = [
  "/images/galeria-pet-01.webp",
  "/images/galeria-pet-02.webp",
  "/images/galeria-pet-03.webp",
  "/images/galeria-pet-04.webp"
];

const services = [
  { icon: Bath, title: "Banho Premium", text: "Banho com produtos de alta qualidade e muito carinho.", price: "A partir de R$ 70,00" },
  { icon: Scissors, title: "Tosa e Higiene", text: "Tosas personalizadas e cuidados que deixam seu pet ainda mais lindo.", price: "A partir de R$ 80,00" },
  { icon: Sparkles, title: "Spa e Bem-estar", text: "Hidratação, massagem e tratamentos para saúde da pele e pelagem.", price: "A partir de R$ 90,00" },
  { icon: Truck, title: "Busca e Leva", text: "Buscamos e levamos seu pet com todo conforto e segurança.", price: "A partir de R$ 40,00" }
];

const benefits = [
  ["Atendimento com amor", "Tratamos cada pet como parte da família.", Heart],
  ["Ambiente seguro e climatizado", "Espaço pensado para o bem-estar do seu pet.", ShieldCheck],
  ["Agendamento fácil e rápido", "Agende em poucos cliques pelo celular.", CalendarCheck]
];

const bookingSteps = [
  [LogIn, "Entre na sua conta", "Acesse sua área do cliente com segurança."],
  [Dog, "Cadastre seu pet", "Informe porte, dados e observações importantes."],
  [Bath, "Escolha o serviço", "Selecione banho, tosa, spa ou outro cuidado."],
  [CalendarCheck, "Confirme o horário", "Finalize o agendamento com tudo organizado."]
];

const testimonials = [
  ["Meu pet sempre volta feliz e cheirozinho! Atendimento maravilhoso.", "Juliana S.", "Tutora do Fred"],
  ["Ambiente impecável e muito seguro. Super recomendo!", "Carlos M.", "Tutor da Luna"],
  ["A busca e leva facilitou muito a minha rotina!", "Patrícia A.", "Tutora do Thor"]
];

function HomeImage({ src, alt, className = "" }) {
  return (
    <div className={`group relative min-h-[220px] overflow-hidden rounded-[24px] bg-[#e6f5eb] shadow-lg ring-1 ring-[#e2eadf] ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b352b]/10 via-transparent to-white/5" />
    </div>
  );
}

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative h-[calc(100vh-128px)] min-h-[620px] overflow-hidden bg-[#e9f6ee]">
          <img src={heroImage} alt="SPA do Doguinho" className="home-hero-image absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#edf8f1]/96 via-[#edf8f1]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1880px] items-center px-6 py-5 md:px-10">
            <div className="max-w-3xl -translate-y-1">
              <h1 className="home-animate-fade text-4xl font-black leading-[.92] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.7rem] 2xl:text-[5.25rem]">
                Mais que um banho,
                <span className="home-shimmer-text block font-serif italic">um momento de amor!</span>
              </h1>

              <p className="home-animate-fade-delay-1 mt-4 max-w-xl text-sm leading-relaxed text-slate-700 md:text-base lg:text-lg">
                No SPA do Doguinho, seu pet recebe cuidado especial, com carinho,
                segurança e muito amor. Porque aqui, ele se sente em casa!
              </p>

              <div className="home-animate-fade-delay-2 mt-6 flex flex-wrap gap-3">
                <Link to="/cliente-login" className="home-pulse-glow inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642]">
                  <CalendarDays size={20} /> Entrar para agendar
                </Link>
                <Link to="/servicos" className="inline-flex items-center gap-3 rounded-2xl border border-[#0d6b54]/35 bg-white/85 px-6 py-3 font-black text-[#0d6b54] shadow-sm backdrop-blur transition hover:-translate-y-1">
                  <Heart size={20} /> Nossos serviços
                </Link>
              </div>

              <div className="home-animate-fade-delay-3 mt-5 flex flex-wrap items-center gap-4">
                <div className="flex gap-1 text-[#f4b942]">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-sm font-black text-slate-600">Mais de 500 pets felizes!</p>
              </div>
            </div>
          </div>

          <div className="home-float absolute bottom-8 right-8 hidden max-w-[280px] rounded-[26px] bg-[#0d6b54] p-5 text-white shadow-2xl xl:block">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><PawPrint size={30} /></div>
              <div>
                <div className="font-black">Ambiente seguro e climatizado</div>
                <p className="mt-1 text-xs text-white/75">Conforto e bem-estar para o seu melhor amigo.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-5 pt-8 pb-16 md:px-8">
          <div className="mx-auto max-w-[1880px]">
            <h2 className="home-animate-fade mb-7 text-center text-3xl font-black text-[#0d6b54] md:text-4xl">Nossos serviços</h2>
            <div className="grid gap-5 md:grid-cols-4">
              {services.map(({ icon: Icon, title, text, price }, index) => (
                <div key={title} className="home-card-animate rounded-[26px] bg-white p-7 text-center shadow-xl ring-1 ring-[#e2eadf]" style={{ animationDelay: `${index * 90}ms` }}>
                  <div className="home-icon-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e7f4ed] text-[#0d6b54]"><Icon size={38} /></div>
                  <h3 className="mt-5 text-lg font-black text-[#0d6b54]">{title}</h3>
                  <p className="mt-3 min-h-[56px] text-sm leading-relaxed text-slate-600">{text}</p>
                  <p className="mt-5 text-sm text-slate-500">{price}</p>
                  <Link to="/cliente-login" className="mt-4 inline-flex w-full justify-center rounded-full bg-[#16815f] px-5 py-3 font-black text-white transition hover:bg-[#0d6b54]">Entrar para agendar</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto max-w-[1760px]">
            <h2 className="home-animate-fade text-center text-3xl font-black text-[#0d6b54] md:text-4xl">Por que escolher o SPA do Doguinho?</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {benefits.map(([title, text, Icon], index) => (
                <div key={title} className="home-card-animate flex items-center gap-5 rounded-[26px] bg-white p-6 shadow-sm ring-1 ring-[#e2eadf]" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="home-icon-pop flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e7f4ed] text-[#0d6b54]"><Icon size={38} /></div>
                  <div><h3 className="text-xl font-black text-[#0d6b54]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="home-animate-fade mx-auto grid max-w-[1880px] overflow-hidden rounded-[34px] bg-white shadow-xl ring-1 ring-[#e2eadf] lg:grid-cols-[.9fr_1.1fr]">
            <HomeImage src={bookingImage} alt="Banho pet SPA do Doguinho" className="min-h-[420px] rounded-none" />

            <div className="p-8 md:p-10">
              <h2 className="text-3xl font-black text-[#0d6b54]">Como funciona?</h2>
              <p className="mt-2 text-slate-600">O fluxo completo acontece na área logada do cliente.</p>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {bookingSteps.map(([Icon, title, text], index) => (
                  <div key={title} className="rounded-3xl border border-[#e2eadf] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e7f4ed] text-[#0d6b54]"><Icon size={24} /></div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-[.14em] text-[#0d6b54]">Passo {index + 1}</div>
                        <h3 className="mt-1 text-lg font-black text-[#12382f]">{title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 text-sm font-bold text-slate-600 md:grid-cols-3">
                {["Dados protegidos", "Histórico do pet", "Agenda organizada"].map((item) => <div key={item} className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#0d6b54]" /> {item}</div>)}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/cliente-login" className="inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-4 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#095642]"><LogIn size={20} /> Entrar para agendar</Link>
                <Link to="/cliente-login" className="inline-flex items-center gap-3 rounded-2xl border border-[#0d6b54]/20 bg-white px-6 py-4 font-black text-[#0d6b54] shadow-sm transition hover:-translate-y-1"><UserPlus size={20} /> Criar conta</Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#e9fff2] px-6 py-4 font-black text-[#128c4b] shadow-sm transition hover:-translate-y-1"><Phone size={20} /> WhatsApp</a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto max-w-[1760px] text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-5 py-2 text-sm font-black text-[#0d6b54]">
              <Sparkles size={16} /> Momentos especiais
            </span>
            <h2 className="home-animate-fade mt-5 text-3xl font-black text-[#0d6b54] md:text-4xl">Pets que passaram por aqui</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Uma prévia carinhosa da experiência SPA do Doguinho: banho, tosa, cuidado e muito amor.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-4">
              {homeGalleryImages.map((image, index) => (
                <div key={image} className="home-card-animate" style={{ animationDelay: `${index * 80}ms` }}>
                  <HomeImage src={image} alt={`Pet atendido no SPA do Doguinho ${index + 1}`} className="min-h-[260px]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#e7f4ed] px-5 py-16 md:px-8">
          <div className="mx-auto max-w-[1760px]">
            <h2 className="home-animate-fade text-center text-3xl font-black text-[#0d6b54] md:text-4xl">O que dizem nossos clientes</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {testimonials.map(([text, name, role], index) => (
                <div key={text} className="home-card-animate rounded-[24px] bg-white p-7 shadow-lg" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex gap-1 text-[#f4b942]">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                  <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-700">“{text}”</p>
                  <div className="mt-5 font-black text-[#0d6b54]">{name}</div>
                  <div className="text-xs text-slate-500">{role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8">
          <div className="home-animate-fade mx-auto flex max-w-[1880px] flex-col gap-6 rounded-t-[90px] rounded-b-[28px] bg-[#0d6b54] p-8 text-white shadow-2xl md:flex-row md:items-center md:justify-between md:p-10">
            <div className="flex items-center gap-6">
              <div className="home-float flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/70"><PawPrint size={50} /></div>
              <div><h2 className="text-3xl font-black">Seu pet merece esse cuidado!</h2><p className="mt-2 text-white/75">Entre na área do cliente e agende com segurança.</p></div>
            </div>
            <Link to="/cliente-login" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#f7e7c4] px-8 py-4 font-black text-[#12382f] shadow-xl transition hover:-translate-y-1"><CalendarDays size={20} /> Entrar para agendar</Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
