"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { BookingCard } from "@/components/BookingCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { cancelBooking, getBookings } from "@/services/bookingService";
import { getResourceById } from "@/services/resourceService";
import { getStoredUser } from "@/services/authService";

export default function BookingsPage() {
  const [status, setStatus] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const currentUser = getStoredUser() ?? { id: "u1" } as never;
  const bookings = useMemo(() => getBookings().filter((booking) => booking.userId === (currentUser.id ?? "u1") && (status === "all" || booking.status === status)), [currentUser.id, refreshKey, status]);

  const handleCancel = (id: string) => {
    cancelBooking(id);
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Reservations</p>
              <h1 className="text-3xl font-semibold text-slate-900">My bookings</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/resources"><Button variant="secondary"><Plus className="mr-2 h-4 w-4" /> Book a resource</Button></Link>
            </div>
          </div>

          <div className="mb-6 max-w-xs">
            <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </Select>
          </div>

          {bookings.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {bookings.map((booking) => {
                const resource = getResourceById(booking.resourceId);
                if (!resource) return null;
                return (
                  <div key={booking.id} className="space-y-3">
                    <BookingCard booking={booking} resource={resource} />
                    {booking.status !== "cancelled" ? <Button variant="secondary" className="w-full" onClick={() => handleCancel(booking.id)}>Cancel booking</Button> : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No bookings found" message="You do not have any matching reservations yet." action={<Link href="/resources"><Button>Browse resources</Button></Link>} />
          )}
        </main>
      </div>
    </div>
  );
}
