export type UserRole = "employee" | "administrator";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: UserStatus;
}
