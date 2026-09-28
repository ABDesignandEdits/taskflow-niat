import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { analyticsService } from '../services/analyticsService';
import { categoryService } from '../services/categoryService';
import { TaskCard } from '../components/TaskCard';
import { StatCard } from '../components/StatCard';
import { ProgressRing } from '../components/ProgressRing';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Flame,
  Zap,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  ListTodo
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = ({ onOpenNewTask, onEditTask, onDeleteTask }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const todayDateStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksRes, overviewRes, categoriesRes] = await Promise.all([
          taskService.getTasks(),
          analyticsService.getOverview(),
          categoryService.getCategories()
        ]);
        setTasks(tasksRes || []);
        setOverview(overviewRes || null);
        setCategories(categoriesRes || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshKey]);

  const handleToggleTaskStatus = async (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus, completed_at: newStatus === 'Completed' ? new Date().toISOString() : null } : t))
    );

    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      const updatedOverview = await analyticsService.getOverview();
      setOverview(updatedOverview);
    } catch (err) {
      console.error('Failed to update status:', err);
      setRefreshKey(k => k + 1);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      await taskService.toggleSubtask(subtaskId);
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your personal productivity dashboard..." />;
  }

  const todayTasks = tasks.filter(t => t.due_date === todayDateStr);
  const completedToday = tasks.filter(t => 
    (t.status === 'Completed' && t.completed_at && t.completed_at.startsWith(todayDateStr)) ||
    (t.status === 'Completed' && t.due_date === todayDateStr)
  );
  const pendingToday = todayTasks.filter(t => t.status !== 'Completed');
  const overdueTasks = tasks.filter(t => t.status !== 'Completed' && t.due_date && t.due_date < todayDateStr);

  const summary = overview?.summary || {
    totalTasks: tasks.length,
    totalCompleted: completedToday.length,
    totalPending: pendingToday.length,
    totalOverdue: overdueTasks.length,
    todayCompletionRate: todayTasks.length > 0 ? Math.round((completedToday.length / todayTasks.length) * 100) : 0
  };

  const streak = overview?.streak || { currentStreak: 0, longestStreak: 0 };
  const score = overview?.productivityScore || { score: 70, rating: 'Good Momentum', feedback: 'Keep knocking out your goals!' };
  const insights = overview?.insights || [];
  const suggestions = overview?.suggestions || [];

  return (
    <div className="page-container dashboard-page-root">
      {/* 1. Header Greeting & Progress Bar */}
      <div className="dashboard-header-card glass-card">
        <div className="dashboard-greeting-row">
          <div>
            <div className="greeting-badge">
              <Sparkles size={14} color="#6366f1" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="greeting-title">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p className="greeting-sub">
              {pendingToday.length > 0
                ? `You have ${pendingToday.length} task${pendingToday.length > 1 ? 's' : ''} to complete today. Let's make it happen!`
                : "All clear for today! Take a well-deserved break or plan ahead."}
            </p>
          </div>

          <button
            onClick={onOpenNewTask}
            className="btn btn-primary btn-add-task-header"
            id="dashboard-add-task-btn"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Today's Progress Bar */}
        <div className="dashboard-progress-banner">
          <div className="progress-banner-header">
            <span className="progress-title">Today's Progress</span>
            <span className="progress-percent-val">{summary.todayCompletionRate || 0}%</span>
          </div>
          <div className="progress-track" style={{ height: '10px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${summary.todayCompletionRate || 0}%`,
                background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)'
              }}
            />
          </div>
          <div className="progress-meta-counts">
            <span>{todayTasks.length} Scheduled Today</span>
            <span>{completedToday.length} Done</span>
            <span>{pendingToday.length} Remaining</span>
            {overdueTasks.length > 0 && (
              <span className="overdue-highlight">⚠️ {overdueTasks.length} Overdue</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Stats Grid */}
      <div className="dashboard-stats-grid">
        <StatCard
          title="Streak"
          value={`🔥 ${streak.currentStreak} Days`}
          subtitle={`Best: ${streak.longestStreak} days continuous`}
          icon={Flame}
          color="#f59e0b"
        />
        <StatCard
          title="Daily Score"
          value={`${score.score} / 100`}
          subtitle={score.rating}
          icon={Zap}
          color="#6366f1"
        />
        <StatCard
          title="Completed Today"
          value={completedToday.length}
          subtitle={`${pendingToday.length} still pending`}
          icon={CheckCircle2}
          color="#10b981"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks.length}
          subtitle={overdueTasks.length > 0 ? 'Requires attention' : 'No overdue work'}
          icon={AlertCircle}
          color={overdueTasks.length > 0 ? '#ef4444' : '#10b981'}
        />
      </div>

      {/* 3. Main Split View: Today's Tasks & Productivity Insights */}
      <div className="dashboard-split-layout">
        {/* Left Column: Today's Tasks */}
        <div className="dashboard-tasks-column">
          <div className="section-title-row">
            <div className="title-with-badge">
              <ListTodo size={20} color="#6366f1" />
              <h2>Today's Tasks</h2>
              <span className="count-badge">{todayTasks.length}</span>
            </div>
            <Link to="/tasks" className="view-all-link">
              <span>View All Tasks</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <EmptyState
              title="No tasks scheduled for today 🎉"
              description="You have completed everything scheduled for today, or have not added today's assignments yet."
              actionText="Add Today's Task"
              onAction={onOpenNewTask}
            />
          ) : (
            <div className="today-tasks-list">
              {todayTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleTaskStatus}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onToggleSubtask={handleToggleSubtask}
                />
              ))}
            </div>
          )}

          {/* Overdue Backlog Alert if any */}
          {overdueTasks.length > 0 && (
            <div className="overdue-backlog-card glass-card">
              <div className="overdue-header">
                <AlertCircle size={18} color="#ef4444" />
                <h4>Overdue Backlog ({overdueTasks.length})</h4>
              </div>
              <p className="overdue-sub">Finish these first to boost your daily productivity score!</p>
              <div className="overdue-tasks-mini-list">
                {overdueTasks.slice(0, 3).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleTaskStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onToggleSubtask={handleToggleSubtask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Productivity Score Breakdown & Smart Suggestions */}
        <div className="dashboard-insights-column">
          <div className="glass-card productivity-breakdown-card">
            <div className="score-card-header">
              <div className="score-badge-circle">
                <span className="score-num">{score.score}</span>
                <span className="score-denom">/100</span>
              </div>
              <div>
                <h3 className="score-status-title">{score.rating}</h3>
                <p className="score-status-desc">{score.feedback}</p>
              </div>
            </div>

            <div className="score-factors-list">
              <div className="factor-item">
                <span>Task Completion</span>
                <span className="factor-val">+{score.breakdown?.completionPoints || 0} pts</span>
              </div>
              <div className="factor-item">
                <span>High Priority Focus</span>
                <span className="factor-val">+{score.breakdown?.priorityPoints || 0} pts</span>
              </div>
              <div className="factor-item">
                <span>Streak Consistency</span>
                <span className="factor-val">+{score.breakdown?.streakBonus || 0} pts</span>
              </div>
              {score.breakdown?.overduePenalty > 0 && (
                <div className="factor-item penalty">
                  <span>Overdue Penalty</span>
                  <span className="factor-val">-{score.breakdown?.overduePenalty} pts</span>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card suggestions-card">
            <div className="card-heading-row">
              <Lightbulb size={18} color="#f59e0b" />
              <h3>Smart Productivity Tips</h3>
            </div>
            <div className="suggestions-list">
              {suggestions.map((sug, idx) => (
                <div key={idx} className="suggestion-item">
                  <span className="suggestion-bullet">💡</span>
                  <div>
                    <h5 className="suggestion-title">{sug.title}</h5>
                    <p className="suggestion-text">{sug.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {insights.length > 0 && (
            <div className="glass-card insights-card">
              <div className="card-heading-row">
                <Sparkles size={18} color="#6366f1" />
                <h3>Your Work Patterns</h3>
              </div>
              <div className="insights-list">
                {insights.map((ins, idx) => (
                  <div key={idx} className="insight-item">
                    <div className="insight-dot"></div>
                    <div>
                      <h5 className="insight-title">{ins.title}</h5>
                      <p className="insight-desc">{ins.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dashboard-page-root {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .dashboard-header-card {
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dashboard-greeting-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .greeting-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          background: var(--primary-light);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.5rem;
        }

        .greeting-title {
          font-size: 1.9rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.3rem;
        }

        .greeting-sub {
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .btn-add-task-header {
          padding: 0.75rem 1.4rem;
          font-size: 0.95rem;
        }

        .dashboard-progress-banner {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .progress-banner-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .progress-percent-val {
          color: var(--primary);
          font-weight: 800;
        }

        .progress-meta-counts {
          display: flex;
          gap: 1.25rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
          flex-wrap: wrap;
        }

        .overdue-highlight {
          color: var(--danger);
          font-weight: 700;
        }

        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.25rem;
        }

        .dashboard-split-layout {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 1.75rem;
          align-items: start;
        }

        .dashboard-tasks-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .title-with-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .count-badge {
          background: var(--primary-light);
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.15rem 0.55rem;
          border-radius: var(--radius-full);
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .today-tasks-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .overdue-backlog-card {
          border-left: 4px solid var(--danger);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .overdue-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .overdue-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .overdue-tasks-mini-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .dashboard-insights-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .productivity-breakdown-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .score-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .score-badge-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
        }

        .score-num {
          font-size: 1.3rem;
          font-weight: 800;
          line-height: 1;
        }

        .score-denom {
          font-size: 0.65rem;
          opacity: 0.8;
        }

        .score-status-title {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .score-status-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .score-factors-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-top: 1px solid var(--border-subtle);
          padding-top: 0.85rem;
        }

        .factor-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .factor-val {
          font-weight: 700;
          color: var(--success);
        }

        .factor-item.penalty .factor-val {
          color: var(--danger);
        }

        .card-heading-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .suggestions-list, .insights-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .suggestion-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.85rem;
        }

        .suggestion-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .suggestion-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .insight-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .insight-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary);
          margin-top: 0.35rem;
        }

        .insight-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .insight-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .dashboard-split-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
