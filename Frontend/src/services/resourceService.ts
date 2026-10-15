import { apiFetch } from "@/services/api";
import type { Resource, ResourceCategory, ResourceStatus } from "@/types/resource";

let resourceCache: Resource[] = [];
let hasLoadedResources = false;

export async function refreshResources() {
  try {
    const serverResources = await apiFetch<Resource[]>("/resources");
    if (Array.isArray(serverResources)) {
      resourceCache = serverResources;
      hasLoadedResources = true;
    }
  } catch (error) {
    console.error("Unable to load resources from backend.", error);
    resourceCache = [];
  }

  return resourceCache;
}

export function getResources() {
  if (!hasLoadedResources && typeof window !== "undefined") {
    void refreshResources();
  }
  return resourceCache;
}

export function getResourceById(id: string) {
  return getResources().find((resource) => resource.id === id) ?? null;
}

export function getResourcesByCategory(category?: ResourceCategory) {
  const items = getResources();
  if (!category) return items;
  return items.filter((resource) => resource.category === category);
}

export function searchResources(query: string, category?: ResourceCategory) {
  const normalized = query.toLowerCase().trim();
  return getResources().filter((resource) => {
    const matchesCategory = category ? resource.category === category : true;
    if (!normalized) return matchesCategory;
    const haystack = `${resource.name} ${resource.location} ${resource.description} ${resource.category}`.toLowerCase();
    return matchesCategory && haystack.includes(normalized);
  });
}

export async function createResource(payload: Omit<Resource, "id">) {
  const serverResource = await apiFetch<Resource>("/resources", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  resourceCache = [...getResources(), serverResource];
  return serverResource;
}

export async function updateResource(id: string, updates: Partial<Resource>) {
  const current = getResources();
  const index = current.findIndex((resource) => resource.id === id);
  if (index < 0) return null;

  const updatedResource = await apiFetch<Resource>(`/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  resourceCache = current.map((resource) => (resource.id === id ? updatedResource : resource));
  return updatedResource;
}

export function toggleResourceStatus(id: string, status: ResourceStatus) {
  return updateResource(id, { status });
}

export async function deleteResource(id: string) {
  const current = getResources();
  const index = current.findIndex((resource) => resource.id === id);
  if (index < 0) return false;

  await apiFetch<{ deleted: boolean }>(`/resources/${id}`, {
    method: "DELETE",
  });

  resourceCache = current.filter((resource) => resource.id !== id);
  return true;
}
