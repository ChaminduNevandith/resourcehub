const express = require('express');
const { register, login, me, updateMe, updatePassword, logout, listUsers } = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', me);
router.put('/me', requireAuth, updateMe);
router.put('/me/password', requireAuth, updatePassword);
router.post('/logout', logout);
router.get('/users', requireAuth, requireAdmin, listUsers);

module.exports = router;
