import { ResourceDetailsClient } from "@/components/resources/ResourceDetailsClient";
import { getResourceById } from "@/services/resourceService";

export const instant = false;

export default async function ResourceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = getResourceById(id);

  return <ResourceDetailsClient resource={resource} resourceId={id} />;
}
