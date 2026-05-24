import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bath, CalendarDays, CheckCircle, Heart, MessageCircle, PawPrint, Scissors, ShieldCheck, Sparkles, Star, Syringe } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";
const heroDog = "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=90";
const bathDog = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=90";

const features = [
  [CalendarDays, "Agendamento fácil", "Escolha pet, serviço, data e horário em poucos cliques."],
  [Sparkles, "Banho premium", "Produtos selecionados, acabamento caprichado e cheirinho especial."],
  [ShieldCheck, "Ambiente seguro", "Atendimento organizado e preparado para cada pet."],
  [Heart, "Cuidado com amor", "Tratamento carinhoso para deixar seu pet tranquilo."]
];

const cards = [
  ["Banho & Tosa", "/images/banho-tosa.svg", "Higiene completa, perfume e acabamento com muito carinho."],
  ["Vacinação & Bem-estar", "/images/vacina-pet.svg", "Acompanhamento, prevenção e cuidado para a saúde do pet."],
  ["Spa Pet Relaxante", "/images/spa-pet.svg", "Experiência relaxante para seu melhor amigo ficar tranquilo."]
];

const plans = [
  ["Pequeno", "até 10 kg", "/images/hero-doguinho.svg", "60,00", "90,00", "70,00"],
  ["Médio", "10,1 a 25 kg", "/images/banho-tosa.svg", "80,00", "120,00", "90,00"],
  ["Grande", "25,1 a 40 kg", "/images/spa-pet.svg", "100,00", "150,00", "110,00"],
  ["Gigante", "acima de 40 kg", "/images/cliente-premium.svg", "120,00", "180,00", "130,00"]
];

