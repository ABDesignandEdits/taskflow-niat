import React from 'react';

export const ProgressRing = ({
  radius = 60,
  stroke = 10,
  progress = 0,
  color = '#6366f1',
  trackColor = 'rgba(255,255,255,0.08)',
  label = 'Completed'
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className="progress-ring-wrapper">
      <svg height={radius * 2} width={radius * 2} className="progress-ring-svg">
        <circle
          stroke={trackColor}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="progress-ring-center">
        <span className="progress-ring-value">{progress}%</span>
        {label && <span className="progress-ring-label">{label}</span>}
      </div>

      <style>{`
        .progress-ring-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .progress-ring-svg {
          transform: rotate(-90deg);
        }

        .progress-ring-center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .progress-ring-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1;
        }

        .progress-ring-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }
      `}</style>
    </div>
  );
};
