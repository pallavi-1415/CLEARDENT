import React from 'react';

function Badge({ children, className = '', variant = 'primary' }) {
  const baseStyle = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.75rem] font-semibold font-sans tracking-wide uppercase transition-all duration-200';
  
  const variants = {
    primary: 'bg-[#e0f2fe] text-[#0369a1]',
    secondary: 'bg-[#f1f5f9] text-[#475569]',
    success: 'bg-[#dcfce7] text-[#15803d]',
    warning: 'bg-[#fef9c3] text-[#a16207]',
    gold: 'bg-[#fef3c7] text-[#b45309]',
    danger: 'bg-[#fee2e2] text-[#b91c1c]',
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <span className={`${baseStyle} ${selectedVariant} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
