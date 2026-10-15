const express = require('express');
const {
  getAllResources,
  getResourceById,
  getResourceBookings,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Resource browsing is available to all clients.
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.get('/:id/bookings', getResourceBookings);

// Resource catalog changes require administrator access.
router.post('/', requireAuth, requireAdmin, createResource);
router.put('/:id', requireAuth, requireAdmin, updateResource);
router.delete('/:id', requireAuth, requireAdmin, deleteResource);

module.exports = router;
