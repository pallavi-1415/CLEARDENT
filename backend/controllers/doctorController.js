const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Find appointments matching the doctor's name
    // (Note: in booking/index.jsx, doctorName is saved, e.g. "Dr. Sarah Jenkins")
    // We do a case-insensitive search or match the name.
    const appointments = await Appointment.find({
      doctorName: { $regex: new RegExp(doctor.name, 'i') }
    }).populate('userId', 'name email dob').sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    console.error('Doctor appointments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get doctor dashboard stats
// @route   GET /api/doctor/stats
exports.getDoctorStats = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const appointments = await Appointment.find({
      doctorName: { $regex: new RegExp(doctor.name, 'i') }
    });

    const totalAppointments = appointments.length;
    const upcoming = appointments.filter(a => a.status === 'Upcoming').length;
    const approved = appointments.filter(a => a.status === 'Approved').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

    // Get unique patients
    const patientIds = [...new Set(appointments.map(a => a.userId.toString()))];
    const uniquePatientsCount = patientIds.length;

    res.json({
      totalAppointments,
      upcoming,
      approved,
      completed,
      cancelled,
      uniquePatientsCount
    });
  } catch (err) {
    console.error('Doctor stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get doctor profile
// @route   GET /api/doctor/profile
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    console.error('Doctor profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctor/profile
exports.updateDoctorProfile = async (req, res) => {
  try {
    const { name, dob, specialization, bio, phone, timeSlots, days, availability } = req.body;
    const doctor = await User.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const oldName = doctor.name;
    if (name && name !== oldName) {
      doctor.name = name;
      // Sync doctorName on all appointments
      await Appointment.updateMany({ doctorName: oldName }, { doctorName: name });
    }

    if (dob !== undefined) doctor.dob = dob;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (bio !== undefined) doctor.bio = bio;
    if (phone !== undefined) doctor.phone = phone;
    if (timeSlots && Array.isArray(timeSlots)) doctor.timeSlots = timeSlots;
    if (days && Array.isArray(days)) doctor.days = days;

    if (availability) {
      const formattedAvailability = [];
      for (const [day, slotsArray] of Object.entries(availability)) {
        if (Array.isArray(slotsArray)) {
          const slots = slotsArray.map(slotStr => {
            const [start, end] = slotStr.split(' - ');
            return { start: start.trim(), end: end?.trim() || '' };
          });
          formattedAvailability.push({ day, slots });
        }
      }
      doctor.availability = formattedAvailability;
    }

    await doctor.save();
    // Emit real-time update for availability
    if (global.io) {
      global.io.emit('availabilityUpdated', { 
        doctorId: doctor._id, 
        doctorName: doctor.name,
        timeSlots: doctor.timeSlots, 
        days: doctor.days,
        availability: doctor.availability 
      });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        dob: doctor.dob,
        role: doctor.role,
        specialization: doctor.specialization,
        bio: doctor.bio,
        phone: doctor.phone,
        timeSlots: doctor.timeSlots,
        availability: doctor.availability,
        isApproved: doctor.isApproved
      }
    });
  } catch (err) {
    console.error('Update doctor profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update appointment status
// @route   PUT /api/doctor/appointments/:id/status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Upcoming', 'Approved', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Upcoming, Approved, Completed, or Cancelled' });
    }

    const doctor = await User.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Verify appointment is for this doctor (using regex match to be safe and match doctor name)
    const docNameRegex = new RegExp(doctor.name, 'i');
    if (!docNameRegex.test(appointment.doctorName)) {
      return res.status(403).json({ message: 'Access denied: Appointment is assigned to another doctor' });
    }

    appointment.status = status;
    await appointment.save();

    if (global.io) {
      global.io.emit('appointmentStatusUpdated', {
        appointment,
        message: `Your appointment for ${appointment.treatmentName} has been ${status === 'Approved' ? 'approved' : status === 'Cancelled' ? 'declined' : status.toLowerCase()}.`
      });
    }

    res.json({ message: `Appointment status updated to ${status} successfully`, appointment });
  } catch (err) {
    console.error('Update appointment status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

