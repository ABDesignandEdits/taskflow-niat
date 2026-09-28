import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { ProgressRing } from '../components/ProgressRing';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Flame,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
  Lightbulb,
  Award
} from 'lucide-react';

export const AnalyticsPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getOverview();
        setOverview(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating your productivity analytics..." />;
  }

  const summary = overview?.summary || {};
  const streak = overview?.streak || { currentStreak: 0, longestStreak: 0 };
  const score = overview?.productivityScore || { score: 70, rating: 'Good Momentum', feedback: 'Keep it going!' };
  const weeklyData = overview?.weeklyChart || [];
  const categoryData = overview?.categoryChart || [];
  const insights = overview?.insights || [];
  const suggestions = overview?.suggestions || [];

  const CHART_COLORS = ['#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#64748b'];

  return (
    <div className="page-container analytics-page-root">
      <div className="analytics-page-header">
        <div>
          <h1 className="analytics-title">Productivity Analytics 📊</h1>
          <p className="analytics-subtitle">Track your focus trends, velocity, and task distributions over time.</p>
        </div>
      </div>

      <div className="analytics-hero-grid">
        <div className="glass-card streak-hero-card">
          <div className="streak-hero-left">
            <div className="flame-badge-big">
              <Flame size={32} color="#ffffff" />
            </div>
            <div>
              <span className="streak-hero-label">CURRENT PRODUCTIVITY STREAK</span>
              <h2 className="streak-hero-num">{streak.currentStreak} Day{streak.currentStreak === 1 ? '' : 's'} 🔥</h2>
              <p className="streak-hero-sub">
                {streak.activeToday ? "You checked off a task today! Streak protected." : "Complete a task today to keep your streak burning!"}
              </p>
            </div>
          </div>
          <div className="streak-hero-best">
            <Award size={20} color="#f59e0b" />
            <span>All-time Record: <strong>{streak.longestStreak} Days</strong></span>
          </div>
        </div>

        <div className="glass-card score-hero-card">
          <div className="score-hero-top">
            <div>
              <span className="score-hero-label">DAILY PRODUCTIVITY SCORE</span>
              <h2 className="score-hero-num">{score.score} <span className="score-hero-denom">/ 100</span></h2>
              <span className="score-hero-pill">{score.rating}</span>
            </div>
            <div className="score-icon-box">
              <Zap size={28} color="#6366f1" />
            </div>
          </div>
          <p className="score-hero-feedback">{score.feedback}</p>
        </div>
      </div>

      <div className="charts-grid-2">
        <div className="glass-card chart-container-card">
          <div className="chart-header">
            <TrendingUp size={20} color="#6366f1" />
            <h3>Weekly Task Completion</h3>
          </div>
          <p className="chart-desc">Tasks completed each day over the last 7 days.</p>

          <div className="recharts-wrapper-box" style={{ height: '280px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-medium)',
                    borderRadius: '8px',
                    color: 'var(--text-main)'
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Bar dataKey="completed" name="Completed Tasks" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card chart-container-card">
          <div className="chart-header">
            <PieIcon size={20} color="#06b6d4" />
            <h3>Tasks by Category</h3>
          </div>
          <p className="chart-desc">How your homework and projects are split across subjects.</p>

          <div className="recharts-wrapper-box" style={{ height: '280px', width: '100%', marginTop: '1rem' }}>
            {categoryData.length === 0 ? (
              <div className="chart-empty-msg">No categorized tasks yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-medium)',
                      borderRadius: '8px',
                      color: 'var(--text-main)'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="charts-grid-2">
        <div className="glass-card rate-breakdown-card">
          <div className="chart-header">
            <CheckCircle2 size={20} color="#10b981" />
            <h3>Overall Completion Velocity</h3>
          </div>

          <div className="rate-content-row">
            <ProgressRing
              radius={70}
              stroke={12}
              progress={summary.completionRate || 0}
              color="#10b981"
              label="Completed"
            />
            <div className="rate-stats-list">
              <div className="rate-stat-box">
                <span className="rate-stat-label">Total Tasks Created</span>
                <span className="rate-stat-val">{summary.totalTasks || 0}</span>
              </div>
              <div className="rate-stat-box">
                <span className="rate-stat-label">Tasks Completed</span>
                <span className="rate-stat-val text-success">{summary.totalCompleted || 0}</span>
              </div>
              <div className="rate-stat-box">
                <span className="rate-stat-label">Pending / In-Progress</span>
                <span className="rate-stat-val">{summary.totalPending || 0}</span>
              </div>
              <div className="rate-stat-box">
                <span className="rate-stat-label">Overdue Tasks</span>
                <span className="rate-stat-val text-danger">{summary.totalOverdue || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card suggestions-panel-card">
          <div className="chart-header">
            <Lightbulb size={20} color="#f59e0b" />
            <h3>Smart Productivity Suggestions</h3>
          </div>
          <div className="analytics-suggestions-list">
            {suggestions.map((sug, idx) => (
              <div key={idx} className="analytics-suggestion-item">
                <span className="sug-bullet">⚡</span>
                <div>
                  <h4>{sug.title}</h4>
                  <p>{sug.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .analytics-page-root {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .analytics-title {
          font-size: 2rem;
          font-weight: 800;
        }

        .analytics-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .analytics-hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.5rem;
        }

        .streak-hero-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.75rem;
          gap: 1.25rem;
          border-left: 4px solid #f59e0b;
        }

        .streak-hero-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .flame-badge-big {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
        }

        .streak-hero-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #f59e0b;
          letter-spacing: 0.08em;
        }

        .streak-hero-num {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .streak-hero-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .streak-hero-best {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-subtle);
          padding-top: 0.75rem;
        }

        .score-hero-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
          border-left: 4px solid var(--primary);
        }

        .score-hero-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .score-hero-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.08em;
        }

        .score-hero-num {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.1;
          margin-top: 0.2rem;
        }

        .score-hero-denom {
          font-size: 1rem;
          color: var(--text-dim);
        }

        .score-hero-pill {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          background: var(--primary-light);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          margin-top: 0.4rem;
        }

        .score-icon-box {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          background: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-hero-feedback {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .charts-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .chart-container-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .chart-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chart-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .chart-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .chart-empty-msg {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          font-size: 0.9rem;
        }

        .rate-breakdown-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .rate-content-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .rate-stats-list {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .rate-stat-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .rate-stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .rate-stat-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .text-success { color: var(--success); }
        .text-danger { color: var(--danger); }

        .suggestions-panel-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .analytics-suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .analytics-suggestion-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.85rem;
        }

        .analytics-suggestion-item h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .analytics-suggestion-item p {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        @media (max-width: 1024px) {
          .analytics-hero-grid, .charts-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;
