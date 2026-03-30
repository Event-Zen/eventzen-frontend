import axios from "axios";

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL 
    ? `${import.meta.env.VITE_USER_SERVICE_URL.replace(/\/+$/, '')}/api` 
    : "http://localhost:4001/api",
  withCredentials: true,
});

userApi.interceptors.request.use((config) => {
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

export const listUsersAdmin = async () => {
  const response = await userApi.get("/users/admin");
  return response.data;
};

export const updateUserStatusAdmin = async (id: string, status: string) => {
  const response = await userApi.patch(`/users/admin/${id}/status`, { status });
  return response.data;
};
