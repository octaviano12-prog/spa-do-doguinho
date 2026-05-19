import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dog,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState(
    "admin@spadodoguinho.com.br"
  );

  const [password, setPassword] = useState(
    "admin123456"
  );

  const { login, loading } = useAuth();

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    const ok = await login(email, password);

    if (ok) {
      navigate("/");
    }
  }

  return (
    <div className="loginPage premiumLoginPage">
      <div className="loginBgGlow glow1" />
      <div className="loginBgGlow glow2" />

      <motion.form
        className="loginCard premiumLoginCard"
        onSubmit={submit}
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="brand center">
          <div className="brandIcon premiumLogo">
            <Dog />
          </div>

          <div>
            <strong>
              SPA do Doguinho
            </strong>

            <small>
              Sistema administrativo premium
            </small>
          </div>
        </div>

        <div className="loginBadge">
          <ShieldCheck size={15} />
          Painel seguro
        </div>

        <h1>
          Entrar no painel
        </h1>

        <p>
          Controle clientes, pets,
          agendamentos, estoque,
          financeiro e galeria.
        </p>

        <label>
          <span>Email</span>

          <div className="inputIcon">
            <Mail size={17} />

            <input
              className="input"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Seu email"
            />
          </div>
        </label>

        <label>
          <span>Senha</span>

          <div className="inputIcon">
            <LockKeyhole size={17} />

            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Sua senha"
            />
          </div>
        </label>

        <button
          className="btn gold fullBtn premiumLoginBtn"
          disabled={loading}
        >
          {loading
            ? "Entrando..."
            : "Entrar no sistema"}
        </button>
      </motion.form>
    </div>
  );
}
