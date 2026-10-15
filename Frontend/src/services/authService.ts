import { apiFetch } from "@/services/api";
import type { User } from "@/types/user";

const USER_KEY = "resourcehub-auth-user";
const TOKEN_KEY = "resourcehub-auth-token";

function saveSession(user: User, token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(TOKEN_KEY, token);
}

export async function signIn(email: string, password: string): Promise<User> {
  const result = await apiFetch<{ user: User; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveSession(result.user, result.token);
  return result.user;
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  const result = await apiFetch<{ user: User; token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  saveSession(result.user, result.token);
  return result.user;
}

export async function getUsers(): Promise<User[]> {
  return apiFetch<User[]>("/auth/users");
}

export async function updateUserDetails(name: string, email: string): Promise<User> {
  const user = await apiFetch<User>("/auth/me", {
    method: "PUT",
    body: JSON.stringify({ name, email }),
  });
  const token = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
  if (token) saveSession(user, token);
  return user;
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetch<void>("/auth/me/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function signOut() {
  try {
    await apiFetch<void>("/auth/logout", { method: "POST" });
  } finally {
    clearStoredUser();
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(USER_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as User;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
}
