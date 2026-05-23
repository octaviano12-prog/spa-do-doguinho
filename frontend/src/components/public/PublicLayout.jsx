import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CalendarDays,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PawPrint,
  Phone,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/quem-somos", label: "Quem Somos" },
  { to: "/servicos", label: "Serviços" },
  { to: "/galeria", label: "Galeria" },
  { to: "/contato", label: "Contato" }
];

const whatsappUrl = "https://wa.me/5518997493722?text=Olá! Gostaria de agendar um atendimento no SPA do Doguinho.";

export default function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050f0b] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#06140f]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center shadow-xl shadow-green-900/30">
              <PawPrint />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black leading-none">SPA DO DOGUINHO</h1>
              <p className="text-xs text-green-200 mt-1">Estética animal premium</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 font-bold">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl transition ${
                    isActive ? "bg-white/15 text-green-200" : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-2xl shadow-lg font-black flex items-center gap-2 transition"
            >
              <MessageCircle size={18} />
              Agendar
            </a>

            <Link
              to="/login"
              className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl border border-white/10 font-black transition"
            >
              Área Admin
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="lg:hidden w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#06140f] px-6 py-5">
            <nav className="grid gap-2 font-bold">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-5 py-4 rounded-2xl transition ${
                      isActive ? "bg-white/15 text-green-200" : "text-white/75 hover:bg-white/10"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 bg-green-500 hover:bg-green-600 px-5 py-4 rounded-2xl shadow-lg font-black flex items-center justify-center gap-2 transition"
              >
                <MessageCircle size={18} />
                Agendar pelo WhatsApp
              </a>

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="bg-white/10 hover:bg-white/20 px-5 py-4 rounded-2xl border border-white/10 font-black text-center transition"
              >
                Área Admin
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-20">{children}</main>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed right-5 bottom-5 z-50 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl shadow-green-900/40 transition hover:scale-105"
        aria-label="Agendar pelo WhatsApp"
      >
        <MessageCircle size={30} />
      </a>

      <footer className="border-t border-white/10 bg-[#06140f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#22c55e22,transparent_30%),radial-gradient(circle_at_85%_80%,#f59e0b22,transparent_30%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center shadow-xl">
                <PawPrint />
              </div>
              <div>
                <h2 className="text-2xl font-black">SPA DO DOGUINHO</h2>
                <p className="text-xs text-green-200">Cuidado premium pet</p>
              </div>
            </div>

            <p className="text-white/60 mt-5 leading-relaxed">
              Banho, tosa, estética animal, vacinação e bem-estar com carinho, segurança e experiência premium.
            </p>

            <div className="flex gap-3 mt-6">
              <a href="#" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <Facebook size={20} />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-green-500 hover:bg-green-600 flex items-center justify-center transition">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-black text-lg mb-5">Navegação</h3>
            <div className="grid gap-3 text-white/65 font-semibold">
              {navLinks.map((item) => (
                <Link key={item.to} to={item.to} className="hover:text-green-200 transition">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-black text-lg mb-5">Contato</h3>
            <div className="grid gap-4 text-white/70">
              <p className="flex items-start gap-3"><Phone size={18} className="text-green-300 mt-1" /> +55 18 99749-3722</p>
              <p className="flex items-start gap-3"><Mail size={18} className="text-green-300 mt-1" /> contato@spadodoguinho.com.br</p>
              <p className="flex items-start gap-3"><MapPin size={18} className="text-green-300 mt-1" /> Rua Marco Antonio M.J Franco Nº 606 - Sud Mennucci/SP</p>
            </div>
          </div>

          <div>
            <h3 className="font-black text-lg mb-5">Diferenciais</h3>
            <div className="grid gap-3">
              {[
                [ShieldCheck, "Ambiente seguro"],
                [Sparkles, "Estética premium"],
                [Heart, "Cuidado com amor"],
                [CalendarDays, "Agendamento fácil"]
              ].map(([Icon, text]) => (
                <div key={text} className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 text-white/80 font-bold">
                  <Icon className="text-green-300" size={20} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-white/45 text-sm">
            <div>© 2026 SPA do Doguinho. Todos os direitos reservados.</div>
            <div>Desenvolvido com carinho para uma gestão pet moderna.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
