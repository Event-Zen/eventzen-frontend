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

export const createEvent = async (payload: any) => {
  const response = await eventApi.post("/", payload);
  return response.data;
};

export const updateEvent = async (id: string, payload: any) => {
  const response = await eventApi.put(`/${id}`, payload);
  return response.data;
};

export const listPublishedEvents = async () => {
  const response = await eventApi.get("/");
  return response.data;
};

export const selectVendorsApi = async (eventId: string, payload: any) => {
  const response = await eventApi.post(`/${eventId}/vendors/select`, payload);
  return response.data;
};
