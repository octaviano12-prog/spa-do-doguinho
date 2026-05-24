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
  const size = small ? "w-11 h-11" : "w-[54px] h-[54px]";

  return (
    <div
      className={`${size} relative flex shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-white/70 bg-gradient-to-br from-[#f7ffe9] via-[#d8fff0] to-[#0d8b67] shadow-[0_14px_35px_rgba(13,139,103,.22)]`}
    >
      <div className="absolute inset-[5px] rounded-[15px] bg-white/90" />
      <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-[#f4c86a]/60 blur-md" />
      <PawPrint size={small ? 22 : 26} className="relative text-[#07351f]" />
    </div>
  );
}

export default function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#edf6ed] text-[#102d27]">
      <header className="fixed left-0 right-0 top-0 z-50 px-3 py-3 md:px-6">
        <div className="mx-auto max-w-[1760px] overflow-hidden rounded-[26px] border border-white/55 bg-white/66 shadow-[0_18px_45px_rgba(16,45,39,.10)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(25,83,78,.08),transparent_42%,rgba(244,200,106,.20))]" />

          <div className="relative flex min-h-[66px] items-center justify-between gap-3 px-4 2xl:px-6">
            <Link
              to="/"
              className="group flex w-[238px] min-w-0 shrink-0 items-center gap-3 xl:w-[252px] 2xl:w-[282px]"
              onClick={() => setMobileOpen(false)}
            >
              <BrandLogo />

              <div className="min-w-0 leading-none">
                <div className="flex items-center gap-1">
                  <span className="text-[20px] font-black tracking-tight text-[#102d27] 2xl:text-[24px]">SPA</span>
                  <span className="text-[15px] font-black text-[#0d8b67] 2xl:text-[17px]">do</span>
                </div>

                <div className="text-[23px] font-black leading-[.82] tracking-tight text-[#102d27] 2xl:text-[27px]">
                  Doguinho
                </div>

                <div className="mt-2 whitespace-nowrap text-[9px] font-black uppercase tracking-[.12em] text-[#0d8b67] 2xl:text-[10px]">
                  Banho • Tosa • Spa Pet
                </div>
              </div>
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
              <div className="flex items-center gap-1 rounded-[22px] border border-[#b7d7c2]/75 bg-white/62 px-2 py-1.5 shadow-inner backdrop-blur">
                {navLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `relative flex items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-2.5 text-[12px] font-black transition 2xl:px-4 2xl:text-[13px] ${
                          isActive
                            ? "bg-[#19534e] text-white shadow-lg shadow-emerald-900/10"
                            : "text-slate-600 hover:bg-[#edf6ed] hover:text-[#19534e]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon size={14} className={isActive ? "text-[#f4c86a]" : "text-slate-400"} />
                          <span>{item.label}</span>
                          {isActive && (
                            <span className="absolute -bottom-1 left-5 right-5 h-[3px] rounded-full bg-[#f4c86a]" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            <div className="hidden w-[318px] shrink-0 items-center justify-end gap-2 lg:flex xl:w-[332px] 2xl:w-[370px]">
              <Link
                to="/agendamento"
                className="flex items-center gap-2 whitespace-nowrap rounded-2xl border border-[#0d8b67]/20 bg-[#19534e] px-4 py-3 text-[13px] font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#123f3b]"
              >
                <CalendarDays size={16} /> Agendar
              </Link>

              <Link
                to="/cliente-login"
                className="flex items-center gap-2 whitespace-nowrap rounded-2xl border border-[#b7d7c2]/80 bg-white/75 px-4 py-3 text-[13px] font-black text-[#102d27] shadow-sm transition hover:-translate-y-0.5 hover:border-[#19534e] hover:bg-white"
              >
                <User size={16} /> Cliente
              </Link>

              <Link
                to="/login"
                className="flex items-center gap-2 whitespace-nowrap rounded-2xl border border-[#b7d7c2]/80 bg-white/75 px-4 py-3 text-[13px] font-black text-[#102d27] shadow-sm transition hover:-translate-y-0.5 hover:border-[#19534e] hover:bg-white"
              >
                <ShieldCheck size={16} /> Admin
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#b7d7c2]/80 bg-white/80 p-3 text-[#102d27] shadow-sm lg:hidden"
              aria-label="Abrir menu"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mx-auto mt-3 max-w-[1760px] rounded-[30px] border border-white/70 bg-white/92 px-4 py-5 text-[#102d27] shadow-2xl backdrop-blur-2xl lg:hidden">
            <nav className="grid gap-2 font-bold">
              {navLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-5 py-4 transition ${
                        isActive ? "bg-[#19534e] text-white" : "text-slate-700 hover:bg-[#edf6ed]"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}

              <Link
                to="/agendamento"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#19534e] px-5 py-4 font-black text-white shadow-lg transition hover:bg-[#123f3b]"
              >
                <CalendarDays size={18} /> Agendar atendimento
              </Link>

              <Link
                to="/cliente-login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#b7d7c2]/80 bg-[#edf6ed] px-5 py-4 font-black text-[#19534e] transition hover:bg-white"
              >
                <User size={18} /> Área do Cliente
              </Link>

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#b7d7c2]/80 bg-[#edf6ed] px-5 py-4 font-black text-[#19534e] transition hover:bg-white"
              >
                <ShieldCheck size={18} /> Área Admin
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-[92px]">{children}</main>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-black text-white shadow-xl shadow-emerald-900/20 transition hover:scale-105 md:flex"
        >
          <MessageCircle size={19} /> WhatsApp
        </a>

        <Link
          to="/agendamento"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#19534e] text-white shadow-xl shadow-emerald-900/25 ring-4 ring-white/70 transition hover:scale-105 hover:bg-[#123f3b] md:h-16 md:w-16"
          aria-label="Agendar atendimento"
        >
          <CalendarDays size={26} />
        </Link>
      </div>

      <footer className="relative overflow-hidden border-t border-emerald-900/10 bg-[#071b12] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,.16),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(245,158,11,.14),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo small />
              <div>
                <h2 className="text-2xl font-black">SPA do Doguinho</h2>
                <p className="text-xs text-emerald-200">Banho, tosa e spa pet</p>
              </div>
            </div>

            <p className="mt-5 leading-relaxed text-white/62">
              Banho, tosa, estética animal, vacinação e bem-estar com carinho,
              segurança, tecnologia e experiência premium.
            </p>

            <div className="mt-6 flex gap-3">
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 transition hover:bg-white/15" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 transition hover:bg-white/15" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 transition hover:bg-emerald-700" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-black">Navegação</h3>
            <div className="grid gap-3 font-semibold text-white/65">
              {navLinks.map((item) => (
                <Link key={item.to} to={item.to} className="transition hover:text-emerald-200">
                  {item.label}
                </Link>
              ))}
              <Link to="/cliente-login" className="transition hover:text-emerald-200">
                Área do Cliente
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-black">Contato</h3>
            <div className="grid gap-4 text-white/70">
              <p className="flex items-start gap-3">
                <Phone size={18} className="mt-1 text-emerald-300" /> +55 18 99749-3722
              </p>
              <p className="flex items-start gap-3">
                <Mail size={18} className="mt-1 text-emerald-300" /> contato@spadodoguinho.com.br
              </p>
              <p className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-emerald-300" /> Rua Marco Antonio M.J Franco Nº 606 - Sud Mennucci/SP
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-black">Diferenciais</h3>
            <div className="grid gap-3">
              {[
                [ShieldCheck, "Ambiente seguro"],
                [Sparkles, "Estética premium"],
                [Heart, "Cuidado com amor"],
                [CalendarDays, "Agendamento fácil"]
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4 font-bold text-white/82">
                  <Icon className="text-emerald-300" size={20} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
            <div>© 2026 SPA do Doguinho. Todos os direitos reservados.</div>
            <div>Desenvolvido com carinho para uma gestão pet moderna.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
