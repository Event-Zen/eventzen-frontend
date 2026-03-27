import axios from "axios";

export const vendorApi = axios.create({
  baseURL: import.meta.env.VITE_VENDOR_SERVICE_URL || "http://localhost:5006/api/vendor-services",
  withCredentials: true,
});

vendorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createVendorService = async (payload: any) => {
  const response = await vendorApi.post("/", payload);
  return response.data;
};

export const listVendorServices = async () => {
  const response = await vendorApi.get("/");
  return response.data;
};

export const getMyVendorServices = async () => {
  const response = await vendorApi.get("/me");
  return response.data;
};
