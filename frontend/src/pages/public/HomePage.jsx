import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bath, CalendarDays, CheckCircle, Heart, MessageCircle, PawPrint, Scissors, ShieldCheck, Sparkles, Star, Syringe } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "../../components/public/PublicLayout";

const API_PUBLIC = "https://spadodoguinho.com.br/api/public";
const heroDog = "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=90";
const bathDog = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=90";
const pugDog = "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=900&q=90";

function money(value) { return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function iconFor(name = "", category = "") { const t = `${name} ${category}`.toLowerCase(); if (t.includes("tosa")) return Scissors; if (t.includes("vacina")) return Syringe; if (t.includes("spa")) return Sparkles; if (t.includes("banho")) return Bath; return PawPrint; }
function imageFor(name = "", category = "") { const t = `${name} ${category}`.toLowerCase(); if (t.includes("vacina")) return "/images/vacina-pet.svg"; if (t.includes("spa")) return "/images/spa-pet.svg"; if (t.includes("tosa") || t.includes("banho")) return "/images/banho-tosa.svg"; return "/images/hero-doguinho.svg"; }

const features = [
  [CalendarDays, "Agendamento fácil", "Escolha pet, serviço, data e horário em poucos cliques."],
  [Sparkles, "Banho premium", "Produtos selecionados, acabamento caprichado e cheirinho especial."],
  [ShieldCheck, "Ambiente seguro", "Atendimento organizado, acolhedor e preparado para cada pet."],
  [Heart, "Cuidado com amor", "Tratamento carinhoso para deixar seu melhor amigo tranquilo."],
];

const plans = [
  ["Pequeno", "até 10 kg", "/images/hero-doguinho.svg", "60,00", "90,00", "70,00"],
  ["Médio", "10,1 a 25 kg", "/images/banho-tosa.svg", "80,00", "120,00", "90,00"],
  ["Grande", "25,1 a 40 kg", "/images/spa-pet.svg", "100,00", "150,00", "110,00"],
  ["Gigante", "acima de 40 kg", "/images/cliente-premium.svg", "120,00", "180,00", "130,00"],
];

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_PUBLIC}/services`);
        const data = await res.json();
        if (Array.isArray(data)) setServices(data.filter((s) => Number(s.active ?? 1) === 1));
      } catch (err) {
        console.error("Erro ao carregar serviços:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#02130b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,197,94,.30),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(234,179,8,.18),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,.16),transparent_34%),linear-gradient(180deg,#02130b,#062716_42%,#020d08)]" />
        <div className="absolute -left-32 top-36 h-[520px] w-[520px] rounded-full bg-green-500/10 blur-[120px]" />
        <div className="absolute right-[-160px] top-24 h-[620px] w-[620px] rounded-full bg-yellow-500/10 blur-[130px]" />

        <div className="relative">
          <section className="max-w-[1540px] mx-auto px-5 md:px-8 2xl:px-10 pt-16 pb-10 min-h-[800px] grid xl:grid-cols-[1.05fr_.95fr] gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="pt-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-white/8 px-5 py-2 text-yellow-100 font-black shadow-xl backdrop-blur-xl"><PawPrint size={18}/> Cuidado que seu pet merece</span>
              <h1 className="mt-8 max-w-4xl text-5xl md:text-7xl 2xl:text-8xl font-black leading-[.94] tracking-tight">Seu pet limpo, <span className="text-green-300">cheiroso</span> e feliz.</h1>
              <p className="mt-7 max-w-2xl text-lg md:text-xl text-white/75 leading-relaxed">Banho, tosa, estética animal, vacinação e bem-estar com carinho, segurança e uma experiência premium para tutores e doguinhos.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/agendamento" className="group rounded-2xl bg-green-600 hover:bg-green-700 px-8 py-4 font-black text-white shadow-xl shadow-green-900/30 flex items-center gap-3 transition">Agendar agora <ArrowRight size={20} className="group-hover:translate-x-1 transition" /></Link>
                <Link to="/servicos" className="rounded-2xl border border-yellow-400/35 bg-white/5 hover:bg-white/10 px-8 py-4 font-black text-yellow-100 flex items-center gap-3 transition"><PawPrint size={20}/> Nossos serviços</Link>
              </div>
              <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-3xl">
                {[["+3.500", "Pets atendidos"], ["6+", "Anos de experiência"], ["Online", "Agendamento fácil"]].map(([n,l]) => (
                  <div key={l} className="rounded-3xl border border-white/10 bg-white/7 p-6 backdrop-blur-xl shadow-xl">
                    <div className="text-3xl md:text-4xl font-black">{n}</div>
                    <div className="text-white/60 text-sm mt-2">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .1 }} className="relative">
              <div className="absolute -inset-8 rounded-[70px] bg-green-500/10 blur-2xl" />
              <div className="relative rounded-[52px] border border-yellow-400/20 bg-white/8 p-5 md:p-7 shadow-2xl backdrop-blur-xl">
                <img src={heroDog} alt="Cachorro feliz no SPA do Doguinho" className="h-[520px] 2xl:h-[640px] w-full object-cover rounded-[42px] shadow-2xl" />
                <div className="absolute -bottom-6 left-5 md:left-[-34px] bg-[#fffaf0] text-slate-900 rounded-3xl p-5 shadow-2xl border border-yellow-100 max-w-[320px]">
                  <div className="flex items-center gap-3"><Star className="text-yellow-500 fill-yellow-500"/><div><p className="font-black">Atendimento 5 estrelas</p><p className="text-xs text-slate-500">Cuidado com amor e segurança</p></div></div>
                </div>
                <div className="absolute right-8 bottom-10 w-24 h-24 rounded-full bg-green-900/85 border border-yellow-300/40 flex items-center justify-center text-yellow-200 shadow-2xl"><PawPrint size={44}/></div>
              </div>
            </motion.div>
          </section>

          <section className="max-w-[1540px] mx-auto px-5 md:px-8 2xl:px-10 pb-16">
            <div className="rounded-[38px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl grid md:grid-cols-4 overflow-hidden">
              {features.map(([Icon,title,text]) => <div key={title} className="p-8 2xl:p-10 border-white/10 md:border-r last:border-r-0"><Icon className="text-yellow-300 mb-5" size={36}/><h3 className="text-xl 2xl:text-2xl font-black">{title}</h3><p className="text-white/60 mt-3 text-sm 2xl:text-base leading-relaxed">{text}</p></div>)}
            </div>
          </section>

          <section className="max-w-[1540px] mx-auto px-5 md:px-8 2xl:px-10 py-16">
            <div className="grid xl:grid-cols-[420px_1fr] gap-10 items-end mb-12">
              <div><span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-white/8 px-5 py-2 text-yellow-100 font-black"><Sparkles size={18}/> Experiências premium</span><h2 className="mt-6 text-4xl md:text-6xl font-black leading-tight">Tudo para o bem-estar do seu pet</h2></div>
              <p className="text-white/60 text-lg max-w-3xl xl:ml-auto">Uma vitrine moderna com serviços principais, planos por porte e integração com o painel administrativo.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-7 2xl:gap-9">
              {[["Banho & Tosa","/images/banho-tosa.svg","Higiene completa, perfume e acabamento com muito carinho."],["Hidratação & Bem-estar","/images/vacina-pet.svg","Cuidados para deixar os pelos macios, saudáveis e bonitos."],["Spa Relaxante","/images/spa-pet.svg","Experiência relaxante para seu melhor amigo ficar tranquilo."]].map(([title,img,text]) => (
                <div key={title} className="group rounded-[38px] bg-[#fffaf0] p-5 text-slate-900 shadow-2xl border border-yellow-100 hover:-translate-y-2 transition">
                  <img src={img} alt={title} className="w-full h-64 2xl:h-72 object-cover rounded-[30px] bg-green-50"/>
                  <div className="p-5"><h3 className="text-2xl 2xl:text-3xl font-black">{title}</h3><p className="text-slate-500 mt-3 min-h-[54px]">{text}</p><Link to="/servicos" className="mt-6 inline-flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 px-5 py-3 rounded-2xl font-black transition">Saiba mais <PawPrint size={16}/></Link></div>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-[1540px] mx-auto px-5 md:px-8 2xl:px-10 py-16">
            <div className="rounded-[44px] border border-white/10 bg-white/5 p-7 md:p-10 2xl:p-12 shadow-2xl">
              <div className="grid xl:grid-cols-[1fr_auto] gap-8 items-end mb-12"><div><span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-white/8 px-5 py-2 text-yellow-100 font-black"><PawPrint size={18}/> Escolha o porte</span><h2 className="mt-6 text-4xl md:text-6xl font-black">Planos que cabem no seu bolso</h2><p className="mt-4 text-white/60 text-lg">Preços justos por tamanho do pet, conectados com a lógica do sistema.</p></div><Link to="/agendamento" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl">Agendar por porte <ArrowRight size={20}/></Link></div>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 2xl:gap-7">
                {plans.map(([name,range,img,banho,combo,tosa]) => <div key={name} className="rounded-[32px] bg-[#fffaf0] p-6 2xl:p-7 text-slate-900 shadow-xl border border-yellow-100 hover:-translate-y-1 transition"><div className="text-center"><h3 className="text-2xl font-black">{name}</h3><p className="text-sm text-slate-500">{range}</p><img src={img} alt={name} className="mt-5 mx-auto h-40 w-40 rounded-full object-cover bg-green-50 border border-green-100"/></div><div className="mt-7 space-y-3 text-sm"><PlanLine label="Banho" value={`R$ ${banho}`}/><PlanLine label="Banho e Tosa" value={`R$ ${combo}`}/><PlanLine label="Só Tosa" value={`R$ ${tosa}`}/></div><Link to="/agendamento" className="mt-7 block rounded-2xl bg-green-700 hover:bg-green-800 text-white text-center p-4 font-black transition">A partir de<br/><span className="text-xl">R$ {banho}</span></Link></div>)}
              </div>
            </div>
          </section>

          {services.length > 0 && <section className="max-w-[1540px] mx-auto px-5 md:px-8 2xl:px-10 py-16"><div className="grid xl:grid-cols-[460px_1fr] gap-10 items-start"><div className="xl:sticky xl:top-32"><span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-5 py-2 rounded-full font-black"><Sparkles size={18}/> Serviços cadastrados</span><h2 className="text-4xl md:text-6xl font-black mt-6">Catálogo conectado ao painel</h2><p className="text-white/60 mt-5 text-lg">Os serviços exibidos aqui vêm direto do banco de dados e podem ser alterados no painel admin.</p></div><div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-6">{!loading && services.slice(0,9).map((service,index)=>{const Icon=iconFor(service.name,service.category); return <motion.div key={service.id || service.name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.04}} className="rounded-[30px] bg-white p-5 text-slate-900 shadow-2xl border border-green-100 hover:-translate-y-2 transition"><img src={imageFor(service.name,service.category)} alt={service.name} className="w-full h-44 object-cover rounded-[22px] mb-5 bg-green-50"/><div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center"><Icon size={24}/></div><h3 className="text-xl font-black mt-4 break-words">{service.name}</h3><p className="text-slate-500 mt-2 text-sm min-h-[56px] break-words">{service.description || "Cuidado especial para seu pet."}</p><div className="mt-5 pt-5 border-t flex items-end justify-between"><div><div className="text-xs text-slate-400 font-bold">A partir de</div><div className="text-xl font-black text-green-700">{money(service.price)}</div></div><CheckCircle className="text-green-500"/></div></motion.div>})}</div></div></section>}

          <section className="max-w-[1540px] mx-auto px-5 md:px-8 2xl:px-10 py-16 pb-24">
            <div className="relative overflow-hidden rounded-[44px] bg-gradient-to-r from-green-800 via-emerald-700 to-green-500 p-8 md:p-12 2xl:p-16 shadow-2xl grid xl:grid-cols-[1fr_auto_360px] gap-8 items-center border border-green-300/20">
              <div><h2 className="text-4xl md:text-6xl font-black leading-tight">Pronto para mimar seu doguinho?</h2><p className="mt-5 text-white/85 text-lg max-w-2xl">Agende agora e proporcione uma experiência completa de cuidado, higiene e carinho.</p></div>
              <div className="flex flex-col sm:flex-row xl:flex-col gap-4"><Link to="/agendamento" className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition">Agendar agora <ArrowRight size={20}/></Link><a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition"><MessageCircle size={20}/> Falar no WhatsApp</a></div>
              <img src={bathDog} alt="Pets felizes" className="hidden xl:block h-72 w-full object-cover rounded-[34px] shadow-2xl border border-white/10"/>
            </div>
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}
function PlanLine({ label, value }) { return <div className="flex items-center justify-between gap-3"><span>{label}</span><b className="text-green-700">{value}</b></div>; }
