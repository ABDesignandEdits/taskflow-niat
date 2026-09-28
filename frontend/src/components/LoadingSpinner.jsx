import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading your productivity dashboard...' }) => {
  return (
    <div className="loading-spinner-container">
      <Loader2 className="spinner-icon-animated" size={36} />
      <p className="loading-text">{message}</p>

      <style>{`
        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          gap: 1rem;
        }

        .spinner-icon-animated {
          animation: spin 1s linear infinite;
          color: var(--primary);
        }

        .loading-text {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
