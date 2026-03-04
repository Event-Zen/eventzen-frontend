import { useState } from "react";
import { registerApi } from "../auth/auth.api"; 
import type { RegisterRequest } from "../../types/auth"; 

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(payload: RegisterRequest) {
    setLoading(true);
    setError(null);

    try {
      const data = await registerApi(payload);
      return data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { register, loading, error };
}