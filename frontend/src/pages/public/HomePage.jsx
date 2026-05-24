import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bath, CalendarDays, Clock, Heart, MessageCircle, PawPrint, Scissors, ShieldCheck, Sparkles, Star, Syringe } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const photos = {
  hero: "https://images.pexels.com/photos/6131158/pexels-photo-6131158.jpeg?auto=compress&cs=tinysrgb&w=2200",
  bath: "https://images.pexels.com/photos/19145888/pexels-photo-19145888.jpeg?auto=compress&cs=tinysrgb&w=1200"
};

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#edf6ed] text-[#102d27]">
        <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-[#dcefe3] px-5 pb-10 pt-8 md:px-8 2xl:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(13,139,103,.16),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(244,200,106,.24),transparent_28%)]" />

          <div className="relative mx-auto grid min-h-[calc(100vh-120px)] max-w-[1840px] gap-8 xl:grid-cols-[.78fr_1.22fr] xl:items-center">
            <div className="z-10 max-w-4xl py-8 xl:py-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#19534e]/10 bg-white/90 px-5 py-2 text-sm font-black text-[#19534e] shadow-sm">
                <Sparkles size={16} /> Boutique pet premium
              </span>

              <h1 className="mt-7 text-5xl font-black leading-[.92] tracking-tight text-[#102d27] md:text-7xl 2xl:text-8xl">
                Seu pet limpo,
                <br />
                cheiroso e feliz.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">
                Banho, tosa, spa e vacinação com rotina segura, ambiente tranquilo e experiência premium.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/agendamento" className="group inline-flex items-center gap-3 rounded-2xl bg-[#19534e] px-7 py-4 font-black text-white shadow-[0_20px_45px_rgba(25,83,78,.24)] transition hover:-translate-y-0.5 hover:bg-[#123f3b]">
                  <CalendarDays size={19} /> Agendar agora <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </Link>
                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#b7d7c2] bg-white px-7 py-4 font-black text-[#102d27] shadow-sm transition hover:-translate-y-0.5 hover:border-[#19534e]"><MessageCircle size={19} /> WhatsApp</a>
              </div>

              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[["+3.500", "pets"], ["5★", "premium"], ["online", "fácil"]].map(([value, label]) => <div key={label} className="rounded-3xl bg-white/92 p-5 shadow-lg ring-1 ring-[#b7d7c2]/40"><div className="text-2xl font-black text-[#0d8b67]">{value}</div><div className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</div></div>)}
              </div>
            </div>

            <div className="relative min-h-[580px] xl:min-h-[calc(100vh-150px)]">
              <div className="absolute inset-y-0 right-0 w-full overflow-hidden rounded-[64px] bg-slate-200 shadow-2xl ring-1 ring-black/5 xl:w-[108%]">
                <img src={photos.hero} alt="Pet após banho" className="h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#dcefe3]/28 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-8 left-[-36px] hidden w-[320px] overflow-hidden rounded-[36px] border-[10px] border-[#dcefe3] bg-white shadow-2xl md:block 2xl:w-[380px]">
                <img src={photos.bath} alt="Banho cuidadoso" className="h-56 w-full object-cover" />
                <div className="p-5"><div className="flex gap-1 text-[#f4c86a]">{[1,2,3,4,5].map((i)=><Star key={i} size={16} fill="currentColor" />)}</div><h3 className="mt-3 text-xl font-black">Banho Premium</h3></div>
              </div>

              <div className="absolute right-8 bottom-8 rounded-[28px] bg-white/92 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f3ef] text-[#19534e]"><ShieldCheck size={28} /></div><div><div className="font-black text-[#102d27]">Ambiente seguro</div><p className="text-sm text-slate-500">Calma, higiene e atenção.</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1840px] gap-5 px-5 py-12 md:grid-cols-4 md:px-8 2xl:px-10">
          {[[Bath, "Banho Premium"], [Scissors, "Tosa Boutique"], [Sparkles, "Spa Relaxante"], [Syringe, "Vacinação"]].map(([Icon, title]) => <div key={title} className="rounded-[30px] bg-white p-7 shadow-xl ring-1 ring-[#b7d7c2]/40 transition hover:-translate-y-1"><Icon className="text-[#19534e]" size={34} /><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="mt-2 text-slate-600">Atendimento premium e cuidadoso para seu pet.</p></div>)}
        </section>

        <section className="px-5 pb-16 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1840px] gap-8 rounded-[42px] bg-[#19534e] p-8 text-white shadow-2xl md:grid-cols-2 md:p-12 xl:items-center">
            <div><span className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-[#dcefe3]">Pacotes por porte</span><h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Preço claro antes de agendar.</h2><p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">Valores separados por porte do pet para facilitar o atendimento.</p></div>
            <div className="grid gap-4 md:grid-cols-2">{[["Pequeno", "R$ 60", "~1h"], ["Médio", "R$ 80", "~1h30"], ["Grande", "R$ 100", "~2h"], ["Gigante", "R$ 120", "~2h30"]].map(([name, price, time]) => <div key={name} className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 backdrop-blur"><div className="flex items-start justify-between gap-4"><div><h3 className="text-2xl font-black text-white">{name}</h3><p className="mt-1 text-white/60">Banho a partir de</p></div><PawPrint className="text-[#f4c86a]" size={28} /></div><div className="mt-5 text-4xl font-black text-[#f4c86a]">{price}</div><div className="mt-4 flex items-center gap-2 text-white/70"><Clock size={18} />{time}</div></div>)}</div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
