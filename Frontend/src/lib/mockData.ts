import type { Booking } from "@/types/booking";
import type { Resource } from "@/types/resource";
import type { User } from "@/types/user";

export const users: User[] = [
  { id: "u1", name: "Ava Thompson", email: "ava@resourcehub.io", role: "employee", avatar: "AT", status: "active" },
  { id: "u2", name: "Noah Patel", email: "noah@resourcehub.io", role: "employee", avatar: "NP", status: "active" },
  { id: "u3", name: "Mila Garcia", email: "mila@resourcehub.io", role: "employee", avatar: "MG", status: "active" },
  { id: "u4", name: "Ethan Lee", email: "ethan@resourcehub.io", role: "employee", avatar: "EL", status: "active" },
  { id: "u5", name: "Sophia Nguyen", email: "sophia@resourcehub.io", role: "administrator", avatar: "SN", status: "active" },
  { id: "u6", name: "Lucas Brooks", email: "lucas@resourcehub.io", role: "employee", avatar: "LB", status: "inactive" },
  { id: "u7", name: "Emma Johnson", email: "emma@resourcehub.io", role: "administrator", avatar: "EJ", status: "active" },
  { id: "u8", name: "Daniel Kim", email: "daniel@resourcehub.io", role: "employee", avatar: "DK", status: "active" },
];

export const resources: Resource[] = [
  { id: "r1", name: "Harbor Boardroom", description: "Executive meeting room with 4K display and video conferencing.", category: "Meeting Rooms", location: "Floor 12 - North Wing", capacity: 12, image: "/images/boardroom.svg", amenities: ["4K display", "Video call", "Whiteboard"], status: "available" },
  { id: "r2", name: "Summit Collaboration Hub", description: "Flexible teamwork space for brainstorming and workshops.", category: "Meeting Rooms", location: "Floor 5 - East Wing", capacity: 8, image: "/images/collab.svg", amenities: ["TV display", "Standing desk", "Conference phone"], status: "reserved" },
  { id: "r3", name: "North Focus Studio", description: "Quiet room designed for hybrid team meetings and presentations.", category: "Meeting Rooms", location: "Floor 7 - West Wing", capacity: 6, image: "/images/focus.svg", amenities: ["Acoustic panels", "Dual displays", "Webcam"], status: "available" },
  { id: "r4", name: "Atlas Team Lounge", description: "Open coworking lounge for collaborative work and quick huddles.", category: "Workspaces", location: "Floor 3 - Central Hub", capacity: 20, image: "/images/lounge.svg", amenities: ["Monitor wall", "Power hubs", "Coffee station"], status: "available" },
  { id: "r5", name: "Skyline Desk Zone", description: "Hot-desking space with ergonomic seating and storage.", category: "Workspaces", location: "Floor 8 - Skyline", capacity: 10, image: "/images/desk.svg", amenities: ["Ergonomic chairs", "Lockers", "USB hubs"], status: "reserved" },
  { id: "r6", name: "Projector Kit A", description: "Portable projector with wireless casting support.", category: "Equipment", location: "Equipment Locker A", capacity: 1, image: "/images/projector.svg", amenities: ["HDMI", "Wireless screen share", "Carry case"], status: "available" },
  { id: "r7", name: "Conference Camera Pro", description: "4K conference camera suitable for hybrid meeting rooms.", category: "Equipment", location: "Equipment Locker B", capacity: 1, image: "/images/camera.svg", amenities: ["Auto focus", "Tripod mount", "USB-C"], status: "available" },
  { id: "r8", name: "Lot 4 Visitor Parking", description: "Reserved visitor parking area near the main entrance.", category: "Parking Spaces", location: "Lot 4", capacity: 18, image: "/images/parking.svg", amenities: ["EV charging", "Visitor passes", "Covered spots"], status: "reserved" },
  { id: "r9", name: "Innovation Lab", description: "Flexible innovation space for workshops, demos, and product testing.", category: "Other Resources", location: "Floor 9 - Innovation Hall", capacity: 16, image: "/images/lab.svg", amenities: ["Display wall", "Whiteboards", "Demo equipment"], status: "available" },
  { id: "r10", name: "Recording Booth", description: "Sound-treated booth for podcasting, interviews, and demos.", category: "Other Resources", location: "Floor 4 - Media Suite", capacity: 2, image: "/images/booth.svg", amenities: ["Acoustic treatment", "Lighting kit", "Audio monitor"], status: "maintenance" },
  { id: "r11", name: "Glasshouse Meeting Room", description: "Bright, airy meeting room ideal for customer presentations.", category: "Meeting Rooms", location: "Floor 2 - Atrium", capacity: 10, image: "/images/boardroom.svg", amenities: ["Natural light", "Video wall", "Bluetooth audio"], status: "available" },
  { id: "r12", name: "Cedar Studio", description: "Private workspace for focused calls and creative work.", category: "Workspaces", location: "Floor 6 - Studio Wing", capacity: 4, image: "/images/focus.svg", amenities: ["Monitor", "Standing desk", "Phone booth"], status: "available" },
];

