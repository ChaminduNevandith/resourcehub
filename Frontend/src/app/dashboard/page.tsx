"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, BookText, CalendarRange, Clock3, MapPinned, Plus, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { BookingCard } from "@/components/BookingCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { getBookings, refreshBookings } from "@/services/bookingService";
import { getResourceById, getResources, refreshResources } from "@/services/resourceService";
import { getStoredUser } from "@/services/authService";
import type { User } from "@/types/user";

const utilizationData = [
  { name: "Mon", value: 54 },
  { name: "Tue", value: 69 },
  { name: "Wed", value: 58 },
  { name: "Thu", value: 76 },
  { name: "Fri", value: 82 },
  { name: "Sat", value: 41 },
];

export default function DashboardPage() {
  const [todayLabel, setTodayLabel] = useState("Loading date...");
  const [, setRefreshKey] = useState(0);
  const [activeUser, setActiveUser] = useState<Pick<User, "id" | "name" | "role">>({
    id: "u1",
    role: "employee",
    name: "Ava Thompson",
  });
  const resources = getResources();
  const allBookings = getBookings();
  const upcoming = allBookings.filter((booking) => booking.status === "confirmed").slice(0, 3);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      const storedUser = getStoredUser();
      if (storedUser) setActiveUser(storedUser);
      setTodayLabel(
        new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
      );
    }, 0);
    void Promise.all([refreshBookings(), refreshResources()]).then(() => setRefreshKey((value) => value + 1));
    return () => window.clearTimeout(hydrationTask);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="employee" canAccessAdmin={activeUser.role === "administrator"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar role="employee" canAccessAdmin={activeUser.role === "administrator"} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Welcome back</p>
              <h1 className="text-3xl font-semibold text-slate-900">{activeUser.name || "Ava Thompson"}</h1>
            </div>
            <div className="text-sm text-slate-500">{todayLabel}</div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard title="Total resources" value={String(resources.length)} detail="Across all teams" icon={<MapPinned className="h-5 w-5" />} />
            <StatsCard title="Active bookings" value={String(allBookings.filter((booking) => booking.status === "confirmed").length)} detail="This week" icon={<BookText className="h-5 w-5" />} />
            <StatsCard title="Upcoming" value={String(upcoming.length)} detail="Next reservations" icon={<CalendarRange className="h-5 w-5" />} />
            <StatsCard title="Available today" value={String(resources.filter((resource) => resource.status === "available").length)} detail="Ready to book" icon={<Activity className="h-5 w-5" />} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <Card className="p-0">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <p className="text-sm text-slate-500">Resource utilization</p>
                  <h2 className="text-xl font-semibold text-slate-900">Weekly occupancy</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700"><TrendingUp className="h-4 w-4" /> +12.5%</div>
              </div>
              <div className="h-72 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={utilizationData}>
                    <defs>
                      <linearGradient id="utilization" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.06} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#2563eb" fill="url(#utilization)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
              </div>
              <div className="space-y-3">
                <Link href="/resources" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100">
                  <div>
                    <p className="font-medium text-slate-900">Browse resources</p>
                    <p className="text-sm text-slate-500">Check availability</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </Link>
                <Link href="/bookings" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100">
                  <div>
                    <p className="font-medium text-slate-900">My bookings</p>
                    <p className="text-sm text-slate-500">Review upcoming trips</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </Link>
                <Link href="/calendar" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100">
                  <div>
                    <p className="font-medium text-slate-900">Open calendar</p>
                    <p className="text-sm text-slate-500">Month and weekly views</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </Link>
              </div>
              <div className="mt-5">
                <Link href="/resources"><Button className="w-full"><Plus className="mr-2 h-4 w-4" /> Create booking</Button></Link>
              </div>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Recent booking activity</h2>
              </div>
              <div className="space-y-4">
                {allBookings.slice(0, 4).map((booking) => {
                  const resource = getResourceById(booking.resourceId);
                  if (!resource) return null;
                  return <BookingCard key={booking.id} booking={booking} resource={resource} />;
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Popular resources</h2>
              </div>
              <div className="space-y-3">
                {resources.slice(0, 4).map((resource) => (
                  <div key={resource.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-semibold">{resource.name.slice(0, 2)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{resource.name}</p>
                      <p className="text-sm text-slate-500">{resource.category}</p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"><Clock3 className="h-3 w-3" /> {resource.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
