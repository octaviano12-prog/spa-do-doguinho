import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  CalendarDays,
  Camera,
  Heart,
  MessageCircle,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Syringe
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";
import { getPublicServicePhoto, homePhotoStories, publicPhotos } from "../../data/publicPhotos";

const services = [
  {
    title: "Banho & Tosa",
    badge: "MAIS PEDIDO",
    icon: Bath,
    img: getPublicServicePhoto("Banho & Tosa"),
    text: "Higiene completa, perfume e acabamento com muito carinho.",
    price: "R$ 60,00"
  },
  {
    title: "Tosa Premium",
    badge: "ACABAMENTO",
    icon: Scissors,
    img: getPublicServicePhoto("Tosa Premium"),
    text: "Tosa higiênica ou completa conforme a necessidade do pet.",
    price: "R$ 80,00"
  },
  {
    title: "Vacinação",
    badge: "SAÚDE",
    icon: Syringe,
    img: getPublicServicePhoto("Vacinação"),
    text: "Registro, cuidado preventivo e acompanhamento organizado.",
    price: "R$ 120,00"
  },
  {
    title: "Spa Relaxante",
    badge: "RELAXANTE",
    icon: Sparkles,
    img: getPublicServicePhoto("Spa Relaxante"),
    text: "Bem-estar, relaxamento, pele e pelagem com cuidado especial.",
    price: "R$ 95,00"
  }
];

const plans = [
  { name: "Pequeno", range: "até 10 kg", time: "~1h", price: "R$ 60,00" },
  { name: "Médio", range: "10,1 a 25 kg", time: "~1h30", price: "R$ 80,00" },
  { name: "Grande", range: "25,1 a 40 kg", time: "~2h", price: "R$ 100,00" },
  { name: "Gigante", range: "acima de 40 kg", time: "~2h30", price: "R$ 120,00" }
];

