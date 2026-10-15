"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck2, CheckCircle2, MapPin, Sparkles, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { BookingForm } from "@/components/BookingForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { createBooking, getBookingsForResource, hasBookingConflict, refreshBookings } from "@/services/bookingService";
import { getStoredUser } from "@/services/authService";
import { getResourceById, refreshResources } from "@/services/resourceService";
import type { Resource } from "@/types/resource";

export function ResourceDetailsClient({ resource: initialResource, resourceId }: { resource: Resource | null; resourceId: string }) {
  const [resource, setResource] = useState(initialResource);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh both datasets so details and availability stay in sync.
  useEffect(() => {
    void Promise.all([refreshResources(), refreshBookings()]).then(() => {
      setResource(getResourceById(resourceId));
      setRefreshKey((value) => value + 1);
    });
  }, [resourceId]);

  const existingBookings = useMemo(() => getBookingsForResource(resource?.id ?? ""), [resource?.id, refreshKey]);

  if (!resource) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex flex-1 items-center justify-center p-6">
            <EmptyState title="Resource not found" message="This resource is no longer available in the mock catalog." action={<Link href="/resources"><Button>Back to resources</Button></Link>} />
          </main>
        </div>
      </div>
    );
  }

  const handleSubmit = async ({ date, startTime, endTime }: { date: string; startTime: string; endTime: string }) => {
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return { ok: false, message: "End time must be after start time." };
    }

    const user = getStoredUser();
    const inIso = start.toISOString();
    const outIso = end.toISOString();

    if (hasBookingConflict(inIso, outIso, resource.id)) {
      return { ok: false, message: "This time slot overlaps with an existing reservation." };
    }

    try {
      await createBooking({
      userId: user?.id ?? "u1",
      resourceId: resource.id,
      startTime: inIso,
      endTime: outIso,
      status: "pending",
      purpose: "Requested reservation",
      });
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Unable to create the reservation." };
    }

    setBookingMessage("Reservation submitted successfully.");
    setRefreshKey((value) => value + 1);
    return { ok: true, message: "Reservation submitted successfully." };
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Link href="/resources" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600"><ArrowLeft className="h-4 w-4" /> Back to resources</Link>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <div className="relative h-72 w-full">
                  <Image src={resource.image} alt={resource.name} fill className="object-cover" />
                </div>
                <div className="space-y-5 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{resource.category}</p>
                      <h1 className="mt-1 text-3xl font-semibold text-slate-900">{resource.name}</h1>
                    </div>
                    <Badge label={resource.status} tone={resource.status === "available" ? "success" : resource.status === "reserved" ? "warning" : "info"} />
                  </div>

                  <p className="text-slate-600">{resource.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {resource.location}</span>
                    {resource.capacity ? <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> Capacity {resource.capacity}</span> : null}
                    <span className="inline-flex items-center gap-2"><CalendarCheck2 className="h-4 w-4" /> {existingBookings.length} bookings</span>
                  </div>
                </div>
              </div>

              <Card>
                <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {resource.amenities.map((amenity) => (
                    <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{amenity}</span>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <BookingForm resourceName={resource.name} onSubmit={handleSubmit} />

              {bookingMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  <div className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {bookingMessage}</div>
                </div>
              ) : null}

              <Card>
                <div className="flex items-center gap-2 text-slate-700"><Sparkles className="h-4 w-4" /> Availability</div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {existingBookings.length ? (
                    existingBookings.map((booking) => (
                      <div key={booking.id} className="rounded-xl bg-slate-50 p-3">
                        <p className="font-medium text-slate-900">{booking.status}</p>
                        <p>{new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <p>No current reservations for this resource.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
