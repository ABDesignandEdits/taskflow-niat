import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User, Mail, Sparkles, Check, AlertCircle } from 'lucide-react';

const AVATAR_SEEDS = ['Alex', 'Jordan', 'Taylor', 'Sam', 'Riley', 'Morgan', 'Casey', 'Avery'];

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [gradeOrRole, setGradeOrRole] = useState(user?.grade_or_role || 'High School Student');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarSeed, setAvatarSeed] = useState(() => {
    return user?.name?.split(' ')[0] || 'Alex';
  });

  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    const avatar_url = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`;

    try {
      await updateProfile({
        name: name.trim(),
        grade_or_role: gradeOrRole.trim(),
        bio: bio.trim(),
        avatar_url
      });
      setMsg({ text: 'Profile updated successfully! ✨', type: 'success' });
    } catch (err) {
      setMsg({ text: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemoData = async () => {
    setSeedLoading(true);
    setMsg({ text: '', type: '' });
    try {
      await authService.seedDemoData();
      setMsg({ text: 'Sample tasks, 3-day streak & semester goals created successfully! Check your Dashboard! 🎉', type: 'success' });
    } catch (err) {
      setMsg({ text: err.message || 'Failed to seed sample data.', type: 'error' });
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="page-container profile-page-root">
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Personalize your student identity and study profile.</p>
      </div>

      {msg.text && (
        <div className={`profile-alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {msg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="profile-content-grid">
        <div className="glass-card profile-card-left">
          <div className="profile-avatar-large">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`}
              alt="Avatar Preview"
              className="avatar-img-big"
            />
          </div>

          <h3 className="profile-display-name">{name || 'Student Name'}</h3>
          <p className="profile-display-role">{gradeOrRole}</p>
          <span className="profile-display-email">{user?.email}</span>

          <div className="avatar-picker-section">
            <label className="form-label">Pick Avatar Style</label>
            <div className="avatar-seeds-grid">
              {AVATAR_SEEDS.map((seed) => (
                <button
                  key={seed}
                  type="button"
                  onClick={() => setAvatarSeed(seed)}
                  className={`avatar-seed-btn ${avatarSeed === seed ? 'seed-active' : ''}`}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`}
                    alt={seed}
                    className="avatar-seed-img"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-forms-right">
          <form onSubmit={handleSave} className="glass-card profile-edit-form">
            <h3 className="form-card-title">Edit Details</h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Grade / Academic Level</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 10th Grade, High School Senior, Computer Science Freshman"
                value={gradeOrRole}
                onChange={(e) => setGradeOrRole(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Study Motto</label>
              <textarea
                className="form-textarea"
                placeholder="What motivates you to learn and stay organized?"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </form>

          <div className="glass-card demo-seeder-card">
            <div className="demo-seeder-header">
              <Sparkles size={20} color="#f59e0b" />
              <h4>Explore with Sample Student Data</h4>
            </div>
            <p className="demo-seeder-desc">
              Instantly populate your account with sample Physics homework, Math exams, a 3-day completion streak, and semester goals to test all features.
            </p>
            <button
              type="button"
              onClick={handleSeedDemoData}
              className="btn btn-secondary btn-seed-demo"
              disabled={seedLoading}
              id="seed-demo-data-btn"
            >
              <Sparkles size={16} />
              <span>{seedLoading ? 'Seeding Demo Data...' : 'Populate Sample Teenager Tasks & Goals'}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .profile-page-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-title {
          font-size: 2rem;
          font-weight: 800;
        }

        .profile-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .profile-alert {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .alert-error {
          background: var(--danger-light);
          color: var(--danger);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .profile-content-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.75rem;
          align-items: start;
        }

        .profile-card-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          gap: 0.75rem;
        }

        .profile-avatar-large {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--primary-light);
          border: 3px solid var(--primary);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .avatar-img-big {
          width: 85%;
          height: 85%;
        }

        .profile-display-name {
          font-size: 1.4rem;
          font-weight: 800;
        }

        .profile-display-role {
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 600;
        }

        .profile-display-email {
          font-size: 0.8rem;
          color: var(--text-dim);
        }

        .avatar-picker-section {
          width: 100%;
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.25rem;
          margin-top: 0.5rem;
          text-align: left;
        }

        .avatar-seeds-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .avatar-seed-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--bg-surface-elevated);
          border: 2px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .avatar-seed-btn:hover {
          transform: scale(1.15);
        }

        .seed-active {
          border-color: var(--primary) !important;
          background: var(--primary-light) !important;
        }

        .avatar-seed-img {
          width: 80%;
          height: 80%;
        }

        .profile-forms-right {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-edit-form {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-card-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .demo-seeder-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border: 1px dashed var(--warning);
        }

        .demo-seeder-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .demo-seeder-header h4 {
          font-size: 1.05rem;
          font-weight: 700;
        }

        .demo-seeder-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .btn-seed-demo {
          align-self: flex-start;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .profile-content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
