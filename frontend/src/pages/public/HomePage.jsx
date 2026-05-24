import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, CheckCircle, Heart, MessageCircle, ShieldCheck, Sparkles, Star } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const hero = "https://images.pexels.com/photos/6131158/pexels-photo-6131158.jpeg?auto=compress&cs=tinysrgb&w=1800";
const bath = "https://images.pexels.com/photos/19145888/pexels-photo-19145888.jpeg?auto=compress&cs=tinysrgb&w=1200";
const grooming = "https://images.pexels.com/photos/19145882/pexels-photo-19145882.jpeg?auto=compress&cs=tinysrgb&w=1200";
const happy = "https://images.pexels.com/photos/6816863/pexels-photo-6816863.jpeg?auto=compress&cs=tinysrgb&w=1200";

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#edf6ed] text-[#102d27]">
        <section className="relative overflow-hidden bg-[#dcefe3] px-5 pb-16 pt-10 md:px-8 2xl:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(25,83,78,.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,.55),transparent_30%)]" />

          <div className="relative mx-auto grid max-w-[1680px] gap-10 xl:grid-cols-[.75fr_1.25fr] xl:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#19534e]/10 bg-white/90 px-5 py-2 text-sm font-black text-[#19534e] shadow-sm"><Sparkles size={16} /> Boutique pet premium</span>

              <h1 className="mt-7 text-5xl font-black leading-[.9] tracking-tight md:text-7xl 2xl:text-8xl">
                Seu pet limpo,
                <br />
                cheiroso e feliz.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">
                Banho, tosa e spa com atendimento tranquilo,
                produtos premium e experiência moderna.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/agendamento" className="group inline-flex items-center gap-3 rounded-2xl bg-[#19534e] px-8 py-4 font-black text-white shadow-[0_20px_45px_rgba(25,83,78,.24)] transition hover:-translate-y-0.5 hover:bg-[#123f3b]">
                  <CalendarDays size={19} />
                  Agendar agora
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </Link>

                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#b7d7c2] bg-white px-8 py-4 font-black text-[#102d27] shadow-sm transition hover:-translate-y-0.5 hover:border-[#19534e]">
                  <MessageCircle size={19} />
                  WhatsApp
                </a>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {[["+3.500", "pets atendidos"], ["5 estrelas", "experiência premium"], ["online", "agendamento rápido"]].map(([title, text]) => (
                  <div key={title} className="rounded-[28px] bg-white/90 p-5 shadow-lg ring-1 ring-[#b7d7c2]/40 backdrop-blur">
                    <div className="text-2xl font-black text-[#0d8b67]">{title}</div>
                    <div className="mt-1 text-xs font-bold uppercase text-slate-500">{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[720px]">
              <div className="absolute right-0 top-0 h-[620px] w-[72%] overflow-hidden rounded-[56px] shadow-2xl">
                <img src={hero} alt="Pet feliz" className="h-full w-full object-cover" />
              </div>

              <div className="absolute bottom-0 left-0 w-[42%] overflow-hidden rounded-[38px] border-[10px] border-[#dcefe3] bg-white shadow-2xl">
                <img src={bath} alt="Banho premium" className="h-72 w-full object-cover" />

                <div className="p-5">
                  <div className="flex gap-1 text-[#f4c86a]">
                    {[1,2,3,4,5].map((i)=><Star key={i} size={16} fill="currentColor" />)}
                  </div>

                  <h3 className="mt-3 text-2xl font-black">Banho Premium</h3>
                  <p className="mt-2 text-sm text-slate-600">Cuidado delicado e acabamento impecável.</p>
                </div>
              </div>

              <div className="absolute right-10 top-10 rounded-[28px] bg-white/92 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f3ef] text-[#19534e]">
                    <ShieldCheck size={28} />
                  </div>

                  <div>
                    <div className="font-black">Ambiente seguro</div>
                    <p className="text-sm text-slate-500">Rotina tranquila e organizada.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1680px] gap-6 px-5 py-14 md:grid-cols-3 md:px-8 2xl:px-10">
          {[{ image: bath, title: "Banho premium" }, { image: grooming, title: "Tosa boutique" }, { image: happy, title: "Spa relaxante" }].map((item) => (
            <div key={item.title} className="group overflow-hidden rounded-[36px] bg-white shadow-xl ring-1 ring-[#dcefe3]">
              <div className="relative h-[360px] overflow-hidden">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 font-black text-[#102d27] shadow-lg">
                    <CheckCircle size={17} className="text-[#19534e]" />
                    {item.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="px-5 pb-16 md:px-8 2xl:px-10">
          <div className="mx-auto grid max-w-[1680px] gap-5 rounded-[42px] bg-[#19534e] p-8 text-white shadow-2xl md:grid-cols-3 md:p-10">
            {[{ icon: CalendarDays, title: "Agenda prática", text: "Reserve online em poucos minutos." }, { icon: ShieldCheck, title: "Ambiente seguro", text: "Higiene, calma e atenção." }, { icon: Heart, title: "Cuidado real", text: "Cada pet tratado com carinho." }].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
                  <Icon className="text-[#f4c86a]" size={34} />
                  <h3 className="mt-5 text-2xl font-black">{item.title}</h3>
                  <p className="mt-2 text-white/70">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
