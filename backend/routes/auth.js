const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../validators/authValidator');
const User = require('../models/User');
const uploadSingle = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/auth/signup
// Supports both patient (JSON/FormData without file) and doctor (FormData with license file)
router.post('/signup', uploadSingle, validateSignup, signup);

// @route   POST /api/auth/login
router.post('/login', validateLogin, login);

// Debug route: list all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/doctors/approved
// @access  Public
router.get('/doctors/approved', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isApproved: true }).select('name specialization bio phone timeSlots availability');
    res.json(doctors);
  } catch (err) {
    console.error('Fetch approved doctors error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
