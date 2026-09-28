import React from 'react';
import confetti from 'canvas-confetti';
import { Target, Calendar, Edit2, Trash2, CheckCircle, Sparkles } from 'lucide-react';

export const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
  const isAchieved = goal.status === 'Achieved' || goal.progress >= 100;

  const handleSliderChange = (e) => {
    const newProgress = Number(e.target.value);
    if (newProgress === 100 && !isAchieved) {
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      } catch (err) {}
    }
    onUpdateProgress(goal.id, newProgress);
  };

  return (
    <div className={`goal-card-root ${isAchieved ? 'goal-achieved' : ''}`}>
      <div className="goal-card-header">
        <div className="goal-title-area">
          <span className="goal-category-badge" style={{ backgroundColor: `${goal.color || '#8b5cf6'}20`, color: goal.color || '#8b5cf6' }}>
            {goal.category || 'General'}
          </span>
          <h4 className="goal-title">{goal.title}</h4>
        </div>
        <div className="goal-actions">
          <button onClick={() => onEdit(goal)} className="btn-icon" title="Edit Goal">
            <Edit2 size={15} />
          </button>
          <button onClick={() => onDelete(goal.id)} className="btn-icon delete-btn" title="Delete Goal">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {goal.description && <p className="goal-desc">{goal.description}</p>}

      {/* Progress Bar & Slider */}
      <div className="goal-progress-section">
        <div className="progress-label-row">
          <span className="progress-status-text">
            {isAchieved ? (
              <span className="achieved-badge">
                <CheckCircle size={14} /> Goal Achieved! 🎉
              </span>
            ) : (
              'Progress'
            )}
          </span>
          <span className="progress-percentage">{goal.progress}%</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${goal.progress}%`,
              background: isAchieved
                ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                : `linear-gradient(90deg, ${goal.color || '#8b5cf6'} 0%, #6366f1 100%)`
            }}
          />
        </div>

        {/* Interactive Progress Range Slider */}
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={goal.progress}
            onChange={handleSliderChange}
            className="goal-slider-input"
            aria-label="Adjust goal progress percentage"
          />
        </div>
      </div>

      {/* Target Date */}
      {goal.target_date && (
        <div className="goal-footer">
          <Calendar size={13} />
          <span>Target: {goal.target_date}</span>
        </div>
      )}

      <style>{`
        .goal-card-root {
          background: var(--bg-surface-glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: var(--card-shadow);
          transition: all var(--transition-fast);
        }

        .goal-card-root:hover {
          border-color: var(--border-medium);
          transform: translateY(-2px);
        }

        .goal-achieved {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.05);
        }

        .goal-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .goal-title-area {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .goal-category-badge {
          align-self: flex-start;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .goal-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .goal-actions {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .goal-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .goal-progress-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .progress-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
        }

        .achieved-badge {
          color: var(--success);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .progress-percentage {
          font-weight: 800;
          color: var(--text-main);
        }

        .progress-track {
          width: 100%;
          height: 8px;
          background: var(--bg-surface-elevated);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .slider-container {
          margin-top: 0.2rem;
        }

        .goal-slider-input {
          width: 100%;
          cursor: pointer;
          accent-color: var(--primary);
        }

        .goal-footer {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--text-dim);
          border-top: 1px solid var(--border-subtle);
          padding-top: 0.75rem;
        }
      `}</style>
    </div>
  );
};
