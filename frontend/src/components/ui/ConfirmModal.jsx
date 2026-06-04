import React from 'react';
import ReactDOM from 'react-dom';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .confirm-modal-card {
          animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .confirm-cancel-btn:hover {
          background: #f1f5f9 !important;
          border-color: #94a3b8 !important;
          color: #1e293b !important;
        }
        .confirm-ok-btn:hover {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45) !important;
          transform: translateY(-1px) !important;
        }
        .confirm-ok-btn:active {
          transform: translateY(0) !important;
        }
      `}</style>

      <div
        className="confirm-modal-card"
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.25rem 2rem 2rem',
          maxWidth: '420px',
          width: '100%',
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.04), 0 32px 64px -12px rgba(15,23,42,0.2)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Close × */}
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            fontSize: '1.2rem',
            lineHeight: 1,
            padding: '4px 8px',
            borderRadius: '8px',
            transition: 'color 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#475569')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h2
          style={{
            margin: '0 0 0.6rem',
            fontSize: '1.35rem',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.025em',
            fontFamily: 'inherit',
          }}
        >
          {title || 'Confirm Action'}
        </h2>

        {/* Message */}
        <p
          style={{
            margin: '0 0 2rem',
            color: '#64748b',
            fontSize: '0.92rem',
            lineHeight: '1.65',
            fontFamily: 'inherit',
          }}
        >
          {message}
        </p>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: '#f1f5f9',
            margin: '0 -2rem 1.5rem',
          }}
        />

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          {/* Cancel */}
          <button
            className="confirm-cancel-btn"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '14px',
              border: '1.5px solid #e2e8f0',
              background: '#ffffff',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.92rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
          >
            {cancelText}
          </button>

          {/* Confirm — theme indigo/blue */}
          <button
            className="confirm-ok-btn"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.92rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ConfirmModal;
