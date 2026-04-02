const User = require('../models/User');

exports.getDashboard = (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  const data = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization || '',
      phone: user.phone || '',
    },
    message: '',
  };

  if (user.role === 'admin') {
    data.message = 'Welcome to the admin dashboard. You can manage users and doctor schedules.';
  } else if (user.role === 'doctor') {
    data.message = 'Welcome to the doctor dashboard. You can see appointments and patient details.';
  } else {
    data.message = 'Welcome to the patient dashboard. You can book and view appointments.';
  }

  res.json(data);
};

exports.updateProfile = async (req, res) => {
  const { name, email, phone, specialization } = req.body;
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const currentUser = await User.findById(user.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== currentUser._id.toString()) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone || currentUser.phone;

    if (currentUser.role === 'doctor') {
      currentUser.specialization = specialization || currentUser.specialization;
    }

    await currentUser.save();

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        specialization: currentUser.specialization || '',
        phone: currentUser.phone || '',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not update profile.' });
  }
};
