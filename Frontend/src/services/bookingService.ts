import { apiFetch } from "@/services/api";
import type { Booking, BookingStatus } from "@/types/booking";

let bookingCache: Booking[] = [];
let hasLoadedBookings = false;

// Load the latest bookings once, then reuse them for local lookups.
export async function refreshBookings() {
  try {
    const serverBookings = await apiFetch<Booking[]>("/bookings");
    if (Array.isArray(serverBookings)) {
      bookingCache = serverBookings;
      hasLoadedBookings = true;
    }
  } catch (error) {
    console.error("Unable to load bookings from backend.", error);
    bookingCache = [];
  }

  return bookingCache;
}

export function getBookings() {
  if (!hasLoadedBookings && typeof window !== "undefined") {
    void refreshBookings();
  }
  return bookingCache;
}

export function getBookingsByUser(userId: string) {
  return getBookings().filter((booking) => booking.userId === userId);
}

export function getBookingsForResource(resourceId: string) {
  return getBookings().filter((booking) => booking.resourceId === resourceId);
}

export function hasBookingConflict(startTime: string, endTime: string, resourceId: string, ignoreBookingId?: string) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return false;
  }

  // Two time ranges overlap when each starts before the other one ends.
  return getBookings().some((booking) => {
    if (booking.resourceId !== resourceId) return false;
    if (ignoreBookingId && booking.id === ignoreBookingId) return false;
    if (booking.status === "cancelled") return false;

    const existingStart = new Date(booking.startTime).getTime();
    const existingEnd = new Date(booking.endTime).getTime();

    return start < existingEnd && end > existingStart;
  });
}

export async function createBooking(payload: Omit<Booking, "id" | "createdAt">) {
  const booking = await apiFetch<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  bookingCache = [booking, ...getBookings()];
  return booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const current = getBookings();
  const booking = current.find((item) => item.id === id);
  if (!booking) return null;

  const updated = await apiFetch<Booking>(`/bookings/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  bookingCache = current.map((item) => (item.id === id ? updated : item));
  return updated;
}

export async function cancelBooking(id: string) {
  return updateBookingStatus(id, "cancelled");
}

export async function rescheduleBooking(id: string, startTime: string, endTime: string) {
  const current = getBookings();
  const booking = current.find((item) => item.id === id);
  if (!booking) return null;

  const updated = await apiFetch<Booking>(`/bookings/${id}/reschedule`, {
    method: "PUT",
    body: JSON.stringify({ startTime, endTime }),
  });

  bookingCache = current.map((item) => (item.id === id ? updated : item));
  return updated;
}
