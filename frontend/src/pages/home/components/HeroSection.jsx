import Button from '../../../components/ui/Button';
import orthoAlignerImg from '../../../assets/ortho_aligner.png';
import dentalHeroArtworkImg from '../../../assets/dental_hero_artwork.png';

function HeroSection({ navigate }) {
  return (
    <section className="pt-10 pb-14 px-24 max-lg:px-12 max-md:px-6 max-md:py-8 max-sm:px-4 max-sm:pt-6 max-sm:pb-8 flex flex-col items-center relative">
      {/* Top row text layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-16 max-lg:gap-8 max-md:gap-6 items-end w-full max-w-[1200px] mx-auto max-md:text-center">
        {/* Left Column: Headings */}
        <div className="animate-slide-in flex flex-col gap-1">
          <span className="text-[#2563eb] text-[1.1rem] font-medium tracking-[0.02em] font-sans">
            Smile & Dental Care
          </span>
          <h1 className="text-[3.8rem] max-md:text-[2.8rem] max-sm:text-[2.1rem] leading-[1.1] font-sans font-normal text-gold-dark m-0 tracking-[-0.02em]">
            Advanced dentistry<br />
            for every smile
          </h1>
        </div>

        {/* Right Column: Desc & CTA button */}
        <div className="flex flex-col gap-5 items-start max-md:items-center">
          <p className="text-text-secondary text-[1rem] leading-[1.6] m-0 font-sans">
            Complete care for your smile — prevention, restoration, and aesthetic treatments in one place.
          </p>

          <Button
            onClick={() => {
              if (window.openBookingModal) window.openBookingModal();
              else navigate('booking');
            }}
            variant="dark"
            className="flex items-center rounded-[10px] p-[0.3rem_0.3rem_0.3rem_1.4rem] text-[0.9rem] font-medium gap-[1.2rem] font-sans"
          >
            <span>Schedule Appointment</span>
            <div className="bg-[#0f172a] p-[0.5rem_0.7rem] rounded-[7px] flex items-center justify-center text-white">
              <span className="text-[0.8rem] font-bold flex items-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7" />
                  <polyline points="6 17 11 12 6 7" />
                </svg>
              </span>
            </div>
          </Button>
        </div>
      </div>

      {/* Bottom row cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr] gap-6 max-lg:gap-4 w-full max-w-[1200px] mt-8 mx-auto">
        {/* Card 1: Dental Treatment */}
        <div className="relative bg-[#5a8bdc] bg-gradient-to-br from-[#5a8bdc] to-[#4777c5] rounded-[24px] p-[2rem_2.5rem] max-sm:p-6 text-white flex flex-col justify-between overflow-hidden h-[330px] max-sm:h-[220px]">
          {/* Background soft concentric waves */}
          <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none"></div>
 
          {/* Text group */}
          <div className="z-[2] max-w-[60%] max-sm:max-w-[70%] flex flex-col gap-2.5">
            <h2 className="text-[2rem] max-sm:text-[1.5rem] font-normal m-0 font-sans tracking-[-0.01em]">
              Dental Treatment
            </h2>
            <p className="text-[0.88rem] max-sm:text-[0.78rem] opacity-90 leading-[1.55] m-0 font-sans font-light">
              Comprehensive care including check-ups, fillings, and preventive treatments.
            </p>
          </div>
 
          {/* Doctor cutout image */}
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80"
            alt="Dentist"
            className="absolute right-[5%] max-sm:right-[2%] bottom-0 h-[85%] max-sm:h-[80%] w-[40%] max-sm:w-[35%] rounded-t-full object-cover pointer-events-none z-[1] border-t-2 border-white/20 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
 
          {/* Bottom Row */}
          <div className="flex justify-between items-center z-[2] mt-auto">
            {/* Avatars */}
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Dr. Jenkins"
                className="w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-full border-[3px] border-[#5a8bdc] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Dr. Kinash"
                className="w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-full border-[3px] border-[#5a8bdc] ml-[-10px] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Dr. Thorne"
                className="w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-full border-[3px] border-[#5a8bdc] ml-[-10px] object-cover"
              />
              <div className="w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-full bg-white text-[#1d2e88] text-[0.75rem] max-sm:text-[0.65rem] font-bold flex items-center justify-center border-[3px] border-[#5a8bdc] ml-[-10px]">
                +20
              </div>
            </div>
 
            {/* Up-Right Arrow Button */}
            <Button
              onClick={() => {
                if (window.openBookingModal) window.openBookingModal();
                else navigate('services');
              }}
              className="w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-[10px] bg-[#1d2e88] text-white border-none flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#131e5f] hover:scale-105"
              variant="plain"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Button>
          </div>
        </div>
 
        {/* Card 2: Orthodontics */}
        <div
          className="relative bg-[#d9e8fb] rounded-[24px] flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-1 h-[330px] max-sm:h-[220px]"
          onClick={() => navigate('services')}
        >
          <img
            src={orthoAlignerImg}
            alt="Orthodontics Aligners"
            className="absolute w-full h-full object-cover opacity-80"
          />
          {/* Mobile readable contrast overlay */}
          <div className="absolute inset-0 bg-black/15 md:hidden z-[1]" />
          <div className="relative z-[2] rotate-0 md:-rotate-90 md:whitespace-nowrap text-[2rem] max-sm:text-[1.6rem] font-medium md:font-light text-text-primary max-sm:text-white font-sans tracking-[0.02em] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] md:drop-shadow-none">
            Orthodontics
          </div>
        </div>
 
        {/* Card 3: Dental Surgery */}
        <div
          className="relative bg-white rounded-[24px] flex flex-col items-center justify-center overflow-hidden border border-slate-900/5 shadow-[0_10px_30px_rgba(15,23,42,0.02)] cursor-pointer transition-transform duration-200 hover:-translate-y-1 h-[330px] max-sm:h-[220px]"
          onClick={() => navigate('services')}
        >
          <img
            src={dentalHeroArtworkImg}
            alt="Dental Surgery"
            className="absolute w-full h-full object-cover opacity-[0.95]"
          />
          {/* Mobile readable contrast overlay */}
          <div className="absolute inset-0 bg-black/15 md:hidden z-[1]" />
          <div className="relative z-[2] rotate-0 md:-rotate-90 md:whitespace-nowrap text-[2rem] max-sm:text-[1.6rem] font-medium md:font-light text-text-primary max-sm:text-white font-sans tracking-[0.02em] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] md:drop-shadow-none">
            Dental Surgery
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
