const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { cleanupExpiredAppointments } = require('./controllers/appointmentController');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'Doctor Appointment Booking backend is running' });
});

connectDB().then(() => {
  cleanupExpiredAppointments();
  setInterval(cleanupExpiredAppointments, 60 * 1000);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
