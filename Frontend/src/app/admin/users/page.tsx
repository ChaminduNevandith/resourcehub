"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getStoredUser, getUsers } from "@/services/authService";
import type { User } from "@/types/user";
import { confirmAction, showSuccess } from "@/lib/alerts";

export default function AdminUsersPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Load users only after confirming the current user is an administrator.
  useEffect(() => {
    if (getStoredUser()?.role !== "administrator") {
      router.replace("/dashboard");
      return;
    }
    void getUsers().then(setAllUsers);
  }, [refreshKey, router]);

  // Keep the table results aligned with the search and role filters.
  const users = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesRole = role === "all" || user.role === role;
      const matchesQuery = !query || `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
      return matchesRole && matchesQuery;
    });
  }, [allUsers, query, role]);

  const toggleUser = async (id: string) => {
    const list = allUsers;
    const current = list.find((user) => user.id === id);
    if (!current) return;
    if (!await confirmAction(`${current.status === "active" ? "Deactivate" : "Activate"} user?`, `${current.name}'s account status will be changed.`)) return;
    current.status = current.status === "active" ? "inactive" : "active";
    setAllUsers([...list]);
    setRefreshKey((value) => value + 1);
    await showSuccess(current.status === "active" ? "User activated" : "User deactivated");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="administrator" />
      <div className="flex flex-1 flex-col">
        <Navbar role="administrator" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Directory</p>
            <h1 className="text-3xl font-semibold text-slate-900">User management</h1>
          </div>

          <Card className="mb-6">
            <div className="grid gap-4 md:grid-cols-[1.5fr_0.7fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" className="pl-10" />
              </div>
              <Select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="all">All roles</option>
                <option value="employee">Employee</option>
                <option value="administrator">Administrator</option>
              </Select>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <Card key={user.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{user.avatar}</div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{user.name}</h2>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{user.role}</span>
                  <span className="text-xs text-slate-500">{user.status}</span>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => toggleUser(user.id)}>{user.status === "active" ? "Deactivate" : "Activate"}</Button>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
