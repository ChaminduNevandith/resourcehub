import Link from "next/link";
import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Resource } from "@/types/resource";

export function ResourceCard({ resource }: { resource: Resource }) {
  const statusTone = resource.status === "available" ? "success" : resource.status === "reserved" ? "warning" : "info";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image src={resource.image} alt={resource.name} fill className="object-cover" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{resource.category}</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{resource.name}</h3>
          </div>
          <Badge label={resource.status} tone={statusTone} />
        </div>

        <p className="line-clamp-3 text-sm text-slate-600">{resource.description}</p>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {resource.location}</span>
          {resource.capacity ? <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> {resource.capacity} seats</span> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {resource.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{amenity}</span>
          ))}
        </div>

        <Link href={`/resources/${resource.id}`}>
          <Button className="w-full">View details</Button>
        </Link>
      </div>
    </article>
  );
}
