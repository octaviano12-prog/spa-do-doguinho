import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bath, CalendarDays, Heart, MessageCircle, PawPrint, Scissors, ShieldCheck, Sparkles, Star, Syringe } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const dogHero = "https://raw.githubusercontent.com/octaviano12-prog/spa-do-doguinho/main/frontend/public/images/hero-doguinho-banho-real.webp";

const services = [
  { title: "Banho & Tosa", badge: "MAIS PEDIDO", icon: Bath, img: "/images/banho-tosa.svg", text: "Higiene completa, perfume e acabamento com muito carinho.", price: "R$ 60,00" },
  { title: "Tosa Premium", badge: "ACABAMENTO", icon: Scissors, img: "/images/banho-tosa.svg", text: "Tosa higiênica ou completa conforme a necessidade do pet.", price: "R$ 80,00" },
  { title: "Vacinação", badge: "SAÚDE", icon: Syringe, img: "/images/vacina-pet.svg", text: "Registro, cuidado preventivo e acompanhamento organizado.", price: "R$ 120,00" },
  { title: "Spa Relaxante", badge: "RELAXANTE", icon: Sparkles, img: "/images/spa-pet.svg", text: "Bem-estar, relaxamento, pele e pelagem com cuidado especial.", price: "R$ 95,00" }
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
  [Heart, "Amor de verdade", "Seu doguinho tratado com carinho."]
];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#020d08] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,197,94,.34),transparent_28%),radial-gradient(circle_at_78%_8%,rgba(245,158,11,.18),transparent_26%),linear-gradient(180deg,#020d08,#052415_48%,#020d08)]" />
        <div className="pointer-events-none absolute left-10 top-36 text-green-300/10 text-[160px] rotate-12">🐾</div>
        <div className="pointer-events-none absolute right-16 top-52 text-yellow-200/10 text-[120px] -rotate-12">🐶</div>
        <div className="pointer-events-none absolute bottom-96 left-1/2 text-green-300/10 text-[130px] rotate-6">✨</div>

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 pt-10 pb-14 min-h-[720px] grid xl:grid-cols-[1.05fr_.95fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-300/25 bg-green-400/10 px-5 py-2 text-green-100 font-black shadow-xl backdrop-blur-xl">
              <Sparkles size={18} /> NOVA HOME PREMIUM
            </div>
            <h1 className="mt-7 max-w-5xl text-[48px] md:text-[72px] 2xl:text-[90px] font-black leading-[.95] tracking-tight drop-shadow-2xl">
              Seu doguinho merece um <span className="bg-gradient-to-r from-green-200 via-emerald-300 to-yellow-200 bg-clip-text text-transparent">dia de spa.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/78 leading-relaxed">
              Banho, tosa, estética animal e cuidados especiais para deixar seu pet limpo, cheiroso, feliz e muito bem cuidado.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/agendamento" className="group rounded-[22px] bg-gradient-to-r from-green-500 to-emerald-700 px-9 py-5 text-lg font-black text-white shadow-[0_0_38px_rgba(34,197,94,.38)] hover:scale-[1.03] transition flex items-center gap-3">
                Agendar agora <ArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="rounded-[22px] border border-yellow-300/35 bg-white/8 px-9 py-5 text-lg font-black text-yellow-100 hover:bg-white/12 transition flex items-center gap-3">
                <MessageCircle /> WhatsApp
              </a>
            </div>
            <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl">
              <Stat value="+3.500" label="Pets atendidos" />
              <Stat value="5★" label="Atendimento premium" />
              <Stat value="Online" label="Agendamento rápido" />
            </div>
          </div>

          <div className="relative min-h-[520px] flex items-end justify-center">
            <div className="absolute inset-0 rounded-[60px] bg-gradient-to-br from-green-400/25 to-yellow-300/10 blur-3xl" />
            <div className="absolute top-8 right-8 h-52 w-52 rounded-full bg-yellow-300/15 blur-2xl" />
            <div className="relative w-full max-w-[680px] rounded-[46px] border border-yellow-300/25 bg-white/8 p-5 shadow-2xl backdrop-blur-xl overflow-visible">
              <img src={dogHero} alt="Cachorro no banho" className="relative z-10 h-[500px] 2xl:h-[620px] w-full object-contain rounded-[36px] drop-shadow-[0_28px_55px_rgba(0,0,0,.65)]" />
              <div className="absolute -left-5 bottom-10 z-20 rounded-3xl bg-[#fffaf0] px-5 py-4 text-slate-900 shadow-2xl border border-yellow-100">
                <div className="flex items-center gap-2 text-yellow-500"><Star className="fill-yellow-500" size={18}/><Star className="fill-yellow-500" size={18}/><Star className="fill-yellow-500" size={18}/><Star className="fill-yellow-500" size={18}/><Star className="fill-yellow-500" size={18}/></div>
                <p className="mt-2 font-black">Atendimento 5 estrelas</p>
                <p className="text-xs text-slate-500">Cuidado, segurança e carinho</p>
              </div>
              <div className="absolute -right-5 top-12 z-20 w-20 h-20 rounded-full bg-green-600 flex items-center justify-center shadow-[0_0_35px_rgba(34,197,94,.45)] border border-green-200/50"><PawPrint size={38}/></div>
            </div>
          </div>
        </section>

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 pb-16">
          <div className="grid md:grid-cols-4 gap-5">
            {benefits.map(([Icon, title, text]) => <Benefit key={title} Icon={Icon} title={title} text={text} />)}
          </div>
        </section>

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 py-16">
          <SectionTitle badge="Serviços premium" title="Escolha o cuidado perfeito" text="Cards novos com mais destaque, selo de categoria e foco em conversão." />
          <div className="mt-12 grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {services.map((service) => <ServiceCard key={service.title} {...service} />)}
          </div>
        </section>

        <section className="relative max-w-[1580px] mx-auto px-5 md:px-8 2xl:px-10 py-16">
          <div className="rounded-[42px] border border-white/10 bg-white/6 p-7 md:p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mb-10">
              <div>
                <Badge icon={PawPrint}>Porte do doguinho</Badge>
                <h2 className="mt-5 text-4xl md:text-6xl font-black">Preços e tempo médio</h2>
                <p className="mt-3 text-white/60 text-lg">O agendamento fica mais claro quando o tutor entende porte, valor e duração.</p>
              </div>
              <Link to="/agendamento" className="rounded-2xl bg-green-600 hover:bg-green-700 px-8 py-4 font-black text-white shadow-xl flex items-center justify-center gap-2">Agendar por porte <ArrowRight size={18}/></Link>
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
              <p className="mt-4 text-slate-600 text-lg">Adicione aqui fotos reais, antes/depois e avaliações para deixar a página com personalidade do SPA do Doguinho.</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <MiniReview name="Tutor satisfeito" text="Meu doguinho voltou cheiroso e tranquilo." />
                <MiniReview name="Atendimento cuidadoso" text="Equipe atenciosa e ambiente seguro." />
              </div>
            </div>
            <div className="rounded-[40px] bg-gradient-to-br from-green-700 via-emerald-600 to-green-500 p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden relative">
              <div className="absolute right-8 top-8 text-white/10 text-[150px]">🐾</div>
              <div className="relative">
                <h2 className="text-4xl md:text-6xl font-black">Pronto para mimar seu doguinho?</h2>
                <p className="mt-4 text-white/85 text-lg max-w-2xl">Seu pet merece um atendimento especial. Agende agora pelo site ou fale conosco no WhatsApp.</p>
              </div>
              <div className="relative mt-10 flex flex-wrap gap-4">
                <Link to="/agendamento" className="rounded-2xl bg-orange-400 hover:bg-orange-500 px-8 py-4 font-black text-white shadow-xl flex items-center gap-2">Agendar agora <ArrowRight size={18}/></Link>
                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 px-8 py-4 font-black text-white flex items-center gap-2"><MessageCircle size={18}/> WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

function Badge({ icon: Icon, children }) { return <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-white/8 px-5 py-2 text-yellow-100 font-black text-sm"><Icon size={17}/>{children}</span>; }
function BadgeLight({ children }) { return <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-5 py-2 font-black text-sm"><Sparkles size={17}/>{children}</span>; }
function Stat({ value, label }) { return <div className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-xl backdrop-blur"><div className="text-3xl font-black">{value}</div><div className="mt-2 text-white/60 text-sm">{label}</div></div>; }
function Benefit({ Icon, title, text }) { return <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-xl hover:-translate-y-1 transition"><Icon className="text-yellow-300 mb-4" size={32}/><h3 className="text-xl font-black">{title}</h3><p className="mt-2 text-white/60 text-sm leading-relaxed">{text}</p></div>; }
function SectionTitle({ badge, title, text }) { return <div className="text-center max-w-4xl mx-auto"><Badge icon={Sparkles}>{badge}</Badge><h2 className="mt-5 text-4xl md:text-6xl font-black leading-tight">{title}</h2><p className="mt-4 text-white/60 text-lg">{text}</p></div>; }
function ServiceCard({ title, badge, icon: Icon, img, text, price }) { return <div className="group rounded-[34px] bg-[#fffaf0] p-5 text-slate-900 shadow-2xl border border-yellow-100 hover:-translate-y-2 transition relative overflow-hidden"><div className="absolute right-5 top-5 z-10 rounded-full bg-green-700 text-white px-3 py-1 text-xs font-black shadow-lg">{badge}</div><div className="h-44 rounded-[26px] bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center overflow-hidden"><img src={img} alt={title} className="w-full h-full object-contain p-3 group-hover:scale-105 transition"/></div><div className="mt-5 w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shadow-inner"><Icon size={28}/></div><h3 className="mt-4 text-2xl font-black">{title}</h3><p className="mt-2 text-slate-500 min-h-[58px] leading-relaxed">{text}</p><div className="mt-5 pt-5 border-t flex items-end justify-between"><div><span className="text-xs text-slate-400 font-bold">A partir de</span><div className="text-2xl font-black text-green-700">{price}</div></div><PawPrint className="text-green-500" /></div></div>; }
function Plan({ name, range, time, price }) { return <div className="rounded-[30px] bg-[#fffaf0] p-6 text-slate-900 shadow-xl border border-yellow-100 hover:-translate-y-1 transition"><div className="flex items-center justify-between"><div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center"><PawPrint size={30}/></div><span className="rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-black">{time}</span></div><h3 className="mt-6 text-2xl font-black">{name}</h3><p className="text-slate-500">{range}</p><div className="mt-5 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-green-600" style={{ width: name === "Pequeno" ? "25%" : name === "Médio" ? "50%" : name === "Grande" ? "75%" : "100%" }} /></div><p className="mt-5 text-sm text-slate-500">Banho a partir de</p><div className="text-3xl font-black text-green-700">{price}</div><Link to="/agendamento" className="mt-5 block rounded-2xl bg-green-700 hover:bg-green-800 text-white text-center p-3.5 font-black">Agendar</Link></div>; }
function MiniReview({ name, text }) { return <div className="rounded-3xl bg-white p-5 shadow border border-green-100"><div className="flex text-yellow-500 mb-3"><Star size={17} className="fill-yellow-500"/><Star size={17} className="fill-yellow-500"/><Star size={17} className="fill-yellow-500"/><Star size={17} className="fill-yellow-500"/><Star size={17} className="fill-yellow-500"/></div><h3 className="font-black">{name}</h3><p className="mt-2 text-sm text-slate-500">{text}</p></div>; }
