import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const response = await resetPassword({ email, newPassword, confirmPassword });

    if (response.message && response.message.includes('Password reset successfully')) {
      setMessage(response.message);
      setLoading(false);
      setTimeout(() => navigate('/login'), 1800);
    } else {
      setError(response.message || 'Could not reset password.');
      setLoading(false);
    }
  };

  return (
    <main className="page-center">
      <section className="card">
        <h2>Reset Password</h2>
        <p>Enter your email and a new password to recover your account.</p>

        {message && <div className="status-message">{message}</div>}
        {error && <div className="status-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <p className="small-text">
          Remembered your password?{' '}
          <button className="link-button" type="button" onClick={() => navigate('/login')}>
            Login
          </button>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
