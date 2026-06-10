import React from 'react';
import Button from '../../../components/ui/Button';
import dentalHeroArtworkImg from '../../../assets/dental_hero_artwork.png';

function AppointmentCta({ navigate, isLoggedIn, setActiveTab }) {
  return (
    <section className="py-20 px-24 max-lg:px-12 max-lg:py-16 max-md:px-6 max-md:py-12 max-sm:px-4 max-sm:py-10 flex justify-center box-border bg-[#f5f4f0]">
      <div className="bg-gradient-to-br from-[#dceefc] to-[#cde7fc] rounded-[32px] max-md:rounded-[24px] max-sm:rounded-[20px] p-[4.5rem_5rem] max-lg:p-[3.5rem_3rem] max-md:p-[2.5rem_1.8rem] max-sm:p-[2rem_1.2rem] grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center gap-16 max-lg:gap-12 max-md:gap-10 max-sm:gap-8 relative overflow-hidden max-w-[1500px] w-full">
        {/* Left Column: Heading & Input Form */}
        <div className="flex flex-col gap-6 z-[2]">
          <h2 className="text-[2.8rem] font-medium text-gold-dark m-0 font-sans leading-[1.15] tracking-[-0.02em]">
            Your confident<br />
            smile starts here
          </h2>
          <p className="text-[0.98rem] leading-[1.55] text-text-secondary m-0 max-w-[420px] font-sans">
            Schedule your consultation and let our experienced team create a treatment plan designed just for you.
          </p>

          {/* Form fields */}
          <div className="flex flex-col gap-4 mt-4 w-full max-w-[420px]">
            <Button
              onClick={() => {
                window.location.href = 'mailto:info@cleardent.com';
              }}
              variant="navy"
              className="w-full rounded-full p-[0.65rem_0.65rem_0.65rem_2rem] text-[0.95rem] flex items-center justify-between shadow-[0_8px_25px_rgba(22,40,78,0.15)] font-sans"
            >
              <span>Contact Us</span>
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7" />
                  <polyline points="6 17 11 12 6 7" />
                </svg>
              </div>
            </Button>
          </div>
        </div>

        {/* Right Column: Surgeon Cutout */}
        <div className="relative h-[420px] max-lg:h-[340px] max-sm:h-[280px] w-full flex items-end justify-center z-[1] max-sm:hidden">
          {/* Wrapper for clipped doctor image and its shadow */}
          <div className="relative w-full max-w-[340px] max-sm:max-w-[260px] aspect-[340/380] h-auto mb-[15px] max-sm:mx-auto">
            {/* Shadow / Offset Shape behind */}
            <div className="absolute top-5 left-[-1.2rem] w-full h-full bg-white/35 [clip-path:url(#surgeon-mask)] z-[1]"></div>

            {/* Main Shape Container */}
            <div className="relative w-full h-full bg-[#d9e8fb] [clip-path:url(#surgeon-mask)] z-[2] flex items-end justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&h=700&q=80"
                alt="Surgeon professional specialist cutout"
                className="w-full h-full object-cover relative z-[2]"
              />
            </div>
          </div>

          {/* Badge: Patient Loyalty */}
          <div className="absolute top-[12%] max-md:top-[5%] left-[-8%] max-lg:left-[-2%] max-md:left-0 bg-white p-4 max-md:p-[0.8rem_1rem] rounded-[16px] shadow-[0_10px_30px_rgba(15,23,42,0.08)] flex items-center gap-5 z-[5] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div>
              <div className="text-[0.9rem] font-semibold text-gold-dark font-sans mb-[0.2rem]">Patient Loyalty</div>
              <div className="text-[0.75rem] text-text-secondary font-sans leading-tight">
                return for<br />continued care
              </div>
            </div>
            {/* Donut Chart */}
            <div className="relative w-[50px] h-[50px] flex items-center justify-center">
              <svg width="50" height="50" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4a8be6" strokeWidth="4" strokeDasharray="78 22" strokeDashoffset="25" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[0.75rem] font-bold text-[#4a8be6] font-sans">
                78%
              </div>
            </div>
          </div>

          {/* Badge: 3D Scanning */}
          <div className="absolute bottom-[10%] max-md:bottom-[5%] left-[-8%] max-lg:left-[-2%] max-md:left-0 bg-white p-4 max-md:p-[0.8rem] rounded-[16px] shadow-[0_10px_30px_rgba(15,23,42,0.08)] flex flex-col gap-1.5 z-[5] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div>
              <div className="text-[0.85rem] font-semibold text-gold-dark font-sans">3D Scanning</div>
              <div className="text-[0.7rem] text-[#64748b] font-sans">Radiation-safe</div>
            </div>
            <div className="relative w-[120px] h-[55px] bg-[#0c1938] rounded-[10px] overflow-hidden flex items-center justify-center">
              <img
                src={dentalHeroArtworkImg}
                alt="3D Scanning screen"
                className="h-4/5 filter hue-rotate-180 brightness-150 contrast-110 object-contain"
              />
              <span className="absolute bottom-1 right-1.5 bg-white/90 text-gold-dark text-[0.65rem] font-bold p-[0.1rem_0.35rem] rounded-[4px] font-sans">
                $60
              </span>
            </div>
          </div>

          {/* Badge: Choose Doctor overlay */}
          <div className="absolute top-[38%] max-md:top-[35%] right-[-12%] max-lg:right-[-2%] max-md:right-0 bg-white p-4 max-md:p-[0.8rem] rounded-[16px] shadow-[0_10px_30px_rgba(15,23,42,0.08)] flex flex-col gap-2 z-[5] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div>
              <div className="text-[0.85rem] font-semibold text-gold-dark font-sans leading-tight">Choose the right<br />Doctor</div>
            </div>
            <div className="flex items-center">
              {[
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=40&h=40&q=80",
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=40&h=40&q=80",
                "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=40&h=40&q=80"
              ].map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="specialist avatar"
                  className="w-[26px] h-[26px] rounded-full border-2 border-white ml-[-8px] first:ml-0 object-cover"
                />
              ))}
              <div className="w-[26px] h-[26px] rounded-full bg-[#3b82f6] border-2 border-white ml-[-8px] flex items-center justify-center text-[0.65rem] text-white font-bold font-sans">
                +20
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AppointmentCta;
