export type Role = "ATTENDEE" | "VENDOR" | "PLANNER" | "ADMIN";

export type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED";

export type User = {
  id: string;
  role: Role;
  status: UserStatus;
  name: string;
  email: string;
};

export type RegisterRequest = {
  role: Role;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
};