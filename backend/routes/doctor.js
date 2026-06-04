const express = require('express');
const router = express.Router();
const doctorAuth = require('../middleware/doctorAuth');
const {
  getDoctorAppointments,
  getDoctorStats,
  getDoctorProfile,
  updateDoctorProfile,
  updateAppointmentStatus
} = require('../controllers/doctorController');

// All doctor routes require doctor authentication
router.use(doctorAuth);

router.get('/appointments', getDoctorAppointments);
router.get('/stats', getDoctorStats);
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);
router.put('/appointments/:id/status', updateAppointmentStatus);

module.exports = router;
