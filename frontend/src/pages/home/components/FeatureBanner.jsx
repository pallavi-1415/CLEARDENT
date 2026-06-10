import Button from '../../../components/ui/Button';
import doctorAuthProImg from '../../../assets/doctor_auth_pro.png';

function FeatureBanner({ navigate, isLoggedIn, setActiveTab }) {
  return (
    <section className="py-20 px-24 max-lg:px-12 max-lg:py-16 max-md:px-6 max-md:py-12 max-sm:px-4 max-sm:py-10 flex justify-center box-border w-full bg-[#6c94c0] bg-gradient-to-r from-[#6c94c0] to-[#799fc9] items-center overflow-hidden">
      {/* SVG Mask Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="dentistry-wave-mask" clipPathUnits="objectBoundingBox">
            <path d="M 0.35,0 
                     C 0.65,0 1,0.1 1,0.35 
                     C 1,0.55 0.72,0.5 0.72,0.7 
                     C 0.72,0.85 0.9,0.9 0.6,1 
                     C 0.3,1 0,0.85 0,0.6 
                     C 0,0.4 0.18,0.45 0.18,0.25 
                     C 0.18,0.1 0.2,0 0.35,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1.6fr_1.2fr] items-center gap-16 max-lg:gap-8 max-md:gap-10 w-full max-w-[1200px] text-white">
        {/* Left Column: Heading */}
        <div className="z-[2] md:col-span-2 lg:col-span-1">
          <h2 className="text-[3.4rem] max-sm:text-[1.9rem] font-sans font-normal text-white m-0 leading-[1.15] tracking-[-0.02em]">
            Modern dentistry.<br />
            Human care.
          </h2>
        </div>

        {/* Middle Column: Dentist Image with double wave mask */}
        <div className="relative flex items-center justify-center z-[2]">
          <div className="relative w-full max-w-[450px] max-sm:max-w-[270px] aspect-[450/380] h-auto max-sm:mx-auto">
            {/* Clipped image container */}
            <div className="w-full h-full [clip-path:url(#dentistry-wave-mask)] overflow-hidden flex items-center justify-center bg-[#dbeafe]">
              <img
                src={doctorAuthProImg}
                alt="Modern Dentist adjustment procedure"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Pill: Clear Treatment Progress */}
            <div className="absolute top-[35%] max-md:top-auto max-md:bottom-[5%] max-sm:bottom-[2%] left-[-10%] max-lg:left-[-4%] max-md:left-0 max-sm:left-[2px] bg-white text-gold-dark p-[0.8rem_1.6rem] max-md:p-[0.6rem_1.2rem] max-sm:p-[0.5rem_0.9rem] rounded-full shadow-[0_12px_30px_rgba(15,23,42,0.12)] flex items-center gap-2 z-10 whitespace-nowrap transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] max-sm:text-[0.75rem]">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
              <span className="text-[0.85rem] max-sm:text-[0.75rem] font-semibold font-sans">Clear Treatment Progress</span>
            </div>

            {/* Floating Badge: Smiles Restored */}
            <div className="absolute top-[12%] max-md:top-[5%] max-sm:top-[2%] right-[-10%] max-lg:right-[-4%] max-md:right-0 max-sm:right-[2px] bg-white text-gold-dark p-[1rem_1.5rem] max-md:p-[0.8rem_1.2rem] max-sm:p-[0.6rem_0.9rem] rounded-[16px] shadow-[0_12px_30px_rgba(15,23,42,0.12)] flex flex-col gap-0.5 z-10 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <span className="text-[1.5rem] font-bold text-[#16284e] font-sans">12,000+</span>
              <span className="text-[0.75rem] text-text-muted whitespace-nowrap font-sans">happy smiles restored</span>
            </div>
          </div>
        </div>

        {/* Right Column: Description & CTAs */}
        <div className="flex flex-col gap-10 justify-center pl-6 max-md:pl-0 max-md:items-center z-[2]">
          <p className="text-[0.98rem] leading-[1.65] text-white/95 m-0 max-w-[300px] font-sans max-md:text-center">
            Advanced treatments tailored to your needs — always delivered with comfort and precision.
          </p>

          {/* Double pill-button layout */}
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => {
                if (window.openBookingModal) window.openBookingModal();
                else navigate('booking');
              }}
              variant="navy"
              className="rounded-full p-[0.9rem_2.2rem] text-[0.95rem] font-semibold"
            >
              Schedule Appointment
            </Button>
            <Button
              onClick={() => {
                if (window.openBookingModal) window.openBookingModal();
                else navigate('services');
              }}
              variant="navy"
              className="w-12 h-12 rounded-[16px] flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureBanner;
