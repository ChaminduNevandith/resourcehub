const express = require('express');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  rescheduleBooking,
} = require('../controllers/bookingController');

const router = express.Router();

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/reschedule', rescheduleBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
