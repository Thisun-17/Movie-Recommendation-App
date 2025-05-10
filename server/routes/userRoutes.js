const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Register route
router.post('/', registerUser);

// Login route
router.post('/login', loginUser);

// Profile route (protected)
router.get('/profile', protect, getUserProfile);

module.exports = router;