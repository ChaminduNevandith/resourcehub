import { resources as mockResources } from "@/lib/mockData";
import { apiFetch } from "@/services/api";
import type { Resource, ResourceCategory, ResourceStatus } from "@/types/resource";

let resourceCache: Resource[] = [...mockResources];
let hasLoadedResources = false;

export async function refreshResources() {
  try {
    const serverResources = await apiFetch<Resource[]>("/resources");
    if (Array.isArray(serverResources)) {
      resourceCache = serverResources;
      hasLoadedResources = true;
    }
  } catch (error) {
    console.warn("Unable to load resources from backend; using local fallback data.", error);
    resourceCache = [...mockResources];
  }

  return resourceCache;
}

export function getResources() {
  if (!hasLoadedResources) {
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

export function createResource(payload: Omit<Resource, "id">) {
  const nextResource: Resource = {
    ...payload,
    id: `r${Date.now()}`,
  };

  const current = getResources();
  const updated = [...current, nextResource];
  resourceCache = updated;

  void apiFetch<Resource>("/resources", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((serverResource) => {
    resourceCache = resourceCache.map((item) => item.id === nextResource.id ? serverResource : item);
  }).catch((error) => {
    console.warn("Could not sync new resource to backend.", error);
  });

  return nextResource;
}

export function updateResource(id: string, updates: Partial<Resource>) {
  const current = getResources();
  const index = current.findIndex((resource) => resource.id === id);
  if (index < 0) return null;

  const updatedResource = { ...current[index], ...updates };
  resourceCache = current.map((resource) => (resource.id === id ? updatedResource : resource));

  void apiFetch<Resource>(`/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  }).catch((error) => {
    console.warn("Could not sync resource update to backend.", error);
  });

  return updatedResource;
}

export function toggleResourceStatus(id: string, status: ResourceStatus) {
  return updateResource(id, { status });
}

export function deleteResource(id: string) {
  const current = getResources();
  const index = current.findIndex((resource) => resource.id === id);
  if (index < 0) return false;

  resourceCache = current.filter((resource) => resource.id !== id);

  void apiFetch<{ deleted: boolean }>(`/resources/${id}`, {
    method: "DELETE",
  }).catch((error) => {
    console.warn("Could not delete resource on backend.", error);
  });

  return true;
}
