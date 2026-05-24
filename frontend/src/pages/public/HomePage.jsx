import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  CalendarDays,
  Crown,
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

const heroImage = "/images/hero-doguinho-banho-compatible.svg";

const services = [
  {
    title: "Banho & Tosa",
    icon: Bath,
    image: "/images/banho-tosa.svg",
    text: "Higiene completa, perfume e acabamento com carinho.",
    price: "R$ 60,00"
  },
  {
    title: "Vacinação",
    icon: Syringe,
    image: "/images/vacina-pet.svg",
    text: "Registro, cuidado preventivo e acompanhamento.",
    price: "R$ 120,00"
  },
  {
    title: "Tosa",
    icon: Scissors,
    image: "/images/banho-tosa.svg",
    text: "Tosa higiênica ou completa conforme o pet.",
    price: "R$ 80,00"
  },
  {
    title: "Spa Relaxante",
    icon: Sparkles,
    image: "/images/spa-pet.svg",
    text: "Bem-estar, relaxamento, pele e pelagem.",
    price: "R$ 95,00"
  }
];

const stats = [
  { icon: PawPrint, value: "+3.500", label: "Pets atendidos" },
  { icon: ShieldCheck, value: "6+", label: "Anos de experiência" },
  { icon: CalendarDays, value: "Online", label: "Agendamento fácil" }
];

const benefits = [
  { icon: CalendarDays, title: "Agendamento fácil", text: "Rápido pelo site ou WhatsApp." },
  { icon: Crown, title: "Cuidado premium", text: "Produtos adequados para cada pet." },
  { icon: ShieldCheck, title: "Ambiente seguro", text: "Atendimento organizado e monitorado." },
  { icon: Heart, title: "Carinho", text: "Seu doguinho tratado com amor." }
];

const plans = [
  {
    name: "Pequeno",
    range: "até 10 kg",
    price: "R$ 60,00",
    time: "~1h de atendimento",
    progress: "25%",
    image: "https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    name: "Médio",
    range: "10,1 a 25 kg",
    price: "R$ 80,00",
    time: "~1h30 de atendimento",
    progress: "50%",
    image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    name: "Grande",
    range: "25,1 a 40 kg",
    price: "R$ 100,00",
    time: "~2h de atendimento",
    progress: "75%",
    image: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    name: "Gigante",
    range: "acima de 40 kg",
    price: "R$ 120,00",
    time: "~2h30 de atendimento",
    progress: "100%",
    image: "https://images.pexels.com/photos/1189673/pexels-photo-1189673.jpeg?auto=compress&cs=tinysrgb&w=600"
  }
];

const trustItems = [
  [Sparkles, "Produtos Premium", "Apenas o melhor para o seu pet."],
  [ShieldCheck, "Equipe Especializada", "Profissionais treinados com amor e cuidado."],
  [Heart, "Ambiente Agradável", "Espaço seguro, limpo e climatizado."]
];

