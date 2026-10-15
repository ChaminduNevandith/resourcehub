"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Briefcase, KeyRound, Mail, Save } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getStoredUser, updatePassword, updateUserDetails } from "@/services/authService";
import type { User } from "@/types/user";
import { showError, showSuccess } from "@/lib/alerts";

const fallbackUser: User = {
  id: "u1",
  name: "Ava Thompson",
  email: "ava@resourcehub.io",
  role: "employee",
  avatar: "AT",
  status: "active",
};

const fallbackAdminUser: User = {
  id: "admin",
  name: "Administrator",
  email: "admin@resourcehub.io",
  role: "administrator",
  avatar: "AD",
  status: "active",
};

export function ProfilePage({ adminOnly = false }: { adminOnly?: boolean }) {
  const router = useRouter();
  const [user, setUser] = useState(adminOnly ? fallbackAdminUser : fallbackUser);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      const storedUser = getStoredUser();
      if (adminOnly) {
        if (storedUser?.role === "administrator") {
          setUser(storedUser);
          return;
        }
        router.replace("/dashboard");
        return;
      }

      if (storedUser?.role === "administrator") {
        router.replace("/admin/profile");
        return;
      }
      if (storedUser) setUser(storedUser);
    }, 0);

    return () => window.clearTimeout(hydrationTask);
  }, [adminOnly, router]);

  const handleChange = (field: "name" | "email", value: string) => {
    setUser((current) => ({ ...current, [field]: value }));
    setSaved(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const updatedUser = await updateUserDetails(user.name, user.email);
      setUser(updatedUser);
      setSaved(true);
      await showSuccess("Profile updated");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to save profile changes.";
      setError(message);
      await showError("Unable to update profile", message);
    } finally {
      setSaving(false);
    }

  };

  const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
    setPasswords((current) => ({ ...current, [field]: value }));
    setPasswordSaved(false);
    setPasswordError(null);
  };

  const handlePasswordSave = async () => {
    if (passwords.next.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    setPasswordSaved(false);
    setPasswordError(null);
    try {
      await updatePassword(passwords.current, passwords.next);
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordSaved(true);
      await showSuccess("Password updated");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to update your password.";
      setPasswordError(message);
      await showError("Unable to update password", message);
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col">
        <Navbar role={user.role} />
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

              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600"><Mail className="h-4 w-4" /> Your contact details are saved to your ResourceHub account.</div>
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600"><Bell className="h-4 w-4" /> Booking activity notifications remain mock-only until backend integration.</div>

              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
              <div className="mt-6">
                <Button onClick={handleSave} disabled={saving}><Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save changes"}</Button>
              </div>
            </Card>

            <Card>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Change password</h2>
                {passwordSaved ? <span className="text-sm text-emerald-600">Updated</span> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Input label="Current password" type="password" value={passwords.current} onChange={(event) => handlePasswordChange("current", event.target.value)} />
                <Input label="New password" type="password" value={passwords.next} onChange={(event) => handlePasswordChange("next", event.target.value)} />
                <Input label="Confirm new password" type="password" value={passwords.confirm} onChange={(event) => handlePasswordChange("confirm", event.target.value)} />
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600"><KeyRound className="h-4 w-4" /> Use at least 8 characters. Your current password is required.</div>
              {passwordError ? <p className="mt-4 text-sm text-red-600">{passwordError}</p> : null}
              <div className="mt-6">
                <Button onClick={handlePasswordSave} disabled={passwordSaving}><KeyRound className="mr-2 h-4 w-4" /> {passwordSaving ? "Updating..." : "Update password"}</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
