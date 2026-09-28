import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const GoalModal = ({ isOpen, onClose, onSave, goalToEdit = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [targetDate, setTargetDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState('#8b5cf6');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title || '');
      setDescription(goalToEdit.description || '');
      setCategory(goalToEdit.category || 'Academic');
      setTargetDate(goalToEdit.target_date || '');
      setProgress(goalToEdit.progress || 0);
      setColor(goalToEdit.color || '#8b5cf6');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Academic');
      setTargetDate('');
      setProgress(0);
      setColor('#8b5cf6');
    }
    setError('');
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Goal title is required.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        category,
        target_date: targetDate || null,
        progress: Number(progress),
        color
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save goal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{goalToEdit ? 'Edit Goal' : 'Create New Goal'}</h3>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error-alert">{error}</div>}

            <div className="form-group">
              <label className="form-label">Goal Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Master JavaScript, Ace Physics Exam, Read 10 Books"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Why is this goal important? What milestones will you hit?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Academic">Academic / School</option>
                  <option value="Coding">Coding & Tech</option>
                  <option value="Personal">Personal Growth</option>
                  <option value="Fitness">Fitness & Health</option>
                  <option value="Creative">Creative / Hobbies</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Progress: {progress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="goal-slider-input"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : goalToEdit ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
