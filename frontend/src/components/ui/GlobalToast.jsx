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
    <div 
      className={`fixed top-6 right-6 z-[999999] rounded-2xl p-4 flex items-center gap-3 font-sans text-[0.88rem] font-semibold max-w-[380px] border box-border transition-all duration-200 shadow-2xl animate-toast-slide-in ${
        toast.type === 'error' 
          ? 'border-l-[5px] border-l-red-500 bg-red-50 text-red-800 border-red-200' 
          : 'border-l-[5px] border-l-emerald-500 bg-emerald-50 text-emerald-800 border-emerald-200'
      }`}
    >
      <div className="flex-1">{toast.message}</div>
      <button
        onClick={() => setToast(null)}
        className="bg-transparent border-none text-current cursor-pointer font-bold text-lg px-1 flex items-center justify-center hover:opacity-80 transition-opacity"
      >
        &times;
      </button>
    </div>
  );
};

export default GlobalToast;
