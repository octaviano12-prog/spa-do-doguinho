import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bath, CalendarDays, CheckCircle, Clock, Heart, MessageCircle, PawPrint, Scissors, ShieldCheck, Sparkles, Star, Syringe } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const photos = {
  hero: "https://images.pexels.com/photos/6131158/pexels-photo-6131158.jpeg?auto=compress&cs=tinysrgb&w=1800",
  bath: "https://images.pexels.com/photos/19145888/pexels-photo-19145888.jpeg?auto=compress&cs=tinysrgb&w=1200",
  towel: "https://images.pexels.com/photos/6131162/pexels-photo-6131162.jpeg?auto=compress&cs=tinysrgb&w=1200",
  grooming: "https://images.pexels.com/photos/19145882/pexels-photo-19145882.jpeg?auto=compress&cs=tinysrgb&w=1200",
  care: "https://images.pexels.com/photos/4432261/pexels-photo-4432261.jpeg?auto=compress&cs=tinysrgb&w=1200",
  vet: "https://images.pexels.com/photos/7468980/pexels-photo-7468980.jpeg?auto=compress&cs=tinysrgb&w=1200",
  happy: "https://images.pexels.com/photos/6816863/pexels-photo-6816863.jpeg?auto=compress&cs=tinysrgb&w=1200"
};

const services = [
  { title: "Banho Premium", icon: Bath, image: photos.bath, text: "Limpeza delicada, hidratação e perfume na medida.", price: "R$ 60,00" },
  { title: "Tosa Boutique", icon: Scissors, image: photos.grooming, text: "Acabamento bonito, seguro e adequado para cada pelagem.", price: "R$ 80,00" },
  { title: "Spa Relaxante", icon: Sparkles, image: photos.towel, text: "Cuidado de pele, pelagem e bem-estar para o pet relaxar.", price: "R$ 95,00" },
  { title: "Vacinação", icon: Syringe, image: photos.vet, text: "Prevenção, orientação e registro para manter a saúde em dia.", price: "R$ 120,00" }
];

const steps = [
  ["01", "Recepção tranquila", "Seu pet chega com calma e é acolhido sem pressa."],
  ["02", "Avaliação do cuidado", "Analisamos porte, pelagem, pele e comportamento."],
  ["03", "Banho ou tosa", "Produtos adequados e rotina feita com paciência."],
  ["04", "Finalização premium", "Perfume, acabamento e orientação antes da entrega."]
];

const packages = [
  { name: "Pequeno", detail: "até 10 kg", price: "R$ 60", time: "~1h" },
  { name: "Médio", detail: "10 a 25 kg", price: "R$ 80", time: "~1h30" },
  { name: "Grande", detail: "25 a 40 kg", price: "R$ 100", time: "~2h" },
  { name: "Gigante", detail: "acima de 40 kg", price: "R$ 120", time: "~2h30" }
];

