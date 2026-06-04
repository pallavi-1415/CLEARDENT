import React from 'react';
import { Loader2 } from 'lucide-react';

function LoadingSpinner({ message = 'Loading...', fullScreen = true }) {
  const content = (
    <div className="flex flex-col items-center justify-center text-slate-900">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-[0.9rem] font-sans tracking-[0.05em] uppercase text-slate-500">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex py-10 items-center justify-center w-full">
      {content}
    </div>
  );
}

export default LoadingSpinner;
