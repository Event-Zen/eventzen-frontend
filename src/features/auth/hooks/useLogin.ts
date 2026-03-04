import { useState } from "react";
import { loginApi } from "../api/auth.api";

type LoginPayload = { email: string; password: string };

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(payload: LoginPayload) {
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(payload);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}