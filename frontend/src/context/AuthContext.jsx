import React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("spa_user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("spa_token"));
  const [loading, setLoading] = useState(false);

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await client.post("/auth/login", { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("spa_user", JSON.stringify(data.user));
      localStorage.setItem("spa_token", data.token);
      toast.success("Login realizado");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erro ao entrar");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("spa_user");
    localStorage.removeItem("spa_token");
    toast.success("Sessão encerrada");
  }

  const value = useMemo(() => ({ user, token, login, logout, loading }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
