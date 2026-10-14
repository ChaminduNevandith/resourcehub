"use client";

import { useState } from "react";
import { Bell, Briefcase, Mail, Save } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getStoredUser } from "@/services/authService";

export default function ProfilePage() {
  const storedUser = getStoredUser() ?? {
    id: "u1",
    name: "Ava Thompson",
    email: "ava@resourcehub.io",
    role: "employee",
    avatar: "AT",
    status: "active",
  };

  const [user, setUser] = useState(storedUser);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: "name" | "email" | "role", value: string) => {
    setUser((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("resourcehub-demo-user", JSON.stringify(user));
    }
    setSaved(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Account</p>
            <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.2fr]">
            <Card className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-semibold text-white">{user.avatar}</div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{user.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{user.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"><Briefcase className="h-4 w-4" /> {user.role}</div>
            </Card>

            <Card>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Edit profile</h2>
                {saved ? <span className="text-sm text-emerald-600">Saved</span> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Full name" value={user.name} onChange={(event) => handleChange("name", event.target.value)} />
                <Input label="Email" value={user.email} onChange={(event) => handleChange("email", event.target.value)} />
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600"><Mail className="h-4 w-4" /> Contact updates are stored only in the client-side demo store.</div>
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600"><Bell className="h-4 w-4" /> Booking activity notifications remain mock-only until backend integration.</div>

              <div className="mt-6">
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save changes</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
