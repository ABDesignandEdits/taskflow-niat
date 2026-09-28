import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  danger = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-area">
          <div className="confirm-warning-icon">
            <AlertTriangle size={24} color="#ef4444" />
          </div>
        </div>
        <div className="confirm-text-area">
          <h4 className="confirm-title">{title}</h4>
          <p className="confirm-message">{message}</p>
        </div>
        <div className="modal-footer confirm-footer">
          <button onClick={onCancel} className="btn btn-secondary btn-sm">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        .confirm-dialog-box {
          max-width: 400px;
          text-align: center;
          padding: 1.5rem;
        }

        .confirm-icon-area {
          display: flex;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .confirm-warning-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirm-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }

        .confirm-message {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .confirm-footer {
          margin-top: 1.25rem;
          border-top: none;
          padding: 0;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
