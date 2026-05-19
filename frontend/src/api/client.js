import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://greenyellow-lark-659813.hostingersite.com/api";

const client = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("spa_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("spa_token");
      localStorage.removeItem("spa_user");

      toast.error("Sessão expirada");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    if (status === 500) {
      toast.error("Erro interno do servidor");
    }

    if (!status) {
      toast.error("Servidor indisponível");
    }

    return Promise.reject(error);
  }
);

export default client;