const proof = [["+3.500", "pets atendidos"], ["5 estrelas", "experiência premium"], ["online", "agendamento fácil"]];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fbf7ef] text-[#10231a]">
        <section className="relative bg-[#f5efe4] px-5 pb-16 pt-12 md:px-8 lg:pb-20 2xl:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(15,122,59,.13),transparent_30%),radial-gradient(circle_at_80%_8%,rgba(245,214,107,.20),transparent_26%)]" />
          <div className="relative mx-auto grid max-w-[1680px] gap-12 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/90 px-5 py-2 text-sm font-black text-emerald-900 shadow-sm"><Sparkles size={16} /> Boutique pet care em Sud Mennucci</span>
              <h1 className="mt-7 text-5xl font-black leading-[.93] tracking-tight md:text-7xl 2xl:text-8xl">Cuidado premium para seu pet voltar impecável.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">Banho, tosa, spa e vacinação em uma experiência calma, cheirosa e organizada para pets e tutores.</p>
              <div className="mt-9 flex flex-wrap gap-4"><Link to="/agendamento" className="group inline-flex items-center gap-3 rounded-2xl bg-[#0f7a3b] px-7 py-4 font-black text-white shadow-[0_20px_45px_rgba(15,122,59,.24)] transition hover:-translate-y-0.5 hover:bg-[#0b6631]"><CalendarDays size={19} /> Agendar agora <ArrowRight size={18} className="transition group-hover:translate-x-1" /></Link><a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-7 py-4 font-black text-[#10231a] shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-700"><MessageCircle size={19} /> Falar no WhatsApp</a></div>
              <div className="mt-10 grid max-w-2xl grid-cols-3 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl">{proof.map(([value, label]) => <div key={label} className="border-r border-slate-100 p-5 last:border-r-0"><div className="text-2xl font-black text-[#0f7a3b]">{value}</div><div className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</div></div>)}</div>
            </div>
            <div className="relative min-h-[580px]">
              <div className="absolute right-0 top-6 h-[520px] w-[86%] overflow-hidden rounded-[48px] bg-slate-200 shadow-2xl ring-1 ring-black/5"><img src={photos.hero} alt="Pet limpo enrolado em toalha" className="h-full w-full object-cover" /></div>
              <div className="absolute bottom-8 left-0 hidden w-[43%] overflow-hidden rounded-[34px] border-[10px] border-[#f5efe4] bg-white shadow-2xl md:block"><img src={photos.bath} alt="Banho pet premium" className="h-72 w-full object-cover" /></div>
              <div className="absolute right-8 bottom-10 max-w-sm rounded-[28px] border border-emerald-900/10 bg-white/92 p-5 shadow-2xl backdrop-blur"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800"><ShieldCheck size={28} /></div><div><div className="font-black">Atendimento cuidadoso</div><div className="mt-1 flex text-yellow-500">{[1, 2, 3, 4, 5].map((item) => <Star key={item} size={15} fill="currentColor" />)}</div><p className="mt-1 text-sm text-slate-500">Rotina segura do começo ao fim.</p></div></div></div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-5 px-5 py-10 md:grid-cols-4 md:px-8 2xl:px-10">{[[CalendarDays, "Agenda prática", "Reserve pelo site em poucos minutos."], [Sparkles, "Produtos premium", "Shampoos e finalizadores adequados."], [ShieldCheck, "Ambiente seguro", "Higiene, organização e atenção."], [Heart, "Carinho real", "Cada pet tratado com calma e respeito."]].map(([Icon, title, text]) => <Feature key={title} Icon={Icon} title={title} text={text} />)}</section>

        <section className="mx-auto max-w-[1680px] px-5 py-14 md:px-8 2xl:px-10"><SectionTitle eyebrow="Serviços" title="Tudo que seu pet precisa para ficar lindo e saudável" text="Cards com fotos reais, preços claros e caminhos rápidos para agendar." /><div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">{services.map((service) => <ServiceCard key={service.title} {...service} />)}</div></section>

        <section className="px-5 py-16 md:px-8 2xl:px-10"><div className="mx-auto grid max-w-[1680px] gap-8 overflow-hidden rounded-[42px] bg-[#10231a] p-8 text-white shadow-2xl md:p-12 xl:grid-cols-[.85fr_1.15fr] xl:items-center"><div><span className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-emerald-100">Experiência</span><h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Um fluxo de cuidado sem bagunça.</h2><p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">Processo claro, atendimento cuidadoso e agendamento fácil para o tutor acompanhar tudo com confiança.</p><Link to="/agendamento" className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#f5d66b] px-7 py-4 font-black text-[#10231a] transition hover:bg-yellow-300">Agendar atendimento <ArrowRight size={18} /></Link></div><div className="grid gap-4 md:grid-cols-2">{steps.map(([number, title, text]) => <StepCard key={number} number={number} title={title} text={text} />)}</div></div></section>

        <section className="mx-auto max-w-[1680px] px-5 py-8 md:px-8 2xl:px-10"><div className="grid gap-8 xl:grid-cols-[.85fr_1.15fr]"><div className="rounded-[36px] bg-white p-8 shadow-xl ring-1 ring-black/5"><span className="inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-900">Pacotes</span><h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">Preços por porte, sem complicar.</h2><p className="mt-4 text-slate-600">O tutor entende rápido quanto custa, quanto tempo leva e já pode agendar.</p><img src={photos.care} alt="Kit de cuidado pet" className="mt-8 h-72 w-full rounded-[28px] object-cover" /></div><div className="grid gap-5 md:grid-cols-2">{packages.map((item) => <PackageCard key={item.name} {...item} />)}</div></div></section>

        <section className="mx-auto max-w-[1680px] px-5 py-16 md:px-8 2xl:px-10"><div className="grid gap-5 md:grid-cols-[1.1fr_.9fr_1fr]"><GalleryPhoto image={photos.grooming} title="Tosa com acabamento" /><GalleryPhoto image={photos.towel} title="Pós-banho confortável" tall /><GalleryPhoto image={photos.happy} title="Rotina com carinho" /></div></section>

        <section className="px-5 pb-16 md:px-8 2xl:px-10"><div className="mx-auto max-w-[1680px] overflow-hidden rounded-[40px] bg-[#0f7a3b] shadow-2xl"><div className="grid gap-8 p-8 text-white md:p-10 xl:grid-cols-[1fr_auto] xl:items-center"><div><h2 className="text-4xl font-black md:text-5xl">Pronto para deixar seu pet impecável?</h2><p className="mt-3 max-w-3xl text-white/75">Agende banho, tosa ou spa e ofereça uma experiência premium para seu melhor amigo.</p></div><div className="flex flex-wrap gap-4"><Link to="/agendamento" className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-[#0f7a3b] transition hover:bg-emerald-50"><CalendarDays size={18} /> Agendar agora</Link><a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-7 py-4 font-black text-white transition hover:bg-white/10"><MessageCircle size={18} /> WhatsApp</a></div></div></div></section>
      </main>
    </PublicLayout>
  );
}

function SectionTitle({ eyebrow, title, text }) { return <div className="mx-auto max-w-4xl text-center"><span className="inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-900">{eyebrow}</span><h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">{title}</h2><p className="mt-4 text-lg text-slate-600">{text}</p></div>; }
function Feature({ Icon, title, text }) { return <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"><Icon className="text-emerald-700" size={32} /><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p></div>; }
function ServiceCard({ title, icon: Icon, image, text, price }) { return <article className="group overflow-hidden rounded-[30px] bg-white shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1"><div className="relative h-64 overflow-hidden"><img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-xl"><Icon size={24} /></div></div><div className="p-6"><h3 className="text-2xl font-black">{title}</h3><p className="mt-3 min-h-[72px] text-slate-600">{text}</p><div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-5"><span className="text-sm font-bold text-slate-400">A partir de</span><strong className="text-2xl text-emerald-800">{price}</strong></div></div></article>; }
function StepCard({ number, title, text }) { return <div className="rounded-[28px] border border-white/10 bg-white/10 p-6"><div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5d66b] font-black text-[#10231a]">{number}</span><h3 className="text-xl font-black">{title}</h3></div><p className="mt-4 text-white/70">{text}</p></div>; }
function PackageCard({ name, detail, price, time }) { return <div className="rounded-[30px] bg-white p-6 shadow-xl ring-1 ring-black/5 transition hover:-translate-y-1"><div className="flex items-start justify-between gap-4"><div><h3 className="text-2xl font-black">{name}</h3><p className="mt-1 text-slate-500">{detail}</p></div><PawPrint className="text-emerald-700" size={30} /></div><p className="mt-8 text-sm font-bold text-slate-400">Banho a partir de</p><div className="mt-1 text-4xl font-black text-emerald-800">{price}</div><div className="mt-5 flex items-center gap-2 text-slate-600"><Clock size={18} />{time}</div><Link to="/agendamento" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#10231a] px-5 py-4 font-black text-white transition hover:bg-emerald-900">Agendar <ArrowRight size={18} /></Link></div>; }
function GalleryPhoto({ image, title, tall = false }) { return <div className={`group relative overflow-hidden rounded-[34px] bg-slate-200 shadow-xl ${tall ? "md:-mt-10" : ""}`}><img src={image} alt={title} className="h-[430px] w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-transparent" /><div className="absolute bottom-5 left-5 right-5"><div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-black text-[#10231a] shadow-lg"><CheckCircle size={17} className="text-emerald-700" />{title}</div></div></div>; }
