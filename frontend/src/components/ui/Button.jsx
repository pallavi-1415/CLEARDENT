import React from 'react';

function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center font-sans font-semibold rounded-[8px] transition-all duration-200 cursor-pointer border-none';
  
  const variants = {
    primary: 'bg-gold text-white hover:bg-gold-hover',
    secondary: 'bg-[#f1f5f9] text-text-primary hover:bg-[#e2e8f0]',
    outline: 'bg-transparent border border-gold text-gold hover:bg-gold hover:text-white',
    dark: 'bg-[#1e293b] text-white hover:bg-[#0f172a]',
    navy: 'bg-[#16284e] text-white hover:bg-[#0c1938]',
    plain: '', // for custom/reset buttons
  };

  const selectedVariant = variants[variant] || variants.plain;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${selectedVariant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
