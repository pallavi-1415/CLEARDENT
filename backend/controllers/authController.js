const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT (includes role)
const generateToken = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };
  const secret = process.env.JWT_SECRET || 'default_secret';
  return jwt.sign(payload, secret, { expiresIn: '8h' });
};

// @desc   Register new user (patient or doctor)
// @route  POST /api/auth/signup  (multipart/form-data)
// @access Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, dob, role = 'patient', specialization = '' } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Build user object
    const userData = {
      name,
      email,
      dob,
      password: hashedPassword,
      role,
      specialization,
    };

    // Handle license file for doctors
    if (role === 'doctor' && req.file) {
      userData.licenseUrl = `/uploads/${req.file.filename}`;
      userData.isApproved = false; // must be approved by admin
    } else {
      userData.isApproved = true; // patients are auto-approved
    }

    const user = await User.create(userData);

    // Doctors get a pending response (no token yet)
    if (role === 'doctor') {
      return res.status(201).json({
        pending: true,
        message: 'Your doctor registration is pending admin approval. You will be notified once approved.',
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }

    const token = generateToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, dob: user.dob, role: user.role }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Login user (patient, doctor, admin)
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Block unapproved doctors
    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({
        message: 'Your account is pending admin approval. Please check back later.',
        pending: true
      });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        role: user.role,
        specialization: user.specialization,
        isApproved: user.isApproved,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
