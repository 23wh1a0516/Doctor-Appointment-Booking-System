import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [specialization, setSpecialization] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const response = await signup({ name, email, password, role, specialization, phone });

    if (response.message && response.message.includes('success')) {
      setMessage('Account created successfully. Please log in.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 1400);
    } else {
      setError(response.message || 'Signup failed');
      setLoading(false);
    }
  };

  return (
    <main className="page-center">
      <section className="card">
        <h2>Sign Up</h2>
        <p>Register a new account so you can book appointments and access your dashboard.</p>

        {message && <div className="status-message">{message}</div>}
        {error && <div className="status-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="user">User</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === 'doctor' && (
            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <input
                id="specialization"
                type="text"
                value={specialization}
                onChange={(event) => setSpecialization(event.target.value)}
                placeholder="e.g. General, Cardiologist"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Signup;
