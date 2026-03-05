import { useEffect, useState } from "react";

type Role = "ATTENDEE" | "VENDOR" | "PLANNER" | "ADMIN";
type Status = "ACTIVE" | "PENDING" | "SUSPENDED";

export type AuthUser = {
  id: string;
  role: Role;
  status?: Status;
  name: string;
  email: string;
};

function readUser(): AuthUser | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(() => readUser());
  const isAuthed = !!localStorage.getItem("accessToken");

  useEffect(() => {
    // Keep header in sync if user logs in/out in another tab
    const onStorage = () => setUser(readUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  }

  return { user, isAuthed, logout };
}