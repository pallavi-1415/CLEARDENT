import React, { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function ToothLoader({ onClose }) {
  useEffect(() => {
    // Automatically close loader and transition to next page after 1.2 seconds
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-[999999] flex items-center justify-center overflow-hidden select-none">
      <div className="w-40 h-40">
        <DotLottieReact
          src="/loader.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}

export default ToothLoader;
