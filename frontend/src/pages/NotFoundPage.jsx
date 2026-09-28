import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card glass-card">
        <div className="not-found-icon">
          <Compass size={48} color="#6366f1" />
        </div>
        <h1>404 — Page Not Found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>

      <style>{`
        .not-found-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .not-found-card {
          text-align: center;
          max-width: 450px;
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .not-found-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