const benefits = [
  [CalendarDays, "Agendamento fácil", "Escolha data e horário sem complicação."],
  [Sparkles, "Estética premium", "Banho, perfume e finalização caprichada."],
  [ShieldCheck, "Ambiente seguro", "Cuidado organizado do início ao fim."],
  [Heart, "Carinho de verdade", "Seu pet tratado com calma, respeito e atenção."]
];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#06140f] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#06140f_0%,#0b2a1e_42%,#fff7ed_42%,#fff7ed_63%,#062017_63%,#06140f_100%)]" />

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 pt-10 pb-12 grid xl:grid-cols-[1fr_1.04fr] gap-10 items-center min-h-[650px]">
          <div className="max-w-4xl">
            <Badge icon={Sparkles}>SPA do Doguinho Premium</Badge>
            <h1 className="mt-7 text-[44px] md:text-[70px] 2xl:text-[86px] font-black leading-[.95] tracking-tight">
              Banho, tosa e carinho para seu pet voltar lindo.
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/75 leading-relaxed">
              Um atendimento bonito, seguro e acolhedor para deixar seu doguinho limpo, cheiroso, tranquilo e muito bem cuidado.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/agendamento" className="group rounded-[22px] bg-[#f97316] px-8 py-5 text-lg font-black text-white shadow-[0_20px_40px_rgba(249,115,22,.28)] hover:bg-orange-500 transition flex items-center gap-3">
                Agendar agora <ArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="rounded-[22px] border border-white/15 bg-white/10 px-8 py-5 text-lg font-black text-white hover:bg-white/15 transition flex items-center gap-3">
                <MessageCircle /> WhatsApp
              </a>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl">
              <Stat value="+3.500" label="Pets atendidos" />
              <Stat value="5 estrelas" label="Cuidado premium" />
              <Stat value="Online" label="Agendamento rápido" />
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[44px] border border-white/15 bg-white/10 p-3 shadow-2xl">
              <img src={publicPhotos.heroBath} alt="Doguinho recebendo cuidado de banho" className="h-[470px] 2xl:h-[580px] w-full rounded-[34px] object-cover" />
              <div className="absolute inset-3 rounded-[34px] bg-gradient-to-t from-[#03130d]/82 via-transparent to-transparent" />
              <div className="absolute left-8 bottom-8 right-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-900 shadow-xl">
                  <Camera size={16} className="text-green-700" />
                  Visual mais fotográfico
                </div>
                <h2 className="mt-4 max-w-xl text-3xl md:text-4xl font-black">A experiência começa antes do primeiro banho.</h2>
              </div>
              <div className="absolute right-7 top-7 rounded-3xl bg-[#fffaf0] px-5 py-4 text-slate-900 shadow-2xl">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((item) => <Star key={item} className="fill-yellow-500" size={17} />)}
                </div>
                <p className="mt-2 text-sm font-black">Atendimento 5 estrelas</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 pb-14">
          <div className="grid md:grid-cols-4 gap-5">
            {benefits.map(([Icon, title, text]) => <Benefit key={title} Icon={Icon} title={title} text={text} />)}
          </div>
        </section>

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 py-16 text-slate-950">
          <SectionTitle badge="Fotos que vendem cuidado" title="Um site com cara de pet bem cuidado" text="Imagens maiores, serviços mais claros e chamadas pensadas para transformar visita em agendamento." dark />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {homePhotoStories.map((story) => <PhotoStory key={story.title} {...story} />)}
          </div>
        </section>

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 py-16">
          <SectionTitle badge="Serviços premium" title="Escolha o cuidado perfeito" text="Banho, tosa, vacinação e spa com apresentação mais bonita e direta." />
          <div className="mt-12 grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {services.map((service) => <ServiceCard key={service.title} {...service} />)}
          </div>
        </section>

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 py-16">
          <div className="rounded-[42px] border border-white/10 bg-white/10 p-7 md:p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mb-10">
              <div>
                <Badge icon={PawPrint}>Porte do doguinho</Badge>
                <h2 className="mt-5 text-4xl md:text-6xl font-black">Preços e tempo médio</h2>
                <p className="mt-3 text-white/65 text-lg">Valores por porte para o tutor escolher com confiança.</p>
              </div>
              <Link to="/agendamento" className="rounded-2xl bg-[#f97316] hover:bg-orange-500 px-8 py-4 font-black text-white shadow-xl flex items-center justify-center gap-2">
                Agendar por porte <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {plans.map((plan) => <Plan key={plan.name} {...plan} />)}
            </div>
          </div>
        </section>

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 py-16">
          <div className="grid xl:grid-cols-[.9fr_1.1fr] gap-8 items-stretch">
            <div className="rounded-[40px] bg-[#fffaf0] text-slate-900 p-8 md:p-10 shadow-2xl">
              <BadgeLight>Clientes felizes</BadgeLight>
              <h2 className="mt-5 text-4xl md:text-5xl font-black">Mais carinho, mais confiança.</h2>
              <p className="mt-4 text-slate-600 text-lg">Depoimentos e fotos ajudam o tutor a sentir segurança antes de agendar.</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <MiniReview name="Tutor satisfeito" text="Meu doguinho voltou cheiroso e tranquilo." />
                <MiniReview name="Atendimento cuidadoso" text="Equipe atenciosa e ambiente seguro." />
              </div>
            </div>
            <div className="rounded-[40px] bg-[#0f766e] p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden relative">
              <img src={publicPhotos.towel} alt="Doguinho enrolado em toalha" className="absolute inset-0 h-full w-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#06352c] via-[#0f766e]/88 to-[#0f766e]/70" />
              <div className="relative">
                <h2 className="text-4xl md:text-6xl font-black">Pronto para mimar seu doguinho?</h2>
                <p className="mt-4 text-white/85 text-lg max-w-2xl">Agende pelo site ou fale conosco no WhatsApp.</p>
              </div>
              <div className="relative mt-10 flex flex-wrap gap-4">
                <Link to="/agendamento" className="rounded-2xl bg-[#f97316] hover:bg-orange-500 px-8 py-4 font-black text-white shadow-xl flex items-center gap-2">
                  Agendar agora <ArrowRight size={18} />
                </Link>
                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 px-8 py-4 font-black text-white flex items-center gap-2">
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

function Badge({ icon: Icon, children }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/25 bg-white/10 px-5 py-2 text-emerald-50 font-black text-sm"><Icon size={17} />{children}</span>;
}

