import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bath, CalendarDays, Heart, MessageCircle, PawPrint, ShieldCheck, Sparkles, Syringe, Scissors } from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const heroDog = "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=90";

const services = [
  { title: "Banho & Tosa", icon: Bath, img: "/images/banho-tosa.svg", text: "Higiene completa, perfume e acabamento com carinho.", price: "R$ 60,00" },
  { title: "Vacinação", icon: Syringe, img: "/images/vacina-pet.svg", text: "Registro, cuidado preventivo e acompanhamento.", price: "R$ 120,00" },
  { title: "Tosa", icon: Scissors, img: "/images/banho-tosa.svg", text: "Tosa higiênica ou completa conforme o pet.", price: "R$ 80,00" },
  { title: "Spa Relaxante", icon: Sparkles, img: "/images/spa-pet.svg", text: "Bem-estar, relaxamento, pele e pelagem.", price: "R$ 95,00" }
];

const plans = [
  ["Pequeno", "até 10 kg", "R$ 60,00"],
  ["Médio", "10,1 a 25 kg", "R$ 80,00"],
  ["Grande", "25,1 a 40 kg", "R$ 100,00"],
  ["Gigante", "acima de 40 kg", "R$ 120,00"]
];

const benefits = [
  [CalendarDays, "Agendamento fácil", "Rápido pelo site ou WhatsApp."],
  [Sparkles, "Cuidado premium", "Produtos adequados para cada pet."],
  [ShieldCheck, "Ambiente seguro", "Atendimento organizado e monitorado."],
  [Heart, "Carinho", "Seu doguinho tratado com amor."]
];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#02130b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(34,197,94,.22),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(234,179,8,.13),transparent_26%),linear-gradient(180deg,#02130b,#062716_50%,#020d08)]" />
        <div className="relative max-w-[1460px] mx-auto px-5 md:px-8 2xl:px-10">
          <section className="grid xl:grid-cols-[1fr_560px] gap-10 items-center pt-8 pb-14 min-h-[610px]">
            <div>
              <Badge icon={PawPrint}>Cuidado premium para seu pet</Badge>
              <h1 className="mt-6 max-w-4xl text-[42px] md:text-[58px] 2xl:text-[70px] font-black leading-[1.02] tracking-tight">
                Seu pet limpo, <span className="text-green-300">cheiroso</span> e feliz.
              </h1>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-white/72 leading-relaxed">
                Banho, tosa, estética animal, vacinação e bem-estar com carinho, segurança e uma experiência premium.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink to="/agendamento">Agendar agora</ButtonLink>
                <ButtonLink to="/servicos" variant="ghost">Ver serviços</ButtonLink>
              </div>
              <div className="mt-9 grid sm:grid-cols-3 gap-4 max-w-3xl">
                <Stat value="+3.500" label="Pets atendidos" />
                <Stat value="6+" label="Anos de experiência" />
                <Stat value="Online" label="Agendamento fácil" />
              </div>
            </div>

            <div className="relative rounded-[34px] border border-yellow-400/20 bg-white/8 p-4 shadow-2xl backdrop-blur-xl">
              <img src={heroDog} alt="Cachorro feliz" className="h-[390px] 2xl:h-[470px] w-full object-cover rounded-[26px] shadow-2xl" />
              <div className="absolute left-5 bottom-5 rounded-2xl bg-[#fffaf0] text-slate-900 px-5 py-4 shadow-xl border border-yellow-100">
                <p className="font-black">Atendimento 5 estrelas</p>
                <p className="text-xs text-slate-500">Cuidado com amor e segurança</p>
              </div>
            </div>
          </section>

          <section className="pb-14">
            <div className="grid md:grid-cols-4 gap-4">
              {benefits.map(([Icon, title, text]) => <Benefit key={title} Icon={Icon} title={title} text={text} />)}
            </div>
          </section>

          <section className="py-12">
            <SectionTitle badge="Serviços" title="Escolha o cuidado ideal" text="Uma página mais limpa, sem excesso de cards e com foco no agendamento." />
            <div className="mt-10 grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {services.map((s) => <ServiceCard key={s.title} {...s} />)}
            </div>
          </section>

          <section className="py-12">
            <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mb-8">
                <div>
                  <Badge icon={PawPrint}>Planos por porte</Badge>
                  <h2 className="mt-5 text-3xl md:text-5xl font-black">Preços por tamanho</h2>
                  <p className="mt-3 text-white/60">O valor muda conforme o porte do doguinho.</p>
                </div>
                <ButtonLink to="/agendamento">Agendar por porte</ButtonLink>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {plans.map(([name, range, price]) => <Plan key={name} name={name} range={range} price={price} />)}
              </div>
            </div>
          </section>

          <section className="py-12 pb-20">
            <div className="rounded-[34px] bg-gradient-to-r from-green-800 via-emerald-700 to-green-500 p-7 md:p-10 shadow-2xl grid xl:grid-cols-[1fr_auto] gap-6 items-center border border-green-300/20">
              <div>
                <h2 className="text-3xl md:text-5xl font-black leading-tight">Pronto para mimar seu doguinho?</h2>
                <p className="mt-4 text-white/85 max-w-2xl">Agende agora e proporcione uma experiência completa de cuidado, higiene e carinho.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <ButtonLink to="/agendamento" orange>Agendar agora</ButtonLink>
                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-7 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 transition"><MessageCircle size={18}/> WhatsApp</a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}

