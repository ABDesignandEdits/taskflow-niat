import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Plus,
  Flame,
  User,
  LogOut,
  Settings,
  Sparkles,
  Menu,
  CheckCircle2
} from 'lucide-react';

export const Navbar = ({ onOpenNewTask, streak = 0 }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-logo-icon">
            <CheckCircle2 size={24} color="#ffffff" />
          </div>
          <span className="brand-name">TaskFlow</span>
        </Link>

        {streak > 0 && (
          <div className="streak-pill" title={`${streak} Day Productivity Streak!`}>
            <Flame size={16} className="streak-flame-icon" />
            <span>{streak} Day Streak</span>
          </div>
        )}
      </div>

      <div className="navbar-right">
        {/* Quick Add Task Button */}
        <button
          onClick={onOpenNewTask}
          className="btn btn-primary btn-sm quick-add-btn"
          id="quick-add-task-btn"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          id="theme-toggle-btn"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile Menu */}
        <div className="user-menu-wrapper">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="user-avatar-btn"
            id="user-profile-menu-btn"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="user-avatar-img" />
            ) : (
              <div className="user-avatar-placeholder">
                {user?.name ? user.name[0].toUpperCase() : 'S'}
              </div>
            )}
            <span className="user-name-label">{user?.name?.split(' ')[0] || 'Student'}</span>
          </button>

          {menuOpen && (
            <div className="user-dropdown-menu" onClick={() => setMenuOpen(false)}>
              <div className="dropdown-header">
                <p className="dropdown-user-name">{user?.name}</p>
                <p className="dropdown-user-email">{user?.email}</p>
                <span className="dropdown-user-role">{user?.grade_or_role || 'High School Student'}</span>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/profile" className="dropdown-item">
                <User size={16} />
                <span>My Profile</span>
              </Link>
              <Link to="/settings" className="dropdown-item">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item dropdown-logout-btn">
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar-container {
          height: var(--header-height);
          background: var(--bg-surface-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .brand-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .brand-name {
          background: linear-gradient(135deg, var(--text-main) 30%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .streak-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15));
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #f59e0b;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          animation: pulseGlow 2s infinite ease-in-out;
        }

        .streak-flame-icon {
          color: #ef4444;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .theme-toggle-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .theme-toggle-btn:hover {
          color: var(--primary);
          border-color: var(--primary);
        }

        .user-menu-wrapper {
          position: relative;
        }

        .user-avatar-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          padding: 0.3rem 0.75rem 0.3rem 0.3rem;
          border-radius: var(--radius-full);
          transition: border-color var(--transition-fast);
        }

        .user-avatar-btn:hover {
          border-color: var(--primary);
        }

        .user-avatar-img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--primary-light);
        }

        .user-avatar-placeholder {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .user-name-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          box-shadow: var(--card-shadow);
          min-width: 220px;
          padding: 0.5rem;
          z-index: 200;
          animation: scaleUp 0.15s ease-out;
        }

        .dropdown-header {
          padding: 0.75rem 0.75rem 0.5rem;
        }

        .dropdown-user-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .dropdown-user-email {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .dropdown-user-role {
          display: inline-block;
          margin-top: 0.3rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--primary);
          background: var(--primary-light);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 0.4rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-main);
          width: 100%;
          text-align: left;
          transition: background var(--transition-fast);
        }

        .dropdown-item:hover {
          background: var(--bg-surface-elevated);
          color: var(--primary);
        }

        .dropdown-logout-btn {
          color: var(--danger);
        }

        .dropdown-logout-btn:hover {
          background: var(--danger-light);
          color: var(--danger);
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 1rem;
          }
          .user-name-label {
            display: none;
          }
          .streak-pill span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
