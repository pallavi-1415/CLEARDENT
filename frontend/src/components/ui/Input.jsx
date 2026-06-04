import React from 'react';

function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border-none p-[0.85rem_1.4rem] rounded-full bg-white text-gold-dark text-[0.9rem] outline-none shadow-[0_4px_10px_rgba(15,23,42,0.03)] font-sans transition-all duration-200 focus:shadow-[0_4px_15px_rgba(37,99,235,0.1)] ${className}`}
      {...props}
    />
  );
}

export default Input;
