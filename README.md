# Doctor Appointment Booking System

This repository contains a MERN stack app for doctor appointment booking.

## Structure

- `backend/` - Express API, MongoDB connection, authentication, and dashboard routes
- `frontend/` - React app with Home, Login, Signup, and Dashboard pages

## Setup

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `backend/` with:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/doctorBooking
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```
3. Start backend:
   ```bash
   npm run dev
   ```
4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
5. Start frontend:
   ```bash
   npm start
   ```

## Notes

- The landing page includes a "Get Started" button redirecting to login.
- The login page includes a signup link directing to the signup page.
- Account creation uses role-based signup: `user`, `doctor`, and `admin`.
- After login, the app redirects to a role-aware dashboard.

## MongoDB

Use local MongoDB or a cloud URI. If you use MongoDB Atlas, update `MONGO_URI` accordingly.
