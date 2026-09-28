import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No tasks found',
  description = 'You have no tasks in this view. Enjoy your free time or add a new task!',
  actionText = 'Create Task',
  onAction = null
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-icon-circle">
        <Icon size={32} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {onAction && actionText && (
        <button onClick={onAction} className="btn btn-primary btn-sm empty-action-btn">
          <Plus size={16} />
          <span>{actionText}</span>
        </button>
      )}

      <style>{`
        .empty-state-card {
          background: var(--bg-surface-glass);
          border: 1px dashed var(--border-medium);
          border-radius: var(--radius-xl);
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .empty-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .empty-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .empty-description {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 420px;
          line-height: 1.5;
        }

        .empty-action-btn {
          margin-top: 0.75rem;
        }
      `}</style>
    </div>
  );
};
