CREATE TABLE IF NOT EXISTS resources (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER,
  image VARCHAR(255),
  amenities JSONB,
  status VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(20) PRIMARY KEY,
  "userId" VARCHAR(50) NOT NULL,
  "resourceId" VARCHAR(20) NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  "startTime" TIMESTAMPTZ NOT NULL,
  "endTime" TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) NOT NULL,
  purpose TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  avatar VARCHAR(10) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash VARCHAR(128) PRIMARY KEY,
  "userId" VARCHAR(20) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO resources (id, name, description, category, location, capacity, image, amenities, status)
VALUES
  ('r1', 'Harbor Boardroom', 'Executive meeting room with 4K display and video conferencing.', 'Meeting Rooms', 'Floor 12 - North Wing', 12, '/images/boardroom.svg', '["4K display", "Video call", "Whiteboard"]', 'available'),
  ('r2', 'Summit Collaboration Hub', 'Flexible teamwork space for brainstorming and workshops.', 'Meeting Rooms', 'Floor 5 - East Wing', 8, '/images/collab.svg', '["TV display", "Standing desk", "Conference phone"]', 'reserved'),
  ('r3', 'North Focus Studio', 'Quiet room designed for hybrid team meetings and presentations.', 'Meeting Rooms', 'Floor 7 - West Wing', 6, '/images/focus.svg', '["Acoustic panels", "Dual displays", "Webcam"]', 'available'),
  ('r4', 'Atlas Team Lounge', 'Open coworking lounge for collaborative work and quick huddles.', 'Workspaces', 'Floor 3 - Central Hub', 20, '/images/lounge.svg', '["Monitor wall", "Power hubs", "Coffee station"]', 'available'),
  ('r5', 'Skyline Desk Zone', 'Hot-desking space with ergonomic seating and storage.', 'Workspaces', 'Floor 8 - Skyline', 10, '/images/desk.svg', '["Ergonomic chairs", "Lockers", "USB hubs"]', 'reserved'),
  ('r6', 'Projector Kit A', 'Portable projector with wireless casting support.', 'Equipment', 'Equipment Locker A', 1, '/images/projector.svg', '["HDMI", "Wireless screen share", "Carry case"]', 'available'),
  ('r7', 'Conference Camera Pro', '4K conference camera suitable for hybrid meeting rooms.', 'Equipment', 'Equipment Locker B', 1, '/images/camera.svg', '["Auto focus", "Tripod mount", "USB-C"]', 'available'),
  ('r8', 'Lot 4 Visitor Parking', 'Reserved visitor parking area near the main entrance.', 'Parking Spaces', 'Lot 4', 18, '/images/parking.svg', '["EV charging", "Visitor passes", "Covered spots"]', 'reserved'),
  ('r9', 'Innovation Lab', 'Flexible innovation space for workshops, demos, and product testing.', 'Other Resources', 'Floor 9 - Innovation Hall', 16, '/images/lab.svg', '["Display wall", "Whiteboards", "Demo equipment"]', 'available'),
  ('r10', 'Recording Booth', 'Sound-treated booth for podcasting, interviews, and demos.', 'Other Resources', 'Floor 4 - Media Suite', 2, '/images/booth.svg', '["Acoustic treatment", "Lighting kit", "Audio monitor"]', 'maintenance'),
  ('r11', 'Glasshouse Meeting Room', 'Bright, airy meeting room ideal for customer presentations.', 'Meeting Rooms', 'Floor 2 - Atrium', 10, '/images/boardroom.svg', '["Natural light", "Video wall", "Bluetooth audio"]', 'available'),
  ('r12', 'Cedar Studio', 'Private workspace for focused calls and creative work.', 'Workspaces', 'Floor 6 - Studio Wing', 4, '/images/focus.svg', '["Monitor", "Standing desk", "Phone booth"]', 'available')
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (id, "userId", "resourceId", "startTime", "endTime", status, purpose, "createdAt")
VALUES
  ('b1', 'u1', 'r1', '2026-10-13T09:00:00.000Z', '2026-10-13T10:00:00.000Z', 'confirmed', 'Quarterly planning', '2026-10-10T08:00:00.000Z'),
  ('b2', 'u2', 'r2', '2026-10-13T11:00:00.000Z', '2026-10-13T12:30:00.000Z', 'confirmed', 'Product alignment', '2026-10-11T10:00:00.000Z'),
  ('b3', 'u3', 'r3', '2026-10-14T13:00:00.000Z', '2026-10-14T15:00:00.000Z', 'pending', 'Client workshop', '2026-10-12T12:00:00.000Z'),
  ('b4', 'u4', 'r4', '2026-10-15T10:00:00.000Z', '2026-10-15T12:00:00.000Z', 'confirmed', 'Design review', '2026-10-09T09:00:00.000Z'),
  ('b5', 'u8', 'r5', '2026-10-16T14:00:00.000Z', '2026-10-16T16:00:00.000Z', 'confirmed', 'Team sprint', '2026-10-08T08:30:00.000Z')
ON CONFLICT (id) DO NOTHING;
