type Role = "ATTENDEE" | "VENDOR" | "PLANNER" | "ADMIN";

export function dashboardPath(role: Role) {
  if (role === "ATTENDEE") return "/attendee/dashboard";
  if (role === "PLANNER") return "/planner/dashboard";
  if (role === "VENDOR") return "/vendor/dashboard";
  return "/admin/dashboard";
}