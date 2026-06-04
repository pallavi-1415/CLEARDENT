import React from 'react';

function EmptyState({ icon: Icon, message, className = '' }) {
  return (
    <div className={`text-center py-12 text-slate-500 flex flex-col items-center justify-center w-full ${className}`}>
      {Icon && <Icon className="mx-auto text-blue-600 mb-3" size={32} />}
      <p className="text-[0.85rem] font-medium">{message}</p>
    </div>
  );
}

export default EmptyState;
