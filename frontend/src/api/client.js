import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  `${window.location.origin}/api`;

const client = axios.create({
  baseURL: apiBaseUrl,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("spa_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default client;
import axios from "axios";

const client = axios.create({
  baseURL: "https://spadodoguinho.com.br/api",
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("spa_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default client;
