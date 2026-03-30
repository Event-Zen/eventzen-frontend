import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:4001",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    if (config.headers && typeof config.headers.set === 'function') {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});