import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:4001",
  withCredentials: true, 
});