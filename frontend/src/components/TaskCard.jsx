import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit2,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';

export const TaskCard = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onToggleSubtask
}) => {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = task.status === 'Completed';

  // Format date info
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = !isCompleted && task.due_date && task.due_date < todayStr;
  const isToday = task.due_date === todayStr;

  const completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    const nextStatus = isCompleted ? 'Pending' : 'Completed';
    if (nextStatus === 'Completed') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (err) {
        // ignore confetti errors
      }
    }
    onToggleStatus(task.id, nextStatus);
  };

  return (
    <div className={`task-card-root ${isCompleted ? 'task-completed' : ''} ${isOverdue ? 'task-overdue' : ''}`}>
      <div className="task-card-main">
        {/* Checkbox Trigger */}
        <button
          onClick={handleCheckboxClick}
          className="task-checkbox-btn"
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle className="checkbox-icon completed-icon" size={22} />
          ) : (
            <Circle className="checkbox-icon pending-icon" size={22} />
          )}
        </button>

        {/* Task Core Info */}
        <div className="task-info-content" onClick={() => totalSubtasks > 0 && setExpanded(!expanded)}>
          <div className="task-header-row">
            <h4 className={`task-title ${isCompleted ? 'title-struck' : ''}`}>{task.title}</h4>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          {/* Metadata Row (Badges, Time, Category) */}
          <div className="task-meta-row">
            {/* Category Tag */}
            {task.category && (
              <span
                className="task-meta-pill"
                style={{
                  backgroundColor: `${task.category.color || '#6366f1'}20`,
                  color: task.category.color || '#6366f1',
                  borderColor: `${task.category.color || '#6366f1'}40`
                }}
              >
                {task.category.name}
              </span>
            )}

            {/* Priority Badge */}
            <span className={`badge badge-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>

            {/* Due Date Indicator */}
            {task.due_date && (
              <span className={`task-date-pill ${isOverdue ? 'date-overdue' : isToday ? 'date-today' : ''}`}>
                <Calendar size={13} />
                <span>{isToday ? 'Today' : task.due_date}</span>
                {task.due_time && <span>{task.due_time.slice(0, 5)}</span>}
              </span>
            )}

            {/* Estimated Duration */}
            {task.estimated_minutes > 0 && (
              <span className="task-time-pill">
                <Clock size={13} />
                <span>{task.estimated_minutes}m</span>
              </span>
            )}

            {/* Subtasks Count Badge */}
            {totalSubtasks > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="subtask-toggle-badge"
              >
                <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="task-actions-group">
          <button
            onClick={() => onEdit(task)}
            className="btn-icon task-action-btn"
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="btn-icon task-action-btn delete-btn"
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expandable Subtasks Checklist */}
      {expanded && totalSubtasks > 0 && (
        <div className="subtasks-container">
          <p className="subtasks-heading">Checklist ({completedSubtasks}/{totalSubtasks})</p>
          <div className="subtasks-list">
            {task.subtasks.map((st) => (
              <div
                key={st.id}
                className={`subtask-item ${st.completed ? 'subtask-done' : ''}`}
                onClick={() => onToggleSubtask && onToggleSubtask(st.id)}
              >
                {st.completed ? (
                  <CheckSquare size={16} className="subtask-check-icon checked" />
                ) : (
                  <Square size={16} className="subtask-check-icon" />
                )}
                <span className="subtask-text">{st.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .task-card-root {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1.1rem 1.25rem;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .task-card-root:hover {
          border-color: var(--border-medium);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .task-completed {
          opacity: 0.65;
          background: var(--bg-surface-elevated);
        }

        .task-overdue {
          border-left: 4px solid var(--danger);
        }

        .task-card-main {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .task-checkbox-btn {
          margin-top: 0.15rem;
          color: var(--text-dim);
          transition: transform var(--transition-fast);
        }

        .task-checkbox-btn:hover {
          transform: scale(1.15);
        }

        .completed-icon {
          color: var(--success);
        }

        .pending-icon {
          color: var(--text-dim);
        }

        .pending-icon:hover {
          color: var(--primary);
        }

        .task-info-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          cursor: pointer;
        }

        .task-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.35;
        }

        .title-struck {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-description {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .task-meta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .task-meta-pill {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid transparent;
        }

        .task-date-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-surface-elevated);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
        }

        .date-today {
          color: var(--primary);
          background: var(--primary-light);
          font-weight: 700;
        }

        .date-overdue {
          color: var(--danger);
          background: var(--danger-light);
          font-weight: 700;
        }

        .task-time-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        .subtask-toggle-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--secondary);
          background: var(--secondary-light);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
        }

        .task-actions-group {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .task-action-btn {
          color: var(--text-dim);
        }

        .task-action-btn:hover {
          color: var(--text-main);
          background: var(--bg-surface-elevated);
        }

        .task-action-btn.delete-btn:hover {
          color: var(--danger);
          background: var(--danger-light);
        }

        /* Subtasks Section */
        .subtasks-container {
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          padding-left: 2.4rem;
        }

        .subtasks-heading {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
        }

        .subtasks-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .subtask-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-main);
          cursor: pointer;
          padding: 0.2rem 0;
        }

        .subtask-check-icon {
          color: var(--text-dim);
        }

        .subtask-check-icon.checked {
          color: var(--success);
        }

        .subtask-done .subtask-text {
          text-decoration: line-through;
          color: var(--text-dim);
        }
      `}</style>
    </div>
  );
};
