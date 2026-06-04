const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { signup, login } = require('../controllers/authController');
const User = require('../models/User');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'license-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExts = /\.(jpeg|jpg|png|pdf)$/i;
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const validExt  = allowedExts.test(path.extname(file.originalname));
    const validMime = allowedMimes.includes(file.mimetype);
    if (validExt && validMime) {
      return cb(null, true);
    }
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPEG, JPG, PNG images and PDF files are allowed.'));
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Wrapper that handles multer errors gracefully
const uploadSingle = (req, res, next) => {
  upload.single('license')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      const msg = err instanceof multer.MulterError
        ? (err.code === 'LIMIT_FILE_SIZE' ? 'File size exceeds the 10MB limit.' : err.field || err.message)
        : (err.message || 'File upload error.');
      return res.status(400).json({ message: msg });
    }
    next();
  });
};

// @route   POST /api/auth/signup
// Supports both patient (JSON/FormData without file) and doctor (FormData with license file)
router.post('/signup', uploadSingle, signup);

// @route   POST /api/auth/login
router.post('/login', login);

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
