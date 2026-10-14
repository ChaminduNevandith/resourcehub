import { users } from "@/lib/mockData";
import type { User, UserRole } from "@/types/user";

const STORAGE_KEY = "resourcehub-demo-user";

export function getDemoUsers(): User[] {
  return users;
}

export async function signIn(email: string, password: string, role?: UserRole): Promise<User> {
  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      (role ? item.role === role : true) &&
      (password.length >= 6 || password === "demo123")
  );

  if (!user) {
    throw new Error("Invalid demo credentials. Try a known employee or admin account.");
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error("An account with this email already exists in the demo store.");
  }

  const newUser: User = {
    id: `u${users.length + 1}`,
    name,
    email,
    role: "employee",
    avatar: name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
    status: "active",
  };

  users.push(newUser);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }

  return newUser;
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved) as User;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
