import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, Menu, Instagram, Phone } from "lucide-react";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050f0b] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#06140f]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center shadow-xl">
              <PawPrint />
            </div>
            <div>
              <h1 className="text-2xl font-black">SPA DO DOGUINHO</h1>
              <p className="text-xs text-green-200">Cuidado premium pet</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-semibold">
            <Link to="/">Home</Link>
            <Link to="/servicos">Serviços</Link>
            <Link to="/galeria">Galeria</Link>
            <Link to="/contato">Contato</Link>
            <Link to="/login" className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-2xl shadow-lg">
              Área Admin
            </Link>
          </nav>

          <Menu className="md:hidden" />
        </div>
      </header>

      <main className="pt-20">{children}</main>

      <footer className="border-t border-white/10 bg-[#06140f]">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-black">SPA DO DOGUINHO</h2>
            <p className="text-white/60 mt-2">Banho, tosa e cuidado especial para seu pet.</p>
          </div>

          <div>
            <h3 className="font-black mb-3">Contato</h3>
            <p className="flex items-center gap-2 text-white/70"><Phone size={16} /> WhatsApp</p>
            <p className="flex items-center gap-2 text-white/70 mt-2"><Instagram size={16} /> Instagram</p>
          </div>

          <div className="text-white/50 md:text-right">
            © 2026 SPA do Doguinho
          </div>
        </div>
      </footer>
    </div>
  );
}
