import React from 'react';

function FormFieldWrapper({ label, children, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

export default FormFieldWrapper;
