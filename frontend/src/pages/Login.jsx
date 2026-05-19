import { Dog } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@spadodoguinho.com.br");
  const [password, setPassword] = useState("admin123456");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate("/");
  }

  return (
    <div className="loginPage">
      <form className="loginCard" onSubmit={submit}>
        <div className="brand center">
          <div className="brandIcon"><Dog /></div>
          <div>
            <strong>SPA do Doguinho</strong>
            <small>Sistema administrativo</small>
          </div>
        </div>

        <h1>Entrar no painel</h1>
        <p>Controle agenda, clientes, pets, financeiro e estoque.</p>

        <label><span>Email</span><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label><span>Senha</span><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="btn gold fullBtn" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  );
}
