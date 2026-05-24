import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Bath,
  CalendarDays,
  CheckCircle2,
  Heart,
  Image,
  LogIn,
  MessageCircle,
  PawPrint,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Medal,
  HandHeart,
  Leaf,
  Snowflake,
  SprayCan,
  Scissors
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const whatsappUrl =
  "https://wa.me/5518997493722?text=Olá! Gostaria de conhecer melhor o SPA do Doguinho.";

const pillars = [
  { icon: Heart, title: "Amor", text: "Cuidado com afeto e atenção em cada detalhe." },
  { icon: ShieldCheck, title: "Segurança", text: "Ambiente seguro, higienizado e adaptado para o bem-estar." },
  { icon: Leaf, title: "Bem-estar", text: "Produtos premium e técnicas suaves que respeitam cada pet." },
  { icon: PawPrint, title: "Experiência", text: "Profissionais qualificados e apaixonados pelo que fazem." }
];

const values = [
  { icon: Heart, title: "Amor", text: "Tratamos cada pet como se fosse nosso. Com carinho verdadeiro em cada toque." },
  { icon: HandHeart, title: "Respeito", text: "Respeitamos o tempo, os limites e a individualidade de cada doguinho." },
  { icon: Medal, title: "Qualidade", text: "Utilizamos produtos premium e técnicas atualizadas para resultados incríveis." },
  { icon: ShieldCheck, title: "Segurança", text: "Ambiente seguro, protocolos rigorosos e profissionais treinados." },
  { icon: Users, title: "Transparência", text: "Confiança, clareza e comunicação aberta com todos os tutores." }
];

const essenceItems = [
  "Atendimento individualizado",
  "Técnicas modernas e seguras",
  "Produtos de alta qualidade",
  "Ambiente tranquilo e acolhedor"
];

const ambienceItems = [
  [Snowflake, "Ambiente climatizado e confortável"],
  [SprayCan, "Higiene impecável e esterilização rigorosa"],
  [Scissors, "Equipamentos modernos e seguros"],
  [Users, "Profissionais treinados e apaixonados"],
  [PawPrint, "Áreas pensadas para o conforto do pet"]
];

