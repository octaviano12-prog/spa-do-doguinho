import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Heart,
  LogIn,
  MessageCircle,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sparkles,
  Syringe,
  Truck,
  UserPlus,
  Weight,
  Clock,
  Phone,
  Dog
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const whatsappUrl =
  "https://wa.me/5518997493722?text=Olá! Gostaria de agendar um atendimento no SPA do Doguinho.";

const heroImage = "/images/agendamento-hero.webp";

const benefits = [
  [ShieldCheck, "Segurança dos dados", "Suas informações e as do seu pet ficam protegidas em um ambiente seguro e confiável."],
  [PawPrint, "Cadastro completo do pet", "Com o cadastro, conhecemos melhor seu doguinho e podemos oferecer o melhor atendimento."],
  [Heart, "Serviços por porte e necessidade", "Indicamos os serviços ideais de acordo com porte, idade e necessidades do seu pet."],
  [CalendarDays, "Histórico de agendamentos", "Acompanhe todos os agendamentos, serviços realizados e informações importantes."]
];

const steps = [
  [UserPlus, "Entre ou crie sua conta", "Faça login ou crie sua conta de forma rápida e segura."],
  [PawPrint, "Cadastre seu pet", "Informe os dados do seu pet para um atendimento personalizado."],
  [Bath, "Escolha o serviço", "Veja as opções disponíveis e escolha o serviço ideal para seu doguinho."],
  [CalendarDays, "Selecione data e horário", "Escolha o melhor dia e horário para vocês. Simples e prático!"],
  [CheckCircle2, "Confirme o agendamento", "Revise as informações e confirme. Pronto! Seu agendamento está feito."]
];

const checklist = [
  "Nome do tutor",
  "Dados de contato",
  "Nome do pet",
  "Porte do pet",
  "Peso aproximado",
  "Raça",
  "Idade",
  "Observações importantes",
  "Preferência de serviço"
];

const serviceCards = [
  [Bath, "Banho Premium", "/images/galeria-pet-03.webp", "Banho com produtos especiais, hidratação e perfume exclusivo."],
  [Scissors, "Tosa e Higiene", "/images/galeria-pet-02.webp", "Tosas higiênicas e completas para deixar seu pet sempre lindo e confortável."],
  [Sparkles, "Spa e Bem-estar", "/images/sobre-essencia.webp", "Tratamentos relaxantes que cuidam da pele, pelos e bem-estar do seu pet."],
  [Syringe, "Vacinas", "/images/cliente-premium.svg", "Vacinação com segurança e acompanhamento profissional."],
  [Truck, "Busca e Leva", "/images/galeria-pet-04.webp", "Mais comodidade para você. Buscamos e levamos seu pet com carinho."]
];

const faqs = [
  "Preciso criar conta para agendar?",
  "Posso cadastrar mais de um pet?",
  "O preço muda conforme o porte?",
  "Posso cancelar ou remarcar?",
  "Consigo falar pelo WhatsApp?"
];

