import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  return (
    <header className="topbar">
      <button className="iconBtn mobileOnly" onClick={onMenuClick}><Menu size={22} /></button>
      <div>
        <h2>Gestão SPA do Doguinho</h2>
        <p>Clientes, pets, agenda, financeiro e estoque</p>
      </div>
      <div className="topbarActions">
        <span className="pill">{user?.name || "Admin"}</span>
        <button className="btn ghost" onClick={logout}><LogOut size={16} /> Sair</button>
      </div>
    </header>
  );
}
