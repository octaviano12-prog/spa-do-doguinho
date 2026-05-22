import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, Menu } from "lucide-react";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-slate-950 text-white">
      <header className="w-full px-6 py-5 flex items-center justify-between bg-white/10 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center">
            <PawPrint />
          </div>

          <div>
            <h1 className="font-black text-2xl">SPA DOGUINHO</h1>
            <p className="text-xs text-white/70">Banho • Tosa • Pet Care</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-semibold">
          <Link to="/">Home</Link>
          <Link to="/servicos">Serviços</Link>
          <Link to="/galeria">Galeria</Link>
          <Link to="/contato">Contato</Link>
          <Link
            to="/login"
            className="bg-green-500 px-5 py-3 rounded-2xl shadow-lg"
          >
            Área Admin
          </Link>
        </nav>

        <Menu className="md:hidden" />
      </header>

      {children}

      <footer className="px-6 py-8 text-center text-white/60">
        SPA do Doguinho © 2026 — Todos os direitos reservados
      </footer>
    </div>
  );
}
