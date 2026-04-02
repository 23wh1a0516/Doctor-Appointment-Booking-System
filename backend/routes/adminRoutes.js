const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { getUsersAndDoctors, deleteUser } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', protect, adminOnly, getUsersAndDoctors);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
