import React from 'react';
import { Star } from 'lucide-react';

function AboutSection() {
  return (
    <section id="about" className="py-20 px-24 max-lg:px-12 max-lg:py-16 max-md:px-6 max-md:py-12 max-sm:px-4 max-sm:py-10 flex justify-center box-border">
      {/* SVG Mask Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="surgeon-mask" clipPathUnits="objectBoundingBox">
            <path d="M 0.45,0 
                     C 0.75,0 1,0.12 1,0.3 
                     C 1,0.42 0.82,0.47 0.82,0.5 
                     C 0.82,0.53 1,0.58 1,0.7 
                     C 1,0.88 0.75,1 0.45,1 
                     C 0.15,1 0,0.85 0,0.5 
                     C 0,0.15 0.15,0 0.45,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-20 max-lg:gap-12 max-md:gap-12 items-center w-full max-w-[1200px] mx-auto">
        {/* Left Column: Stats & Description */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#f1f5f9] p-[0.4rem_0.8rem] rounded-full text-[0.8rem] font-medium text-text-secondary mb-4">
            {/* Leaf / Shield Icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c1.8 0 3.2-1.4 3.2-3.2S13.8 5.6 12 5.6s-3.2 1.4-3.2 3.2 1.4 3.2 3.2 3.2zm0 0c0 1.8 1.4 3.2 3.2 3.2s3.2-1.4 3.2-3.2-1.4-3.2-3.2-3.2-3.2 1.4-3.2 3.2zm0 0c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2 3.2-1.4 3.2-3.2-1.4-3.2-3.2-3.2zm0 0c0-1.8-1.4-3.2-3.2-3.2s-3.2 1.4-3.2 3.2 1.4 3.2 3.2 3.2z" />
            </svg>
            <span>About us</span>
          </div>

          <h2 className="text-[3rem] max-sm:text-[1.8rem] font-medium text-gold-dark mt-0 mx-0 mb-12 font-sans tracking-[-0.02em] leading-[1.15]">
            Expertise you can trust
          </h2>

          <div className="grid grid-cols-2 gap-x-16 gap-y-10 max-md:gap-x-8 max-md:gap-y-8 max-sm:gap-x-4 max-sm:gap-y-6">
            <div>
              <div className="text-[3rem] font-medium text-gold-dark font-sans leading-none">20+</div>
              <div className="text-[0.9rem] text-text-muted mt-1.5 font-sans">certified specialists</div>
            </div>
            <div>
              <div className="text-[3rem] font-medium text-gold-dark font-sans leading-none">50+</div>
              <div className="text-[0.9rem] text-text-muted mt-1.5 font-sans">advanced procedures offered</div>
            </div>
            <div>
              <div className="text-[3rem] font-medium text-gold-dark font-sans leading-none">15</div>
              <div className="text-[0.9rem] text-text-muted mt-1.5 font-sans">years in practice</div>
            </div>
            <div>
              <div className="text-[3rem] font-medium text-gold-dark font-sans leading-none">99%</div>
              <div className="text-[0.9rem] text-text-muted mt-1.5 font-sans">patient satisfaction rate</div>
            </div>
          </div>
        </div>

        {/* Right Column: Doctor image masked as leaf with badges */}
        <div className="relative flex justify-center items-center pr-8 max-md:pr-0">
          {/* Wrapper for clipped doctor image and its shadow */}
          <div className="relative w-full max-w-[340px] max-sm:max-w-[260px] aspect-[340/380] h-auto max-sm:mx-auto">
            {/* Shadow / Offset Shape behind */}
            <div className="absolute top-5 left-[-1.2rem] w-full h-full bg-[#d9e8fb] [clip-path:url(#surgeon-mask)] z-[1]"></div>

            {/* Main Shape Container */}
            <div className="relative w-full h-full bg-[#d9e8fb] [clip-path:url(#surgeon-mask)] z-[2] flex items-end justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&h=700&q=80"
                alt="Surgeon working"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badge: Expert Hands */}
            <div className="absolute bottom-[-0.8rem] left-1/2 -translate-x-1/2 bg-white p-[0.5rem_1.2rem] rounded-full shadow-[0_10px_25px_rgba(15,23,42,0.08)] text-[0.85rem] font-semibold text-gold-dark z-[3] whitespace-nowrap border border-slate-900/5">
              Expert Hands
            </div>
          </div>

          {/* Floating badge: Patient rate stars */}
          <div className="absolute top-[12%] left-[-2rem] max-sm:left-[-1rem] bg-white p-4 rounded-[16px] shadow-[0_15px_35px_rgba(15,23,42,0.08)] flex flex-col gap-1 border border-slate-900/5 z-[4]">
            <span className="text-[0.72rem] font-semibold text-text-muted uppercase tracking-[0.05em]">Patient rate</span>
            <div className="flex gap-0.5 text-[#2563eb]">
              {[...Array(4)].map((_, i) => <Star key={i} size={13} fill="#2563eb" stroke="none" />)}
              <Star size={13} fill="none" stroke="#2563eb" strokeWidth={2} />
            </div>
            <span className="text-[1rem] font-bold text-[#1e3a8a] mt-0.5">4.8/5</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
