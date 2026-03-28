import { api } from "../../../lib/api";
import type { RegisterRequest, RegisterResponse } from "../../../types/auth";

export async function registerApi(payload: RegisterRequest) {
  const res = await api.post<RegisterResponse>("/api/auth/register", payload);
  return res.data;
}

export async function loginApi(payload: { email: string; password: string }) {
  const res = await api.post("/api/auth/login", payload);
  return res.data; // { accessToken, user }
}

export async function getMeApi() {
  const res = await api.get("/api/auth/me");
  return res.data; // { user }
}

export async function updateMeApi(payload: {
  name?: string;
  phone?: string;
  address?: string;
  profileImageUrl?: string;
}) {
  const res = await api.patch("/api/auth/me", payload);
  return res.data; // { user }
}
