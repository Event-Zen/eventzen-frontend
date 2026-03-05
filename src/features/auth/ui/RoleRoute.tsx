import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type Role = "ATTENDEE" | "VENDOR" | "PLANNER" | "ADMIN";

function readRole(): Role | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as { role?: Role };
    return user.role ?? null;
  } catch {
    return null;
  }
}

export function RoleRoute({
  allow,
  children,
  redirectTo = "/",
}: {
  allow: Role[];
  children: JSX.Element;
  redirectTo?: string;
}) {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;

  const role = readRole();
  if (!role) return <Navigate to="/login" replace />;

  if (!allow.includes(role)) return <Navigate to={redirectTo} replace />;

  return children;
}