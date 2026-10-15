const express = require('express');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  rescheduleBooking,
} = require('../controllers/bookingController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', requireAuth, createBooking);
router.put('/:id/status', requireAuth, requireAdmin, updateBookingStatus);
router.put('/:id/reschedule', requireAuth, rescheduleBooking);
router.delete('/:id', requireAuth, requireAdmin, deleteBooking);

module.exports = router;
