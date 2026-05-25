import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Heart,
  LogIn,
  MessageCircle,
  PawPrint,
  ShieldCheck,
  Sparkles,
  UserPlus
} from "lucide-react";
import PublicLayout from "../../components/public/PublicLayout";

const whatsappUrl =
  "https://wa.me/5518997493722?text=Olá! Gostaria de agendar um atendimento no SPA do Doguinho.";

const steps = [
  [UserPlus, "Crie ou acesse sua conta", "Entre na área do cliente para manter seus dados e pets salvos."],
  [PawPrint, "Cadastre seu pet", "Informe porte, peso, raça e observações importantes."],
  [Sparkles, "Escolha o serviço", "Selecione banho, tosa, spa ou outro cuidado disponível."],
  [CalendarDays, "Agende o horário", "Escolha data e horário conforme disponibilidade da agenda."],
  [CheckCircle2, "Confirme tudo", "Finalize com segurança e acompanhe pelo painel do cliente."]
];

export default function AgendamentoPage() {
  return (
    <PublicLayout>
      <main className="overflow-hidden bg-[#fffdf7] text-[#12382f]">
        <section className="relative h-[calc(100vh-96px)] min-h-[620px] overflow-hidden bg-[#e7f4ed]">
          <img
            src="/images/banho-pet-home.webp"
            alt="Agendamento SPA do Doguinho"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e7f4ed]/96 via-[#e7f4ed]/78 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fffdf7] to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1880px] items-center px-6 py-5 md:px-10">
            <div className="max-w-4xl -translate-y-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/85 px-5 py-2 text-sm font-black text-emerald-900 shadow-sm backdrop-blur">
                <CalendarDays size={18} />
                Agendamento online
              </span>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[.92] tracking-[-.05em] text-[#12382f] sm:text-5xl md:text-6xl xl:text-[4.45rem] 2xl:text-[4.85rem]">
                Agende o cuidado do seu doguinho com segurança.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base lg:text-lg">
                Para garantir uma experiência completa, o agendamento é feito pela área do cliente. Assim você cadastra seu pet, informa o porte e acompanha tudo pelo painel.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/cliente-login" className="inline-flex items-center gap-3 rounded-2xl bg-[#0d6b54] px-6 py-3 font-black text-white shadow-[0_20px_45px_rgba(13,107,84,.22)] transition hover:-translate-y-1 hover:bg-[#095642]">
                  <LogIn size={20} />
                  Entrar para agendar
                  <ArrowRight size={18} />
                </Link>

                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-[#e2eadf] bg-white/90 px-6 py-3 font-black text-[#12382f] shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-[#0d6b54]">
                  <MessageCircle size={20} />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-14 md:px-8">
          <div className="mx-auto max-w-[1680px]">
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f4ed] px-5 py-2 text-sm font-black text-[#0d6b54]">
                <Heart size={16} />
                Como funciona
              </span>
              <h2 className="mt-5 text-4xl font-black tracking-[-.04em] text-[#0d6b54] md:text-5xl">
                Tudo organizado em poucos passos.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                O fluxo completo fica dentro da área do cliente para salvar histórico, pets, serviços e agendamentos.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-5">
              {steps.map(([Icon, title, text], index) => (
                <div key={title} className="rounded-[30px] bg-white p-6 text-center shadow-xl ring-1 ring-[#e2eadf]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e7f4ed] text-[#0d6b54]">
                    <Icon size={30} />
                  </div>
                  <div className="mt-5 text-xs font-black uppercase tracking-[.15em] text-[#0d6b54]">
                    Passo {index + 1}
                  </div>
                  <h3 className="mt-2 text-lg font-black text-[#12382f]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-5 rounded-[36px] bg-[#0d6b54] p-7 text-white shadow-2xl md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div>
                <h2 className="text-3xl font-black">Pronto para agendar?</h2>
                <p className="mt-2 text-white/75">
                  Entre na área do cliente para iniciar o agendamento com todas as informações do seu pet.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/cliente-login" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f7e7c4] px-6 py-4 font-black text-[#12382f] shadow-xl transition hover:-translate-y-1">
                  <LogIn size={20} />
                  Entrar para agendar
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white/12 px-6 py-4 font-black text-white ring-1 ring-white/20 transition hover:-translate-y-1">
                  <MessageCircle size={20} />
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
