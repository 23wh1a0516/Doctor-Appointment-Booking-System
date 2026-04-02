import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDashboard,
  getDoctors,
  bookAppointment,
  getUserAppointments,
  getDoctorRequests,
  acceptAppointment,
  getAdminUsers,
  deleteUser,
} from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [adminData, setAdminData] = useState({ users: [], doctors: [] });
  const [form, setForm] = useState({ doctorId: '', date: '', time: '', reason: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('doctorAppToken');
  const storedUser = localStorage.getItem('doctorAppUser');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    getDashboard(token).then((response) => {
      if (response.message && response.message === 'Invalid token') {
        setError('Session expired. Please login again.');
        localStorage.removeItem('doctorAppToken');
        localStorage.removeItem('doctorAppUser');
        navigate('/login');
      } else {
        setData(response);
      }
    });
  }, [navigate, token]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    if (user.role === 'user') {
      getDoctors(token).then((response) => {
        setDoctors(response.doctors || []);
      });
      getUserAppointments(token).then((response) => {
        setAppointments(response.appointments || []);
      });
    }

    if (user.role === 'doctor') {
      getDoctorRequests(token).then((response) => {
        setRequests(response.requests || []);
      });
    }

    if (user.role === 'admin') {
      getAdminUsers(token).then((response) => {
        setAdminData({ users: response.users || [], doctors: response.doctors || [] });
      });
    }
  }, [token, user]);

  const handleLogout = () => {
    localStorage.removeItem('doctorAppToken');
    localStorage.removeItem('doctorAppUser');
    navigate('/login');
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleBookAppointment = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const response = await bookAppointment(token, form);
    if (response.message && response.message.includes('success')) {
      setMessage(response.message);
      setForm({ doctorId: '', date: '', time: '', reason: '' });
      const updated = await getUserAppointments(token);
      setAppointments(updated.appointments || []);
    } else {
      setError(response.message || 'Could not book appointment.');
    }
  };

  const handleAccept = async (appointmentId) => {
    const response = await acceptAppointment(token, appointmentId);
    if (response.message && response.message.includes('accepted')) {
      setMessage(response.message);
      const updated = await getDoctorRequests(token);
      setRequests(updated.requests || []);
    } else {
      setError(response.message || 'Could not accept request.');
    }
  };

  const handleDeleteUser = async (userId) => {
    const response = await deleteUser(token, userId);
    if (response.message && response.message.includes('removed')) {
      setMessage(response.message);
      const updated = await getAdminUsers(token);
      setAdminData({ users: updated.users || [], doctors: updated.doctors || [] });
    } else {
      setError(response.message || 'Could not delete user.');
    }
  };

  if (!token || !user) {
    return null;
  }

  const renderHome = () => {
    if (user.role === 'user') {
      return (
        <div className="board-grid">
          {doctors.length === 0 ? (
            <p className="small-text">No doctors available yet.</p>
          ) : (
            doctors.map((doctor) => (
              <div key={doctor._id} className="info-card">
                <h3>{doctor.name}</h3>
                <p><strong>Specialization</strong> General</p>
                <p><strong>Experience</strong> 4 years</p>
                <p><strong>Contact</strong> {doctor.email}</p>
              </div>
            ))
          )}
        </div>
      );
    }

    if (user.role === 'doctor') {
      return <p className="small-text">Use the sidebar to review appointment requests and update your profile.</p>;
    }

    if (user.role === 'admin') {
      return <p className="small-text">Use the sidebar to manage users and doctors.</p>;
    }

    return null;
  };

  const renderAppointments = () => {
    if (user.role === 'user') {
      return appointments.length === 0 ? (
        <p className="small-text">You have not booked any appointments yet.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment._id} className="info-card">
            <p><strong>Doctor:</strong> {appointment.doctor.name}</p>
            <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <p><strong>Status:</strong> {appointment.status}</p>
          </div>
        ))
      );
    }

    if (user.role === 'doctor') {
      return requests.length === 0 ? (
        <p className="small-text">No new appointment requests.</p>
      ) : (
        requests.map((request) => (
          <div key={request._id} className="info-card">
            <p><strong>Patient:</strong> {request.patient.name}</p>
            <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {request.time}</p>
            <p><strong>Reason:</strong> {request.reason || 'N/A'}</p>
            <button className="primary-btn" type="button" onClick={() => handleAccept(request._id)}>
              Accept
            </button>
          </div>
        ))
      );
    }

    if (user.role === 'admin') {
      return <p className="small-text">Appointments are managed by doctors and users in their own panels.</p>;
    }

    return null;
  };

  const renderApplyDoctor = () => {
    if (user.role === 'user') {
      return (
        <div>
          <p className="small-text">Apply to become a doctor on the platform. Send a request to the admin.</p>
          <button className="primary-btn" type="button" onClick={() => setMessage('Doctor application sent.')}>Send Application</button>
        </div>
      );
    }

    if (user.role === 'doctor') {
      return <p className="small-text">You are already a doctor.</p>;
    }

    if (user.role === 'admin') {
      return <p className="small-text">Admin accounts do not need to apply.</p>;
    }

    return null;
  };

  const renderProfile = () => (
    <div className="profile-card">
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
    </div>
  );

  const renderAdminData = () => (
    <div className="admin-grid">
      <div className="info-card">
        <h4>Users</h4>
        {adminData.users.length === 0 ? <p>No users found.</p> : adminData.users.map((userItem) => (
          <div key={userItem._id} className="list-row">
            <span>{userItem.name}</span>
            <button className="secondary-btn" type="button" onClick={() => handleDeleteUser(userItem._id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="info-card">
        <h4>Doctors</h4>
        {adminData.doctors.length === 0 ? <p>No doctors found.</p> : adminData.doctors.map((doctor) => (
          <div key={doctor._id} className="list-row">
            <span>{doctor.name}</span>
            <button className="secondary-btn" type="button" onClick={() => handleDeleteUser(doctor._id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">DOC APP</div>
        <nav>
          {['Home', 'Appointments', 'Apply Doctor', 'Profile'].map((item) => (
            <button
              key={item}
              className={`nav-item ${activeTab === item ? 'active' : ''}`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        <button className="nav-item logout" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="muted-label">Welcome back</p>
            <h1>{activeTab}</h1>
          </div>
          <div className="profile-chip">{user.name}</div>
        </header>

        <section className="dashboard-panel">
          {message && <div className="status-message">{message}</div>}
          {error && <div className="status-message">{error}</div>}

          {activeTab === 'Home' && renderHome()}
          {activeTab === 'Appointments' && renderAppointments()}
          {activeTab === 'Apply Doctor' && renderApplyDoctor()}
          {activeTab === 'Profile' && renderProfile()}

          {user.role === 'admin' && activeTab === 'Home' && renderAdminData()}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
