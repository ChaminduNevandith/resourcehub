"use client";

import { BarChart3, Building2, CalendarRange, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { getBookings } from "@/services/bookingService";
import { getResources } from "@/services/resourceService";
import { getDemoUsers } from "@/services/authService";

export default function AdminDashboardPage() {
  const resources = getResources();
  const bookings = getBookings();
  const users = getDemoUsers();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="administrator" />
      <div className="flex flex-1 flex-col">
        <Navbar role="administrator" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Administration</p>
            <h1 className="text-3xl font-semibold text-slate-900">Admin dashboard</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard title="Total users" value={String(users.length)} detail="Across the workspace" icon={<Users className="h-5 w-5" />} />
            <StatsCard title="Total resources" value={String(resources.length)} detail="Including shared assets" icon={<Building2 className="h-5 w-5" />} />
            <StatsCard title="Total bookings" value={String(bookings.length)} detail="Reservation records" icon={<CalendarRange className="h-5 w-5" />} />
            <StatsCard title="Active reservations" value={String(bookings.filter((booking) => booking.status === "confirmed").length)} detail="Currently active" icon={<BarChart3 className="h-5 w-5" />} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <Card>
              <h2 className="text-xl font-semibold text-slate-900">Resource utilization</h2>
              <div className="mt-4 grid gap-3">
                {resources.slice(0, 4).map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="font-medium text-slate-900">{resource.name}</p>
                      <p className="text-sm text-slate-500">{resource.category}</p>
                    </div>
                    <div className="text-sm font-medium text-blue-600">{resource.status}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-slate-900">Quick management</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="rounded-xl bg-slate-50 p-3">Review pending reservations</div>
                <div className="rounded-xl bg-slate-50 p-3">Update resource availability</div>
                <div className="rounded-xl bg-slate-50 p-3">Audit user roles</div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