function BadgeLight({ children }) {
  return <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-5 py-2 font-black text-sm"><Sparkles size={17} />{children}</span>;
}

function Stat({ value, label }) {
  return <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur"><div className="text-3xl font-black">{value}</div><div className="mt-2 text-white/60 text-sm">{label}</div></div>;
}

function Benefit({ Icon, title, text }) {
  return <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-xl hover:-translate-y-1 transition"><Icon className="text-orange-300 mb-4" size={32} /><h3 className="text-xl font-black">{title}</h3><p className="mt-2 text-white/65 text-sm leading-relaxed">{text}</p></div>;
}

function SectionTitle({ badge, title, text, dark = false }) {
  const badgeClass = dark ? "border-green-200 bg-green-100 text-green-800" : "border-yellow-400/25 bg-white/10 text-yellow-100";
  return (
    <div className="text-center max-w-4xl mx-auto">
      <span className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 font-black text-sm ${badgeClass}`}><Sparkles size={17} />{badge}</span>
      <h2 className="mt-5 text-4xl md:text-6xl font-black leading-tight">{title}</h2>
      <p className={dark ? "mt-4 text-slate-600 text-lg" : "mt-4 text-white/65 text-lg"}>{text}</p>
    </div>
  );
}

function PhotoStory({ title, description, image }) {
  return (
    <article className="group overflow-hidden rounded-[34px] bg-white shadow-2xl border border-green-100">
      <img src={image} alt={title} className="h-[330px] w-full object-cover group-hover:scale-105 transition duration-500" />
      <div className="p-7">
        <h3 className="text-2xl font-black">{title}</h3>
        <p className="mt-3 text-slate-500 leading-relaxed">{description}</p>
      </div>
    </article>
  );
}

function ServiceCard({ title, badge, icon: Icon, img, text, price }) {
  return (
    <div className="group rounded-[34px] bg-[#fffaf0] p-5 text-slate-900 shadow-2xl border border-yellow-100 hover:-translate-y-2 transition relative overflow-hidden">
      <div className="absolute right-5 top-5 z-10 rounded-full bg-[#0f766e] text-white px-3 py-1 text-xs font-black shadow-lg">{badge}</div>
      <div className="h-48 rounded-[26px] overflow-hidden bg-slate-100">
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      </div>
      <div className="mt-5 w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shadow-inner"><Icon size={28} /></div>
      <h3 className="mt-4 text-2xl font-black">{title}</h3>
      <p className="mt-2 text-slate-500 min-h-[58px] leading-relaxed">{text}</p>
      <div className="mt-5 pt-5 border-t flex items-end justify-between">
        <div><span className="text-xs text-slate-400 font-bold">A partir de</span><div className="text-2xl font-black text-green-700">{price}</div></div>
        <PawPrint className="text-green-500" />
      </div>
    </div>
  );
}

function Plan({ name, range, time, price }) {
  return (
    <div className="rounded-[30px] bg-[#fffaf0] p-6 text-slate-900 shadow-xl border border-yellow-100 hover:-translate-y-1 transition">
      <div className="flex items-center justify-between"><div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center"><PawPrint size={30} /></div><span className="rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-black">{time}</span></div>
      <h3 className="mt-6 text-2xl font-black">{name}</h3>
      <p className="text-slate-500">{range}</p>
      <div className="mt-5 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-green-600" style={{ width: name === "Pequeno" ? "25%" : name === "Médio" ? "50%" : name === "Grande" ? "75%" : "100%" }} /></div>
      <p className="mt-5 text-sm text-slate-500">Banho a partir de</p>
      <div className="text-3xl font-black text-green-700">{price}</div>
      <Link to="/agendamento" className="mt-5 block rounded-2xl bg-green-700 hover:bg-green-800 text-white text-center p-3.5 font-black">Agendar</Link>
    </div>
  );
}

function MiniReview({ name, text }) {
  return <div className="rounded-3xl bg-white p-5 shadow border border-green-100"><div className="flex text-yellow-500 mb-3">{[1, 2, 3, 4, 5].map((item) => <Star key={item} size={17} className="fill-yellow-500" />)}</div><h3 className="font-black">{name}</h3><p className="mt-2 text-sm text-slate-500">{text}</p></div>;
}