export default function HomePage() {
  return (
    <PublicLayout>
      <main className="relative overflow-hidden bg-[#020d08] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,197,94,.28),transparent_28%),radial-gradient(circle_at_72%_8%,rgba(250,204,21,.24),transparent_30%),linear-gradient(180deg,#020d08_0%,#042616_44%,#03160e_100%)]" />
        <div className="absolute inset-0 opacity-[.18] bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <section className="relative max-w-[1680px] mx-auto px-5 md:px-8 2xl:px-10 pt-10 pb-8 grid xl:grid-cols-[.93fr_1.07fr] gap-8 items-center min-h-[700px]">
          <div className="relative z-10">
            <Badge icon={Star}>Cuidado premium para seu pet</Badge>
            <h1 className="mt-7 max-w-4xl text-5xl md:text-7xl 2xl:text-8xl font-black leading-none">
              Seu pet limpo, <span className="text-green-300">cheiroso</span> e feliz.
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/78 leading-relaxed">
              Banho, tosa, estética animal, vacinação e bem-estar com carinho, segurança e uma experiência premium.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/agendamento" className="group rounded-2xl bg-gradient-to-br from-green-400 to-green-700 px-8 py-4 font-black text-white shadow-[0_0_34px_rgba(34,197,94,.34)] transition hover:scale-[1.02] flex items-center gap-3">
                <CalendarDays size={19} />
                Agendar agora
                <ArrowRight size={19} className="transition group-hover:translate-x-1" />
              </Link>
              <Link to="/servicos" className="group rounded-2xl border border-yellow-200/30 bg-black/20 px-8 py-4 font-black text-yellow-50 transition hover:bg-white/10 flex items-center gap-3">
                Ver serviços
                <ArrowRight size={19} className="transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-9 grid sm:grid-cols-3 gap-0 overflow-hidden rounded-3xl border border-green-200/18 bg-white/8 shadow-2xl backdrop-blur-xl">
              {stats.map((item) => <StatCard key={item.label} {...item} />)}
            </div>
          </div>

          <div className="relative min-h-[560px] flex items-center justify-center">
            <div className="absolute h-[430px] w-[430px] md:h-[540px] md:w-[540px] rounded-full border-[8px] border-yellow-200/75 shadow-[0_0_90px_rgba(250,204,21,.38),inset_0_0_70px_rgba(250,204,21,.22)]" />
            <div className="absolute h-[560px] w-[560px] rounded-full bg-yellow-300/10 blur-3xl" />
            <img src={heroImage} alt="Doguinho limpo e feliz" className="relative z-10 h-[520px] md:h-[650px] 2xl:h-[720px] w-full object-contain drop-shadow-[0_38px_60px_rgba(0,0,0,.65)]" />
            <div className="absolute right-4 md:right-12 bottom-16 z-20 rounded-3xl border border-yellow-200/25 bg-[#19361f]/82 px-5 py-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/90 text-green-800 flex items-center justify-center shadow-[0_0_28px_rgba(255,255,255,.38)]">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <p className="font-black">Atendimento 5 estrelas</p>
                  <div className="mt-1 flex text-yellow-300">
                    {[1, 2, 3, 4, 5].map((item) => <Star key={item} size={15} fill="currentColor" />)}
                  </div>
                  <p className="mt-1 text-xs text-white/72">Cuidado com amor e segurança</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative max-w-[1680px] mx-auto px-5 md:px-8 2xl:px-10 pb-12">
          <div className="grid md:grid-cols-4 overflow-hidden rounded-3xl border border-green-200/16 bg-[#062416]/86 shadow-2xl backdrop-blur-xl">
            {benefits.map((item) => <BenefitCard key={item.title} {...item} />)}
          </div>
        </section>

        <section className="relative max-w-[1680px] mx-auto px-5 md:px-8 2xl:px-10 py-12">
          <SectionTitle badge="Nossos Serviços" title="Escolha o cuidado ideal" text="Uma experiência completa de carinho, higiene e bem-estar para o seu melhor amigo." />
          <div className="mt-10 grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {services.map((service) => <ServiceCard key={service.title} {...service} />)}
          </div>
        </section>

        <section className="relative max-w-[1680px] mx-auto px-5 md:px-8 2xl:px-10 py-8">
          <div className="rounded-[32px] border border-green-200/20 bg-[#082619]/82 p-5 md:p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid xl:grid-cols-[.8fr_1fr] gap-6 items-end">
              <div>
                <Badge icon={PawPrint}>Planos por porte</Badge>
                <h2 className="mt-5 text-4xl md:text-5xl font-black">Preços por tamanho</h2>
                <p className="mt-2 text-white/70">O valor muda conforme o porte do doguinho.</p>
              </div>
              <SizeScale />
            </div>

            <div className="mt-7 grid md:grid-cols-2 xl:grid-cols-4 gap-5">
              {plans.map((plan) => <PlanCard key={plan.name} {...plan} />)}
            </div>
          </div>
        </section>

        <section className="relative max-w-[1680px] mx-auto px-5 md:px-8 2xl:px-10 py-8">
          <div className="rounded-[32px] border border-green-200/16 bg-[#062416]/86 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid xl:grid-cols-[.7fr_1fr_.7fr] gap-8 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black leading-none">Seu pet em boas patas!</h2>
                <div className="mt-5 flex -space-x-3">
                  {plans.map((plan) => <img key={plan.name} src={plan.image} alt={plan.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-[#062416]" />)}
                </div>
                <div className="mt-4 flex items-center gap-3 text-yellow-300">
                  {[1, 2, 3, 4, 5].map((item) => <Star key={item} size={18} fill="currentColor" />)}
                  <span className="text-sm font-black text-white">5,0</span>
                </div>
                <p className="mt-1 text-sm text-white/64">+500 avaliações no Google</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {trustItems.map(([Icon, title, text]) => <TrustItem key={title} Icon={Icon} title={title} text={text} />)}
              </div>

              <div className="relative hidden xl:block min-h-[190px]">
                <div className="absolute right-20 top-0 rotate-[-7deg] rounded-xl border-[6px] border-white bg-white p-2 shadow-2xl">
                  <img src="/images/cliente-premium.svg" alt="Espaço SPA do Doguinho" className="h-32 w-44 rounded-md object-cover" />
                </div>
                <div className="absolute right-0 top-8 rotate-[6deg] rounded-xl border-[6px] border-white bg-white p-2 shadow-2xl">
                  <img src="/images/hero-spa-doguinho-premium.svg" alt="SPA do Doguinho" className="h-32 w-44 rounded-md object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative max-w-[1680px] mx-auto px-5 md:px-8 2xl:px-10 pt-2 pb-12">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-green-800 via-green-600 to-green-500 p-7 md:p-9 shadow-[0_24px_70px_rgba(22,163,74,.22)]">
            <img src={heroImage} alt="Doguinho pronto para atendimento" className="absolute -left-8 bottom-[-86px] hidden h-60 object-contain opacity-85 md:block" />
            <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center md:pl-48">
              <div>
                <h2 className="text-3xl md:text-5xl font-black">Pronto para mimar seu doguinho?</h2>
                <p className="mt-2 max-w-3xl text-white/82">Agende agora e proporcione uma experiência completa de cuidado, higiene e carinho.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/agendamento" className="rounded-2xl bg-yellow-300 px-7 py-4 font-black text-slate-950 shadow-xl transition hover:bg-yellow-200 flex items-center gap-2">
                  <CalendarDays size={18} />
                  Agendar agora
                  <ArrowRight size={18} />
                </Link>
                <a href="https://wa.me/5518997493722" target="_blank" rel="noreferrer" className="rounded-2xl border border-white/35 bg-white/10 px-7 py-4 font-black text-white transition hover:bg-white/18 flex items-center gap-2">
                  <MessageCircle size={18} />
                  WhatsApp
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
  return <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/25 bg-black/24 px-5 py-2 text-yellow-100 font-black text-sm shadow-lg backdrop-blur"><Icon size={16} />{children}</span>;
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-4 border-b border-white/10 p-6 sm:border-b-0 sm:border-r last:border-r-0">
      <Icon className="text-green-200" size={34} />
      <div>
        <div className="text-2xl font-black">{value}</div>
        <div className="mt-1 text-sm text-white/62">{label}</div>
      </div>
    </div>
  );
}

function BenefitCard({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-4 border-b border-white/10 p-6 md:border-b-0 md:border-r last:border-r-0">
      <Icon className="mt-1 text-green-200" size={34} />
      <div>
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 text-sm text-white/64">{text}</p>
      </div>
    </div>
  );
}

function SectionTitle({ badge, title, text }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <Badge icon={PawPrint}>{badge}</Badge>
      <h2 className="mt-4 text-4xl md:text-5xl font-black">{title}</h2>
      <p className="mt-3 text-white/72">{text}</p>
    </div>
  );
}

function ServiceCard({ title, icon: Icon, image, text, price }) {
  return (
    <article className="group overflow-hidden rounded-[22px] border border-yellow-100 bg-[#fffaf0] p-4 text-slate-950 shadow-2xl transition hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden rounded-2xl bg-green-50">
        <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-800 shadow-lg">
          <Icon size={21} />
        </div>
      </div>
      <h3 className="mt-5 text-2xl font-black">{title}</h3>
      <p className="mt-2 min-h-[58px] text-slate-600">{text}</p>
      <div className="mt-5 flex items-end justify-between border-t border-slate-200 pt-4">
        <span className="text-sm text-slate-500">A partir de</span>
        <strong className="text-xl text-green-800">{price}</strong>
      </div>
    </article>
  );
}

function SizeScale() {
  return (
    <div className="hidden md:block">
      <div className="grid grid-cols-4 gap-4 text-center text-white/72">
        {plans.map((plan) => <PawPrint key={plan.name} className="mx-auto text-white/75" size={plan.name === "Gigante" ? 34 : 26} />)}
      </div>
      <div className="mt-3 h-2 rounded-full bg-white/16">
        <div className="h-full w-1/2 rounded-full bg-green-300 shadow-[0_0_20px_rgba(134,239,172,.75)]" />
      </div>
      <div className="mt-2 grid grid-cols-4 gap-4 text-center text-xs text-white/72">
        {plans.map((plan) => <span key={plan.name}>{plan.name}</span>)}
      </div>
    </div>
  );
}

function PlanCard({ name, range, price, time, image, progress }) {
  return (
    <article className="relative min-h-[250px] overflow-hidden rounded-[18px] border border-yellow-100 bg-[#fffaf0] p-6 text-slate-950 shadow-xl">
      <div className="relative z-10 max-w-[58%]">
        <h3 className="text-2xl font-black">{name}</h3>
        <p className="mt-1 text-sm text-slate-500">{range}</p>
        <p className="mt-5 text-sm text-slate-500">Banho a partir de</p>
        <div className="text-3xl font-black text-green-800">{price}</div>
        <p className="mt-2 text-sm text-slate-600">{time}</p>
        <Link to="/agendamento" className="mt-5 inline-flex rounded-2xl bg-green-700 px-8 py-3 text-sm font-black text-white transition hover:bg-green-800">
          Agendar
        </Link>
      </div>
      <img src={image} alt={name} className="absolute bottom-0 right-0 h-[86%] w-[48%] object-cover object-center" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
        <div className="h-full bg-green-600" style={{ width: progress }} />
      </div>
    </article>
  );
}

function TrustItem({ Icon, title, text }) {
  return (
    <div className="border-l border-white/10 pl-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-400/12 text-yellow-200">
        <Icon size={24} />
      </div>
      <h3 className="font-black">{title}</h3>
      <p className="mt-2 text-sm text-white/64">{text}</p>
    </div>
  );
}
