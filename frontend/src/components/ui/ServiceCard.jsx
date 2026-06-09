import React from 'react';
import { ArrowUpRight } from 'lucide-react';

function ServiceCard({ name, price, desc, duration, icon: Icon, onBook }) {
  return (
    <div
      className="group relative bg-white border border-[#e2e8f0] rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:bg-[#e0f2fe] hover:border-[#7dd3fc] hover:shadow-[0_8px_32px_rgba(56,189,248,0.15)] hover:-translate-y-1 overflow-hidden min-h-[210px]"
    >
      {/* Icon — always blue */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 transition-all duration-300 group-hover:scale-110 bg-[#2563eb]">
        {Icon && <Icon size={22} />}
      </div>

      {/* Title & Description */}
      <div className="flex flex-col gap-1 flex-1">
        <h4 className="text-[1rem] font-bold text-[#0f172a] font-sans leading-snug m-0 group-hover:text-[#0369a1] transition-colors duration-200">
          {name}
        </h4>
        <p className="text-[#64748b] text-[0.82rem] leading-relaxed font-sans m-0 group-hover:text-[#0c4a6e] transition-colors duration-200">
          {desc}
        </p>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f1f5f9] group-hover:border-[#bae6fd] transition-colors duration-300">
        {/* Price badge — always blue */}
        <span className="text-[#2563eb] text-[0.8rem] font-bold font-sans bg-[#eff6ff] px-2.5 py-1 rounded-lg border border-[#dbeafe] group-hover:bg-[#bae6fd] group-hover:text-[#0369a1] group-hover:border-[#7dd3fc] transition-all duration-300">
          {price}
        </span>
        <button
          onClick={onBook}
          className="inline-flex items-center gap-1 text-[#475569] text-[0.78rem] font-semibold font-sans bg-transparent border-none cursor-pointer p-0 group-hover:text-[#0369a1] transition-colors duration-200"
        >
          <span>Learn More</span>
          <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;
