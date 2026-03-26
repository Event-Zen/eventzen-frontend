import axios from "axios";

export const eventApi = axios.create({
  baseURL: import.meta.env.VITE_EVENT_SERVICE_URL || "http://localhost:5002/api/events",
  withCredentials: true,
});

eventApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
