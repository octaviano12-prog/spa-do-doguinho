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

const logoMark = "data:image/webp;base64,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";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/quem-somos", label: "Quem Somos", icon: User },
  { to: "/servicos", label: "Serviços", icon: Sparkles },
  { to: "/agendamento", label: "Agendamentos", icon: CalendarDays },
  { to: "/galeria", label: "Galeria", icon: PawPrint },
  { to: "/contato", label: "Contato", icon: Phone }
];

const whatsappUrl = "https://wa.me/5518997493722?text=Olá! Gostaria de agendar um atendimento no SPA do Doguinho.";

function LogoImage({ small = false }) {
  return <img src={logoMark} alt="Logo SPA do Doguinho" className={`${small ? "w-11 h-11" : "w-14 h-14 xl:w-16 xl:h-16"} object-cover rounded-[20px] bg-white shadow-[0_0_26px_rgba(45,212,191,.28)] border border-emerald-300/40`} />;
}

export default function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050f0b] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 xl:px-6 pt-3">
        <div className="max-w-[1760px] mx-auto rounded-[28px] border border-yellow-400/20 bg-[#03160d]/82 shadow-[0_18px_60px_rgba(0,0,0,.45)] backdrop-blur-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(34,197,94,.13),transparent_38%,rgba(245,158,11,.09))]" />
          <div className="relative min-h-[78px] px-3 sm:px-4 xl:px-5 2xl:px-6 flex items-center justify-between gap-3">
            <Link to="/" className="group flex items-center gap-3 min-w-0 shrink-0 w-[235px] xl:w-[255px] 2xl:w-[290px]" onClick={() => setMobileOpen(false)}>
              <LogoImage />
              <div className="min-w-0">
                <h1 className="text-[21px] xl:text-[25px] 2xl:text-[28px] font-black leading-[.9] tracking-tight text-white break-normal">SPA DO<br />DOGUINHO</h1>
                <p className="text-[10px] xl:text-[11px] text-yellow-300 mt-1.5 font-black whitespace-nowrap">Banho, tosa e clínica veterinária</p>
              </div>
            </Link>

            <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 font-black text-[13px] 2xl:text-[14px] min-w-0">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} className={({ isActive }) => `relative px-3 2xl:px-4 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 ${isActive ? "text-white bg-white/7" : "text-white/75 hover:text-white hover:bg-white/7"}`}>
                    {({ isActive }) => (<><Icon size={15} className={isActive ? "text-green-300" : "text-white/65"} /><span className="relative z-10">{item.label}</span>{isActive && <span className="absolute left-3 right-3 -bottom-[14px] h-[3px] rounded-full bg-green-400 shadow-[0_0_22px_rgba(74,222,128,.9)]" />}</>)}
                  </NavLink>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2 shrink-0 justify-end w-[365px] xl:w-[390px] 2xl:w-[450px]">
              <Link to="/agendamento" className="group bg-gradient-to-br from-green-500 to-emerald-700 hover:from-green-400 hover:to-emerald-600 px-4 2xl:px-5 py-3.5 rounded-2xl shadow-xl shadow-green-900/30 font-black flex items-center gap-2 transition border border-green-300/20 whitespace-nowrap"><CalendarDays size={18} /> Agendar <ChevronRight size={16} className="group-hover:translate-x-1 transition" /></Link>
              <Link to="/cliente-login" className="bg-[#07150f]/70 hover:bg-white/10 px-4 2xl:px-5 py-3.5 rounded-2xl border border-yellow-400/35 font-black flex items-center gap-2 transition text-yellow-50 whitespace-nowrap"><User size={18} /> Cliente</Link>
              <Link to="/login" className="bg-[#07150f]/70 hover:bg-white/10 px-4 2xl:px-5 py-3.5 rounded-2xl border border-yellow-400/35 font-black flex items-center gap-2 transition text-yellow-50 whitespace-nowrap"><ShieldCheck size={18} /> Admin</Link>
            </div>

            <button type="button" onClick={() => setMobileOpen((current) => !current)} className="lg:hidden w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-yellow-400/20 shrink-0 p-3">{mobileOpen ? <X /> : <Menu />}</button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden max-w-[1760px] mx-auto mt-3 rounded-[30px] border border-yellow-400/20 bg-[#03160d]/96 backdrop-blur-2xl px-4 py-5 shadow-2xl">
            <nav className="grid gap-2 font-bold">
              {navLinks.map((item) => (<NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `px-5 py-4 rounded-2xl transition ${isActive ? "bg-green-600 text-white" : "text-white/75 hover:bg-white/10"}`}>{item.label}</NavLink>))}
              <Link to="/agendamento" onClick={() => setMobileOpen(false)} className="mt-2 bg-green-600 hover:bg-green-700 px-5 py-4 rounded-2xl shadow-lg font-black flex items-center justify-center gap-2 transition"><CalendarDays size={18} /> Agendar atendimento</Link>
              <Link to="/cliente-login" onClick={() => setMobileOpen(false)} className="bg-white/10 hover:bg-white/20 px-5 py-4 rounded-2xl border border-yellow-400/20 font-black flex items-center justify-center gap-2 transition"><User size={18} /> Área do Cliente</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="bg-white/10 hover:bg-white/20 px-5 py-4 rounded-2xl border border-yellow-400/20 font-black flex items-center justify-center gap-2 transition"><ShieldCheck size={18} /> Área Admin</Link>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-[108px]">{children}</main>
      <Link to="/agendamento" className="fixed right-5 bottom-5 z-50 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl shadow-green-900/40 transition hover:scale-105" aria-label="Agendar atendimento"><CalendarDays size={30} /></Link>

      <footer className="border-t border-white/10 bg-[#06140f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e22,transparent_30%),radial-gradient(circle_at_85%_80%,#f59e0b22,transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1"><div className="flex items-center gap-3"><LogoImage small /><div><h2 className="text-2xl font-black">SPA DO DOGUINHO</h2><p className="text-xs text-green-200">Banho, tosa e clínica veterinária</p></div></div><p className="text-white/60 mt-5 leading-relaxed">Banho, tosa, estética animal, vacinação e bem-estar com carinho, segurança e experiência premium.</p><div className="flex gap-3 mt-6"><a href="#" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Instagram size={20} /></a><a href="#" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Facebook size={20} /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-green-500 hover:bg-green-600 flex items-center justify-center transition"><MessageCircle size={20} /></a></div></div>
          <div><h3 className="font-black text-lg mb-5">Navegação</h3><div className="grid gap-3 text-white/65 font-semibold">{navLinks.map((item) => <Link key={item.to} to={item.to} className="hover:text-green-200 transition">{item.label}</Link>)}<Link to="/cliente-login" className="hover:text-green-200 transition">Área do Cliente</Link></div></div>
          <div><h3 className="font-black text-lg mb-5">Contato</h3><div className="grid gap-4 text-white/70"><p className="flex items-start gap-3"><Phone size={18} className="text-green-300 mt-1" /> +55 18 99749-3722</p><p className="flex items-start gap-3"><Mail size={18} className="text-green-300 mt-1" /> contato@spadodoguinho.com.br</p><p className="flex items-start gap-3"><MapPin size={18} className="text-green-300 mt-1" /> Rua Marco Antonio M.J Franco Nº 606 - Sud Mennucci/SP</p></div></div>
          <div><h3 className="font-black text-lg mb-5">Diferenciais</h3><div className="grid gap-3">{[[ShieldCheck, "Ambiente seguro"], [Sparkles, "Estética premium"], [Heart, "Cuidado com amor"], [CalendarDays, "Agendamento fácil"]].map(([Icon, text]) => <div key={text} className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 text-white/80 font-bold"><Icon className="text-green-300" size={20} />{text}</div>)}</div></div>
        </div>
        <div className="relative border-t border-white/10"><div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-white/45 text-sm"><div>© 2026 SPA do Doguinho. Todos os direitos reservados.</div><div>Desenvolvido com carinho para uma gestão pet moderna.</div></div></div>
      </footer>
    </div>
  );
}