function money(value) { return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function iconFor(name = "", category = "") { const t = `${name} ${category}`.toLowerCase(); if (t.includes("tosa")) return Scissors; if (t.includes("vacina")) return Syringe; if (t.includes("spa")) return Sparkles; if (t.includes("banho")) return Bath; return PawPrint; }
function imageFor(name = "", category = "") { const t = `${name} ${category}`.toLowerCase(); if (t.includes("vacina")) return "/images/vacina-pet.svg"; if (t.includes("spa")) return "/images/spa-pet.svg"; if (t.includes("tosa") || t.includes("banho")) return "/images/banho-tosa.svg"; return "/images/hero-doguinho.svg"; }

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_PUBLIC}/services`).then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setServices(data.filter((s) => Number(s.active ?? 1) === 1));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#02130b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(34,197,94,.24),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(234,179,8,.12),transparent_28%),linear-gradient(180deg,#02130b,#062716_45%,#020d08)]" />
        <div className="relative max-w-[1480px] mx-auto px-5 md:px-8 2xl:px-10">
          <section className="min-h-[610px] pt-8 pb-8 grid xl:grid-cols-[1fr_.92fr] gap-9 items-center">
            <div>
              <Badge icon={PawPrint}>Cuidado que seu pet merece</Badge>
              <h1 className="mt-6 max-w-4xl text-[44px] md:text-[60px] 2xl:text-[72px] font-black leading-[1] tracking-tight">Seu pet limpo, <span className="text-green-300">cheiroso</span> e feliz.</h1>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-white/75 leading-relaxed">Banho, tosa, estética animal, vacinação e bem-estar com carinho, segurança e uma experiência premium para tutores e doguinhos.</p>
              <div className="mt-7 flex flex-wrap gap-4"><PrimaryLink to="/agendamento">Agendar agora</PrimaryLink><GhostLink to="/servicos">Nossos serviços</GhostLink></div>
              <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-3xl">{[["+3.500", "Pets atendidos"], ["6+", "Anos de experiência"], ["Online", "Agendamento fácil"]].map(([n,l]) => <Stat key={l} n={n} l={l} />)}</div>
            </div>
            <div className="relative rounded-[38px] border border-yellow-400/20 bg-white/8 p-4 md:p-5 shadow-2xl backdrop-blur-xl">
              <img src={heroDog} alt="Cachorro feliz" className="h-[370px] 2xl:h-[470px] w-full object-cover rounded-[28px] shadow-2xl" />
              <div className="absolute -bottom-4 left-5 bg-[#fffaf0] text-slate-900 rounded-3xl p-4 shadow-2xl border border-yellow-100"><div className="flex items-center gap-3"><Star className="text-yellow-500 fill-yellow-500" size={20}/><div><p className="font-black text-sm">Atendimento 5 estrelas</p><p className="text-xs text-slate-500">Cuidado com amor e segurança</p></div></div></div>
              <div className="absolute right-6 bottom-7 w-16 h-16 rounded-full bg-green-900/85 border border-yellow-300/40 flex items-center justify-center text-yellow-200 shadow-2xl"><PawPrint size={30}/></div>
            </div>
          </section>

          <section className="pb-10"><div className="rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl grid md:grid-cols-4 overflow-hidden">{features.map(([Icon,title,text]) => <Feature key={title} Icon={Icon} title={title} text={text} />)}</div></section>

          <section className="py-10"><SectionTitle badge="Experiências premium" title="Tudo para o bem-estar do seu pet" text="Serviços principais para deixar seu doguinho limpo, saudável e feliz." /><div className="mt-9 grid md:grid-cols-3 gap-6 2xl:gap-8">{cards.map(([title,img,text]) => <ServiceCard key={title} title={title} img={img} text={text} />)}</div></section>

          <section className="py-10"><div className="rounded-[34px] border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl"><div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mb-8"><div><Badge icon={PawPrint}>Escolha o porte</Badge><h2 className="mt-5 text-3xl md:text-5xl font-black">Planos que cabem no seu bolso</h2><p className="mt-3 text-white/60 text-base">Preços por tamanho do pet, seguindo a mesma lógica do sistema.</p></div><PrimaryLink to="/agendamento">Agendar por porte</PrimaryLink></div><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">{plans.map((p) => <Plan key={p[0]} data={p} />)}</div></div></section>

          {services.length > 0 && <section className="py-10"><SectionTitle badge="Serviços cadastrados" title="Catálogo do painel" text="Serviços vindos direto do sistema administrativo." /><div className="mt-9 grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">{!loading && services.slice(0,8).map((service) => <PanelService key={service.id || service.name} service={service} />)}</div></section>}

          <section className="py-10 pb-20"><div className="relative overflow-hidden rounded-[34px] bg-gradient-to-r from-green-800 via-emerald-700 to-green-500 p-7 md:p-9 shadow-2xl grid xl:grid-cols-[1fr_auto_280px] gap-6 items-center border border-green-300/20"><div><h2 className="text-3xl md:text-5xl font-black leading-tight">Pronto para mimar seu doguinho?</h2><p className="mt-4 text-white/85 text-base max-w-2xl">Agende agora e proporcione uma experiência completa de cuidado, higiene e carinho.</p></div><div className="flex flex-col sm:flex-row xl:flex-col gap-3"><PrimaryLink to="/agendamento" orange>Agendar agora</PrimaryLink><a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-7 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 transition"><MessageCircle size={18}/> WhatsApp</a></div><img src={bathDog} alt="Pets felizes" className="hidden xl:block h-52 w-full object-cover rounded-[26px] shadow-2xl border border-white/10"/></div></section>
        </div>
      </main>
    </PublicLayout>
  );
}

function Badge({ icon: Icon, children }) { return <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-white/8 px-5 py-2 text-yellow-100 font-black text-sm"><Icon size={17}/>{children}</span>; }
function PrimaryLink({ to, children, orange }) { return <Link to={to} className={`${orange ? "bg-orange-400 hover:bg-orange-500" : "bg-green-600 hover:bg-green-700"} text-white px-7 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl transition`}>{children}<ArrowRight size={18}/></Link>; }
function GhostLink({ to, children }) { return <Link to={to} className="rounded-2xl border border-yellow-400/35 bg-white/5 hover:bg-white/10 px-7 py-3.5 font-black text-yellow-100 flex items-center gap-3 transition"><PawPrint size={19}/>{children}</Link>; }
function Stat({ n, l }) { return <div className="rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur-xl shadow-xl"><div className="text-2xl md:text-3xl font-black">{n}</div><div className="text-white/60 text-sm mt-2">{l}</div></div>; }
function Feature({ Icon, title, text }) { return <div className="p-5 2xl:p-7 border-white/10 md:border-r last:border-r-0"><Icon className="text-yellow-300 mb-3" size={28}/><h3 className="text-lg font-black">{title}</h3><p className="text-white/60 mt-2 text-sm leading-relaxed">{text}</p></div>; }
function SectionTitle({ badge, title, text }) { return <div className="text-center max-w-4xl mx-auto"><Badge icon={Sparkles}>{badge}</Badge><h2 className="mt-5 text-3xl md:text-5xl font-black leading-tight">{title}</h2><p className="mt-3 text-white/60 text-base md:text-lg">{text}</p></div>; }
function ServiceCard({ title, img, text }) { return <div className="group overflow-hidden rounded-[30px] bg-[#fffaf0] text-slate-900 shadow-2xl border border-yellow-100 hover:-translate-y-2 transition"><img src={img} alt={title} className="w-full h-52 2xl:h-60 object-cover bg-green-50"/><div className="p-5"><h3 className="text-xl 2xl:text-2xl font-black">{title}</h3><p className="text-slate-500 mt-2 min-h-[46px] text-sm 2xl:text-base">{text}</p><Link to="/servicos" className="mt-5 inline-flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 px-5 py-3 rounded-2xl font-black transition text-sm">Saiba mais <PawPrint size={15}/></Link></div></div>; }
function Plan({ data }) { const [name, range, img, banho, combo, tosa] = data; return <div className="rounded-[26px] bg-[#fffaf0] p-5 text-slate-900 shadow-xl border border-yellow-100 hover:-translate-y-1 transition"><div className="text-center"><h3 className="text-xl font-black">{name}</h3><p className="text-xs text-slate-500">{range}</p><img src={img} alt={name} className="mt-4 mx-auto h-28 w-28 rounded-full object-cover bg-green-50 border border-green-100"/></div><div className="mt-5 space-y-2.5 text-sm"><Line label="Banho" value={`R$ ${banho}`}/><Line label="Banho e Tosa" value={`R$ ${combo}`}/><Line label="Só Tosa" value={`R$ ${tosa}`}/></div><Link to="/agendamento" className="mt-5 block rounded-2xl bg-green-700 hover:bg-green-800 text-white text-center p-3.5 font-black transition text-sm">A partir de <span className="text-lg">R$ {banho}</span></Link></div>; }
function Line({ label, value }) { return <div className="flex items-center justify-between gap-3"><span>{label}</span><b className="text-green-700">{value}</b></div>; }
function PanelService({ service }) { const Icon = iconFor(service.name, service.category); return <div className="rounded-[24px] bg-white p-4 text-slate-900 shadow-2xl border border-green-100 hover:-translate-y-2 transition"><img src={imageFor(service.name, service.category)} alt={service.name} className="w-full h-36 object-cover rounded-[18px] mb-4 bg-green-50"/><div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center"><Icon size={20}/></div><h3 className="text-lg font-black mt-3 break-words">{service.name}</h3><p className="text-slate-500 mt-2 text-sm min-h-[48px] break-words">{service.description || "Cuidado especial para seu pet."}</p><div className="mt-4 pt-4 border-t flex items-end justify-between"><div><div className="text-xs text-slate-400 font-bold">A partir de</div><div className="text-lg font-black text-green-700">{money(service.price)}</div></div><CheckCircle className="text-green-500" size={22}/></div></div>; }