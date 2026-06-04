import React from 'react';

function TextArea({
  value,
  onChange,
  placeholder = '',
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[0.9rem] text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-sans resize-none leading-relaxed ${className}`}
      {...props}
    />
  );
}

export default TextArea;
