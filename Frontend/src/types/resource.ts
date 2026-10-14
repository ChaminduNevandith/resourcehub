export type ResourceCategory =
  | "Meeting Rooms"
  | "Workspaces"
  | "Equipment"
  | "Parking Spaces"
  | "Other Resources";

export type ResourceStatus = "available" | "reserved" | "maintenance";

export interface Resource {
  id: string;
  name: string;
  description: string;
  category: ResourceCategory;
  location: string;
  capacity?: number;
  image: string;
  amenities: string[];
  status: ResourceStatus;
}
