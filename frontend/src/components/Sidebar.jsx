import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Calendar,
  Target,
  BarChart3,
  User,
  Settings,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'My Tasks', icon: CheckSquare },
    { to: '/planner', label: 'Daily Planner', icon: Clock },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="sidebar-desktop">
        <div className="sidebar-section">
          <p className="sidebar-category-title">MAIN MENU</p>
          <nav className="sidebar-nav">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                  }
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-section" style={{ marginTop: 'auto' }}>
          <p className="sidebar-category-title">ACCOUNT</p>
          <nav className="sidebar-nav">
            {navItems.slice(6).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                  }
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Motivational Micro Widget */}
        <div className="sidebar-study-tip-card">
          <div className="tip-header">
            <Sparkles size={16} color="#f59e0b" />
            <span>Productivity Tip</span>
          </div>
          <p className="tip-text">
            Start with your hardest homework first (eat the frog 🐸) when your mind is fresh!
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `mobile-nav-item ${isActive ? 'mobile-nav-active' : ''}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <style>{`
        .sidebar-desktop {
          width: var(--sidebar-width);
          background: var(--bg-surface);
          border-right: 1px solid var(--border-subtle);
          position: fixed;
          top: var(--header-height);
          bottom: 0;
          left: 0;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
          z-index: 90;
        }

        .sidebar-category-title {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-dim);
          padding: 0 0.75rem 0.5rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .sidebar-link:hover {
          color: var(--text-main);
          background: var(--bg-surface-elevated);
        }

        .sidebar-link-active {
          color: #ffffff !important;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
        }

        .sidebar-study-tip-card {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .tip-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #f59e0b;
        }

        .tip-text {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* Mobile Bottom Nav */
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 65px;
          background: var(--bg-surface);
          border-top: 1px solid var(--border-medium);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 1000;
          align-items: center;
          justify-content: space-around;
          padding: 0 0.5rem;
        }

        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          color: var(--text-muted);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.4rem 0.6rem;
          border-radius: var(--radius-sm);
        }

        .mobile-nav-active {
          color: var(--primary);
        }

        @media (max-width: 1024px) {
          .sidebar-desktop {
            display: none;
          }
          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};
