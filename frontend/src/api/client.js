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
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("spa_token");
      localStorage.removeItem("spa_user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default client;
