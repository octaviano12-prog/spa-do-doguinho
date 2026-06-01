import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, CalendarPlus, ChevronLeft, Home, LogOut, PawPrint, UserRound } from "lucide-react";

const primaryColor = "#0d6b54";

export default function MobileShell({
  children,
  title,
  backTo = "/mobile",
  hideNav = false,
  showBack,
  active = "home"
}) {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("spa_customer_token"));
  const shouldShowBack = showBack ?? Boolean(title);

  function logout() {
    localStorage.removeItem("spa_customer_token");
    localStorage.removeItem("spa_customer");
    navigate("/mobile/login", { replace: true });
  }

  function goBack() {
    if (backTo) navigate(backTo);
    else navigate(-1);
  }

  return (
    <main className="min-h-[100dvh] w-full overflow-x-hidden bg-[#eef2f5] pb-28 text-[#183153]">
      <header className="sticky top-0 z-50 w-full px-3 pt-3">
        <div className="flex items-center justify-between rounded-[28px] border border-black/5 bg-white/95 px-3 py-3 shadow-lg backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-3">
            {shouldShowBack ? (
              <button
                type="button"
                onClick={goBack}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-[#183153] transition active:scale-95"
                aria-label="Voltar"
              >
                <ChevronLeft size={25} />
              </button>
            ) : (
              <Link
                to="/mobile"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                style={{ backgroundColor: primaryColor }}
                aria-label="Inicio"
              >
                <PawPrint size={25} />
              </Link>
            )}

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">SPA do Doguinho</p>
              <h1 className="max-w-[230px] truncate text-lg font-black leading-tight text-[#183153]">
                {title || "Mobile"}
              </h1>
            </div>
          </div>

          {isLoggedIn ? (
            <button
              type="button"
              onClick={logout}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition active:scale-95"
              aria-label="Sair"
            >
              <LogOut size={20} />
            </button>
          ) : (
            <Link
              to="/mobile/login"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-[#0d6b54] ring-1 ring-slate-100"
              aria-label="Entrar"
            >
              <UserRound size={20} />
            </Link>
          )}
        </div>
      </header>

      {children}

      {!hideNav && <MobileBottomNav active={active} />}
    </main>
  );
}

function MobileBottomNav({ active }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 gap-1 rounded-[30px] border border-black/5 bg-white/95 px-3 py-3 shadow-2xl backdrop-blur-xl">
        <NavItem to="/mobile/conta" icon={Home} text="Inicio" active={active === "home"} />
        <NavItem to="/mobile/agendamentos" icon={CalendarDays} text="Agenda" active={active === "agenda"} />
        <Link to="/mobile/agendar" className="flex flex-col items-center gap-1">
          <div
            className="-mt-7 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white text-white shadow-xl transition active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <CalendarPlus size={24} />
          </div>
          <span className={`text-xs font-bold ${active === "novo" ? "text-green-700" : "text-slate-400"}`}>Novo</span>
        </Link>
        <NavItem to="/mobile/pets" icon={PawPrint} text="Pets" active={active === "pets"} />
        <NavItem to="/mobile/perfil" icon={UserRound} text="Perfil" active={active === "perfil"} />
      </div>
    </nav>
  );
}

function NavItem({ to, icon: Icon, text, active }) {
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 font-bold transition ${active ? "text-green-700" : "text-slate-400"}`}>
      <Icon size={24} />
      <span className="text-xs">{text}</span>
    </Link>
  );
}
