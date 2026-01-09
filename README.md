# Doctor Appointment Management System

## Project Overview

The **Doctor Appointment Management System** is a full-stack web application designed to digitize and streamline the process of managing medical appointments. It enables patients to book appointments with doctors, allows doctors to efficiently manage schedules and appointment requests, and optionally provides admin-level control for overseeing system operations.

---

## Users of the System

###  Patient

* Register and log in securely
* View available doctors
* Book medical appointments
* View appointment history
* Cancel appointments

###  Doctor

* Secure login
* View assigned appointments
* Manage availability and schedule
* Approve, reject, or complete appointments

### Admin (Optional)

* Add or remove doctors
* View registered users
* Monitor and manage all appointments

---

##  Key Features

* Secure authentication and authorization using **JWT**
* Role-based access control (**Patient / Doctor / Admin**)
* Appointment booking with real-time availability checking
* Appointment status tracking and management
* Doctor availability and schedule management
* Separate dashboards for patients and doctors

---

##  Application Pages

* Login and Registration Page
* Patient Dashboard
* Doctor Dashboard
* Book Appointment Page
* Admin Panel *(Optional)*
* Profile Page *(Optional)*

---

##  Technology Stack

### Frontend

* React.js
* React Router
* Axios

### UI Styling

* Bootstrap / Material UI / Tailwind CSS

### Backend

* Node.js
* Express.js

### Authentication

* JWT-based Authentication

### Database

* MongoDB
* Mongoose ODM

### API Architecture

* RESTful APIs

---

##  Database Design

### User Collection

* Name
* Email
* Password
* Role *(Patient / Doctor / Admin)*

### Doctor Collection

* User ID
* Specialization
* Availability
* Experience

### Appointment Collection

* Patient ID
* Doctor ID
* Date
* Time
* Status

---

##  System Workflow

1. Patient registers and logs into the system
2. Patient views available doctors
3. Patient selects a doctor and books an appointment
4. Doctor reviews appointment requests
5. Doctor approves or rejects appointments
6. Patient views updated appointment status

---

##  Advantages

* Reduces manual appointment handling
* Saves time for both patients and doctors
* Prevents appointment conflicts
* Improves hospital efficiency
* Scalable for multiple hospitals

---

##  Future Enhancements

* Email and SMS notifications
* Online payment integration
* Video consultation support
* AI-based doctor recommendations
* Mobile application development

---

##  Conclusion

The **Doctor Appointment Management System**, built using the **MERN stack**, is a complete full-stack solution that demonstrates real-world application development. It offers a secure, scalable, and user-friendly platform, making it an ideal academic as well as practical project.
