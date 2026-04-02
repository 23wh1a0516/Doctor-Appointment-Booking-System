import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <main className="page-center">
      <section className="card">
        <h1>Doctor Appointment Booking</h1>
        <p>Welcome to the appointment booking system. Get started by logging in or creating an account.</p>
        <button className="primary-btn" onClick={() => navigate('/login')}>
          Get Started
        </button>
      </section>
    </main>
  );
};

export default Home;
