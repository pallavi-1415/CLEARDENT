const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  treatmentCategory: { type: String, required: true },
  treatmentName: { type: String, required: true },
  price: { type: String, required: true },
  doctorName: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String, default: '' },
  location: { type: String, default: 'ClearDent Smile Studio - Downtown' },
  paymentMethod: { type: String, default: 'Pay at Clinic' },
  status: { type: String, default: 'Upcoming', enum: ['Upcoming', 'Approved', 'Completed', 'Cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
