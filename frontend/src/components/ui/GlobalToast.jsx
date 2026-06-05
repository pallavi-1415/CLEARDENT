import React, { useState, useEffect } from 'react';

const GlobalToast = () => {
  const [toast, setToast] = useState(null); // { message, type }

  useEffect(() => {
    window.showToast = (message, type = 'success') => {
      setToast({ message, type });
    };
    window.showError = (message) => {
      setToast({ message, type: 'error' });
    };
    return () => {
      delete window.showToast;
      delete window.showError;
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-global-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 999999;
          background: #ffffff;
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 12px;
          animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          max-width: 380px;
          border: 1px solid #e2e8f0;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .custom-global-toast.toast-error {
          border-left: 5px solid #ef4444;
          background: #fef2f2;
          color: #991b1b;
        }
        .custom-global-toast.toast-success {
          border-left: 5px solid #10b981;
          background: #ecfdf5;
          color: #065f46;
        }
      `}</style>
      <div className={`custom-global-toast toast-${toast.type}`}>
        <div style={{ flex: 1 }}>{toast.message}</div>
        <button
          onClick={() => setToast(null)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            padding: '0 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          &times;
        </button>
      </div>
    </>
  );
};

export default GlobalToast;
