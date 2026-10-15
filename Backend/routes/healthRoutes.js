const express = require('express');
const { healthCheck } = require('../controllers/healthController');

const router = express.Router();

// Lightweight endpoint used to verify the API and database state.
router.get('/health', healthCheck);

module.exports = router;
