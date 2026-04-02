import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await login({ email, password });

    if (response.token) {
      localStorage.setItem('doctorAppToken', response.token);
      localStorage.setItem('doctorAppUser', JSON.stringify(response.user));
      setLoading(false);
      navigate('/dashboard');
    } else {
      setError(response.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="page-center">
      <section className="card">
        <h2>Login</h2>
        <p>Enter your email and password to access your dashboard.</p>

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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="small-text">
          <button className="link-button" type="button" onClick={() => navigate('/forgot-password')}>
            Forgot password?
          </button>
        </p>
        <p className="small-text">
          Don't have an account?{' '}
          <button className="link-button" onClick={() => navigate('/signup')}>
            Sign up
          </button>
        </p>
      </section>
    </main>
  );
};

export default Login;
