const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getStats,
  getDoctors,
  approveDoctor,
  rejectDoctor,
  getPatients,
  getAllAppointments
} = require('../controllers/adminController');

// All admin routes require admin authentication
router.use(adminAuth);

router.get('/stats', getStats);
router.get('/doctors', getDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.delete('/doctors/:id', rejectDoctor);
router.get('/patients', getPatients);
router.get('/appointments', getAllAppointments);

module.exports = router;
