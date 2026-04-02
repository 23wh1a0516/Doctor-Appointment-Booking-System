const User = require('../models/User');

const Appointment = require('../models/Appointment');

exports.getUsersAndDoctors = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }, '-password').sort({ createdAt: -1 });
    const doctors = await User.find({ role: 'doctor' }, '-password').sort({ createdAt: -1 });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const acceptedAppointments = await Appointment.countDocuments({ status: 'accepted' });

    res.json({
      users,
      doctors,
      appointmentStats: { totalAppointments, pendingAppointments, acceptedAppointments },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load user data.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account.' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not delete user.' });
  }
};
