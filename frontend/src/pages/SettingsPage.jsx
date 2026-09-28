import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Bell,
  Database,
  Shield,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const SettingsPage = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      new Notification('TaskFlow Notifications Enabled 🎉', {
        body: 'You will receive reminders for your scheduled homework and assignments!'
      });
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <div className="page-container settings-page-root">
      <div className="settings-header">
        <h1 className="settings-title">App Settings</h1>
        <p className="settings-subtitle">Manage preferences, theme mode, and system connections.</p>
      </div>

      <div className="settings-cards-list">
        <div className="glass-card setting-card">
          <div className="setting-card-header">
            <Sun size={20} color="#6366f1" />
            <div>
              <h3>Appearance & Theme</h3>
              <p>Choose between dark mode for late night study sessions or clean light mode.</p>
            </div>
          </div>
          <div className="setting-action-row">
            <span>Current Theme: <strong>{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</strong></span>
            <button onClick={toggleTheme} className="btn btn-secondary btn-sm" id="toggle-theme-setting-btn">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </div>

        <div className="glass-card setting-card">
          <div className="setting-card-header">
            <Bell size={20} color="#06b6d4" />
            <div>
              <h3>Task Reminders & Notifications</h3>
              <p>Receive alerts for upcoming deadlines and daily planner time blocks.</p>
            </div>
          </div>
          <div className="setting-action-row">
            <span>Browser Alerts: <strong>{notificationsEnabled ? 'Enabled' : 'Disabled'}</strong></span>
            <button
              onClick={requestNotificationPermission}
              className={`btn btn-sm ${notificationsEnabled ? 'btn-secondary' : 'btn-primary'}`}
            >
              <Bell size={16} />
              <span>{notificationsEnabled ? 'Permissions Granted' : 'Enable Browser Alerts'}</span>
            </button>
          </div>
        </div>

        <div className="glass-card setting-card">
          <div className="setting-card-header">
            <Database size={20} color="#10b981" />
            <div>
              <h3>Database & Cloud Sync</h3>
              <p>TaskFlow runs with Express REST API and Supabase PostgreSQL integration.</p>
            </div>
          </div>
          <div className="setting-info-box">
            <div className="info-row">
              <span>Backend Architecture:</span>
              <span className="badge badge-medium">Node.js + Express (MVC)</span>
            </div>
            <div className="info-row">
              <span>Database Backend:</span>
              <span className="badge badge-low">Supabase PostgreSQL</span>
            </div>
            <div className="info-row">
              <span>Authentication Standard:</span>
              <span className="badge badge-urgent">Bcrypt Hashing + JWT</span>
            </div>
          </div>
        </div>

        <div className="glass-card setting-card">
          <div className="setting-card-header">
            <HelpCircle size={20} color="#f59e0b" />
            <div>
              <h3>How Productivity Scores Work</h3>
              <p>Understand the simple formula behind your daily score.</p>
            </div>
          </div>
          <div className="setting-explanation-text">
            <p>Your daily score is calculated transparently:</p>
            <ul>
              <li><strong>50 pts:</strong> Percentage of today's scheduled tasks completed.</li>
              <li><strong>30 pts:</strong> Priority weighting (High/Urgent tasks grant extra points).</li>
              <li><strong>20 pts:</strong> Streak consistency bonus for working consecutive days.</li>
              <li><strong>-5 pts:</strong> Small deduction for each overdue task.</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 900px;
        }

        .settings-title {
          font-size: 2rem;
          font-weight: 800;
        }

        .settings-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .settings-cards-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .setting-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .setting-card-header {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
        }

        .setting-card-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .setting-card-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .setting-action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.9rem;
        }

        .setting-info-box {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1rem;
        }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .setting-explanation-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .setting-explanation-text ul {
          margin-top: 0.5rem;
          padding-left: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
