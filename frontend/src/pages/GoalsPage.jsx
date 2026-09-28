import React, { useState, useEffect } from 'react';
import { goalService } from '../services/goalService';
import { GoalCard } from '../components/GoalCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Target, Plus, Sparkles, CheckCircle2, Award } from 'lucide-react';

export const GoalsPage = ({ onOpenNewGoal, onEditGoal, onDeleteGoal }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalService.getGoals();
        setGoals(data || []);
      } catch (err) {
        console.error('Failed to load goals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [refreshKey]);

  const handleUpdateProgress = async (goalId, newProgress) => {
    setGoals(prev =>
      prev.map(g => (g.id === goalId ? { ...g, progress: newProgress, status: newProgress >= 100 ? 'Achieved' : 'In Progress' } : g))
    );
    try {
      await goalService.updateGoal(goalId, { progress: newProgress });
    } catch (err) {
      console.error('Failed to update goal progress:', err);
      setRefreshKey(k => k + 1);
    }
  };

  const achievedCount = goals.filter(g => g.status === 'Achieved' || g.progress >= 100).length;
  const inProgressCount = goals.filter(g => g.status !== 'Achieved' && g.progress < 100).length;

  const filteredGoals = categoryFilter === 'All'
    ? goals
    : goals.filter(g => g.category === categoryFilter);

  return (
    <div className="page-container goals-page-root">
      <div className="goals-header">
        <div>
          <h1 className="goals-title">Goals & Targets 🎯</h1>
          <p className="goals-subtitle">Set long-term milestones, track progress, and celebrate achievements.</p>
        </div>

        <button onClick={onOpenNewGoal} className="btn btn-primary" id="create-goal-btn">
          <Plus size={18} />
          <span>New Goal</span>
        </button>
      </div>

      <div className="goals-stats-banner glass-card">
        <div className="goal-stat-item">
          <Target size={22} color="#6366f1" />
          <div>
            <span className="stat-num">{goals.length}</span>
            <span className="stat-label">Total Goals</span>
          </div>
        </div>
        <div className="goal-stat-item">
          <Award size={22} color="#10b981" />
          <div>
            <span className="stat-num">{achievedCount}</span>
            <span className="stat-label">Achieved 🎉</span>
          </div>
        </div>
        <div className="goal-stat-item">
          <Sparkles size={22} color="#f59e0b" />
          <div>
            <span className="stat-num">{inProgressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
      </div>

      <div className="goal-category-tabs">
        {['All', 'Academic', 'Coding', 'Personal', 'Fitness', 'Creative'].map((cat) => (
          <button
            key={cat}
            className={`goal-tab-btn ${categoryFilter === cat ? 'goal-tab-active' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your goals..." />
      ) : filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals yet 🎯"
          description="Create your first semester or personal goal and drag the progress slider as you complete milestones!"
          actionText="Create Goal"
          onAction={onOpenNewGoal}
        />
      ) : (
        <div className="goals-grid">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEditGoal}
              onDelete={onDeleteGoal}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </div>
      )}

      <style>{`
        .goals-page-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .goals-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .goals-title {
          font-size: 2rem;
          font-weight: 800;
        }

        .goals-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .goals-stats-banner {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 1.25rem 2rem;
        }

        .goal-stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-num {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
          display: block;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .goal-category-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .goal-tab-btn {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-fast);
        }

        .goal-tab-btn:hover {
          color: var(--text-main);
        }

        .goal-tab-active {
          color: var(--primary) !important;
          background: var(--primary-light) !important;
          border-color: var(--primary) !important;
        }

        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .goals-stats-banner {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .goals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default GoalsPage;
