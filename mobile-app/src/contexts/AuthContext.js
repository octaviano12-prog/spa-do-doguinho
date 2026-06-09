import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, setAuthToken } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "spa_doguinho_auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data?.token) {
            setToken(data.token);
            setCustomer(data.customer || null);
            setAuthToken(data.token);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function persistSession(nextToken, nextCustomer) {
    setToken(nextToken);
    setCustomer(nextCustomer || null);
    setAuthToken(nextToken);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, customer: nextCustomer }));
  }

  async function login(email, password) {
    const { data } = await api.post("/auth/customer-login", { email, password });
    await persistSession(data.token, data.customer);
    return data;
  }

  async function register(payload) {
    const { data } = await api.post("/auth/customer-register", payload);
    await persistSession(data.token, data.customer);
    return data;
  }

  async function refreshProfile() {
    const { data } = await api.get("/customer/me");
    setCustomer(data);
    await AsyncStorage.mergeItem(STORAGE_KEY, JSON.stringify({ customer: data }));
    return data;
  }

  async function logout() {
    setToken(null);
    setCustomer(null);
    setAuthToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(() => ({
    token,
    customer,
    loading,
    login,
    register,
    refreshProfile,
    logout
  }), [token, customer, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
