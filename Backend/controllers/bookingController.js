const {
  pool,
  databaseState,
  validStatuses,
  normalizeBooking,
  getBookingsFallback,
  inMemory,
  hasBookingConflict,
} = require('../config/database');

const bookingSelect = `
  SELECT b.*, u.name AS "bookedByName", u.email AS "bookedByEmail"
  FROM bookings b
  LEFT JOIN users u ON u.id = b."userId"
`;

async function getAllBookings(req, res) {
  // Include basic user details so booking cards can render without another request.
  if (databaseState.ready) {
    const { rows } = await pool.query(`${bookingSelect} ORDER BY b."createdAt" DESC`);
    return res.json(rows.map(normalizeBooking));
  }

  return res.json(getBookingsFallback());
}

async function getBookingById(req, res) {
  const { id } = req.params;

  if (databaseState.ready) {
    const { rows } = await pool.query(`${bookingSelect} WHERE b.id = $1`, [id]);
    const booking = rows[0];
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    return res.json(normalizeBooking(booking));
  }

  const booking = getBookingsFallback().find((item) => item.id === id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  return res.json(booking);
}

async function createBooking(req, res) {
  // Validate the time range before checking conflicts or persisting the booking.
  const { resourceId, startTime, endTime, status = 'pending', purpose = 'Requested reservation' } = req.body;
  const userId = req.user?.id || req.body.userId;

  if (!userId || !resourceId || !startTime || !endTime) {
    return res.status(400).json({ message: 'userId, resourceId, startTime and endTime are required.' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return res.status(400).json({ message: 'End time must be after start time.' });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status is invalid.' });
  }

  if (hasBookingConflict(startTime, endTime, resourceId)) {
    return res.status(409).json({ message: 'This time slot overlaps with an existing reservation.' });
  }

  const newBooking = {
    id: `b${Date.now()}`,
    userId,
    resourceId,
    startTime,
    endTime,
    status,
    purpose,
    createdAt: new Date().toISOString(),
  };

  if (databaseState.ready) {
    await pool.query(
      'INSERT INTO bookings (id, "userId", "resourceId", "startTime", "endTime", status, purpose, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [newBooking.id, newBooking.userId, newBooking.resourceId, newBooking.startTime, newBooking.endTime, newBooking.status, newBooking.purpose, newBooking.createdAt],
    );
  } else {
    inMemory.bookings.push(newBooking);
  }

  return res.status(201).json(newBooking);
}

async function updateBookingStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status is invalid.' });
  }

  if (databaseState.ready) {
    const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'Booking not found.' });

    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, id]);
    const { rows: updated } = await pool.query(`${bookingSelect} WHERE b.id = $1`, [id]);
    return res.json(normalizeBooking(updated[0]));
  }

  const booking = inMemory.bookings.find((item) => item.id === id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  booking.status = status;
  return res.json(booking);
}

async function deleteBooking(req, res) {
  const { id } = req.params;

  if (databaseState.ready) {
    const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'Booking not found.' });
    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
    return res.json({ id, deleted: true });
  }

  const index = inMemory.bookings.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ message: 'Booking not found.' });
  inMemory.bookings.splice(index, 1);
  return res.json({ id, deleted: true });
}

async function rescheduleBooking(req, res) {
  const { id } = req.params;
  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    return res.status(400).json({ message: 'startTime and endTime are required.' });
  }

  if (databaseState.ready) {
    const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'Booking not found.' });

    await pool.query('UPDATE bookings SET "startTime" = $1, "endTime" = $2 WHERE id = $3', [startTime, endTime, id]);
    const { rows: updated } = await pool.query(`${bookingSelect} WHERE b.id = $1`, [id]);
    return res.json(normalizeBooking(updated[0]));
  }

  const booking = inMemory.bookings.find((item) => item.id === id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  booking.startTime = startTime;
  booking.endTime = endTime;
  return res.json(booking);
}

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  rescheduleBooking,
};
