import React from 'react';

function SpecialistsSection({ navigate }) {
  return (
    <section id="specialists" className="py-20 px-24 max-lg:px-12 max-lg:py-16 max-md:px-6 max-md:py-12 max-sm:px-4 max-sm:py-10 flex justify-center box-border">
      <div className="w-full">

        {/* Header block */}
        <div className="flex justify-between items-start mb-16 max-md:flex-col max-md:gap-6 max-md:items-center max-md:text-center max-md:mb-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-[2.5rem] font-medium text-gold-dark font-sans tracking-[-0.02em] m-0 leading-[1.2]">
              Our team of experts specialized<br />care for every dental need
            </h2>
            <p className="text-text-muted text-[1rem] leading-[1.6] max-w-[560px] m-0 font-sans font-light">
              Our multidisciplinary team combines experience, precision, and a patient-centered approach to deliver comprehensive dental care in one trusted clinic.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#f1f5f9] p-[0.4rem_0.8rem] rounded-full text-[0.8rem] font-medium text-text-secondary h-fit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 18C7.69 18 5 15.31 5 12C5 8.69 7.69 6 11 6V18ZM13 18V6C16.31 6 19 8.69 19 12C19 15.31 16.31 18 13 18Z" />
            </svg>
            <span>Dental Specialists</span>
          </div>
        </div>

        {/* Specialists grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-lg:gap-6 max-sm:gap-4 w-full max-w-[1200px]">
          {[
            {
              name: "Dr. John Doe",
              role: "General Dentist",
              img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&h=150&q=80"
            },
            {
              name: "Dr. Serhii Kinash",
              role: "Orthodontist",
              img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80"
            },
            {
              name: "Dr. Marcus Thorne",
              role: "Oral & Implant Surgeon",
              img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&h=150&q=80"
            },
            {
              name: "Dr. James Carter",
              role: "Pediatric Dentist",
              img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80"
            }
          ].map((spec, idx) => (
            <div
              key={idx}
              onClick={() => navigate && navigate('doctors')}
              className="flex flex-col items-center text-center gap-4 cursor-pointer transition-all duration-200 group"
            >
              <img
                src={spec.img}
                alt={spec.name}
                className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-[0_5px_15px_rgba(15,23,42,0.04)] object-cover transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_15px_30px_rgba(15,23,42,0.1)]"
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-[1.15rem] font-semibold text-gold-dark m-0 font-sans">
                  {spec.name}
                </h3>
                <span className="text-[0.85rem] text-text-muted font-sans">
                  {spec.role}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default SpecialistsSection;
