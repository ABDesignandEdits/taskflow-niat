import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#6366f1',
  trend = null
}) => {
  return (
    <div className="stat-card-glass">
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        <div
          className="stat-icon-wrapper"
          style={{
            backgroundColor: `${color}18`,
            color: color
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="stat-card-bottom">
        <h3 className="stat-value-text">{value}</h3>
        {subtitle && <p className="stat-subtitle-text">{subtitle}</p>}
      </div>

      <style>{`
        .stat-card-glass {
          background: var(--bg-surface-glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          box-shadow: var(--card-shadow);
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .stat-card-glass:hover {
          border-color: var(--border-medium);
          transform: translateY(-2px);
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-card-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value-text {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.1;
        }

        .stat-subtitle-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }
      `}</style>
    </div>
  );
};
