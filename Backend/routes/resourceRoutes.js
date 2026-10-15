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

router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.get('/:id/bookings', getResourceBookings);
router.post('/', requireAuth, requireAdmin, createResource);
router.put('/:id', requireAuth, requireAdmin, updateResource);
router.delete('/:id', requireAuth, requireAdmin, deleteResource);

module.exports = router;
