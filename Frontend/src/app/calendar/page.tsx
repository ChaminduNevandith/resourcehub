"use client";

import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { getBookings, refreshBookings } from "@/services/bookingService";
import { getResourceById, refreshResources } from "@/services/resourceService";

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week">("month");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh bookings and resources before building the calendar view.
  useEffect(() => {
    void Promise.all([refreshBookings(), refreshResources()]).then(() => setRefreshKey((value) => value + 1));
  }, []);
  const bookings = useMemo(
    () => getBookings().filter((booking) => resourceFilter === "all" || booking.resourceId === resourceFilter),
    [resourceFilter, refreshKey],
  );

  const now = new Date("2026-10-01T00:00:00Z");
  const monthDays = eachDayOfInterval({ start: startOfWeek(startOfMonth(now), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(now), { weekStartsOn: 1 }) });
  const selectedDay = new Date("2026-10-13T00:00:00Z");

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Schedule</p>
              <h1 className="text-3xl font-semibold text-slate-900">Calendar</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant={view === "month" ? "primary" : "secondary"} onClick={() => setView("month")}>Month</Button>
              <Button variant={view === "week" ? "primary" : "secondary"} onClick={() => setView("week")}>Week</Button>
              <Select value={resourceFilter} onChange={(event) => setResourceFilter(event.target.value)} className="min-w-[180px]">
                <option value="all">All resources</option>
                <option value="r1">Harbor Boardroom</option>
                <option value="r2">Summit Collaboration Hub</option>
                <option value="r3">North Focus Studio</option>
                <option value="r4">Atlas Team Lounge</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="px-2 py-3">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {monthDays.map((day) => {
                  const dayBookings = bookings.filter((booking) => isSameDay(new Date(booking.startTime), day));
                  return (
                    <div key={day.toISOString()} className={`min-h-[130px] border-b border-r border-slate-200 p-2 ${day.getMonth() !== now.getMonth() ? "bg-slate-50 text-slate-400" : "bg-white"}`}>
                      <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg text-sm ${isSameDay(day, selectedDay) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayBookings.slice(0, 2).map((booking) => (
                          <div key={booking.id} className="rounded bg-blue-50 px-1 py-0.5 text-[10px] font-medium text-blue-700">
                            {getResourceById(booking.resourceId)?.name ?? "Resource"}
                            <span className="block truncate text-blue-600">{booking.bookedByName ?? booking.userId}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="space-y-4">
              <Card>
                <div className="flex items-center gap-2 text-slate-700"><CalendarDays className="h-4 w-4" /> Upcoming reservations</div>
                <div className="mt-4 space-y-3">
                  {bookings.slice(0, 4).map((booking) => {
                    const resource = getResourceById(booking.resourceId);
                    return (
                      <div key={booking.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                        <p className="font-medium text-slate-900">{resource?.name ?? "Resource"}</p>
                        <p className="text-slate-600">{new Date(booking.startTime).toLocaleDateString()} • {booking.status}</p>
                        <p className="mt-1 text-slate-500">Booked by: {booking.bookedByName ?? booking.userId}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
