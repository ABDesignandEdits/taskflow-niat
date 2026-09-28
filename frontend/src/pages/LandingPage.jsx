import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  Flame,
  Target,
  BarChart3,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Zap
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="landing-root">
      {/* Top Navigation */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="brand-logo-icon">
            <CheckCircle2 size={24} color="#ffffff" />
          </div>
          <span className="brand-name">TaskFlow</span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn btn-secondary btn-sm">
            Log In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-badge">
          <Sparkles size={15} />
          <span>Built for Students & Teenagers</span>
        </div>
        <h1 className="hero-title">
          Turn Your Plans <br />
          <span className="gradient-text">Into Progress.</span>
        </h1>
        <p className="hero-subtitle">
          Organize your schoolwork, homework, exams, coding projects, and daily routines in one clean, motivating productivity dashboard.
        </p>

        <div className="hero-cta-group">
          <Link to="/register" className="btn btn-primary btn-lg" id="landing-get-started-btn">
            <span>Start Being Productive</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg" id="landing-login-btn">
            <span>Open Demo Account</span>
          </Link>
        </div>

        {/* Floating App Preview Mockup */}
        <div className="app-preview-glass">
          <div className="preview-top-bar">
            <div className="preview-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="preview-url-bar">taskflow.app/dashboard</span>
          </div>

          <div className="preview-grid">
            <div className="preview-card">
              <div className="preview-card-header">
                <Flame size={18} color="#ef4444" />
                <span>Productivity Streak</span>
              </div>
              <p className="preview-card-value">🔥 7 Day Streak</p>
              <p className="preview-card-sub">Completed 14 tasks this week</p>
            </div>

            <div className="preview-card">
              <div className="preview-card-header">
                <Zap size={18} color="#6366f1" />
                <span>Daily Momentum</span>
              </div>
              <p className="preview-card-value">88 / 100</p>
              <p className="preview-card-sub">Excellent consistency today!</p>
            </div>

            <div className="preview-card">
              <div className="preview-card-header">
                <Target size={18} color="#10b981" />
                <span>Semester Goal</span>
              </div>
              <p className="preview-card-value">75% Done</p>
              <p className="preview-card-sub">Master JavaScript & React</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="landing-features">
        <div className="section-header">
          <h2 className="section-title">Everything You Need to Ace School & Hobbies</h2>
          <p className="section-subtitle">
            Designed specifically for student workflows. Simple enough to use every day, powerful enough to keep you ahead.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <BookOpen size={24} />
            </div>
            <h3>School & Homework Tracking</h3>
            <p>Categorize assignments by subject (Physics, Math, Biology, Coding) with priority flags and subtask checklists.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              <Clock size={24} />
            </div>
            <h3>Daily Time Planner</h3>
            <p>Block out your day into Morning, Afternoon, and Evening focus periods so you always know what to tackle next.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <BarChart3 size={24} />
            </div>
            <h3>Interactive Analytics</h3>
            <p>Visualize weekly completion curves, category distributions, and daily productivity scores powered by Recharts.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Flame size={24} />
            </div>
            <h3>Real Habit Streaks</h3>
            <p>Stay motivated with real consecutive completion streaks calculated directly from your actual submitted tasks.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <Target size={24} />
            </div>
            <h3>Long-Term Goals</h3>
            <p>Track semester grades, coding projects, and reading targets with interactive progress bars.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <ShieldCheck size={24} />
            </div>
            <h3>Secure & Private</h3>
            <p>Built with enterprise bcrypt password encryption, JWT authentication, and Supabase PostgreSQL isolation.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 TaskFlow. Crafted for modern students & lifelong learners.</p>
      </footer>

      <style>{`
        .landing-root {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 60%), var(--bg-app);
          display: flex;
          flex-direction: column;
        }

        .landing-nav {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .landing-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 800;
          font-size: 1.35rem;
          color: var(--text-main);
        }

        .landing-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .landing-hero {
          max-width: 900px;
          margin: 3rem auto 2rem;
          padding: 0 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--primary-light);
          border: 1px solid var(--primary-glow);
          color: var(--primary);
          padding: 0.4rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.25rem;
          letter-spacing: -0.03em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--text-muted);
          max-width: 650px;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-lg {
          padding: 0.85rem 1.75rem;
          font-size: 1.05rem;
          border-radius: var(--radius-lg);
        }

        .app-preview-glass {
          width: 100%;
          max-width: 800px;
          background: var(--bg-surface-glass);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 35px rgba(99, 102, 241, 0.2);
          overflow: hidden;
        }

        .preview-top-bar {
          background: var(--bg-surface-elevated);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .preview-dots {
          display: flex;
          gap: 0.4rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #10b981; }

        .preview-url-bar {
          font-size: 0.75rem;
          color: var(--text-dim);
          background: var(--bg-surface);
          padding: 0.2rem 1rem;
          border-radius: var(--radius-sm);
        }

        .preview-grid {
          padding: 1.5rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .preview-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          text-align: left;
        }

        .preview-card-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .preview-card-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .preview-card-sub {
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-top: 0.2rem;
        }

        .landing-features {
          max-width: 1100px;
          margin: 4rem auto;
          padding: 0 1.5rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }

        .section-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .feature-box {
          background: var(--bg-surface-glass);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .feature-box:hover {
          transform: translateY(-4px);
          border-color: var(--border-medium);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .landing-footer {
          margin-top: auto;
          padding: 2rem;
          text-align: center;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.85rem;
          color: var(--text-dim);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.4rem;
          }
          .preview-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
export default LandingPage;