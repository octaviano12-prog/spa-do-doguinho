import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  LogOut,
  Menu,
  Search,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <motion.header
      className="topbar premiumTopbar"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="topbarLeft">
        <button
          className="iconBtn mobileOnly"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <div className="topbarTitle">
          <h2>Gestão SPA do Doguinho</h2>

          <p>
            Clientes, pets, agenda,
            financeiro e estoque
          </p>
        </div>
      </div>

      <div className="topbarCenter desktopOnly">
        <div className="searchHeader">
          <Search size={16} />

          <input
            type="text"
            placeholder="Pesquisar no painel..."
          />
        </div>
      </div>

      <div className="topbarActions">
        <button className="iconBtn notificationBtn">
          <Bell size={18} />
          <span className="notifDot" />
        </button>

        <div className="userBadge">
          <div className="avatar">
            {(user?.name || "A")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="userInfo desktopOnly">
            <strong>
              {user?.name || "Administrador"}
            </strong>

            <span>Administrador</span>
          </div>
        </div>

        <button
          className="btn ghost"
          onClick={logout}
        >
          <LogOut size={16} />
          <span className="desktopOnly">
            Sair
          </span>
        </button>
      </div>
    </motion.header>
  );
}
