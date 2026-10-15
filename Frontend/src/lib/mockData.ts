import type { User } from "@/types/user";

export const users: User[] = [
  { id: "u1", name: "Ava Thompson", email: "ava@resourcehub.io", role: "employee", avatar: "AT", status: "active" },
  { id: "u2", name: "Noah Patel", email: "noah@resourcehub.io", role: "employee", avatar: "NP", status: "active" },
  { id: "u3", name: "Mila Garcia", email: "mila@resourcehub.io", role: "employee", avatar: "MG", status: "active" },
  { id: "u4", name: "Ethan Lee", email: "ethan@resourcehub.io", role: "employee", avatar: "EL", status: "active" },
  { id: "u5", name: "Sophia Nguyen", email: "sophia@resourcehub.io", role: "administrator", avatar: "SN", status: "active" },
  { id: "u6", name: "Lucas Brooks", email: "lucas@resourcehub.io", role: "employee", avatar: "LB", status: "inactive" },
  { id: "u7", name: "Emma Johnson", email: "emma@resourcehub.io", role: "administrator", avatar: "EJ", status: "active" },
  { id: "u8", name: "Daniel Kim", email: "daniel@resourcehub.io", role: "employee", avatar: "DK", status: "active" },
];
