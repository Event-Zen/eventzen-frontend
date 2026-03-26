import axios from "axios";

export const eventApi = axios.create({
  baseURL: import.meta.env.VITE_EVENT_SERVICE_URL || "http://localhost:5002/api/events",
  withCredentials: true,
});
