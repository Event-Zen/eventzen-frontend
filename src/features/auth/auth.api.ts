import { api } from "../../lib/api";
import type { RegisterRequest, RegisterResponse } from "../../types/auth";

export async function registerApi(payload: RegisterRequest) {
  const res = await api.post<RegisterResponse>("/api/auth/register", payload);
  return res.data;
}

export async function loginApi(payload: { email: string; password: string }) {
  const res = await api.post("/api/auth/login", payload);
  return res.data; // { accessToken, user }
}