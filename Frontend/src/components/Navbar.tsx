"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, UserCircle } from "lucide-react";
import { useState } from "react";
import { clearStoredUser } from "@/services/authService";
import { Button } from "@/components/ui/Button";

export function Navbar({ role = "employee" }: { role?: "employee" | "administrator" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearStoredUser();
    router.push("/login");
  };

  const navItems = role === "administrator"
    ? [
        { href: "/admin", label: "Overview" },
        { href: "/admin/resources", label: "Resources" },
        { href: "/admin/bookings", label: "Bookings" },
        { href: "/admin/users", label: "Users" },
      ]
    : [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/resources", label: "Resources" },
        { href: "/bookings", label: "Bookings" },
        { href: "/calendar", label: "Calendar" },
        { href: "/profile", label: "Profile" },
      ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" className="rounded-xl border border-slate-200 p-2 lg:hidden" onClick={() => setMobileOpen((value) => !value)}>
            <Menu className="h-5 w-5 text-slate-700" />
          </button>
          <Link href={role === "administrator" ? "/admin" : "/dashboard"} className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm text-white">RH</span>
            <span>ResourceHub</span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              aria-label="Search"
              className="w-72 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Search resources, bookings..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600">
            <Bell className="h-4 w-4" />
          </button>
          <Link href="/profile" className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 sm:flex">
            <UserCircle className="h-4 w-4" />
            {role === "administrator" ? "Admin" : "Employee"}
          </Link>
          <Button variant="secondary" size="sm" onClick={handleLogout}> <LogOut className="mr-2 h-4 w-4" /> Logout</Button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium ${pathname === item.href ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
