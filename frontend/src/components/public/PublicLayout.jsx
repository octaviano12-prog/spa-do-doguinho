import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CalendarDays,
  Facebook,
  Heart,
  Home,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PawPrint,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X
} from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/quem-somos", label: "Quem Somos", icon: User },
  { to: "/servicos", label: "Serviços", icon: Sparkles },
  { to: "/agendamento", label: "Agendamentos", icon: CalendarDays },
  { to: "/galeria", label: "Galeria", icon: PawPrint },
  { to: "/contato", label: "Contato", icon: Phone }
];

const whatsappUrl = "https://wa.me/5518997493722?text=Olá! Gostaria de agendar um atendimento no SPA do Doguinho.";

function BrandLogo({ small = false }) {
  const size = small ? "h-12 w-12" : "h-[54px] w-[54px]";
  return (
    <div className={`${size} relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-emerald-200 shadow-[0_14px_30px_rgba(15,122,59,.16)]`}>
      <div className="absolute inset-[6px] rounded-xl bg-white/85" />
      <PawPrint className="relative text-[#0f7a3b]" size={small ? 25 : 28} />
    </div>
  );
}

export default function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fbf7ef] text-[#10231a]">
      <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 md:px-6">
        <div className="mx-auto max-w-[1680px] overflow-hidden rounded-[24px] border border-black/5 bg-white/92 shadow-[0_18px_50px_rgba(16,35,26,.12)] backdrop-blur-2xl">
          <div className="relative flex min-h-[68px] items-center justify-between gap-3 px-4 2xl:px-5">
            <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3 lg:w-[240px] xl:w-[250px]" onClick={() => setMobileOpen(false)}>
              <BrandLogo />
              <div className="min-w-0 leading-none">
                <div className="text-[20px] font-black text-[#10231a] 2xl:text-[22px]">SPA do</div>
                <div className="text-[23px] font-black leading-[.9] text-[#10231a] 2xl:text-[25px]">Doguinho</div>
                <div className="mt-2 text-[10px] font-black text-[#0f7a3b]">Banho, Tosa e Veterinária</div>
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center xl:flex">
              <div className="flex items-center gap-1 rounded-2xl bg-[#f5efe4] p-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-black transition 2xl:px-4 ${
                          isActive ? "bg-white text-[#0f7a3b] shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-[#10231a]"
                        }`
                      }
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            <div className="hidden w-[315px] shrink-0 items-center justify-end gap-2 lg:flex">
              <Link to="/agendamento" className="flex items-center gap-2 rounded-xl bg-[#0f7a3b] px-4 py-3 text-[13px] font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#0b6631]">
                <CalendarDays size={15} />
                Agendar
              </Link>
              <Link to="/cliente-login" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-black text-[#10231a] transition hover:border-emerald-700">
                <User size={15} />
                Cliente
              </Link>
              <Link to="/login" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-black text-[#10231a] transition hover:border-emerald-700">
                <ShieldCheck size={15} />
                Admin
              </Link>
            </div>

            <button type="button" onClick={() => setMobileOpen((current) => !current)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#10231a] lg:hidden">
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mx-auto mt-3 max-w-[1680px] rounded-[28px] border border-black/5 bg-white/96 px-4 py-5 shadow-2xl backdrop-blur-2xl lg:hidden">
            <nav className="grid gap-2 font-bold">
              {navLinks.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-2xl px-5 py-4 transition ${isActive ? "bg-emerald-50 text-[#0f7a3b]" : "text-slate-600 hover:bg-slate-50"}`}>
                  {item.label}
                </NavLink>
              ))}
              <Link to="/agendamento" onClick={() => setMobileOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-5 py-4 font-black text-white transition hover:bg-[#0b6631]">
                <CalendarDays size={18} />
                Agendar atendimento
              </Link>
              <Link to="/cliente-login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-black text-[#10231a] transition hover:border-emerald-700">
                <User size={18} />
                Área do Cliente
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-black text-[#10231a] transition hover:border-emerald-700">
                <ShieldCheck size={18} />
                Área Admin
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-[92px]">{children}</main>

      <Link to="/agendamento" className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#0f7a3b] text-white shadow-2xl shadow-emerald-900/25 transition hover:scale-105 hover:bg-[#0b6631]" aria-label="Agendar atendimento">
        <CalendarDays size={30} />
      </Link>

      <footer className="relative overflow-hidden bg-[#10231a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(15,122,59,.28),transparent_30%),radial-gradient(circle_at_88%_80%,rgba(245,214,107,.18),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-[1680px] gap-10 px-6 py-14 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo small />
              <div>
                <h2 className="text-2xl font-black">SPA do Doguinho</h2>
                <p className="text-xs text-emerald-100">Banho, tosa e veterinária</p>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-white/65">
              Banho, tosa, estética animal, vacinação e bem-estar com carinho, segurança e experiência premium.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20"><Instagram size={20} /></a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20"><Facebook size={20} /></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f7a3b] transition hover:bg-[#0b6631]"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-black">Navegação</h3>
            <div className="grid gap-3 font-semibold text-white/65">
              {navLinks.map((item) => <Link key={item.to} to={item.to} className="transition hover:text-emerald-100">{item.label}</Link>)}
              <Link to="/cliente-login" className="transition hover:text-emerald-100">Área do Cliente</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-black">Contato</h3>
            <div className="grid gap-4 text-white/70">
              <p className="flex items-start gap-3"><Phone size={18} className="mt-1 text-emerald-200" /> +55 18 99749-3722</p>
              <p className="flex items-start gap-3"><Mail size={18} className="mt-1 text-emerald-200" /> contato@spadodoguinho.com.br</p>
              <p className="flex items-start gap-3"><MapPin size={18} className="mt-1 text-emerald-200" /> Rua Marco Antonio M.J Franco Nº 606 - Sud Mennucci/SP</p>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-black">Diferenciais</h3>
            <div className="grid gap-3">
              {[[ShieldCheck, "Ambiente seguro"], [Sparkles, "Estética premium"], [Heart, "Cuidado com amor"], [CalendarDays, "Agendamento fácil"]].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-bold text-white/80">
                  <Icon className="text-emerald-200" size={20} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative border-t border-white/10">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-6 py-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
            <div>© 2026 SPA do Doguinho. Todos os direitos reservados.</div>
            <div>Desenvolvido com carinho para uma gestão pet moderna.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
