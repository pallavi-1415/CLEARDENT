const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  // Doctor-specific fields
  specialization: { type: String, default: '' },
  licenseUrl: { type: String, default: '' },
  licensePublicId: { type: String, default: '' },
  isApproved: { type: Boolean, default: false },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  timeSlots: { type: [String], default: ['9:00 AM', '10:30 AM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'] },
  availability: [{
    day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], required: true },
    slots: { type: [{ start: { type: String }, end: { type: String } }], default: [] }
  }],
  // keep days for backward compatibility (optional) but will be deprecated
  days: { type: [String], enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
