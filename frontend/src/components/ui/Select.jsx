import React from 'react';

function Select({
  value,
  onChange,
  options = [],
  className = '',
  children,
  ...props
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[0.9rem] text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold cursor-pointer ${className}`}
      {...props}
    >
      {children ? children : options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
