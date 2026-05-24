import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, CalendarCheck, CheckCircle2, Clock, Dog, Gift, Heart, Leaf, MapPin, MessageCircle, PawPrint, Phone, Quote, Scissors, ShieldCheck, Sparkles, Star } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const whatsappHref = "https://wa.me/5518997493722";

const services = [
  { title: "Banho & Tosa", icon: Scissors, desc: "Higiene completa, pelagem bem cuidada e acabamento profissional." },
  { title: "Spa Relaxante", icon: Heart, desc: "Experiência tranquila, cuidadosa e confortável para o seu pet." },
  { title: "Agendamento Online", icon: CalendarCheck, desc: "Escolha serviço, data e horário direto pelo site." }
];

const benefits = [
  "Ambiente limpo, seguro e acolhedor.",
  "Produtos de qualidade para pele e pelagem.",
  "Atendimento humanizado para pets e tutores.",
  "Agendamento online simples e rápido."
];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#edf6ed] text-[#102d27]">
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="fixed bottom-24 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#19534e] text-white shadow-2xl transition hover:scale-105">
          <MessageCircle size={28} />
        </a>

        <section className="relative min-h-[760px] overflow-hidden bg-[#dcefe3] px-5 pb-16 pt-10 md:px-8 2xl:px-10">
          <div className="absolute left-[-160px] top-[-140px] h-[420px] w-[420px] rounded-full bg-[#0d8b67]/18 blur-3xl" />
          <div className="absolute right-[-130px] top-[120px] h-[460px] w-[460px] rounded-full bg-[#f4c86a]/22 blur-3xl" />
          <div className="absolute bottom-[-160px] left-[35%] h-[420px] w-[420px] rounded-full bg-white/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1680px] gap-10 xl:grid-cols-[1.05fr_.95fr] xl:items-center">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="py-12 xl:py-24">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b7d7c2]/80 bg-white/80 px-5 py-2 text-sm font-black text-[#19534e] shadow-sm backdrop-blur">
                <Star size={16} fill="currentColor" /> Estética pet premium
              </div>

              <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[.92] tracking-tight md:text-7xl 2xl:text-8xl">
                Beleza, cuidado e carinho para o seu <span className="text-[#0d8b67]">melhor amigo</span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl">
                Banho, tosa, hidratação, vacinas e atendimento especial para deixar seu pet lindo, cheiroso e feliz.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/agendamento" className="inline-flex items-center gap-3 rounded-2xl bg-[#19534e] px-7 py-4 font-black text-white shadow-[0_22px_50px_rgba(25,83,78,.24)] transition hover:-translate-y-0.5 hover:bg-[#123f3b]"><CalendarCheck size={18} /> Agendar pelo site</Link>
                <Link to="/agendamento" className="inline-flex items-center gap-3 rounded-2xl border border-[#b7d7c2] bg-white/76 px-7 py-4 font-black text-[#102d27] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"><PawPrint size={18} /> Agendar no celular</Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#b7d7c2] bg-white/76 px-7 py-4 font-black text-[#102d27] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"><Phone size={18} /> WhatsApp</a>
              </div>

              <div className="mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
                {[
                  { icon: ShieldCheck, title: "Ambiente seguro", text: "Conforto e cuidado em cada atendimento" },
                  { icon: Heart, title: "Equipe cuidadosa", text: "Seu pet tratado com carinho" },
                  { icon: Leaf, title: "Produtos premium", text: "Qualidade para pele e pelagem" }
                ].map((item) => {
                  const Icon = item.icon;
                  return <div key={item.title} className="rounded-[28px] border border-[#b7d7c2]/70 bg-white/72 p-6 shadow-xl backdrop-blur"><Icon className="text-[#0d8b67]" size={26} /><strong className="mt-4 block text-lg font-black">{item.title}</strong><span className="mt-1 block text-sm text-slate-600">{item.text}</span></div>;
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative mx-auto flex h-[520px] w-full max-w-[560px] items-center justify-center xl:h-[620px]">
              <div className="absolute inset-8 rounded-full bg-white/45 blur-2xl" />
              <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-white via-[#e6f3ef] to-[#b7d7c2] text-[#19534e] shadow-[0_34px_90px_rgba(25,83,78,.22)] md:h-[430px] md:w-[430px]">
                <Dog size={128} strokeWidth={1.7} />
              </div>

              <div className="absolute bottom-8 left-0 rounded-[30px] border border-[#b7d7c2]/70 bg-white/88 p-5 shadow-2xl backdrop-blur">
                <div className="flex gap-1 text-[#f4c86a]">{[1,2,3,4,5].map((i)=><Star key={i} size={18} fill="currentColor" />)}</div>
                <strong className="mt-3 block text-xl font-black">5.0 de avaliação</strong>
                <span className="text-sm text-slate-500">Clientes e pets felizes</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-5 px-5 py-12 md:grid-cols-4 md:px-8 2xl:px-10">
          {[{ icon: PawPrint, value: "+3.500", label: "Pets atendidos" }, { icon: Award, value: "5 anos", label: "De experiência" }, { icon: Clock, value: "Online", label: "Agenda fácil" }, { icon: Gift, value: "Premium", label: "Atendimento especial" }].map(({ icon: Icon, value, label }) => <div key={value} className="rounded-[30px] bg-white p-6 text-center shadow-xl ring-1 ring-[#b7d7c2]/40"><Icon className="mx-auto text-[#19534e]" size={28} /><strong className="mt-4 block text-3xl font-black text-[#0d8b67]">{value}</strong><span className="mt-1 block text-sm font-bold text-slate-500">{label}</span></div>)}
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-12 md:px-8 2xl:px-10">
          <div className="mb-10 text-center"><span className="inline-flex items-center gap-2 rounded-full bg-[#dcefe3] px-5 py-2 text-sm font-black text-[#19534e]"><Sparkles size={16} /> Serviços especiais</span><h2 className="mt-5 text-4xl font-black md:text-6xl">Tudo que seu pet precisa em um só lugar</h2></div>
          <div className="grid gap-6 md:grid-cols-3">{services.map(({ title, icon: Icon, desc }) => <motion.div key={title} whileHover={{ y: -8 }} className="rounded-[34px] bg-white p-8 shadow-xl ring-1 ring-[#b7d7c2]/40"><Icon className="text-[#19534e]" size={38} /><strong className="mt-6 block text-2xl font-black">{title}</strong><p className="mt-3 text-slate-600">{desc}</p><Link to="/servicos" className="mt-7 inline-flex items-center gap-2 font-black text-[#0d8b67]">Ver serviços <CheckCircle2 size={18} /></Link></motion.div>)}</div>
        </section>

        <section className="px-5 py-14 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1680px] gap-8 rounded-[42px] bg-[#19534e] p-8 text-white shadow-2xl md:p-12 xl:grid-cols-[1fr_1fr] xl:items-center">
            <div><span className="text-sm font-black uppercase tracking-widest text-[#f4c86a]">Por que escolher a gente?</span><h2 className="mt-5 text-4xl font-black md:text-6xl">Um atendimento pensado para o pet e para o tutor</h2><p className="mt-5 text-white/72">Tecnologia, agendamento online e muito carinho para transformar cada visita em uma experiência especial.</p></div>
            <div className="grid gap-4">{benefits.map((text)=><div key={text} className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 font-bold text-white/90"><CheckCircle2 className="text-[#f4c86a]" size={22}/><span>{text}</span></div>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-[1680px] px-5 py-12 md:px-8 2xl:px-10">
          <div className="mb-10 text-center"><span className="inline-flex rounded-full bg-[#dcefe3] px-5 py-2 text-sm font-black text-[#19534e]">Depoimentos</span><h2 className="mt-5 text-4xl font-black md:text-6xl">Quem conhece recomenda</h2></div>
          <div className="grid gap-6 md:grid-cols-3">{["Meu pet voltou cheiroso, calmo e muito bem cuidado.", "Gostei muito do agendamento online. Rápido e fácil.", "Equipe atenciosa e espaço organizado. Recomendo!"].map((text,index)=><div key={text} className="rounded-[30px] bg-white p-7 shadow-xl ring-1 ring-[#b7d7c2]/40"><Quote className="text-[#0d8b67]" size={28}/><p className="mt-5 text-lg text-slate-700">“{text}”</p><strong className="mt-5 block">Cliente {index + 1}</strong></div>)}</div>
        </section>

        <section className="px-5 pb-16 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1680px] gap-8 rounded-[42px] bg-[#0d8b67] p-8 text-white shadow-2xl md:p-12 xl:grid-cols-[1fr_auto] xl:items-center"><div><span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#f4c86a]"><MapPin size={15}/> Agendamento fácil</span><h2 className="mt-4 text-4xl font-black md:text-5xl">Pronto para mimar seu doguinho?</h2><p className="mt-3 text-white/80">Agende pelo site, pelo celular ou fale direto no WhatsApp.</p></div><div className="flex flex-wrap gap-4"><Link to="/agendamento" className="rounded-2xl bg-white px-7 py-4 font-black text-[#0d8b67]">Começar agendamento</Link><a href={whatsappHref} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/30 px-7 py-4 font-black text-white">WhatsApp</a></div></div>
        </section>
      </main>
    </PublicLayout>
  );
}
