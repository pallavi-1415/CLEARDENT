const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc   Get dashboard stats
// @route  GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor', isApproved: true });
    const pendingDoctors = await User.countDocuments({ role: 'doctor', isApproved: false });
    const totalAppointments = await Appointment.countDocuments();
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = await Appointment.countDocuments({ appointmentDate: today });
    const upcomingAppointments = await Appointment.countDocuments({ status: 'Upcoming' });

    res.json({
      totalPatients,
      totalDoctors,
      pendingDoctors,
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Get all doctors (approved + pending)
// @route  GET /api/admin/doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    console.error('Admin getDoctors error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Approve a doctor
// @route  PUT /api/admin/doctors/:id/approve
exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    doctor.isApproved = true;
    await doctor.save();

    res.json({ message: 'Doctor approved successfully', doctor: { id: doctor._id, name: doctor.name, isApproved: true } });
  } catch (err) {
    console.error('Admin approveDoctor error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Reject/remove a doctor
// @route  DELETE /api/admin/doctors/:id
exports.rejectDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'Doctor rejected and removed.' });
  } catch (err) {
    console.error('Admin rejectDoctor error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Get all patients
// @route  GET /api/admin/patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get appointment counts per patient
    const patientIds = patients.map(p => p._id);
    const apptCounts = await Appointment.aggregate([
      { $match: { userId: { $in: patientIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    apptCounts.forEach(a => { countMap[a._id.toString()] = a.count; });

    const enriched = patients.map(p => ({
      ...p.toObject(),
      appointmentCount: countMap[p._id.toString()] || 0,
    }));

    res.json(enriched);
  } catch (err) {
    console.error('Admin getPatients error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Get all appointments
// @route  GET /api/admin/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('Admin getAllAppointments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
