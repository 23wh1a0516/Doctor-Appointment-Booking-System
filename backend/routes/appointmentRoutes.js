const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  bookAppointment,
  getUserAppointments,
  getDoctors,
  getDoctorRequests,
  acceptAppointment,
  rejectAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');

const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/', protect, getUserAppointments);
router.get('/doctors', protect, getDoctors);
router.get('/requests', protect, getDoctorRequests);
router.put('/:id/accept', protect, acceptAppointment);
router.put('/:id/reject', protect, rejectAppointment);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
