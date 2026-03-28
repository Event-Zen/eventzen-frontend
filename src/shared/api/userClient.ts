import axios from "axios";

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:4001/api",
  withCredentials: true,
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const listUsersAdmin = async () => {
  const response = await userApi.get("/users/admin");
  return response.data;
};

export const updateUserStatusAdmin = async (id: string, status: string) => {
  const response = await userApi.patch(`/users/admin/${id}/status`, { status });
  return response.data;
};
