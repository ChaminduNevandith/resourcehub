const express = require('express');
const {
  getAllResources,
  getResourceById,
  getResourceBookings,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');

const router = express.Router();

router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.get('/:id/bookings', getResourceBookings);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

module.exports = router;
