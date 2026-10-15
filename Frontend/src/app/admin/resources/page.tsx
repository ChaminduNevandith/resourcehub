"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getResources, createResource, updateResource, toggleResourceStatus, deleteResource, refreshResources } from "@/services/resourceService";
import { getStoredUser } from "@/services/authService";
import type { Resource, ResourceCategory, ResourceStatus } from "@/types/resource";

export default function AdminResourcesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [saving, setSaving] = useState(false);
   useEffect(() => {
    if (getStoredUser()?.role !== "administrator") {
      router.replace("/dashboard");
      return;
    }
    void refreshResources().then(() => setRefreshKey((value) => value + 1));
  }, [router]);
 const resources = useMemo(() => {
    return getResources().filter((resource) => {
      const matchesCategory = category === "All" || resource.category === category;
      const matchesQuery = !query || `${resource.name} ${resource.location}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query, refreshKey]);

  const handleAdd = async () => {
    try {
      await createResource({
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
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not add resource.");
    }
  };

  const handleToggle = async (id: string) => {
    const resource = getResources().find((item) => item.id === id);
    if (!resource) return;
    try {
      await toggleResourceStatus(id, resource.status === "available" ? "maintenance" : "available");
      setRefreshKey((value) => value + 1);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not update resource.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await deleteResource(id);
      setRefreshKey((value) => value + 1);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not delete resource.");
    }
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingResource) return;

    setSaving(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const amenities = String(formData.get("amenities") ?? "")
      .split(",")
      .map((amenity) => amenity.trim())
      .filter(Boolean);

    try {
      await updateResource(editingResource.id, {
        name: String(formData.get("name") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        category: String(formData.get("category")) as ResourceCategory,
        location: String(formData.get("location") ?? "").trim(),
        capacity: Number(formData.get("capacity") ?? 0),
        image: String(formData.get("image") ?? "").trim(),
        amenities,
        status: String(formData.get("status")) as ResourceStatus,
      });
      setEditingResource(null);
      setRefreshKey((value) => value + 1);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not update resource.");
    } finally {
      setSaving(false);
    }
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
          {error ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

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
                  <Button variant="secondary" onClick={() => { setError(null); setEditingResource(resource); }}>Edit</Button>
                  <Button variant="secondary" onClick={() => handleToggle(resource.id)}>{resource.status === "maintenance" ? "Activate" : "Deactivate"}</Button>
                  <Button variant="danger" onClick={() => handleDelete(resource.id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
      {editingResource ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="edit-resource-title" className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Catalog</p>
                <h2 id="edit-resource-title" className="mt-1 text-2xl font-semibold text-slate-900">Edit resource</h2>
              </div>
              <button type="button" aria-label="Close edit resource dialog" onClick={() => setEditingResource(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="grid gap-4 md:grid-cols-2">
              <Input label="Name" name="name" defaultValue={editingResource.name} required />
              <Input label="Location" name="location" defaultValue={editingResource.location} required />
              <Select label="Category" name="category" defaultValue={editingResource.category}>
                <option value="Meeting Rooms">Meeting Rooms</option>
                <option value="Workspaces">Workspaces</option>
                <option value="Equipment">Equipment</option>
                <option value="Parking Spaces">Parking Spaces</option>
                <option value="Other Resources">Other Resources</option>
              </Select>
              <Select label="Status" name="status" defaultValue={editingResource.status}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </Select>
              <Input label="Capacity" name="capacity" type="number" min="0" defaultValue={editingResource.capacity ?? 0} required />
              <Input label="Image path" name="image" defaultValue={editingResource.image} required />
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Description
                <textarea name="description" defaultValue={editingResource.description} rows={3} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>
              <div className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                <span>Amenities <span className="font-normal text-slate-400">(comma separated)</span></span>
                <Input name="amenities" defaultValue={editingResource.amenities.join(", ")} />
              </div>
              <div className="flex justify-end gap-3 md:col-span-2">
                <Button type="button" variant="secondary" onClick={() => setEditingResource(null)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
