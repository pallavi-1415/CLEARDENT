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
      className="fixed inset-0 bg-slate-900/55 flex items-center justify-center z-[99999] backdrop-blur-[8px] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-[24px] p-[2.25rem_2rem_2rem] max-w-[420px] w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04),0_32px_64px_-12px_rgba(15,23,42,0.2)] text-center relative animate-modal-slide-in">
        {/* Close × */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-slate-400 text-lg leading-none p-1 px-2 rounded-lg transition-colors hover:text-slate-600"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="m-0 mb-2.5 text-[1.35rem] font-extrabold text-slate-900 tracking-tight">
          {title || 'Confirm Action'}
        </h2>

        {/* Message */}
        <p className="m-0 mb-8 text-slate-400 text-[0.92rem] leading-relaxed">
          {message}
        </p>

        {/* Divider */}
        <div className="h-[1px] bg-slate-100 -mx-8 mb-6" />

        {/* Buttons */}
        <div className="flex gap-2.5 justify-center">
          {/* Cancel */}
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-5 rounded-[14px] border border-slate-200 bg-white text-slate-500 font-semibold text-[0.92rem] cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800"
          >
            {cancelText}
          </button>

          {/* Confirm — theme indigo/blue */}
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-5 rounded-[14px] border-none bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold text-[0.92rem] cursor-pointer transition-all duration-200 shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:from-indigo-600 hover:to-indigo-700 hover:shadow-[0_8px_24px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0"
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
