export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";

export interface Booking {
  id: string;
  userId: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  purpose: string;
  createdAt: string;
  bookedByName?: string | null;
  bookedByEmail?: string | null;
}