function ImagePlaceholder({ title, subtitle = "Espaço reservado para nova imagem", className = "" }) {
  return (
    <div className={`relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[34px] border border-dashed border-[#0d6b54]/25 bg-[linear-gradient(135deg,#e6f5eb,#fff8e6)] p-8 text-center shadow-lg ring-1 ring-white/70 ${className}`}>
      <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-[#0d8b67]/10 blur-2xl" />
      <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#f4c86a]/25 blur-2xl" />
      <div className="relative">
        <div className="home-float mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-[#0d6b54] shadow-xl">
          <Image size={36} />
        </div>
        <h3 className="mt-5 text-2xl font-black text-[#12382f]">{title}</h3>
        <p className="mt-2 text-sm font-bold text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default function QuemSomosPage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative min-h-[620px] overflow-hidden bg-[linear-gradient(135deg,#fffdf7,#e6f5eb,#fff8e6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(13,139,103,.18),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(244,200,106,.28),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto grid min-h-[620px] max-w-[1880px] gap-10 px-6 py-12 md:px-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div className="max-w-4xl">
              <span className="home-animate-fade inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-black uppercase tracking-[.16em] text-[#0d6b54] shadow-sm backdrop-blur">
                <PawPrint size={16} /> Quem somos
              </span>
              <h1 className="home-animate-fade-delay-1 mt-6 text-4xl font-black leading-[.95] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-7xl">
                SPA do Doguinho
                <span className="home-shimmer-text block font-serif italic">mais que um banho, um cuidado cheio de amor.</span>
              </h1>
              <p className="home-animate-fade-delay-2 mt-6 max-w-2xl text-xl font-black leading-relaxed text-[#0d6b54]">
                Mais que um spa, um lugar de amor e cuidado para quem você mais ama.
              </p>
              <p className="home-animate-fade-delay-2 mt-5 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
                O SPA do Doguinho nasceu do amor incondicional pelos pets e do desejo de proporcionar muito mais do que beleza: aqui, cada banho, cada cuidado e cada detalhe são pensados para o bem-estar físico e emocional do seu melhor amigo.
              </p>
              <p className="home-animate-fade-delay-2 mt-4 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
                Somos um espaço moderno, seguro e acolhedor, com profissionais apaixonados e dedicados a oferecer uma experiência única de relaxamento, higiene e carinho.
              </p>
              <div className="home-animate-fade-delay-3 mt-8 flex flex-wrap gap-4">
                <Link to="/cliente-login" className="home-pulse-glow inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#095642]"><LogIn size={20} /> Entrar para agendar</Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#e9fff2] px-6 py-4 font-black text-[#128c4b] shadow-sm transition hover:-translate-y-1"><MessageCircle size={20} /> Falar no WhatsApp</a>
              </div>
            </div>

            <ImagePlaceholder title="Imagem principal do Quem Somos" subtitle="Depois colocamos uma foto exclusiva inspirada na referência" className="min-h-[460px]" />
          </div>
        </section>

        <section className="relative -mt-8 px-5 md:px-8">
          <div className="mx-auto grid max-w-[1880px] gap-5 rounded-[34px] bg-white p-5 shadow-xl ring-1 ring-[#e2eadf] md:grid-cols-4 md:p-6">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="home-card-animate flex items-center gap-4 rounded-[26px] bg-[#fffdf7] p-6 ring-1 ring-[#e2eadf]" style={{ animationDelay: `${index * 90}ms` }}>
                  <div className="home-icon-pop flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#d9eee3] text-[#0d6b54] ring-1 ring-[#c8e5d6]"><Icon size={32} /></div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-[.05em] text-[#0d6b54]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto grid max-w-[1880px] gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <ImagePlaceholder title="Imagem da nossa essência" subtitle="Foto exclusiva de pet com toalha ou ambiente de cuidado" className="min-h-[520px]" />
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-5 py-2 text-sm font-black text-[#0d6b54]"><Award size={18} /> Nossa essência</span>
              <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-.04em] text-[#0d6b54] md:text-6xl">Acreditamos que cada pet é único.</h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
                Acreditamos que cada pet é único e merece ser tratado com respeito, paciência e muito amor.
              </p>
              <div className="mt-8 grid gap-4">
                {essenceItems.map((step, index) => (
                  <div key={step} className="home-card-animate flex items-center gap-4 rounded-3xl border border-[#e2eadf] bg-white p-5 shadow-sm" style={{ animationDelay: `${index * 80}ms` }}>
                    <Heart className="shrink-0 text-[#0d6b54]" size={20} />
                    <span className="font-bold text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 max-w-2xl text-lg font-black leading-relaxed text-[#12382f]">
                Aqui, seu doguinho não é apenas mais um cliente. Ele é parte da nossa família.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto max-w-[1880px]">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-5 py-2 text-sm font-black text-[#0d6b54]"><Sparkles size={16} /> Nossos valores</span>
              <h2 className="mt-5 text-4xl font-black tracking-[-.04em] text-[#0d6b54] md:text-5xl">Valores que guiam nosso propósito.</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-5">
              {values.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="home-card-animate rounded-[30px] bg-white p-7 text-center shadow-xl ring-1 ring-[#e2eadf]" style={{ animationDelay: `${index * 90}ms` }}>
                    <div className="home-icon-pop mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e7f4ed] text-[#0d6b54]"><Icon size={34} /></div>
                    <h3 className="mt-6 text-xl font-black uppercase tracking-[.05em] text-[#0d6b54]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 rounded-full bg-[#d9eee3] px-6 py-3 text-center text-lg font-black uppercase tracking-[.05em] text-[#0d6b54]">
              Valores que guiam nosso propósito: fazer o melhor, sempre. 💛
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto max-w-[1880px] rounded-[40px] bg-[#e7f4ed] p-7 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-black text-[#0d6b54]"><Bath size={16} /> Ambiente e carinho</span>
                <h2 className="mt-5 text-4xl font-black tracking-[-.04em] text-[#0d6b54] md:text-5xl">Nosso espaço foi criado para seu pet se sentir em casa.</h2>
                <p className="mt-5 max-w-xl text-slate-600">Cheiroso, seguro e feliz do início ao fim.</p>
                <div className="mt-8 grid gap-4">
                  {ambienceItems.map(([Icon, text], index) => (
                    <div key={text} className="home-card-animate flex items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-sm" style={{ animationDelay: `${index * 70}ms` }}>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#d9eee3] text-[#0d6b54]"><Icon size={22} /></div>
                      <span className="font-bold text-slate-700">{text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-3xl bg-white/75 p-5 text-center font-bold leading-relaxed text-[#0d6b54] shadow-sm">
                  Cada detalhe foi pensado para o bem-estar e tranquilidade do seu pet e de toda a família.
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {["Imagem ampla do ambiente", "Imagem da recepção", "Imagem do banho", "Imagem do espaço pet"].map((title, index) => (
                  <div key={title} className={`home-card-animate ${index === 0 ? "md:col-span-2" : ""}`} style={{ animationDelay: `${index * 90}ms` }}>
                    <ImagePlaceholder title={title} subtitle="Reservado para imagem exclusiva" className={index === 0 ? "min-h-[300px] bg-white/65" : "min-h-[250px] bg-white/65"} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto grid max-w-[1880px] gap-8 overflow-hidden rounded-[44px] bg-[linear-gradient(135deg,#d9eee3,#fff8e6)] p-8 text-[#12382f] shadow-2xl ring-1 ring-[#d9eee3] md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2 text-sm font-black text-[#0d6b54]"><Star size={16} fill="currentColor" /> SPA do Doguinho</span>
              <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-.04em] text-[#0d6b54] md:text-6xl">Pronto para proporcionar momentos incríveis para seu doguinho?</h2>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-relaxed text-slate-700">Agende agora ou fale com a gente. Vamos cuidar do seu melhor amigo com todo amor que ele merece!</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/cliente-login" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] px-8 py-4 font-black text-white shadow-xl transition hover:-translate-y-1"><CalendarDays size={20} /> Agendar agora</Link>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#0d6b54]/20 bg-white/80 px-8 py-4 font-black text-[#0d6b54] backdrop-blur transition hover:-translate-y-1"><Phone size={20} /> Falar no WhatsApp</a>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
