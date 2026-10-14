"use client";

import { useMemo, useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getResources, createResource, updateResource, toggleResourceStatus } from "@/services/resourceService";

export default function AdminResourcesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [refreshKey, setRefreshKey] = useState(0);
 const resources = useMemo(() => {
    return getResources().filter((resource) => {
      const matchesCategory = category === "All" || resource.category === category;
      const matchesQuery = !query || `${resource.name} ${resource.location}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query, refreshKey]);

  const handleAdd = () => {
    createResource({
      name: "New smart resource",
      description: "Freshly added for demo management.",
      category: "Other Resources",
      location: "Floor 1",
      capacity: 8,
      image: "/images/boardroom.svg",
      amenities: ["Flexible layout", "Display", "Power access"],
      status: "available",
    });
    setRefreshKey((value) => value + 1);
  };

  const handleToggle = (id: string) => {
    const resource = getResources().find((item) => item.id === id);
    if (!resource) return;
    toggleResourceStatus(id, resource.status === "available" ? "maintenance" : "available");
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="administrator" />
      <div className="flex flex-1 flex-col">
        <Navbar role="administrator" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Catalog</p>
              <h1 className="text-3xl font-semibold text-slate-900">Manage resources</h1>
            </div>
            <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" /> Add resource</Button>
          </div>

          <Card className="mb-6">
            <div className="grid gap-4 md:grid-cols-[1.5fr_0.7fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources" className="pl-10" />
              </div>
              <Select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="All">All</option>
                <option value="Meeting Rooms">Meeting Rooms</option>
                <option value="Workspaces">Workspaces</option>
                <option value="Equipment">Equipment</option>
                <option value="Parking Spaces">Parking Spaces</option>
                <option value="Other Resources">Other Resources</option>
              </Select>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <Card key={resource.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{resource.category}</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">{resource.name}</h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{resource.status}</span>
                </div>
                <p className="text-sm text-slate-600">{resource.location}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => updateResource(resource.id, { status: resource.status === "available" ? "reserved" : "available" })}>Edit</Button>
                  <Button variant="secondary" onClick={() => handleToggle(resource.id)}>{resource.status === "maintenance" ? "Activate" : "Deactivate"}</Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
