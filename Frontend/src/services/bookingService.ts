import { bookings as mockBookings } from "@/lib/mockData";
import { apiFetch } from "@/services/api";
import type { Booking, BookingStatus } from "@/types/booking";

let bookingCache: Booking[] = [...mockBookings];
let hasLoadedBookings = false;

export async function refreshBookings() {
  try {
    const serverBookings = await apiFetch<Booking[]>("/bookings");
    if (Array.isArray(serverBookings)) {
      bookingCache = serverBookings;
      hasLoadedBookings = true;
    }
  } catch (error) {
    console.warn("Unable to load bookings from backend; using local fallback data.", error);
    bookingCache = [...mockBookings];
  }

  return bookingCache;
}

export function getBookings() {
  if (!hasLoadedBookings) {
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

  return getBookings().some((booking) => {
    if (booking.resourceId !== resourceId) return false;
    if (ignoreBookingId && booking.id === ignoreBookingId) return false;
    if (booking.status === "cancelled") return false;

    const existingStart = new Date(booking.startTime).getTime();
    const existingEnd = new Date(booking.endTime).getTime();

    return start < existingEnd && end > existingStart;
  });
}

export function createBooking(payload: Omit<Booking, "id" | "createdAt">) {
  const booking: Booking = {
    ...payload,
    id: `b${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const current = getBookings();
  bookingCache = [booking, ...current];

  void apiFetch<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((serverBooking) => {
    bookingCache = bookingCache.map((item) => item.id === booking.id ? serverBooking : item);
  }).catch((error) => {
    console.warn("Could not sync booking to backend.", error);
  });

  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  const current = getBookings();
  const booking = current.find((item) => item.id === id);
  if (!booking) return null;

  const updated = { ...booking, status };
  bookingCache = current.map((item) => (item.id === id ? updated : item));

  void apiFetch<Booking>(`/bookings/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  }).catch((error) => {
    console.warn("Could not sync booking status to backend.", error);
  });

  return updated;
}

export function cancelBooking(id: string) {
  return updateBookingStatus(id, "cancelled");
}

export function rescheduleBooking(id: string, startTime: string, endTime: string) {
  const current = getBookings();
  const booking = current.find((item) => item.id === id);
  if (!booking) return null;

  const updated = { ...booking, startTime, endTime };
  bookingCache = current.map((item) => (item.id === id ? updated : item));

  void apiFetch<Booking>(`/bookings/${id}/reschedule`, {
    method: "PUT",
    body: JSON.stringify({ startTime, endTime }),
  }).catch((error) => {
    console.warn("Could not sync booking reschedule to backend.", error);
  });

  return updated;
}
