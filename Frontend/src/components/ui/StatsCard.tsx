import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function StatsCard({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: ReactNode }) {
  return (
    <Card className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">{value}</h3>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">{icon}</div>
    </Card>
  );
}
