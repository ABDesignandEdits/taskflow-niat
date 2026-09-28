import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-root">
      <div className="auth-card-wrapper">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <div className="brand-logo-icon">
              <CheckCircle2 size={24} color="#ffffff" />
            </div>
            <span className="brand-name">TaskFlow</span>
          </Link>
          <h2 className="auth-title">Create Account 🚀</h2>
          <p className="auth-subtitle">Join thousands of students organizing tasks effortlessly.</p>
        </div>

        {error && <div className="auth-error-box">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label className="form-label">Your Full Name</label>
            <div className="auth-input-group">
              <User size={18} className="auth-input-icon" />
              <input
                type="text"
                className="form-input auth-input-with-icon"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="auth-input-group">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                className="form-input auth-input-with-icon"
                placeholder="alex@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password (Min 6 characters)</label>
            <div className="auth-input-group">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                className="form-input auth-input-with-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-auth-submit"
            disabled={loading}
            id="register-submit-btn"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-text">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-switch-link">
            Log In
          </Link>
        </div>
      </div>

      <style>{`
        .auth-page-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 60%), var(--bg-app);
        }

        .auth-card-wrapper {
          max-width: 440px;
          width: 100%;
          background: var(--bg-surface-glass);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          padding: 2.5rem 2rem;
          box-shadow: var(--card-shadow);
        }

        .auth-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.75rem;
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 800;
          font-size: 1.3rem;
          color: var(--text-main);
          margin-bottom: 1.25rem;
        }

        .auth-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.35rem;
        }

        .auth-subtitle {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .auth-error-box {
          background: var(--danger-light);
          color: var(--danger);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
          border: 1px solid rgba(239, 68, 68, 0.3);
          text-align: center;
        }

        .auth-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-dim);
        }

        .auth-input-with-icon {
          padding-left: 2.75rem;
        }

        .btn-auth-submit {
          width: 100%;
          padding: 0.85rem;
          margin-top: 0.5rem;
        }

        .auth-footer-text {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .auth-switch-link {
          font-weight: 700;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};
export default RegisterPage;