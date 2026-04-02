const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Appointment.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('1234', salt);

    const userNames = [
      'Aarav Sharma', 'Isha Patel', 'Rohan Gupta', 'Sana Mehta', 'Aditya Singh',
      'Nisha Venkatesh', 'Rahul Reddy', 'Priya Joshi', 'Karan Malhotra', 'Sonia Iyer',
      'Ayesha Khan', 'Devesh Naik', 'Rhea Suresh', 'Vikram Das', 'Ananya Roy',
      'Sameer Bose', 'Pallavi Kumar', 'Vinod Nair', 'Mira Shah', 'Arjun Chawla',
    ];

    const doctorNames = [
      'Dr. Neha Kapoor', 'Dr. Varun Khanna', 'Dr. Shweta Rao', 'Dr. Anil Verma', 'Dr. Meera Joshi',
      'Dr. Rahul Bhat', 'Dr. Kiran Nair', 'Dr. Pooja Sen', 'Dr. Sanjay Desai', 'Dr. Nidhi Ghosh',
      'Dr. Ritu Anand', 'Dr. Vivek Saini', 'Dr. Tara Pillai', 'Dr. Manish Agarwal', 'Dr. Deepa Shah',
    ];

    const specializations = [
      'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics',
      'Gynecology', 'Psychiatry', 'ENT', 'Urology', 'Endocrinology',
      'Gastroenterology', 'Ophthalmology', 'General', 'Pulmonology', 'Nephrology',
    ];

    const users = userNames.map((name, index) => ({
      name,
      email: `user${index + 1}@example.com`,
      password: passwordHash,
      role: 'user',
      phone: `90000000${100 + index}`,
    }));

    const doctors = doctorNames.map((name, index) => ({
      name,
      email: `doctor${index + 1}@example.com`,
      password: passwordHash,
      role: 'doctor',
      specialization: specializations[index],
      phone: `90100000${100 + index}`,
    }));

    const admin = [{ name: 'Admin User', email: 'admin@example.com', password: passwordHash, role: 'admin', phone: '9000000000' }];

    const createdUsers = await User.insertMany([...users, ...doctors, ...admin]);

    const patient = createdUsers.find((item) => item.role === 'user');
    const doctor = createdUsers.find((item) => item.role === 'doctor');

    await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      date: new Date(Date.now() + 86400000),
      time: '14:00',
      reason: 'Back pain',
      status: 'pending',
    });

    console.log('Seed data created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
