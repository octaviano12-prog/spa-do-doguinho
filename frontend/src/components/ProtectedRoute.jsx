import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loginPage">
        <motion.div
          className="loginCard"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div className="brandIcon">
              <LockKeyhole size={26} />
            </div>

            <div style={{ textAlign: "center" }}>
              <h2>Verificando autenticação...</h2>

              <p className="mutedText">
                Aguarde enquanto carregamos o painel.
              </p>
            </div>

            <div className="spinner" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (user?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loginPage">
        <motion.div
          className="loginCard"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div className="brandIcon">
              <LockKeyhole size={26} />
            </div>

            <div style={{ textAlign: "center" }}>
              <h2>Verificando autenticação...</h2>

              <p className="mutedText">
                Aguarde enquanto carregamos o painel.
              </p>
            </div>

            <div className="spinner" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return children;
}
