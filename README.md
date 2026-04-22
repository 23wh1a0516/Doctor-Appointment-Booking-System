# 🏥 Doctor Appointment Booking System

A full-stack **Doctor Appointment Management System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)** that digitizes and streamlines appointment scheduling between patients and doctors.

The system supports **Patients, Doctors, and Admins** with secure authentication, role-based access control, appointment booking, schedule management, and appointment status tracking.

---

## 🚀 Features

### 👤 Patient Module
- Register and Login securely
- Browse available doctors
- Book appointments
- View appointment history
- Cancel appointments
- Track appointment status

### 🩺 Doctor Module
- Secure doctor login
- Manage availability and schedules
- View assigned appointments
- Approve or reject requests
- Mark appointments as completed

### 🛠️ Admin Module
- Add and manage doctors
- View registered users
- Monitor all appointments
- Manage platform operations

---

## 🔐 Authentication & Security
- JWT Authentication
- Role-Based Authorization (Patient / Doctor / Admin)
- Protected Routes
- Secure Password Handling
- Middleware-based Access Control

---

## 🧰 Tech Stack

### Frontend
- React.js
- React Router
- Axios

### UI
- Bootstrap / Material UI / Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### API
- RESTful APIs

---

## 📂 Project Structure

```bash
Doctor-Appointment-Booking-System/
│
├── client/               # React Frontend
│   ├── src/components
│   ├── src/pages
│   ├── src/context
│   └── src/services
│
├── server/               # Node + Express Backend
│   ├── models
│   ├── routes
│   ├── controllers
│   ├── middleware
│   └── config
│
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### User Collection
```js
{
 name,
 email,
 password,
 role
}
```

### Doctor Collection
```js
{
 userId,
 specialization,
 availability,
 experience
}
```

### Appointment Collection
```js
{
 patientId,
 doctorId,
 date,
 time,
 status
}
```

---

## ⚙️ Installation and Setup

### Clone Repository
```bash
git clone https://github.com/23wh1a0516/Doctor-Appointment-Booking-System.git

cd Doctor-Appointment-Booking-System
```

---

### Install Dependencies

Backend:
```bash
npm install
```

Frontend:
```bash
cd client
npm install
```

---

## 🔑 Environment Variables

Create `.env` file in root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## ▶️ Run the Project

Backend:
```bash
npm run server
```

Frontend:
```bash
cd client
npm start
```

---

## 🌐 Application Workflow

1. Patient registers and logs in  
2. Views available doctors  
3. Books appointment  
4. Doctor reviews request  
5. Doctor approves/rejects appointment  
6. Patient tracks status  

---

## 📸 Screenshots

### Login Page
(Add Screenshot Here)

### Patient Dashboard
(Add Screenshot Here)

### Doctor Dashboard
(Add Screenshot Here)

### Appointment Booking
(Add Screenshot Here)

---

## 📌 API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

### Doctors
```http
GET /api/doctors
GET /api/doctors/:id
```

### Appointments
```http
POST /api/appointments/book
GET /api/appointments
PUT /api/appointments/:id
DELETE /api/appointments/:id
```

---

## ✨ Future Enhancements
- Email Notifications
- SMS Alerts
- Video Consultation
- Online Payments
- AI-based Doctor Recommendation
- Mobile Application

---

## 🎯 Advantages
✔ Prevents appointment conflicts  
✔ Reduces manual scheduling  
✔ Improves hospital efficiency  
✔ Scalable for multiple hospitals  
✔ Real-world MERN project implementation  

---

## 👩‍💻 Author

**Vaishnavi Chunduru**
---

## 📜 License
This project is for educational and academic purposes.
