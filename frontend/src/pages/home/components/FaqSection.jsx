import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

function FaqSection({ navigate, isLoggedIn, setActiveTab }) {
  const [activeFaq, setActiveFaq] = useState(-1);

  return (
    <section id="faq" className="py-20 px-24 max-lg:px-12 max-lg:py-16 max-md:px-6 max-md:py-12 max-sm:px-4 max-sm:py-10 flex justify-center box-border bg-[#f5f4f0]">
      <div className="w-full flex flex-col gap-14">

        {/* Heading row with tag */}
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 bg-[#e5e7eb] text-[#374151] p-[0.4rem_0.8rem] rounded-full text-[0.8rem] font-semibold w-fit font-sans">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>FAQ</span>
          </div>
          <h2 className="text-[2.8rem] font-medium text-gold-dark m-0 font-sans tracking-[-0.02em]">
            Get clear answers to your questions
          </h2>
        </div>

        {/* Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-20 max-lg:gap-12 max-md:gap-10 items-start w-full max-w-[1200px]">

          {/* Left floating doctor photo */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-[190px] h-[190px] rounded-full p-[5px] bg-gradient-to-br from-[#3b82f6] to-[#93c5fd] shadow-[0_12px_32px_rgba(59,130,246,0.18)] shrink-0">
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&h=400&q=80"
                alt="Dental clinic FAQ"
                className="w-full h-full rounded-full object-cover block"
              />
            </div>
          </div>

          {/* Right Accordion rows */}
          <div className="flex flex-col">
            {[
              {
                q: "How often should I visit the dentist?",
                a: "We recommend scheduling a check-up and professional cleaning every 6 months. However, your dentist may suggest more frequent visits depending on your oral health needs."
              },
              {
                q: "Are dental treatments painful?",
                a: "Modern dentistry techniques and local anesthetics make treatments virtually painless. For anxious patients, we offer sedation options to ensure maximum comfort."
              },
              {
                q: "Do you offer dental implants?",
                a: "Yes, we specialize in high-end E.max and titanium dental implants, utilizing 3D surgical guides for millimeter-precise placement and faith-healing."
              },
              {
                q: "Do you treat children?",
                a: "Absolutely! We provide a welcoming, gentle environment for kids, offering pediatric checkups, sealants, fluoride treatments, and custom mouthguards."
              }
            ].map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border-b border-slate-900/10 py-[1.8rem] flex flex-col gap-5"
                >
                  {/* Accordion header */}
                  <div
                    onClick={() => setActiveFaq(isOpen ? -1 : index)}
                    className={`flex justify-between items-center cursor-pointer text-gold-dark text-[1.15rem] font-sans transition-colors duration-200 ${isOpen ? 'font-semibold' : 'font-medium'}`}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} className="text-[#1b325f]" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </div>

                  {/* Accordion content (expanded) */}
                  {isOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center animate-fade-in">
                      {/* Answer details */}
                      <div className="flex flex-col gap-7">
                        <p className="text-[0.95rem] leading-[1.65] text-text-secondary m-0 font-sans">
                          {faq.a}
                        </p>
                        <button
                          onClick={() => navigate('services')}
                          className="bg-[#1b325f] text-white border-none rounded-[8px] p-[0.65rem_1.5rem] text-[0.85rem] font-semibold cursor-pointer w-fit transition-colors duration-200 hover:bg-[#2563eb] font-sans"
                        >
                          Learn more
                        </button>
                      </div>

                      {/* Kid Video Thumbnail */}
                      <div>
                        <div className="relative rounded-[16px] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.06)] w-[220px] max-md:w-full h-[125px] max-md:h-[180px] max-sm:h-[140px]">
                          <img
                            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=220&h=125&q=80"
                            alt="Kid treatment clinic preview"
                            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-slate-900/15 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#1b325f] cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

export default FaqSection;
