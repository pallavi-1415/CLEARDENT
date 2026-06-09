const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  service: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Read', 'Resolved'] }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
