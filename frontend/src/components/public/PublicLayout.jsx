import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
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

export default function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050f0b] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 xl:px-6 pt-3">
        <div className="max-w-[1760px] mx-auto rounded-[28px] border border-yellow-400/20 bg-[#03160d]/82 shadow-[0_18px_60px_rgba(0,0,0,.45)] backdrop-blur-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(34,197,94,.13),transparent_38%,rgba(245,158,11,.09))]" />
          <div className="relative min-h-[78px] px-3 sm:px-4 xl:px-5 2xl:px-6 flex items-center justify-between gap-3">
            <Link to="/" className="group flex items-center gap-3 min-w-0 shrink-0 w-[230px] xl:w-[250px] 2xl:w-[285px]" onClick={() => setMobileOpen(false)}>
              <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-[22px] bg-gradient-to-br from-yellow-300/35 via-green-700 to-emerald-950 border border-yellow-300/35 flex items-center justify-center shadow-[0_0_32px_rgba(234,179,8,.20)] shrink-0 group-hover:scale-105 transition">
                <PawPrint className="text-yellow-100" size={31} />
              </div>
              <div className="min-w-0">
                <h1 className="text-[21px] xl:text-[25px] 2xl:text-[28px] font-black leading-[.9] tracking-tight text-white break-normal">SPA DO<br />DOGUINHO</h1>
                <p className="text-[10px] xl:text-[11px] text-yellow-300 mt-1.5 font-black whitespace-nowrap">Estética animal premium</p>
              </div>
            </Link>

            <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 font-black text-[13px] 2xl:text-[14px] min-w-0">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative px-3 2xl:px-4 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 ${
                        isActive ? "text-white bg-white/7" : "text-white/75 hover:text-white hover:bg-white/7"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={15} className={isActive ? "text-green-300" : "text-white/65"} />
                        <span className="relative z-10">{item.label}</span>
                        {isActive && <span className="absolute left-3 right-3 -bottom-[14px] h-[3px] rounded-full bg-green-400 shadow-[0_0_22px_rgba(74,222,128,.9)]" />}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2 shrink-0 justify-end w-[365px] xl:w-[390px] 2xl:w-[450px]">
              <Link to="/agendamento" className="group bg-gradient-to-br from-green-500 to-emerald-700 hover:from-green-400 hover:to-emerald-600 px-4 2xl:px-5 py-3.5 rounded-2xl shadow-xl shadow-green-900/30 font-black flex items-center gap-2 transition border border-green-300/20 whitespace-nowrap">
                <CalendarDays size={18} /> Agendar <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/cliente-login" className="bg-[#07150f]/70 hover:bg-white/10 px-4 2xl:px-5 py-3.5 rounded-2xl border border-yellow-400/35 font-black flex items-center gap-2 transition text-yellow-50 whitespace-nowrap">
                <User size={18} /> Cliente
              </Link>
              <Link to="/login" className="bg-[#07150f]/70 hover:bg-white/10 px-4 2xl:px-5 py-3.5 rounded-2xl border border-yellow-400/35 font-black flex items-center gap-2 transition text-yellow-50 whitespace-nowrap">
                <ShieldCheck size={18} /> Admin
              </Link>
            </div>

            <button type="button" onClick={() => setMobileOpen((current) => !current)} className="lg:hidden w-13 h-13 rounded-2xl bg-white/10 flex items-center justify-center border border-yellow-400/20 shrink-0 p-3">
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden max-w-[1760px] mx-auto mt-3 rounded-[30px] border border-yellow-400/20 bg-[#03160d]/96 backdrop-blur-2xl px-4 py-5 shadow-2xl">
            <nav className="grid gap-2 font-bold">
              {navLinks.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `px-5 py-4 rounded-2xl transition ${isActive ? "bg-green-600 text-white" : "text-white/75 hover:bg-white/10"}`}>
                  {item.label}
                </NavLink>
              ))}
              <Link to="/agendamento" onClick={() => setMobileOpen(false)} className="mt-2 bg-green-600 hover:bg-green-700 px-5 py-4 rounded-2xl shadow-lg font-black flex items-center justify-center gap-2 transition"><CalendarDays size={18} /> Agendar atendimento</Link>
              <Link to="/cliente-login" onClick={() => setMobileOpen(false)} className="bg-white/10 hover:bg-white/20 px-5 py-4 rounded-2xl border border-yellow-400/20 font-black flex items-center justify-center gap-2 transition"><User size={18} /> Área do Cliente</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="bg-white/10 hover:bg-white/20 px-5 py-4 rounded-2xl border border-yellow-400/20 font-black flex items-center justify-center gap-2 transition"><ShieldCheck size={18} /> Área Admin</Link>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-[108px]">{children}</main>

      <Link to="/agendamento" className="fixed right-5 bottom-5 z-50 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl shadow-green-900/40 transition hover:scale-105" aria-label="Agendar atendimento">
        <CalendarDays size={30} />
      </Link>

      <footer className="border-t border-white/10 bg-[#06140f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e22,transparent_30%),radial-gradient(circle_at_85%_80%,#f59e0b22,transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center shadow-xl"><PawPrint /></div><div><h2 className="text-2xl font-black">SPA DO DOGUINHO</h2><p className="text-xs text-green-200">Cuidado premium pet</p></div></div><p className="text-white/60 mt-5 leading-relaxed">Banho, tosa, estética animal, vacinação e bem-estar com carinho, segurança e experiência premium.</p><div className="flex gap-3 mt-6"><a href="#" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Instagram size={20} /></a><a href="#" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Facebook size={20} /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-green-500 hover:bg-green-600 flex items-center justify-center transition"><MessageCircle size={20} /></a></div></div>
          <div><h3 className="font-black text-lg mb-5">Navegação</h3><div className="grid gap-3 text-white/65 font-semibold">{navLinks.map((item) => <Link key={item.to} to={item.to} className="hover:text-green-200 transition">{item.label}</Link>)}<Link to="/cliente-login" className="hover:text-green-200 transition">Área do Cliente</Link></div></div>
          <div><h3 className="font-black text-lg mb-5">Contato</h3><div className="grid gap-4 text-white/70"><p className="flex items-start gap-3"><Phone size={18} className="text-green-300 mt-1" /> +55 18 99749-3722</p><p className="flex items-start gap-3"><Mail size={18} className="text-green-300 mt-1" /> contato@spadodoguinho.com.br</p><p className="flex items-start gap-3"><MapPin size={18} className="text-green-300 mt-1" /> Rua Marco Antonio M.J Franco Nº 606 - Sud Mennucci/SP</p></div></div>
          <div><h3 className="font-black text-lg mb-5">Diferenciais</h3><div className="grid gap-3">{[[ShieldCheck, "Ambiente seguro"], [Sparkles, "Estética premium"], [Heart, "Cuidado com amor"], [CalendarDays, "Agendamento fácil"]].map(([Icon, text]) => <div key={text} className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 text-white/80 font-bold"><Icon className="text-green-300" size={20} />{text}</div>)}</div></div>
        </div>
        <div className="relative border-t border-white/10"><div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-white/45 text-sm"><div>© 2026 SPA do Doguinho. Todos os direitos reservados.</div><div>Desenvolvido com carinho para uma gestão pet moderna.</div></div></div>
      </footer>
    </div>
  );
}
