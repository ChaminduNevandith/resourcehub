"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { CalendarRange, Clock3, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function BookingForm({
  resourceName,
  onSubmit,
  initialDate,
  defaultStart,
  defaultEnd,
}: {
  resourceName: string;
  onSubmit: (values: { date: string; startTime: string; endTime: string }) => { ok: boolean; message?: string };
  initialDate?: string;
  defaultStart?: string;
  defaultEnd?: string;
}) {
  const [date, setDate] = useState(initialDate ?? "");
  const [startTime, setStartTime] = useState(defaultStart ?? "09:00");
  const [endTime, setEndTime] = useState(defaultEnd ?? "10:00");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setDate(initialDate ?? format(new Date(), "yyyy-MM-dd"));
  }, [initialDate]);

  const summary = useMemo(() => {
    if (!date) return "Select a date";
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    return `${resourceName} • ${format(start, "MMM d, yyyy")} • ${format(start, "h:mm aa")} - ${format(end, "h:mm aa")}`;
  }, [date, endTime, resourceName, startTime]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = onSubmit({ date, startTime, endTime });
    setFeedback(result.ok ? { type: "success", text: result.message ?? "Booking request created successfully." } : { type: "error", text: result.message ?? "Unable to create the booking." });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><CalendarRange className="h-4 w-4" /> Reservation details</div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input label="Date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <Input label="Start time" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
        <Input label="End time" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
        <div className="mb-1 flex items-center gap-2 text-slate-500"><Clock3 className="h-4 w-4" /> Booking summary</div>
        <p className="font-medium text-slate-900">{summary}</p>
      </div>

      {feedback ? (
        <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          <TriangleAlert className="h-4 w-4" /> {feedback.text}
        </div>
      ) : null}

      <Button type="submit" className="w-full">Reserve now</Button>
    </form>
  );
}
