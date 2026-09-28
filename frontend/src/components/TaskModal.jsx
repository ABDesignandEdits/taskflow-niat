import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Tag } from 'lucide-react';

export const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit = null,
  categories = []
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [timeBlock, setTimeBlock] = useState('Morning');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [tagsInput, setTagsInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setCategoryId(taskToEdit.category_id || taskToEdit.category?.id || '');
      setPriority(taskToEdit.priority || 'Medium');
      setTimeBlock(taskToEdit.time_block || 'Morning');
      setDueDate(taskToEdit.due_date || '');
      setDueTime(taskToEdit.due_time ? taskToEdit.due_time.slice(0, 5) : '');
      setEstimatedMinutes(taskToEdit.estimated_minutes || 30);
      setTagsInput(taskToEdit.tags ? taskToEdit.tags.join(', ') : '');
      setSubtasks(taskToEdit.subtasks ? taskToEdit.subtasks.map(s => s.title || s) : []);
    } else {
      // Default to today
      const todayStr = new Date().toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setPriority('Medium');
      setTimeBlock('Morning');
      setDueDate(todayStr);
      setDueTime('');
      setEstimatedMinutes(30);
      setTagsInput('');
      setSubtasks([]);
    }
    setError('');
  }, [taskToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (newSubtaskInput.trim()) {
      setSubtasks([...subtasks, newSubtaskInput.trim()]);
      setNewSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setLoading(true);
    setError('');

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      category_id: categoryId || null,
      priority,
      time_block: timeBlock,
      due_date: dueDate || null,
      due_time: dueTime ? `${dueTime}:00` : null,
      estimated_minutes: Number(estimatedMinutes) || 30,
      tags: parsedTags,
      subtasks
    };

    try {
      await onSave(taskPayload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h3>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error-alert">{error}</div>}

            {/* Task Title */}
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Complete Physics Assignment, Math Revision"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Add notes, chapter numbers, or details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category & Priority Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">No Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <div className="priority-pill-selector">
                  {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`priority-pill-btn ${priority === p ? `priority-selected-${p.toLowerCase()}` : ''}`}
                      onClick={() => setPriority(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Due Date & Time */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Due Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            </div>

            {/* Time Block & Estimated Duration */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Time Block (Daily Planner)</label>
                <select
                  className="form-select"
                  value={timeBlock}
                  onChange={(e) => setTimeBlock(e.target.value)}
                >
                  <option value="Morning">Morning (06:00 - 12:00)</option>
                  <option value="Afternoon">Afternoon (12:00 - 17:00)</option>
                  <option value="Evening">Evening (17:00 - 22:00)</option>
                  <option value="Anytime">Anytime</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Time (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  className="form-input"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                />
              </div>
            </div>

            {/* Subtasks Checklist Builder */}
            <div className="form-group">
              <label className="form-label">Subtasks & Checklist</label>
              <div className="subtask-input-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Read Chapter 4, Solve problems 1-10..."
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>

              {subtasks.length > 0 && (
                <div className="modal-subtasks-preview">
                  {subtasks.map((st, idx) => (
                    <div key={idx} className="modal-subtask-pill">
                      <span>{st}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(idx)}
                        className="remove-subtask-btn"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags Input */}
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Physics, Homework, Quiz, Project"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-error-alert {
          background: var(--danger-light);
          color: var(--danger);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .priority-pill-selector {
          display: flex;
          gap: 0.35rem;
        }

        .priority-pill-btn {
          flex: 1;
          padding: 0.55rem 0.2rem;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          background: var(--bg-surface-elevated);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-fast);
        }

        .priority-pill-btn:hover {
          color: var(--text-main);
        }

        .priority-selected-low {
          background: rgba(16, 185, 129, 0.2) !important;
          color: #10b981 !important;
          border-color: #10b981 !important;
        }

        .priority-selected-medium {
          background: rgba(59, 130, 246, 0.2) !important;
          color: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }

        .priority-selected-high {
          background: rgba(245, 158, 11, 0.2) !important;
          color: #f59e0b !important;
          border-color: #f59e0b !important;
        }

        .priority-selected-urgent {
          background: rgba(239, 68, 68, 0.2) !important;
          color: #ef4444 !important;
          border-color: #ef4444 !important;
        }

        .subtask-input-row {
          display: flex;
          gap: 0.5rem;
        }

        .modal-subtasks-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.5rem;
        }

        .modal-subtask-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          color: var(--text-main);
        }

        .remove-subtask-btn {
          color: var(--text-dim);
          display: flex;
          align-items: center;
        }

        .remove-subtask-btn:hover {
          color: var(--danger);
        }

        @media (max-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};
