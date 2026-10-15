"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookText, CalendarRange, Building2, LayoutDashboard, ShieldCheck, UserRound, Warehouse } from "lucide-react";

export function Sidebar({ role = "employee" }: { role?: "employee" | "administrator" }) {
  const pathname = usePathname();

  const employeeLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/resources", label: "Resources", icon: Warehouse },
    { href: "/bookings", label: "Bookings", icon: BookText },
    { href: "/calendar", label: "Calendar", icon: CalendarRange },
    { href: "/profile", label: "Profile", icon: UserRound },
  ];

  const adminLinks = [
    { href: "/admin", label: "Overview", icon: BarChart3 },
    { href: "/admin/resources", label: "Resources", icon: Building2 },
    { href: "/admin/bookings", label: "Bookings", icon: BookText },
    { href: "/admin/users", label: "Users", icon: ShieldCheck },
  ];

  const links = role === "administrator" ? adminLinks : employeeLinks;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-50/80 p-5 lg:block">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{role === "administrator" ? "Admin Portal" : "Employee Hub"}</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${pathname === href ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
