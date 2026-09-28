import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    const demoEmail = 'student@taskflow.dev';
    const demoPass = 'teenagerDemo2026!';

    try {
      await login(demoEmail, demoPass);
      navigate('/dashboard');
    } catch (err) {
      try {
        await register('Alex Morgan', demoEmail, demoPass);
        navigate('/dashboard');
      } catch (regErr) {
        setError(regErr.message || 'Failed to start demo session.');
      }
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
          <h2 className="auth-title">Welcome back 👋</h2>
          <p className="auth-subtitle">Log in to continue organizing your tasks and goals.</p>
        </div>

        {error && <div className="auth-error-box">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="auth-input-group">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                className="form-input auth-input-with-icon"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-input-group">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                className="form-input auth-input-with-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-auth-submit"
            disabled={loading}
            id="login-submit-btn"
          >
            <span>{loading ? 'Logging In...' : 'Log In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-divider">
          <span>OR QUICK EXPLORE</span>
        </div>

        {/* 1-Click Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="btn btn-secondary btn-demo-login"
          disabled={loading}
          id="demo-login-btn"
        >
          <Sparkles size={17} color="#6366f1" />
          <span>🚀 1-Click Teenager Demo Login</span>
        </button>

        <div className="auth-footer-text">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-switch-link">
            Create Account
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

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.5rem 0;
          color: var(--text-dim);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-subtle);
        }

        .auth-divider span {
          padding: 0 0.75rem;
        }

        .btn-demo-login {
          width: 100%;
          padding: 0.8rem;
          font-weight: 700;
          background: var(--bg-surface-elevated);
          border: 1px dashed var(--primary);
        }

        .btn-demo-login:hover {
          background: var(--primary-light);
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
export default LoginPage;