const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'resourcehub',
  ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
};

const pool = new Pool(dbConfig);
const databaseState = { ready: false };
const validStatuses = ['confirmed', 'pending', 'cancelled', 'completed'];

// Fallback data keeps the application usable when PostgreSQL is unavailable.
const inMemory = {
  resources: [
    { id: 'r1', name: 'Harbor Boardroom', description: 'Executive meeting room with 4K display and video conferencing.', category: 'Meeting Rooms', location: 'Floor 12 - North Wing', capacity: 12, image: '/images/boardroom.svg', amenities: ['4K display', 'Video call', 'Whiteboard'], status: 'available' },
    { id: 'r2', name: 'Summit Collaboration Hub', description: 'Flexible teamwork space for brainstorming and workshops.', category: 'Meeting Rooms', location: 'Floor 5 - East Wing', capacity: 8, image: '/images/collab.svg', amenities: ['TV display', 'Standing desk', 'Conference phone'], status: 'reserved' },
    { id: 'r3', name: 'North Focus Studio', description: 'Quiet room designed for hybrid team meetings and presentations.', category: 'Meeting Rooms', location: 'Floor 7 - West Wing', capacity: 6, image: '/images/focus.svg', amenities: ['Acoustic panels', 'Dual displays', 'Webcam'], status: 'available' },
    { id: 'r4', name: 'Atlas Team Lounge', description: 'Open coworking lounge for collaborative work and quick huddles.', category: 'Workspaces', location: 'Floor 3 - Central Hub', capacity: 20, image: '/images/lounge.svg', amenities: ['Monitor wall', 'Power hubs', 'Coffee station'], status: 'available' },
    { id: 'r5', name: 'Skyline Desk Zone', description: 'Hot-desking space with ergonomic seating and storage.', category: 'Workspaces', location: 'Floor 8 - Skyline', capacity: 10, image: '/images/desk.svg', amenities: ['Ergonomic chairs', 'Lockers', 'USB hubs'], status: 'reserved' },
    { id: 'r6', name: 'Projector Kit A', description: 'Portable projector with wireless casting support.', category: 'Equipment', location: 'Equipment Locker A', capacity: 1, image: '/images/projector.svg', amenities: ['HDMI', 'Wireless screen share', 'Carry case'], status: 'available' },
    { id: 'r7', name: 'Conference Camera Pro', description: '4K conference camera suitable for hybrid meeting rooms.', category: 'Equipment', location: 'Equipment Locker B', capacity: 1, image: '/images/camera.svg', amenities: ['Auto focus', 'Tripod mount', 'USB-C'], status: 'available' },
    { id: 'r8', name: 'Lot 4 Visitor Parking', description: 'Reserved visitor parking area near the main entrance.', category: 'Parking Spaces', location: 'Lot 4', capacity: 18, image: '/images/parking.svg', amenities: ['EV charging', 'Visitor passes', 'Covered spots'], status: 'reserved' },
    { id: 'r9', name: 'Innovation Lab', description: 'Flexible innovation space for workshops, demos, and product testing.', category: 'Other Resources', location: 'Floor 9 - Innovation Hall', capacity: 16, image: '/images/lab.svg', amenities: ['Display wall', 'Whiteboards', 'Demo equipment'], status: 'available' },
    { id: 'r10', name: 'Recording Booth', description: 'Sound-treated booth for podcasting, interviews, and demos.', category: 'Other Resources', location: 'Floor 4 - Media Suite', capacity: 2, image: '/images/booth.svg', amenities: ['Acoustic treatment', 'Lighting kit', 'Audio monitor'], status: 'maintenance' },
    { id: 'r11', name: 'Glasshouse Meeting Room', description: 'Bright, airy meeting room ideal for customer presentations.', category: 'Meeting Rooms', location: 'Floor 2 - Atrium', capacity: 10, image: '/images/boardroom.svg', amenities: ['Natural light', 'Video wall', 'Bluetooth audio'], status: 'available' },
    { id: 'r12', name: 'Cedar Studio', description: 'Private workspace for focused calls and creative work.', category: 'Workspaces', location: 'Floor 6 - Studio Wing', capacity: 4, image: '/images/focus.svg', amenities: ['Monitor', 'Standing desk', 'Phone booth'], status: 'available' },
  ],
  bookings: [
    { id: 'b1', userId: 'u1', resourceId: 'r1', startTime: '2026-10-13T09:00:00.000Z', endTime: '2026-10-13T10:00:00.000Z', status: 'confirmed', purpose: 'Quarterly planning', createdAt: '2026-10-10T08:00:00.000Z' },
    { id: 'b2', userId: 'u2', resourceId: 'r2', startTime: '2026-10-13T11:00:00.000Z', endTime: '2026-10-13T12:30:00.000Z', status: 'confirmed', purpose: 'Product alignment', createdAt: '2026-10-11T10:00:00.000Z' },
    { id: 'b3', userId: 'u3', resourceId: 'r3', startTime: '2026-10-14T13:00:00.000Z', endTime: '2026-10-14T15:00:00.000Z', status: 'pending', purpose: 'Client workshop', createdAt: '2026-10-12T12:00:00.000Z' },
    { id: 'b4', userId: 'u4', resourceId: 'r4', startTime: '2026-10-15T10:00:00.000Z', endTime: '2026-10-15T12:00:00.000Z', status: 'confirmed', purpose: 'Design review', createdAt: '2026-10-09T09:00:00.000Z' },
    { id: 'b5', userId: 'u8', resourceId: 'r5', startTime: '2026-10-16T14:00:00.000Z', endTime: '2026-10-16T16:00:00.000Z', status: 'confirmed', purpose: 'Team sprint', createdAt: '2026-10-08T08:30:00.000Z' },
    { id: 'b6', userId: 'u1', resourceId: 'r6', startTime: '2026-10-17T09:30:00.000Z', endTime: '2026-10-17T10:30:00.000Z', status: 'completed', purpose: 'Presentation setup', createdAt: '2026-10-05T07:00:00.000Z' },
    { id: 'b7', userId: 'u2', resourceId: 'r7', startTime: '2026-10-18T11:00:00.000Z', endTime: '2026-10-18T12:00:00.000Z', status: 'cancelled', purpose: 'Interview recording', createdAt: '2026-10-07T11:00:00.000Z' },
    { id: 'b8', userId: 'u3', resourceId: 'r8', startTime: '2026-10-19T08:00:00.000Z', endTime: '2026-10-19T09:00:00.000Z', status: 'confirmed', purpose: 'Visitor parking', createdAt: '2026-10-06T14:00:00.000Z' },
    { id: 'b9', userId: 'u4', resourceId: 'r9', startTime: '2026-10-20T15:00:00.000Z', endTime: '2026-10-20T17:00:00.000Z', status: 'confirmed', purpose: 'Prototype demo', createdAt: '2026-10-10T10:30:00.000Z' },
    { id: 'b10', userId: 'u1', resourceId: 'r10', startTime: '2026-10-21T10:00:00.000Z', endTime: '2026-10-21T11:00:00.000Z', status: 'pending', purpose: 'Recording session', createdAt: '2026-10-12T09:00:00.000Z' },
    { id: 'b11', userId: 'u5', resourceId: 'r1', startTime: '2026-10-22T09:00:00.000Z', endTime: '2026-10-22T10:30:00.000Z', status: 'confirmed', purpose: 'Leadership sync', createdAt: '2026-10-09T10:30:00.000Z' },
    { id: 'b12', userId: 'u2', resourceId: 'r11', startTime: '2026-10-23T14:00:00.000Z', endTime: '2026-10-23T15:00:00.000Z', status: 'confirmed', purpose: 'Customer check-in', createdAt: '2026-10-07T16:30:00.000Z' },
    { id: 'b13', userId: 'u3', resourceId: 'r12', startTime: '2026-10-24T09:00:00.000Z', endTime: '2026-10-24T10:00:00.000Z', status: 'confirmed', purpose: 'Deep work block', createdAt: '2026-10-11T13:00:00.000Z' },
    { id: 'b14', userId: 'u6', resourceId: 'r2', startTime: '2026-10-25T16:00:00.000Z', endTime: '2026-10-25T17:00:00.000Z', status: 'pending', purpose: 'Operations review', createdAt: '2026-10-13T08:00:00.000Z' },
    { id: 'b15', userId: 'u7', resourceId: 'r4', startTime: '2026-10-26T13:00:00.000Z', endTime: '2026-10-26T15:00:00.000Z', status: 'completed', purpose: 'Research review', createdAt: '2026-10-04T15:00:00.000Z' },
  ],
};