export default function AgendamentoPage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative h-[calc(100vh-96px)] min-h-[620px] overflow-hidden bg-[#e7f4ed]">
          <img src={heroImage} alt="Agendamento SPA do Doguinho" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fffdf7]/96 via-[#fffdf7]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1880px] items-center px-6 py-5 md:px-10">
            <div className="max-w-4xl -translate-y-1">
              <div className="mb-6 flex items-center gap-3 text-[#c99631]">
                <span className="h-px w-14 bg-[#c99631]/60" />
                <Heart size={18} />
                <span className="h-px w-14 bg-[#c99631]/60" />
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-[.98] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.35rem] 2xl:text-[4.8rem]">
                Agende o cuidado do seu doguinho com segurança
              </h1>
              <p className="mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-slate-700 md:text-base lg:text-lg">
                Para garantir uma experiência completa, o agendamento é feito pela área do cliente. Assim você cadastra seu pet, informa o porte, escolhe o serviço e acompanha tudo pelo painel.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/cliente-login" className="inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-[0_20px_45px_rgba(13,107,84,.22)] transition hover:-translate-y-1 hover:bg-[#095642]">
                  <LogIn size={20} /> Entrar para agendar
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#12382f]/25 bg-white/85 px-6 py-3 font-black text-[#12382f] shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-[#0d6b54]">
                  <MessageCircle size={20} /> Falar no WhatsApp
                </a>
              </div>
              <div className="mt-9 grid max-w-4xl gap-4 sm:grid-cols-3">
                {[[ShieldCheck, "Ambiente seguro e higienizado"], [PawPrint, "Equipe apaixonada por pets"], [Heart, "Cuidado, carinho e bem-estar"]].map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
                    <Icon size={24} className="text-[#c99631]" />
                    <span className="text-sm font-black text-[#12382f]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto max-w-[1680px] text-center">
            <div className="mx-auto mb-4 flex w-fit items-center gap-3 text-[#c99631]"><span className="h-px w-12 bg-[#c99631]/50" /><PawPrint size={18} /><span className="h-px w-12 bg-[#c99631]/50" /></div>
            <h2 className="text-3xl font-black tracking-[-.03em] text-[#12382f] md:text-5xl">Por que o agendamento é pela área do cliente?</h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-600">Cada pet tem características únicas. Por isso, o cadastro ajuda nossa equipe a oferecer um atendimento mais seguro, personalizado e organizado.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {benefits.map(([Icon, title, text]) => (
                <div key={title} className="rounded-[30px] bg-white p-8 text-center shadow-xl ring-1 ring-[#e2eadf] transition hover:-translate-y-1">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1f4ed] text-[#0d6b54]"><Icon size={34} /></div>
                  <h3 className="mt-6 text-lg font-black text-[#12382f]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white/55 px-5 py-16 md:px-8">
          <div className="mx-auto max-w-[1680px] text-center">
            <div className="mx-auto mb-4 flex w-fit items-center gap-3 text-[#c99631]"><span className="h-px w-12 bg-[#c99631]/50" /><PawPrint size={18} /><span className="h-px w-12 bg-[#c99631]/50" /></div>
            <h2 className="text-3xl font-black tracking-[-.03em] text-[#12382f] md:text-5xl">Como funciona o agendamento</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-5">
              {steps.map(([Icon, title, text], index) => (
                <div key={title} className="relative rounded-[30px] bg-transparent p-5 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f1f4ed] text-[#0d6b54] shadow-sm"><Icon size={38} /></div>
                  <div className="mx-auto -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#0d6b54] text-sm font-black text-white">{index + 1}</div>
                  <h3 className="mt-4 text-lg font-black text-[#12382f]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-5 py-16 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff8e6] via-white to-[#e7f4ed]" />
          <div className="relative mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-3 text-[#c99631]"><span className="h-px w-12 bg-[#c99631]/50" /><Heart size={18} /><span className="h-px w-12 bg-[#c99631]/50" /></div>
              <h2 className="text-3xl font-black tracking-[-.03em] text-[#12382f] md:text-5xl">Antes de agendar, tenha em mãos</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {checklist.map((item) => (
                  <div key={item} className="flex items-center gap-3 font-semibold text-slate-700">
                    <CheckCircle2 size={18} className="text-[#c99631]" /> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="min-h-[320px] overflow-hidden rounded-[34px] shadow-xl ring-1 ring-[#e2eadf]">
              <img src="/images/agendamento-checklist.webp" alt="Pet preparado para agendamento" className="h-full min-h-[320px] w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto max-w-[1680px] text-center">
            <div className="mx-auto mb-4 flex w-fit items-center gap-3 text-[#c99631]"><span className="h-px w-12 bg-[#c99631]/50" /><Heart size={18} /><span className="h-px w-12 bg-[#c99631]/50" /></div>
            <h2 className="text-3xl font-black tracking-[-.03em] text-[#12382f] md:text-5xl">Serviços disponíveis para agendamento</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-5">
              {serviceCards.map(([Icon, title, image, text]) => (
                <div key={title} className="overflow-hidden rounded-[26px] bg-white shadow-xl ring-1 ring-[#e2eadf] transition hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden"><img src={image} alt={title} className="h-full w-full object-cover" /><div className="absolute -bottom-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#fffdf7] text-[#c99631] shadow-lg"><Icon size={28} /></div></div>
                  <div className="px-5 pb-6 pt-10">
                    <h3 className="font-black text-[#12382f]">{title}</h3>
                    <p className="mt-2 min-h-[58px] text-sm leading-relaxed text-slate-600">{text}</p>
                    <Link to="/servicos" className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d6b54] px-4 py-3 text-sm font-black text-white transition hover:bg-[#095642]">Ver serviços <Heart size={14} /></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto max-w-[1680px]">
            <div className="mx-auto mb-8 w-fit text-center"><div className="mb-3 flex items-center justify-center gap-3 text-[#c99631]"><span className="h-px w-12 bg-[#c99631]/50" /><Heart size={18} /><span className="h-px w-12 bg-[#c99631]/50" /></div><h2 className="text-3xl font-black tracking-[-.03em] text-[#12382f] md:text-5xl">Dúvidas frequentes</h2></div>
            <div className="grid gap-4 md:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq} className="flex items-center justify-between rounded-2xl bg-[#f3f7f2] px-6 py-4 font-black text-[#12382f] shadow-sm">
                  {faq}<ChevronDown size={20} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 md:px-8">
          <div className="mx-auto grid max-w-[1680px] overflow-hidden rounded-[34px] bg-[#d9eee3] shadow-2xl md:grid-cols-[.8fr_1.2fr]">
            <div className="min-h-[320px]"><img src="/images/agendamento-cta.webp" alt="Pronto para cuidar do seu melhor amigo" className="h-full min-h-[320px] w-full object-cover" /></div>
            <div className="grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black tracking-[-.03em] text-[#12382f] md:text-5xl">Pronto para cuidar do seu melhor amigo?</h2>
                <p className="mt-4 max-w-xl text-slate-700">Entre na área do cliente e agende com segurança, carinho e praticidade.</p>
              </div>
              <div className="grid gap-3">
                <Link to="/cliente-login" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0d6b54] px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1"><LogIn size={20} /> Entrar para agendar</Link>
                <Link to="/cliente-login" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#0d6b54]/35 bg-white/70 px-7 py-4 font-black text-[#12382f] transition hover:-translate-y-1"><UserPlus size={20} /> Criar conta</Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#0d6b54]/35 bg-white/70 px-7 py-4 font-black text-[#12382f] transition hover:-translate-y-1"><MessageCircle size={20} /> Falar no WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
