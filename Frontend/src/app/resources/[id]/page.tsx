import { ResourceDetailsClient } from "@/components/resources/ResourceDetailsClient";
import { resources } from "@/lib/mockData";
import { getResourceById } from "@/services/resourceService";

export function generateStaticParams() {
  return resources.map((resource) => ({ id: resource.id }));
}

export default async function ResourceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = getResourceById(id);

  return <ResourceDetailsClient resource={resource} />;
}
