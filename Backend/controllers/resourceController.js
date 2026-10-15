const {
  pool,
  databaseState,
  normalizeResource,
  getResourcesFallback,
  getBookingsFallback,
  inMemory,
} = require('../config/database');

function serializeAmenities(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value));
    } catch {
      return JSON.stringify([]);
    }
  }
  return JSON.stringify([]);
}

async function getAllResources(req, res) {
  // Use PostgreSQL when available and keep the demo fallback usable otherwise.
  if (databaseState.ready) {
    const { rows } = await pool.query('SELECT * FROM resources ORDER BY name');
    return res.json(rows.map(normalizeResource));
  }

  return res.json(getResourcesFallback());
}

async function getResourceById(req, res) {
  const { id } = req.params;

  if (databaseState.ready) {
    const { rows } = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
    const resource = rows[0];
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }
    return res.json(normalizeResource(resource));
  }

  const resource = getResourcesFallback().find((item) => item.id === id);
  if (!resource) {
    return res.status(404).json({ message: 'Resource not found.' });
  }

  return res.json(resource);
}

async function getResourceBookings(req, res) {
  const { id } = req.params;

  if (databaseState.ready) {
    const { rows } = await pool.query(`
      SELECT b.*, u.name AS "bookedByName", u.email AS "bookedByEmail"
      FROM bookings b
      LEFT JOIN users u ON u.id = b."userId"
      WHERE b."resourceId" = $1
      ORDER BY b."createdAt" DESC
    `, [id]);
    return res.json(rows.map((booking) => ({ ...booking })));
  }

  const filtered = getBookingsFallback().filter((booking) => booking.resourceId === id);
  return res.json(filtered);
}

async function createResource(req, res) {
  // Normalize optional fields before writing a new catalog item.
  const { name, description, category, location, capacity, image, amenities, status = 'available' } = req.body;

  if (!name || !category || !location) {
    return res.status(400).json({ message: 'name, category and location are required.' });
  }

  const newResource = {
    id: `r${Date.now()}`,
    name,
    description: description || '',
    category,
    location,
    capacity: capacity ?? 1,
    image: image || '/images/default.svg',
    amenities: Array.isArray(amenities) ? amenities : [],
    status,
  };

  if (databaseState.ready) {
    await pool.query(
      'INSERT INTO resources (id, name, description, category, location, capacity, image, amenities, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [newResource.id, newResource.name, newResource.description, newResource.category, newResource.location, newResource.capacity, newResource.image, JSON.stringify(newResource.amenities), newResource.status],
    );
  } else {
    inMemory.resources.push(newResource);
  }

  return res.status(201).json(newResource);
}

async function updateResource(req, res) {
  const { id } = req.params;
  const updates = req.body;

  if (databaseState.ready) {
    const { rows } = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'Resource not found.' });

    const current = rows[0];
    const nextResource = {
      ...current,
      ...updates,
      amenities: Object.prototype.hasOwnProperty.call(updates, 'amenities')
        ? serializeAmenities(updates.amenities)
        : serializeAmenities(current.amenities),
    };

    await pool.query(
      'UPDATE resources SET name = $1, description = $2, category = $3, location = $4, capacity = $5, image = $6, amenities = $7, status = $8 WHERE id = $9',
      [nextResource.name, nextResource.description, nextResource.category, nextResource.location, nextResource.capacity, nextResource.image, nextResource.amenities, nextResource.status, id],
    );

    const { rows: updated } = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
    return res.json(normalizeResource(updated[0]));
  }

  const index = inMemory.resources.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ message: 'Resource not found.' });

  inMemory.resources[index] = { ...inMemory.resources[index], ...updates };
  return res.json(inMemory.resources[index]);
}

async function deleteResource(req, res) {
  const { id } = req.params;

  if (databaseState.ready) {
    const { rows } = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'Resource not found.' });

    const client = await pool.connect();
    try {
      // Remove dependent bookings in the same transaction as the resource.
      await client.query('BEGIN');
      await client.query('DELETE FROM bookings WHERE "resourceId" = $1', [id]);
      await client.query('DELETE FROM resources WHERE id = $1', [id]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    return res.json({ id, deleted: true });
  }

  const index = inMemory.resources.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ message: 'Resource not found.' });
  inMemory.resources.splice(index, 1);
  return res.json({ id, deleted: true });
}

module.exports = {
  getAllResources,
  getResourceById,
  getResourceBookings,
  createResource,
  updateResource,
  deleteResource,
};
