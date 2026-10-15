import { CalendarDays, Clock3, MapPin, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Booking } from "@/types/booking";
import type { Resource } from "@/types/resource";

export function BookingCard({ booking, resource }: { booking: Booking; resource: Resource }) {
  const tone = booking.status === "confirmed" ? "success" : booking.status === "pending" ? "warning" : booking.status === "cancelled" ? "danger" : "info";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{resource.category}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">{resource.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge label={booking.status} tone={tone} />
          <button type="button" className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {new Date(booking.startTime).toLocaleDateString()}</div>
        <div className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> {new Date(booking.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {resource.location}</div>
        <div className="text-sm text-slate-500">Booked by: {booking.bookedByName ?? booking.userId}</div>
      </div>

      <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">Purpose: {booking.purpose}</p>
    </div>
  );
}
