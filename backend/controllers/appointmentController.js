const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { treatmentCategory, treatmentName, price, doctorName, appointmentDate, timeSlot, notes, location, paymentMethod } = req.body;
    
    if (!treatmentCategory || !treatmentName || !price || !doctorName || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
      treatmentCategory,
      treatmentName,
      price,
      doctorName,
      appointmentDate,
      timeSlot,
      notes,
      location: location || 'Lumina Smile Studio - Downtown',
      paymentMethod: paymentMethod || 'Pay at Clinic',
      status: 'Upcoming'
    });

    // Fetch user details for real-time notification naming
    const user = await User.findById(req.user.id);
    const userName = user ? user.name : 'Guest Patient';

    if (global.io) {
      global.io.emit('appointmentCreated', {
        appointment: {
          ...appointment.toObject(),
          userId: { _id: req.user.id, name: userName, email: user ? user.email : '' }
        },
        message: `${userName} requested a ${treatmentName} at ${timeSlot}.`
      });
    }

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user's appointments
// @route   GET /api/appointments
// @access  Private
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, userId: req.user.id });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    if (global.io) {
      global.io.emit('appointmentStatusUpdated', {
        appointment,
        message: `An appointment for ${appointment.treatmentName} has been cancelled by the patient.`
      });
    }

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get booked slots for a doctor on a specific date
// @route   GET /api/appointments/booked
// @access  Private
exports.getBookedSlots = async (req, res) => {
  try {
    const { doctorName, date } = req.query;
    if (!doctorName || !date) {
      return res.status(400).json({ message: 'doctorName and date are required' });
    }

    const appointments = await Appointment.find({
      doctorName: doctorName,
      appointmentDate: date,
      status: { $in: ['Upcoming', 'Completed'] }
    }).select('timeSlot');

    res.json(appointments);
  } catch (err) {
    console.error('Get booked slots error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
