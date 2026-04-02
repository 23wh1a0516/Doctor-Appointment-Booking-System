const express = require('express');
const { getDashboard, updateProfile } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getDashboard);
router.put('/profile', protect, updateProfile);

module.exports = router;
