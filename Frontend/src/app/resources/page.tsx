"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ResourceCard } from "@/components/ResourceCard";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { getResources, refreshResources } from "@/services/resourceService";

const categories = ["All", "Meeting Rooms", "Workspaces", "Equipment", "Parking Spaces", "Other Resources"] as const;
const availabilityOptions = ["All", "available", "reserved", "maintenance"] as const;

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [availability, setAvailability] = useState<(typeof availabilityOptions)[number]>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => { void refreshResources().then(() => setRefreshKey((value) => value + 1)); }, []);

  const resources = useMemo(() => {
    const all = getResources();
    return all.filter((resource) => {
      const matchesQuery = !query || `${resource.name} ${resource.description} ${resource.location}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || resource.category === category;
      const matchesAvailability = availability === "All" || resource.status === availability;
      return matchesQuery && matchesCategory && matchesAvailability;
    });
  }, [availability, category, query, refreshKey]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Browse</p>
              <h1 className="text-3xl font-semibold text-slate-900">Resources</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={() => setView("grid")}>Grid</Button>
              <Button variant="secondary" onClick={() => setView("list")}>List</Button>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr_0.7fr]">
              <SearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by resource, location, or amenity" />
              <Select label="Category" value={category} onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}>
                {categories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
              <Select label="Availability" value={availability} onChange={(event) => setAvailability(event.target.value as (typeof availabilityOptions)[number])}>
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <Filter className="h-4 w-4" />
            {resources.length} resources found
          </div>

          {resources.length ? (
            <div className={view === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
              {resources.map((resource) => (
                <div key={resource.id} className={view === "list" ? "max-w-none" : ""}>
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No resources match your filters" message="Try adjusting your search or status filters to find availability." />
          )}
        </main>
      </div>
    </div>
  );
}
