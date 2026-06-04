import Button from '../../../components/ui/Button';

function ServicesSection({ navigate, isLoggedIn, setActiveTab }) {
  return (
    <section id="services" className="py-20 px-24 max-lg:px-12 max-lg:py-16 max-md:px-6 max-md:py-12 max-sm:px-4 max-sm:py-10 flex justify-center box-border bg-[#f8fafc]">
      <div className="w-full max-w-[1200px] mx-auto">
        {/* Badge & Title */}
        <div className="flex flex-col gap-4 mb-14">
          <div className="inline-flex items-center gap-1.5 bg-[#f1f5f9] p-[0.4rem_0.8rem] rounded-full text-[0.8rem] font-medium text-text-secondary w-fit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 18C7.69 18 5 15.31 5 12C5 8.69 7.69 6 11 6V18ZM13 18V6C16.31 6 19 8.69 19 12C19 15.31 16.31 18 13 18Z" />
            </svg>
            <span>Our Services</span>
          </div>

          <h2 className="text-[2.5rem] font-medium text-gold-dark font-sans tracking-[-0.02em] m-0 max-w-[700px] leading-[1.2]">
            Comprehensive diagnostics, treatment &amp; aesthetic solutions
          </h2>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] lg:grid-cols-[1.2fr_1.2fr_2fr] gap-6 max-lg:gap-8 items-stretch w-full max-w-[1200px]">
          {/* Column 1: Stat and tag cloud */}
          <div className="bg-white rounded-[24px] p-10 border border-slate-900/5 shadow-[0_10px_30px_rgba(15,23,42,0.02)] flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="text-[3.5rem] font-medium text-gold-dark font-sans leading-none">5,000+</div>
              <div className="text-[0.9rem] text-text-muted mt-2 font-sans">successful treatments performed</div>
            </div>

            <div className="flex flex-col gap-2.5 mt-8">
              <div className="flex gap-2 justify-start">
                <span className="bg-gold text-white text-[0.75rem] font-semibold p-[0.4rem_0.8rem] rounded-full">Preventive Care</span>
              </div>
              <div className="flex gap-2 justify-end">
                <span className="bg-[#d9e8fb] text-[#1e3a8a] text-[0.75rem] font-semibold p-[0.4rem_0.8rem] rounded-full">Teeth Whitening</span>
              </div>
              <div className="flex gap-2 justify-start">
                <span className="bg-[#f1f5f9] text-[#475569] text-[0.75rem] font-semibold p-[0.4rem_0.8rem] rounded-full">Pediatric Dentistry</span>
              </div>
              <div className="flex gap-2 justify-end">
                <span className="bg-[#f1f5f9] text-[#475569] text-[0.75rem] font-semibold p-[0.4rem_0.8rem] rounded-full">Oral Surgery</span>
              </div>
            </div>
          </div>

          {/* Column 2: Orthodontics */}
          <div className="relative bg-[#d9e8fb] rounded-[24px] p-10 flex flex-col justify-between overflow-hidden min-h-[400px]">
            {/* Aligner background image */}
            <img
              src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=500&q=80"
              alt="Orthodontics Aligner model"
              className="absolute right-0 bottom-0 w-[55%] h-[50%] object-cover opacity-80 rounded-tl-[100px] border-l-2 border-t-2 border-white/40 pointer-events-none z-[1] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />

            <div className="relative z-[2]">
              <span className="bg-white text-gold text-[0.7rem] font-semibold p-[0.35rem_0.75rem] rounded-full inline-block mb-6 uppercase tracking-[0.02em]">
                Top popular
              </span>
              <h3 className="text-[1.8rem] font-medium text-gold-dark mb-3 font-sans tracking-[-0.01em]">
                Orthodontics
              </h3>
              <p className="text-[0.95rem] text-text-secondary leading-[1.5] m-0 font-sans font-light max-w-[220px]">
                Modern braces and clear aligners for balanced, healthy smiles.
              </p>
            </div>

            <div className="flex justify-end mt-auto">
              <Button
                onClick={() => navigate('services')}
                variant="dark"
                className="w-11 h-11 rounded-[10px] flex items-center justify-center hover:scale-105"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Column 3: Stacked horizontal cards */}
          <div className="flex flex-col gap-5 justify-between md:col-span-2 lg:col-span-1">
            {/* Card 3A: Implantology */}
            <div className="flex-1 bg-white rounded-[24px] p-[2rem_2.5rem] border border-slate-900/5 shadow-[0_10px_30px_rgba(15,23,42,0.02)] flex flex-col justify-between relative">
              <div className="flex justify-between items-start">
                <h3 className="text-[1.6rem] font-medium text-gold-dark m-0 font-sans">
                  Implantology
                </h3>
                <Button
                  onClick={() => navigate('services')}
                  variant="dark"
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center hover:scale-105"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </Button>
              </div>
              <p className="text-[0.95rem] text-text-secondary leading-[1.5] mt-4 mx-0 mb-0 font-sans font-light max-w-[85%]">
                Advanced dental implants and full-mouth restorations with precise digital planning.
              </p>
            </div>

            {/* Card 3B: Digital Dentistry */}
            <div className="flex-1 bg-[#dbeafe] bg-[radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.4)_0%,rgba(219,234,254,0.8)_80%)] rounded-[24px] p-[2rem_2.5rem] flex flex-col justify-between relative">
              <div className="flex justify-between items-start">
                <h3 className="text-[1.6rem] font-medium text-gold-dark m-0 font-sans">
                  Digital Dentistry
                </h3>
                <Button
                  onClick={() => navigate('services')}
                  variant="dark"
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center hover:scale-105"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </Button>
              </div>
              <p className="text-[0.95rem] text-text-secondary leading-[1.5] mt-4 mx-0 mb-0 font-sans font-light max-w-[85%]">
                3D diagnostics, digital scanning, and precision-guided treatment planning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