function Badge({ icon: Icon, children }) { return <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-white/8 px-5 py-2 text-yellow-100 font-black text-sm"><Icon size={17}/>{children}</span>; }
function ButtonLink({ to, children, variant, orange }) { return <Link to={to} className={`${variant === "ghost" ? "border border-yellow-400/35 bg-white/5 hover:bg-white/10 text-yellow-100" : orange ? "bg-orange-400 hover:bg-orange-500 text-white" : "bg-green-600 hover:bg-green-700 text-white"} px-7 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl transition`}>{children}<ArrowRight size={18}/></Link>; }
function Stat({ value, label }) { return <div className="rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur-xl"><div className="text-2xl md:text-3xl font-black">{value}</div><div className="text-white/60 text-sm mt-2">{label}</div></div>; }
function Benefit({ Icon, title, text }) { return <div className="rounded-3xl border border-white/10 bg-white/5 p-5"><Icon className="text-yellow-300 mb-3" size={27}/><h3 className="font-black text-lg">{title}</h3><p className="text-white/60 text-sm mt-2">{text}</p></div>; }
function SectionTitle({ badge, title, text }) { return <div className="text-center max-w-3xl mx-auto"><Badge icon={Sparkles}>{badge}</Badge><h2 className="mt-5 text-3xl md:text-5xl font-black leading-tight">{title}</h2><p className="mt-3 text-white/60 text-base md:text-lg">{text}</p></div>; }
function ServiceCard({ title, img, text, price, icon: Icon }) { return <div className="rounded-[26px] bg-[#fffaf0] p-4 text-slate-900 shadow-2xl border border-yellow-100 hover:-translate-y-1 transition"><div className="h-36 rounded-[20px] bg-green-50 flex items-center justify-center overflow-hidden"><img src={img} alt={title} className="w-full h-full object-contain p-2"/></div><div className="mt-4 w-10 h-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center"><Icon size={20}/></div><h3 className="mt-3 text-xl font-black">{title}</h3><p className="mt-2 text-slate-500 text-sm min-h-[42px]">{text}</p><div className="mt-4 pt-4 border-t flex items-center justify-between"><span className="text-xs text-slate-400 font-bold">A partir de</span><b className="text-green-700 text-lg">{price}</b></div></div>; }
function Plan({ name, range, price }) { return <div className="rounded-[24px] bg-[#fffaf0] p-5 text-slate-900 shadow-xl border border-yellow-100"><div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center"><PawPrint size={26}/></div><h3 className="mt-5 text-2xl font-black">{name}</h3><p className="text-slate-500 text-sm">{range}</p><div className="mt-5 text-sm text-slate-600">Banho a partir de</div><div className="text-2xl font-black text-green-700">{price}</div><Link to="/agendamento" className="mt-5 block rounded-2xl bg-green-700 hover:bg-green-800 text-white text-center p-3 font-black">Agendar</Link></div>; }