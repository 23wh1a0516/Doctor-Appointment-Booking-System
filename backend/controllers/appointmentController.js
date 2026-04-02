const Appointment = require('../models/Appointment');
const User = require('../models/User');

const removeExpiredAppointments = async () => {
  try {
    const now = new Date();
    const appointments = await Appointment.find({});
    const expiredIds = appointments
      .filter((appointment) => {
        const [hours, minutes] = appointment.time.split(':').map(Number);
        const appointmentDateTime = new Date(appointment.date);
        appointmentDateTime.setHours(hours || 0, minutes || 0, 0, 0);
        return appointmentDateTime < now;
      })
      .map((appointment) => appointment._id);

    if (expiredIds.length > 0) {
      await Appointment.deleteMany({ _id: { $in: expiredIds } });
    }
  } catch (error) {
    console.error('Failed to remove expired appointments', error);
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    await removeExpiredAppointments();

    const { doctorId, date, time, reason } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'Please provide doctor, date and time.' });
    }

    const appointmentDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    appointmentDate.setHours(hours || 0, minutes || 0, 0, 0);
    if (appointmentDate <= new Date()) {
      return res.status(400).json({ message: 'Cannot book an appointment in the past.' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'Please select a valid doctor.' });
    }

    const existingConflict = await Appointment.findOne({
      doctor: doctorId,
      date: appointmentDate,
      time,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingConflict) {
      return res.status(400).json({ message: 'Doctor already has an appointment at that time.' });
    }

    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date: appointmentDate,
      time,
      reason,
    });

    await appointment.save();

    res.status(201).json({ message: 'Appointment request sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not book appointment.' });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    await removeExpiredAppointments();

    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name email phone specialization')
      .sort({ date: 1, time: 1 });

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load appointments.' });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;
    const query = { role: 'doctor' };
    if (specialization) {
      query.specialization = specialization;
    }

    const doctors = await User.find(query, 'name email phone specialization');
    const specializations = await User.distinct('specialization', { role: 'doctor' });
    res.json({ doctors, specializations: specializations.filter((item) => item) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load doctors.' });
  }
};

exports.getDoctorRequests = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Doctor access required.' });
    }

    await removeExpiredAppointments();

    const requests = await Appointment.find({ doctor: req.user.id, status: 'pending' })
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load appointment requests.' });
  }
};

exports.acceptAppointment = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Doctor access required.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (appointment.doctor.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this appointment.' });
    }

    appointment.status = 'accepted';
    appointment.rejectReason = '';
    await appointment.save();

    res.json({ message: 'Appointment accepted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not accept appointment.' });
  }
};

exports.rejectAppointment = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Doctor access required.' });
    }

    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'Please provide a reason for rejection.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (appointment.doctor.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this appointment.' });
    }

    appointment.status = 'rejected';
    appointment.rejectReason = reason;
    await appointment.save();

    res.json({ message: 'Appointment rejected.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not reject appointment.' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'User access required.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (appointment.patient.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment.' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment canceled successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not cancel appointment.' });
  }
};

exports.cleanupExpiredAppointments = removeExpiredAppointments;
