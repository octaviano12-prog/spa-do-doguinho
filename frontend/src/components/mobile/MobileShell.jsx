import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, House, PawPrint, UserRound } from "lucide-react";

export default function MobileShell({ children, title, backTo = "/mobile", hideNav = false }) {
  return (
    <main className="min-h-screen bg-[#fffdf7] pb-24 text-[#12382f]">
      <header className="sticky top-0 z-40 border-b border-[#e2eadf] bg-[#fffdf7]/95 backdrop-blur">
        <div className="flex h-[68px] items-center justify-between px-5">
          {title ? (
            <>
              <Link to={backTo} aria-label="Voltar" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-[#e2eadf]">
                <ArrowLeft size={21} />
              </Link>
              <strong className="text-base font-black">{title}</strong>
            </>
          ) : (
            <Link to="/mobile" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f4ed] text-[#0d6b54]">
                <PawPrint size={25} />
              </span>
              <strong className="text-lg font-black">SPA do Doguinho</strong>
            </Link>
          )}
          <Link to="/mobile/conta" aria-label="Minha conta" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0d6b54] ring-1 ring-[#e2eadf]">
            <UserRound size={21} />
          </Link>
        </div>
      </header>
      {children}
      {!hideNav && (
        <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-[#e2eadf] bg-white pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
          <NavItem to="/mobile" icon={House} text="Início" />
          <NavItem to="/mobile/agendar" icon={CalendarDays} text="Agendar" />
          <NavItem to="/mobile/conta" icon={UserRound} text="Conta" />
        </nav>
      )}
    </main>
  );
}

function NavItem({ to, icon: Icon, text }) {
  return (
    <Link to={to} className="flex min-h-[56px] flex-col items-center justify-center gap-1 text-xs font-black text-[#0d6b54]">
      <Icon size={22} />
      {text}
    </Link>
  );
}
