const express = require('express');
const { createAppointment, getMyAppointments, cancelAppointment, getBookedSlots } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected by auth middleware
router.post('/', auth, createAppointment);
router.get('/', auth, getMyAppointments);
router.get('/booked', auth, getBookedSlots);
router.put('/:id/cancel', auth, cancelAppointment);

module.exports = router;