export const bookings: Booking[] = [
  { id: "b1", userId: "u1", resourceId: "r1", startTime: "2026-10-13T09:00:00.000Z", endTime: "2026-10-13T10:00:00.000Z", status: "confirmed", purpose: "Quarterly planning", createdAt: "2026-10-10T08:00:00.000Z" },
  { id: "b2", userId: "u2", resourceId: "r2", startTime: "2026-10-13T11:00:00.000Z", endTime: "2026-10-13T12:30:00.000Z", status: "confirmed", purpose: "Product alignment", createdAt: "2026-10-11T10:00:00.000Z" },
  { id: "b3", userId: "u3", resourceId: "r3", startTime: "2026-10-14T13:00:00.000Z", endTime: "2026-10-14T15:00:00.000Z", status: "pending", purpose: "Client workshop", createdAt: "2026-10-12T12:00:00.000Z" },
  { id: "b4", userId: "u4", resourceId: "r4", startTime: "2026-10-15T10:00:00.000Z", endTime: "2026-10-15T12:00:00.000Z", status: "confirmed", purpose: "Design review", createdAt: "2026-10-09T09:00:00.000Z" },
  { id: "b5", userId: "u8", resourceId: "r5", startTime: "2026-10-16T14:00:00.000Z", endTime: "2026-10-16T16:00:00.000Z", status: "confirmed", purpose: "Team sprint", createdAt: "2026-10-08T08:30:00.000Z" },
  { id: "b6", userId: "u1", resourceId: "r6", startTime: "2026-10-17T09:30:00.000Z", endTime: "2026-10-17T10:30:00.000Z", status: "completed", purpose: "Presentation setup", createdAt: "2026-10-05T07:00:00.000Z" },
  { id: "b7", userId: "u2", resourceId: "r7", startTime: "2026-10-18T11:00:00.000Z", endTime: "2026-10-18T12:00:00.000Z", status: "cancelled", purpose: "Interview recording", createdAt: "2026-10-07T11:00:00.000Z" },
  { id: "b8", userId: "u3", resourceId: "r8", startTime: "2026-10-19T08:00:00.000Z", endTime: "2026-10-19T09:00:00.000Z", status: "confirmed", purpose: "Visitor parking", createdAt: "2026-10-06T14:00:00.000Z" },
  { id: "b9", userId: "u4", resourceId: "r9", startTime: "2026-10-20T15:00:00.000Z", endTime: "2026-10-20T17:00:00.000Z", status: "confirmed", purpose: "Prototype demo", createdAt: "2026-10-10T10:30:00.000Z" },
  { id: "b10", userId: "u1", resourceId: "r10", startTime: "2026-10-21T10:00:00.000Z", endTime: "2026-10-21T11:00:00.000Z", status: "pending", purpose: "Recording session", createdAt: "2026-10-12T09:00:00.000Z" },
  { id: "b11", userId: "u5", resourceId: "r1", startTime: "2026-10-22T09:00:00.000Z", endTime: "2026-10-22T10:30:00.000Z", status: "confirmed", purpose: "Leadership sync", createdAt: "2026-10-09T10:30:00.000Z" },
  { id: "b12", userId: "u2", resourceId: "r11", startTime: "2026-10-23T14:00:00.000Z", endTime: "2026-10-23T15:00:00.000Z", status: "confirmed", purpose: "Customer check-in", createdAt: "2026-10-07T16:30:00.000Z" },
  { id: "b13", userId: "u3", resourceId: "r12", startTime: "2026-10-24T09:00:00.000Z", endTime: "2026-10-24T10:00:00.000Z", status: "confirmed", purpose: "Deep work block", createdAt: "2026-10-11T13:00:00.000Z" },
  { id: "b14", userId: "u6", resourceId: "r2", startTime: "2026-10-25T16:00:00.000Z", endTime: "2026-10-25T17:00:00.000Z", status: "pending", purpose: "Operations review", createdAt: "2026-10-13T08:00:00.000Z" },
  { id: "b15", userId: "u7", resourceId: "r4", startTime: "2026-10-26T13:00:00.000Z", endTime: "2026-10-26T15:00:00.000Z", status: "completed", purpose: "Research review", createdAt: "2026-10-04T15:00:00.000Z" },
];
