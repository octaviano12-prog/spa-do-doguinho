import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import client from "../api/client";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("spa_user") || "null");
  } catch {
    localStorage.removeItem("spa_user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem("spa_token"));
  const [loading, setLoading] = useState(false);

  function persistSession(nextUser, nextToken) {
    setUser(nextUser);
    setToken(nextToken);

    if (nextUser) {
      localStorage.setItem("spa_user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("spa_user");
    }

    if (nextToken) {
      localStorage.setItem("spa_token", nextToken);
    } else {
      localStorage.removeItem("spa_token");
    }
  }

  async function login(email, password) {
    setLoading(true);

    try {
      const { data } = await client.post("/auth/login", {
        email,
        password,
      });

      persistSession(data.user, data.token);

      toast.success("Login realizado com sucesso");

      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Erro ao entrar"
      );

      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    persistSession(null, null);

    toast.success("Sessão encerrada");
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
