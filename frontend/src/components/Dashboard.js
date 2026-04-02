import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDashboard,
  getDoctors,
  bookAppointment,
  getUserAppointments,
  getDoctorRequests,
  acceptAppointment,
  rejectAppointment,
  cancelAppointment,
  getAdminUsers,
  updateProfile,
  deleteUser,
} from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [adminData, setAdminData] = useState({ users: [], doctors: [], appointmentStats: { totalAppointments: 0, pendingAppointments: 0, acceptedAppointments: 0 } });
  const [form, setForm] = useState({ doctorId: '', date: '', time: '', reason: '', specialization: '' });
  const [rejectReasons, setRejectReasons] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', specialization: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('doctorAppToken');
  const storedUser = localStorage.getItem('doctorAppUser');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    getDashboard(token)
      .then((response) => {
        if (response.message && response.message === 'Invalid token') {
          setError('Session expired. Please login again.');
          localStorage.removeItem('doctorAppToken');
          localStorage.removeItem('doctorAppUser');
          setUser(null);
          navigate('/login');
        } else if (response.message) {
          setError(response.message);
        } else {
          setData(response);
          if (response.user) {
            setUser(response.user);
            localStorage.setItem('doctorAppUser', JSON.stringify(response.user));
          }
        }
      })
      .catch((err) => {
        setError(err.message || 'Unable to load dashboard data.');
      });
  }, [navigate, token]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    if (user.role === 'user') {
      getDoctors(token)
        .then((response) => {
          if (response.message) {
            setError(response.message);
            setDoctors([]);
            setSpecializations([]);
            return;
          }
          setDoctors(response.doctors || []);
          setSpecializations(response.specializations || []);
        })
        .catch(() => setError('Unable to load doctors.'));

      getUserAppointments(token)
        .then((response) => {
          if (response.message) {
            setError(response.message);
            setAppointments([]);
            return;
          }
          setAppointments(response.appointments || []);
        })
        .catch(() => setError('Unable to load appointments.'));
    }

    if (user.role === 'doctor') {
      getDoctorRequests(token)
        .then((response) => {
          if (response.message) {
            setError(response.message);
            setRequests([]);
            return;
          }
          setRequests(response.requests || []);
        })
        .catch(() => setError('Unable to load appointment requests.'));
    }

    if (user.role === 'admin') {
      getAdminUsers(token)
        .then((response) => {
          if (response.message) {
            setError(response.message);
            setAdminData({ users: [], doctors: [], appointmentStats: { totalAppointments: 0, pendingAppointments: 0, acceptedAppointments: 0 } });
            return;
          }
          setAdminData({
            users: response.users || [],
            doctors: response.doctors || [],
            appointmentStats: response.appointmentStats || { totalAppointments: 0, pendingAppointments: 0, acceptedAppointments: 0 },
          });
        })
        .catch(() => setError('Unable to load admin dashboard data.'));
    }
  }, [token, user]);

  const handleLogout = () => {
    localStorage.removeItem('doctorAppToken');
    localStorage.removeItem('doctorAppUser');
    setUser(null);
    navigate('/login');
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleProfileChange = (event) => {
    setProfileForm({ ...profileForm, [event.target.name]: event.target.value });
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const response = await updateProfile(token, profileForm);
    if (response.message && response.message.includes('updated')) {
      setUser(response.user);
      localStorage.setItem('doctorAppUser', JSON.stringify(response.user));
      setMessage(response.message);
      setIsEditingProfile(false);
    } else {
      setError(response.message || 'Could not update profile.');
    }
  };

  const handleBookAppointment = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const response = await bookAppointment(token, form);
    if (response.message && response.message.includes('success')) {
      setMessage(response.message);
      setForm({
        ...form,
        doctorId: '',
        date: '',
        time: '',
        reason: '',
      });
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

  const handleRejectChange = (event, appointmentId) => {
    setRejectReasons({ ...rejectReasons, [appointmentId]: event.target.value });
  };

  const handleReject = async (appointmentId) => {
    const reason = (rejectReasons[appointmentId] || '').trim();
    if (!reason) {
      setError('Please provide a reason for rejection.');
      return;
    }

    const response = await rejectAppointment(token, appointmentId, { reason });
    if (response.message && response.message.includes('rejected')) {
      setMessage(response.message);
      setRejectReasons({ ...rejectReasons, [appointmentId]: '' });
      const updated = await getDoctorRequests(token);
      setRequests(updated.requests || []);
    } else {
      setError(response.message || 'Could not reject request.');
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

  const handleCancelAppointment = async (appointmentId) => {
    const response = await cancelAppointment(token, appointmentId);
    if (response.message && response.message.includes('canceled')) {
      setMessage(response.message);
      const updated = await getUserAppointments(token);
      setAppointments(updated.appointments || []);
    } else {
      setError(response.message || 'Could not cancel appointment.');
    }
  };

  const renderHome = () => {
    if (user.role === 'user') {
      const nextAppointment = appointments[0];

      return (
        <div className="info-card">
          <h3>Welcome back, {user.name.split(' ')[0]}</h3>
          <p className="small-text">This is your patient dashboard. Use the sidebar to book appointments and review your history.</p>
          <div className="board-grid" style={{ marginTop: '16px' }}>
            <div className="info-card">
              <h4>Total Appointments</h4>
              <p>{appointments.length}</p>
            </div>
            <div className="info-card">
              <h4>Next Visit</h4>
              {nextAppointment ? (
                <>
                  <p>{new Date(nextAppointment.date).toLocaleDateString()}</p>
                  <p>{nextAppointment.time}</p>
                  <p>{nextAppointment.doctor.name}</p>
                </>
              ) : (
                <p>No upcoming visits</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (user.role === 'doctor') {
      return (
        <div className="info-card">
          <h3>Doctor Overview</h3>
          <p className="small-text">Use the sidebar to review and accept patient appointment requests.</p>
          <div className="board-grid" style={{ marginTop: '16px' }}>
            <div className="info-card">
              <h4>Pending Requests</h4>
              <p>{requests.length}</p>
            </div>
            <div className="info-card">
              <h4>Your Profile</h4>
              <p>{user.name}</p>
            </div>
          </div>
        </div>
      );
    }

    if (user.role === 'admin') {
      return (
        <div className="info-card">
          <h3>Admin Overview</h3>
          <p className="small-text">Manage users and doctors from the sidebar panels below.</p>
          <div className="board-grid" style={{ marginTop: '16px' }}>
            <div className="info-card">
              <h4>Total Users</h4>
              <p>{adminData.users.length}</p>
            </div>
            <div className="info-card">
              <h4>Total Doctors</h4>
              <p>{adminData.doctors.length}</p>
            </div>
            <div className="info-card">
              <h4>Booked Appointments</h4>
              <p>{adminData.appointmentStats.totalAppointments}</p>
            </div>
            <div className="info-card">
              <h4>Pending Requests</h4>
              <p>{adminData.appointmentStats.pendingAppointments}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderAppointments = () => {
    if (user.role === 'user') {
      return (
        <div className="info-card">
          <h3>Book an Appointment</h3>
          <form onSubmit={handleBookAppointment}>
            <div className="form-group">
              <label htmlFor="specialization">Doctor Specialization</label>
              <select
                name="specialization"
                id="specialization"
                value={form.specialization}
                onChange={(event) => {
                  setForm({ ...form, specialization: event.target.value, doctorId: '' });
                }}
                required
              >
                <option value="">Choose specialization</option>
                {specializations.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

                  <div className="form-group">
              <label htmlFor="doctorId">Select Doctor</label>
              <select name="doctorId" id="doctorId" value={form.doctorId} onChange={handleChange} required>
                <option value="">Choose a doctor</option>
                {doctors
                  .filter((doctor) => !form.specialization || doctor.specialization === form.specialization)
                  .map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} ({doctor.specialization || 'General'})
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input name="date" id="date" type="date" value={form.date} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input name="time" id="time" type="time" value={form.time} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <input name="reason" id="reason" type="text" value={form.reason} onChange={handleChange} />
            </div>

            <button className="primary-btn" type="submit">Book Appointment</button>
          </form>
        </div>
      );
    }

    if (user.role === 'doctor') {
      return renderRequests();
    }

    if (user.role === 'admin') {
      return (
        <div className="info-card">
          <h3>Admin Overview</h3>
          <p className="small-text">Use the sidebar to manage users and doctors, or review platform activity.</p>
        </div>
      );
    }

    return null;
  };

  const renderMyAppointments = () => (
    <div className="info-card">
      <h3>Your Appointments</h3>
      {appointments.length === 0 ? (
        <p className="small-text">No appointments booked yet.</p>
      ) : (
        <div className="board-grid">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="info-card">
              <p><strong>Doctor:</strong> {appointment.doctor.name}</p>
              <p><strong>Specialization:</strong> {appointment.doctor.specialization || 'General'}</p>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRequests = () => (
    <div className="info-card">
      <h3>Appointment Requests</h3>
      {requests.length === 0 ? (
        <p className="small-text">No new appointment requests.</p>
      ) : (
        requests.map((request) => (
          <div key={request._id} className="info-card request-card">
            <p><strong>Patient:</strong> {request.patient.name}</p>
            <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {request.time}</p>
            <p><strong>Reason:</strong> {request.reason || 'N/A'}</p>
            <div className="form-group">
              <label htmlFor={`reject-${request._id}`}>Rejection Reason</label>
              <textarea
                id={`reject-${request._id}`}
                value={rejectReasons[request._id] || ''}
                onChange={(event) => handleRejectChange(event, request._id)}
                placeholder="Provide a reason if rejecting"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="primary-btn" type="button" onClick={() => handleAccept(request._id)}>Accept Request</button>
              <button className="secondary-btn" type="button" onClick={() => handleReject(request._id)}>Reject Request</button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="profile-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Your Profile</h3>
        {!isEditingProfile && (
          <button className="secondary-btn" type="button" onClick={() => setIsEditingProfile(true)} style={{ width: 'auto', padding: '10px 16px' }}>
            Edit
          </button>
        )}
      </div>
      {isEditingProfile ? (
        <form onSubmit={handleProfileSave}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={profileForm.name} onChange={handleProfileChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} required />
          </div>
          {user.role === 'doctor' && (
            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <input id="specialization" name="specialization" type="text" value={profileForm.specialization} onChange={handleProfileChange} required />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" value={profileForm.phone} onChange={handleProfileChange} />
          </div>
          <button className="primary-btn" type="submit">Save Profile</button>
          <button className="secondary-btn" type="button" onClick={() => setIsEditingProfile(false)} style={{ marginTop: '10px' }}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.role === 'doctor' && <p><strong>Specialization:</strong> {user.specialization || 'Not provided'}</p>}
          <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
        </>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="info-card">
      <h3>Manage Users</h3>
      {adminData.users.length === 0 ? (
        <p className="small-text">No users registered yet.</p>
      ) : (
        adminData.users.map((userItem) => (
          <div key={userItem._id} className="list-row">
            <span>{userItem.name} — {userItem.email}</span>
            <button className="secondary-btn" type="button" onClick={() => handleDeleteUser(userItem._id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );

  const renderDoctors = () => (
    <div className="info-card">
      <h3>Manage Doctors</h3>
      {adminData.doctors.length === 0 ? (
        <p className="small-text">No doctors registered yet.</p>
      ) : (
        adminData.doctors.map((doctor) => (
          <div key={doctor._id} className="list-row">
            <span>{doctor.name} — {doctor.specialization || 'General'} — {doctor.email}</span>
            <button className="secondary-btn" type="button" onClick={() => handleDeleteUser(doctor._id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );

  const getNavTabs = () => {
    if (user.role === 'user') {
      return [
        { label: 'Home', key: 'Home' },
        { label: 'Book Appointment', key: 'Appointments' },
        { label: 'My Appointments', key: 'MyAppointments' },
        { label: 'Profile', key: 'Profile' },
      ];
    }

    if (user.role === 'doctor') {
      return [
        { label: 'Home', key: 'Home' },
        { label: 'Requests', key: 'Requests' },
        { label: 'Profile', key: 'Profile' },
      ];
    }

    if (user.role === 'admin') {
      return [
        { label: 'Home', key: 'Home' },
        { label: 'Users', key: 'Users' },
        { label: 'Doctors', key: 'Doctors' },
        { label: 'Profile', key: 'Profile' },
      ];
    }

    return [{ label: 'Home', key: 'Home' }, { label: 'Profile', key: 'Profile' }];
  };

  const renderTabContent = () => {
    if (activeTab === 'Home') {
      return renderHome();
    }

    if (activeTab === 'Appointments') {
      return renderAppointments();
    }

    if (activeTab === 'MyAppointments') {
      return (
        <div className="info-card">
          <h3>Your Appointments</h3>
          {appointments.length === 0 ? (
            <p className="small-text">No appointments booked yet.</p>
          ) : (
            <div className="board-grid">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="info-card">
                  <p><strong>Doctor:</strong> {appointment.doctor.name}</p>
                  <p><strong>Specialization:</strong> {appointment.doctor.specialization || 'General'}</p>
                  <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                  {appointment.status === 'rejected' && (
                    <p><strong>Rejection Reason:</strong> {appointment.rejectReason || 'Not provided'}</p>
                  )}
                  <button className="secondary-btn" type="button" onClick={() => handleCancelAppointment(appointment._id)} style={{ marginTop: '12px' }}>
                    Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'Requests') {
      return renderRequests();
    }

    if (activeTab === 'Users') {
      return renderUsers();
    }

    if (activeTab === 'Doctors') {
      return renderDoctors();
    }

    if (activeTab === 'Profile') {
      return renderProfile();
    }

    return null;
  };

  if (!token || !user) {
    return null;
  }

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">DoctorCare</div>
        <p className="small-text">Welcome back, {user.name}</p>
        <nav>
          {getNavTabs().map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          <button className="nav-item logout" type="button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      <section className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h2>{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</h2>
            <p>{data?.message || 'Manage your account and appointments here.'}</p>
          </div>
          <div className="profile-chip">{user.email}</div>
        </div>

        {message && <div className="status-message">{message}</div>}
        {error && <div className="status-message">{error}</div>}

        <div className="dashboard-panel">{renderTabContent()}</div>
      </section>
    </main>
  );
};

export default Dashboard;
