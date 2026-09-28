import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const DailyPlannerPage = ({ onOpenNewTask, onEditTask, onDeleteTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await taskService.getTasks({ date: selectedDate });
        setTasks(data || []);
      } catch (err) {
        console.error('Failed to load planner tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleToggleStatus = async (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus, completed_at: newStatus === 'Completed' ? new Date().toISOString() : null } : t))
    );
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const formattedDateString = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(selectedDate + 'T00:00:00'));

  const morningTasks = tasks.filter(t => t.time_block === 'Morning');
  const afternoonTasks = tasks.filter(t => t.time_block === 'Afternoon');
  const eveningTasks = tasks.filter(t => t.time_block === 'Evening');
  const anytimeTasks = tasks.filter(t => !t.time_block || t.time_block === 'Anytime');

  return (
    <div className="page-container planner-page-root">
      <div className="planner-header">
        <div>
          <h1 className="planner-title">Daily Time Planner</h1>
          <p className="planner-subtitle">Structure your day with focused time blocks.</p>
        </div>

        <div className="date-nav-controls glass-card">
          <button onClick={handlePrevDay} className="btn-icon" title="Previous Day">
            <ChevronLeft size={20} />
          </button>
          <div className="date-label-wrapper">
            <CalendarIcon size={16} color="#6366f1" />
            <span className="current-date-label">{formattedDateString}</span>
          </div>
          <button onClick={handleNextDay} className="btn-icon" title="Next Day">
            <ChevronRight size={20} />
          </button>
          <button onClick={handleToday} className="btn btn-secondary btn-sm">
            Today
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading daily schedule..." />
      ) : (
        <div className="timeblocks-container">
          <div className="timeblock-section glass-card">
            <div className="timeblock-header morning">
              <div className="timeblock-icon-title">
                <Sun size={22} color="#f59e0b" />
                <div>
                  <h3 className="timeblock-title">Morning Focus</h3>
                  <span className="timeblock-range">06:00 — 12:00</span>
                </div>
              </div>
              <button
                onClick={() => onOpenNewTask({ time_block: 'Morning', due_date: selectedDate })}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={15} />
                <span>Add Task</span>
              </button>
            </div>

            <div className="timeblock-tasks">
              {morningTasks.length === 0 ? (
                <p className="timeblock-empty-hint">No tasks scheduled for morning.</p>
              ) : (
                morningTasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggleStatus={handleToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              )}
            </div>
          </div>

          <div className="timeblock-section glass-card">
            <div className="timeblock-header afternoon">
              <div className="timeblock-icon-title">
                <Sunset size={22} color="#ec4899" />
                <div>
                  <h3 className="timeblock-title">Afternoon Work & Homework</h3>
                  <span className="timeblock-range">12:00 — 17:00</span>
                </div>
              </div>
              <button
                onClick={() => onOpenNewTask({ time_block: 'Afternoon', due_date: selectedDate })}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={15} />
                <span>Add Task</span>
              </button>
            </div>

            <div className="timeblock-tasks">
              {afternoonTasks.length === 0 ? (
                <p className="timeblock-empty-hint">No tasks scheduled for afternoon.</p>
              ) : (
                afternoonTasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggleStatus={handleToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              )}
            </div>
          </div>

          <div className="timeblock-section glass-card">
            <div className="timeblock-header evening">
              <div className="timeblock-icon-title">
                <Moon size={22} color="#8b5cf6" />
                <div>
                  <h3 className="timeblock-title">Evening Coding, Projects & Review</h3>
                  <span className="timeblock-range">17:00 — 22:00</span>
                </div>
              </div>
              <button
                onClick={() => onOpenNewTask({ time_block: 'Evening', due_date: selectedDate })}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={15} />
                <span>Add Task</span>
              </button>
            </div>

            <div className="timeblock-tasks">
              {eveningTasks.length === 0 ? (
                <p className="timeblock-empty-hint">No tasks scheduled for evening.</p>
              ) : (
                eveningTasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggleStatus={handleToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              )}
            </div>
          </div>

          {anytimeTasks.length > 0 && (
            <div className="timeblock-section glass-card">
              <div className="timeblock-header anytime">
                <div className="timeblock-icon-title">
                  <Clock size={22} color="#06b6d4" />
                  <div>
                    <h3 className="timeblock-title">Anytime / Floating Tasks</h3>
                    <span className="timeblock-range">Flexible time</span>
                  </div>
                </div>
              </div>
              <div className="timeblock-tasks">
                {anytimeTasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggleStatus={handleToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .planner-page-root {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .planner-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .planner-title {
          font-size: 2rem;
          font-weight: 800;
        }

        .planner-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .date-nav-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
        }

        .date-label-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .timeblocks-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .timeblock-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.5rem;
        }

        .timeblock-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .timeblock-icon-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .timeblock-title {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .timeblock-range {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .timeblock-tasks {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .timeblock-empty-hint {
          font-size: 0.85rem;
          color: var(--text-dim);
          font-style: italic;
          padding: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default DailyPlannerPage;
