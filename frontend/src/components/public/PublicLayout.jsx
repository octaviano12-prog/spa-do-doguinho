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

function BrandLogo({ small = false }) {
  const size = small ? "w-12 h-12" : "w-[58px] h-[58px]";
  return (
    <div className={`${size} relative shrink-0 rounded-[22px] overflow-hidden bg-gradient-to-br from-[#effff9] via-[#cbfff0] to-[#18b38b] border border-teal-200/80 shadow-[0_0_24px_rgba(20,184,166,.30)] flex items-center justify-center`}>
      <div className="absolute inset-[5px] rounded-[18px] bg-white/86" />
      <div className="absolute top-2 text-[#071924]"><PawPrint size={small ? 21 : 25} /></div>
      <div className="absolute bottom-[9px] left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-teal-600" />
      <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-7 h-3.5 rounded-t-full bg-teal-200 border border-white" />
      <div className="absolute bottom-[18px] left-1/2 -translate-x-1/2 w-3.5 h-4 rounded-full bg-white shadow" />
    </div>
  );
}

export default function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050f0b] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 pt-3">
        <div className="max-w-[1680px] mx-auto rounded-[26px] border border-white/10 bg-[#03130d]/88 shadow-[0_18px_55px_rgba(0,0,0,.42)] backdrop-blur-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(34,197,94,.12),transparent_36%,rgba(234,179,8,.08))]" />
          <div className="relative min-h-[72px] px-4 2xl:px-5 flex items-center justify-between gap-3">
            <Link to="/" className="group flex items-center gap-3 min-w-0 shrink-0 w-[250px] xl:w-[260px] 2xl:w-[285px]" onClick={() => setMobileOpen(false)}>
              <BrandLogo />
              <div className="min-w-0 leading-none">
                <div className="flex items-center gap-1">
                  <span className="text-[22px] 2xl:text-[25px] font-black tracking-tight text-white">SPA</span>
                  <span className="text-[16px] 2xl:text-[18px] font-black text-teal-200">do</span>
                </div>
                <div className="text-[24px] 2xl:text-[28px] font-black tracking-tight text-white leading-[.82]">Doguinho</div>
                <div className="text-[10px] 2xl:text-[11px] text-yellow-300 mt-2 font-black whitespace-nowrap">Banho • Tosa • Veterinária</div>
              </div>
            </Link>

            <nav className="hidden xl:flex flex-1 items-center justify-center min-w-0">
              <div className="flex items-center gap-1 rounded-[22px] bg-black/18 border border-white/8 px-2 py-2 shadow-inner">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `relative px-3 2xl:px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 text-[13px] 2xl:text-[14px] font-black ${isActive ? "text-white bg-green-500/18" : "text-white/66 hover:text-white hover:bg-white/7"}`}>
                      {({ isActive }) => (<><Icon size={14} className={isActive ? "text-green-300" : "text-white/45"} /><span>{item.label}</span>{isActive && <span className="absolute left-4 right-4 -bottom-2 h-[2px] rounded-full bg-green-300 shadow-[0_0_18px_rgba(74,222,128,.95)]" />}</>)}
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            <div className="hidden lg:flex items-center gap-2 shrink-0 justify-end w-[345px] xl:w-[365px] 2xl:w-[410px]">
              <Link to="/agendamento" className="group bg-gradient-to-br from-green-500 to-emerald-700 hover:from-green-400 hover:to-emerald-600 px-4 2xl:px-5 py-3 rounded-2xl shadow-xl shadow-green-900/30 font-black flex items-center gap-2 transition border border-green-300/20 whitespace-nowrap text-sm 2xl:text-base"><CalendarDays size={17} /> Agendar <ChevronRight size={15} className="group-hover:translate-x-1 transition" /></Link>
              <Link to="/cliente-login" className="bg-black/18 hover:bg-white/10 px-4 py-3 rounded-2xl border border-yellow-400/25 font-black flex items-center gap-2 transition text-yellow-50 whitespace-nowrap text-sm 2xl:text-base"><User size={17} /> Cliente</Link>
              <Link to="/login" className="bg-black/18 hover:bg-white/10 px-4 py-3 rounded-2xl border border-yellow-400/25 font-black flex items-center gap-2 transition text-yellow-50 whitespace-nowrap text-sm 2xl:text-base"><ShieldCheck size={17} /> Admin</Link>
            </div>

            <button type="button" onClick={() => setMobileOpen((current) => !current)} className="lg:hidden w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-yellow-400/20 shrink-0 p-3">{mobileOpen ? <X /> : <Menu />}</button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden max-w-[1680px] mx-auto mt-3 rounded-[28px] border border-yellow-400/20 bg-[#03160d]/96 backdrop-blur-2xl px-4 py-5 shadow-2xl">
            <nav className="grid gap-2 font-bold">
              {navLinks.map((item) => (<NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `px-5 py-4 rounded-2xl transition ${isActive ? "bg-green-600 text-white" : "text-white/75 hover:bg-white/10"}`}>{item.label}</NavLink>))}
              <Link to="/agendamento" onClick={() => setMobileOpen(false)} className="mt-2 bg-green-600 hover:bg-green-700 px-5 py-4 rounded-2xl shadow-lg font-black flex items-center justify-center gap-2 transition"><CalendarDays size={18} /> Agendar atendimento</Link>
              <Link to="/cliente-login" onClick={() => setMobileOpen(false)} className="bg-white/10 hover:bg-white/20 px-5 py-4 rounded-2xl border border-yellow-400/20 font-black flex items-center justify-center gap-2 transition"><User size={18} /> Área do Cliente</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="bg-white/10 hover:bg-white/20 px-5 py-4 rounded-2xl border border-yellow-400/20 font-black flex items-center justify-center gap-2 transition"><ShieldCheck size={18} /> Área Admin</Link>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-[100px]">{children}</main>
      <Link to="/agendamento" className="fixed right-5 bottom-5 z-50 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl shadow-green-900/40 transition hover:scale-105" aria-label="Agendar atendimento"><CalendarDays size={30} /></Link>

      <footer className="border-t border-white/10 bg-[#06140f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e22,transparent_30%),radial-gradient(circle_at_85%_80%,#f59e0b22,transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1"><div className="flex items-center gap-3"><BrandLogo small /><div><h2 className="text-2xl font-black">SPA do Doguinho</h2><p className="text-xs text-green-200">Banho, tosa e veterinária</p></div></div><p className="text-white/60 mt-5 leading-relaxed">Banho, tosa, estética animal, vacinação e bem-estar com carinho, segurança e experiência premium.</p><div className="flex gap-3 mt-6"><a href="#" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Instagram size={20} /></a><a href="#" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Facebook size={20} /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-green-500 hover:bg-green-600 flex items-center justify-center transition"><MessageCircle size={20} /></a></div></div>
          <div><h3 className="font-black text-lg mb-5">Navegação</h3><div className="grid gap-3 text-white/65 font-semibold">{navLinks.map((item) => <Link key={item.to} to={item.to} className="hover:text-green-200 transition">{item.label}</Link>)}<Link to="/cliente-login" className="hover:text-green-200 transition">Área do Cliente</Link></div></div>
          <div><h3 className="font-black text-lg mb-5">Contato</h3><div className="grid gap-4 text-white/70"><p className="flex items-start gap-3"><Phone size={18} className="text-green-300 mt-1" /> +55 18 99749-3722</p><p className="flex items-start gap-3"><Mail size={18} className="text-green-300 mt-1" /> contato@spadodoguinho.com.br</p><p className="flex items-start gap-3"><MapPin size={18} className="text-green-300 mt-1" /> Rua Marco Antonio M.J Franco Nº 606 - Sud Mennucci/SP</p></div></div>
          <div><h3 className="font-black text-lg mb-5">Diferenciais</h3><div className="grid gap-3">{[[ShieldCheck, "Ambiente seguro"], [Sparkles, "Estética premium"], [Heart, "Cuidado com amor"], [CalendarDays, "Agendamento fácil"]].map(([Icon, text]) => <div key={text} className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 text-white/80 font-bold"><Icon className="text-green-300" size={20} />{text}</div>)}</div></div>
        </div>
        <div className="relative border-t border-white/10"><div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-white/45 text-sm"><div>© 2026 SPA do Doguinho. Todos os direitos reservados.</div><div>Desenvolvido com carinho para uma gestão pet moderna.</div></div></div>
      </footer>
    </div>
  );
}
