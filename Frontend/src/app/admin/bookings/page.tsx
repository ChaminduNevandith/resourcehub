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
import { cancelBooking, getBookings, refreshBookings, updateBookingStatus } from "@/services/bookingService";
import { getResourceById, getResources, refreshResources } from "@/services/resourceService";
import { getStoredUser } from "@/services/authService";

export default function AdminBookingsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [resourceId, setResourceId] = useState("all");
  const [date, setDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (getStoredUser()?.role !== "administrator") {
      router.replace("/dashboard");
      return;
    }
    void Promise.all([refreshBookings(), refreshResources()]).then(() => setRefreshKey((value) => value + 1));
  }, [router]);
  const resources = getResources();

  const bookings = useMemo(() => {
    return getBookings().filter((booking) => {
      const resource = getResourceById(booking.resourceId);
      const matchesStatus = status === "all" || booking.status === status;
      const matchesCategory = category === "all" || resource?.category === category;
      const matchesResource = resourceId === "all" || booking.resourceId === resourceId;
      const matchesDate = !date || booking.startTime.slice(0, 10) === date;
      const matchesQuery = !query || resource?.name.toLowerCase().includes(query.toLowerCase()) || booking.purpose.toLowerCase().includes(query.toLowerCase()) || booking.bookedByName?.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesCategory && matchesResource && matchesDate && matchesQuery;
    });
  }, [category, date, query, refreshKey, resourceId, status]);

  const handleReview = async (id: string, nextStatus: "confirmed" | "cancelled") => {
    if (nextStatus === "cancelled") await cancelBooking(id);
    else await updateBookingStatus(id, "confirmed");
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="administrator" />
      <div className="flex flex-1 flex-col">
        <Navbar role="administrator" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Operations</p>
            <h1 className="text-3xl font-semibold text-slate-900">Booking management</h1>
          </div>

          <Card className="mb-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookings" className="pl-10" />
              </div>
              <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </Select>
              <Select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {[...new Set(resources.map((resource) => resource.category))].map((item) => <option key={item} value={item}>{item}</option>)}
              </Select>
              <Select value={resourceId} onChange={(event) => setResourceId(event.target.value)}>
                <option value="all">All resources</option>
                {resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name}</option>)}
              </Select>
              <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filter by date" />
            </div>
          </Card>

          <div className="space-y-4">
            {bookings.map((booking) => {
              const resource = getResourceById(booking.resourceId);
              return (
                <Card key={booking.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{resource?.category ?? "Resource"}</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">{resource?.name ?? booking.resourceId}</h2>
                    <p className="mt-1 text-sm text-slate-600">{booking.purpose}</p>
                    <p className="mt-1 text-sm text-slate-500">{new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}</p>
                    <p className="mt-1 text-sm text-slate-500">Booked by: {booking.bookedByName ?? booking.userId}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{booking.status}</span>
                    {booking.status === "pending" ? (
                      <>
                        <Button variant="secondary" onClick={() => handleReview(booking.id, "confirmed")}>Approve</Button>
                        <Button variant="danger" onClick={() => handleReview(booking.id, "cancelled")}>Reject</Button>
                      </>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