function normalizeResource(resource) {
  if (Array.isArray(resource.amenities)) {
    return { ...resource, amenities: [...resource.amenities] };
  }

  if (typeof resource.amenities === 'string') {
    try {
      return { ...resource, amenities: JSON.parse(resource.amenities) };
    } catch (error) {
      return { ...resource, amenities: [] };
    }
  }

  return { ...resource, amenities: [] };
}

function normalizeBooking(booking) {
  return { ...booking };
}

function getResourcesFallback() {
  return inMemory.resources.map((resource) => ({ ...resource, amenities: [...resource.amenities] }));
}

function getBookingsFallback() {
  return inMemory.bookings.map((booking) => ({ ...booking }));
}

function hasBookingConflict(startTime, endTime, resourceId, ignoreBookingId = null) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return false;
  }

  // Ranges overlap when each starts before the other one ends.
  return getBookingsFallback().some((booking) => {
    if (booking.resourceId !== resourceId) return false;
    if (ignoreBookingId && booking.id === ignoreBookingId) return false;
    if (booking.status === 'cancelled') return false;

    const existingStart = new Date(booking.startTime).getTime();
    const existingEnd = new Date(booking.endTime).getTime();
    return start < existingEnd && end > existingStart;
  });
}

async function initializeDatabase() {
  try {
    // Create the schema and seed demo data on the first successful connection.
    await pool.query('SELECT 1');
    databaseState.ready = true;

    await pool.query(`
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
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(20) PRIMARY KEY,
        "userId" VARCHAR(50) NOT NULL,
        "resourceId" VARCHAR(20) NOT NULL,
        "startTime" TIMESTAMPTZ NOT NULL,
        "endTime" TIMESTAMPTZ NOT NULL,
        status VARCHAR(50) NOT NULL,
        purpose TEXT,
        "createdAt" TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query('ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_resourceid_fkey');
    await pool.query(`
      ALTER TABLE bookings
        ADD CONSTRAINT bookings_resourceid_fkey
        FOREIGN KEY ("resourceId") REFERENCES resources(id) ON DELETE CASCADE
    `);

    await pool.query(`
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
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        token_hash VARCHAR(128) PRIMARY KEY,
        "userId" VARCHAR(20) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "createdAt" TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const resourceCountResult = await pool.query('SELECT COUNT(*)::int AS total FROM resources');
    if (Number(resourceCountResult.rows[0].total) === 0) {
      for (const resource of inMemory.resources) {
        await pool.query(
          'INSERT INTO resources (id, name, description, category, location, capacity, image, amenities, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [resource.id, resource.name, resource.description, resource.category, resource.location, resource.capacity, resource.image, JSON.stringify(resource.amenities), resource.status],
        );
      }
    }

    const bookingCountResult = await pool.query('SELECT COUNT(*)::int AS total FROM bookings');
    if (Number(bookingCountResult.rows[0].total) === 0) {
      for (const booking of inMemory.bookings) {
        await pool.query(
          'INSERT INTO bookings (id, "userId", "resourceId", "startTime", "endTime", status, purpose, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [booking.id, booking.userId, booking.resourceId, booking.startTime, booking.endTime, booking.status, booking.purpose, booking.createdAt],
        );
      }
    }

    console.log('PostgreSQL connected. Database initialized successfully.');
  } catch (error) {
    databaseState.ready = false;
    console.warn('PostgreSQL connection unavailable. Using in-memory fallback data.', error.message);
  }
}

module.exports = {
  pool,
  databaseState,
  validStatuses,
  inMemory,
  normalizeResource,
  normalizeBooking,
  getResourcesFallback,
  getBookingsFallback,
  hasBookingConflict,
  initializeDatabase,
};
