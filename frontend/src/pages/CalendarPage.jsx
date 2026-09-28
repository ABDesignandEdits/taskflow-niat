import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { TaskCard } from '../components/TaskCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const CalendarPage = ({ onOpenNewTask, onEditTask, onDeleteTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(data || []);
      } catch (err) {
        console.error('Failed to load tasks for calendar:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToggleStatus = async (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus, completed_at: newStatus === 'Completed' ? new Date().toISOString() : null } : t))
    );
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateObj = new Date(year, month - 1, dayNum);
    const dateStr = dateObj.toISOString().split('T')[0];
    calendarDays.push({ dayNum, dateStr, isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${mStr}-${dStr}`;
    calendarDays.push({ dayNum: d, dateStr, isCurrentMonth: true });
  }

  const remainingCells = 42 - calendarDays.length;
  for (let n = 1; n <= remainingCells; n++) {
    const mStr = String(month + 2 > 12 ? 1 : month + 2).padStart(2, '0');
    const yVal = month + 2 > 12 ? year + 1 : year;
    const dStr = String(n).padStart(2, '0');
    const dateStr = `${yVal}-${mStr}-${dStr}`;
    calendarDays.push({ dayNum: n, dateStr, isCurrentMonth: false });
  }

  const selectedDateTasks = tasks.filter(t => t.due_date === selectedDateStr);
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="page-container calendar-page-root">
      <div className="calendar-page-header">
        <div>
          <h1 className="calendar-title">Calendar Schedule</h1>
          <p className="calendar-subtitle">Plan upcoming homework, project milestones, and exam dates.</p>
        </div>

        <button
          onClick={() => onOpenNewTask({ due_date: selectedDateStr })}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add Task for Date</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading calendar view..." />
      ) : (
        <div className="calendar-layout-split">
          <div className="calendar-matrix-card glass-card">
            <div className="calendar-nav-bar">
              <h2 className="month-year-title">{monthName} {year}</h2>
              <div className="nav-buttons-group">
                <button onClick={handlePrevMonth} className="btn-icon" title="Previous Month">
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDateStr(todayStr);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Today
                </button>
                <button onClick={handleNextMonth} className="btn-icon" title="Next Month">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="weekdays-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(w => (
                <div key={w} className="weekday-cell">{w}</div>
              ))}
            </div>

            <div className="days-grid">
              {calendarDays.map((cell, idx) => {
                const dayTasks = tasks.filter(t => t.due_date === cell.dateStr);
                const isSelected = cell.dateStr === selectedDateStr;
                const isToday = cell.dateStr === todayStr;

                return (
                  <div
                    key={idx}
                    className={`day-cell ${cell.isCurrentMonth ? '' : 'outside-month'} ${isSelected ? 'cell-selected' : ''} ${isToday ? 'cell-today' : ''}`}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                  >
                    <span className="day-number">{cell.dayNum}</span>
                    {dayTasks.length > 0 && (
                      <div className="day-task-indicators">
                        {dayTasks.slice(0, 3).map(dt => (
                          <div
                            key={dt.id}
                            className="task-indicator-dot"
                            style={{ backgroundColor: dt.category?.color || '#6366f1' }}
                            title={dt.title}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <span className="extra-tasks-count">+{dayTasks.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="calendar-agenda-card glass-card">
            <div className="agenda-header">
              <div className="agenda-date-badge">
                <CalendarIcon size={16} color="#6366f1" />
                <h3>{selectedDateStr === todayStr ? `Today (${selectedDateStr})` : selectedDateStr}</h3>
              </div>
              <span className="agenda-task-count">{selectedDateTasks.length} Tasks</span>
            </div>

            <div className="agenda-tasks-list">
              {selectedDateTasks.length === 0 ? (
                <div className="agenda-empty-state">
                  <p>No tasks scheduled for {selectedDateStr}.</p>
                  <button
                    onClick={() => onOpenNewTask({ due_date: selectedDateStr })}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <Plus size={14} />
                    <span>Add Task for this Day</span>
                  </button>
                </div>
              ) : (
                selectedDateTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .calendar-page-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .calendar-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .calendar-title {
          font-size: 2rem;
          font-weight: 800;
        }

        .calendar-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .calendar-layout-split {
          display: grid;
          grid-template-columns: 1.7fr 1.3fr;
          gap: 1.5rem;
          align-items: start;
        }

        .calendar-matrix-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .calendar-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .month-year-title {
          font-size: 1.4rem;
          font-weight: 800;
        }

        .nav-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .weekdays-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-dim);
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.35rem;
        }

        .day-cell {
          aspect-ratio: 1;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.4rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .day-cell:hover {
          border-color: var(--primary);
          background: var(--bg-surface-elevated);
        }

        .outside-month {
          opacity: 0.3;
        }

        .cell-selected {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px var(--primary-glow);
          background: var(--primary-light) !important;
        }

        .cell-today .day-number {
          background: var(--primary);
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .day-number {
          font-size: 0.82rem;
          font-weight: 600;
        }

        .day-task-indicators {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          flex-wrap: wrap;
        }

        .task-indicator-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .extra-tasks-count {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-dim);
        }

        .calendar-agenda-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .agenda-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.75rem;
        }

        .agenda-date-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .agenda-date-badge h3 {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .agenda-task-count {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          background: var(--primary-light);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }

        .agenda-tasks-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .agenda-empty-state {
          text-align: center;
          padding: 2rem 1rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .calendar-layout-split {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;
