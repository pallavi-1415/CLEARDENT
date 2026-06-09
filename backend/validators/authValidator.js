const { validateEmail } = require('../utils/emailValidator');

exports.validateSignup = async (req, res, next) => {
  const { name, email, password, role = 'patient' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  // Perform strict email verification
  const emailValidation = await validateEmail(email);
  if (!emailValidation.valid) {
    return res.status(400).json({ message: emailValidation.reason });
  }

  // Doctors must upload a license
  if (role === 'doctor' && !req.file) {
    return res.status(400).json({ message: 'Medical license file is required for doctor registration.' });
  }

  // Block admin registration through this public route
  if (role === 'admin') {
    return res.status(403).json({ message: 'Admin registration is not permitted through this form.' });
  }

  // Validate role
  if (!['patient', 'doctor'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be patient or doctor.' });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  next();
};
