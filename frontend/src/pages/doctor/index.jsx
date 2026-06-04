import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { fetchApprovedDoctors } from '../../services/login';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Clock,
  Award,
  Shield,
  CheckCircle,
  Star,
  Users,
  Briefcase
} from 'lucide-react';

const DOCTOR_AVATARS_LIST = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'
];



const getDoctorPhoto = (name, index) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('sarah') || lowercaseName.includes('emily') || lowercaseName.includes('bianchi') || lowercaseName.includes('maria') || lowercaseName.includes('jenkins') || lowercaseName.includes('carter') || lowercaseName.includes('sophia') || lowercaseName.includes('bennett')) {
    return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';
  }
  if (lowercaseName.includes('serhii') || lowercaseName.includes('kinash') || lowercaseName.includes('luca') || lowercaseName.includes('novak') || lowercaseName.includes('michael')) {
    return 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
  }
  if (lowercaseName.includes('marcus') || lowercaseName.includes('thorne') || lowercaseName.includes('annette')) {
    return 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80';
  }
  if (lowercaseName.includes('daniel') || lowercaseName.includes('rossi')) {
    return 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80';
  }
  return DOCTOR_AVATARS_LIST[index % DOCTOR_AVATARS_LIST.length];
};

function OurDoctors({ navigate, isLoggedIn, currentUser, onLogout, activeTab, setActiveTab, portalSubTab, setPortalSubTab }) {
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch approved doctors from database
  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);
        const approvedDocs = await fetchApprovedDoctors();

        // Map dynamic profiles
        const mappedApproved = approvedDocs.map((d, index) => ({
          _id: d._id,
          name: d.name.startsWith('Dr.') ? d.name : `Dr. ${d.name}`,
          specialization: d.specialization || 'Dental Specialist',
          bio: d.bio || 'Experienced clinical specialist dedicated to patient health and dental wellbeing.',
          phone: d.phone || '+1 (555) 789-0123',
          email: d.email || `${d.name.toLowerCase().replace(/\s+/g, '')}@lumina.com`,
          timeSlots: d.timeSlots || ['9:00 AM', '10:30 AM', '1:30 PM', '3:00 PM', '4:30 PM'],
          availability: d.availability || [
            { day: 'Monday', slots: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:30 PM', end: '5:00 PM' }] },
            { day: 'Wednesday', slots: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:30 PM', end: '5:00 PM' }] }
          ],
          photo: getDoctorPhoto(d.name, index)
        }));

        setDoctorsList(mappedApproved);
      } catch (err) {
        console.error('Failed to load approved doctors:', err);
        setDoctorsList([]);
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, []);

  // Filter Doctors
  const filteredDoctors = doctorsList.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || doc.specialization.toLowerCase() === specialtyFilter.toLowerCase();
    return matchesSearch && matchesSpecialty;
  });

  // Render swirl/pinwheel pattern behind doctor (Card 1 style)
  const renderSwirlPattern = () => {
    const lineCount = 24;
    const lines = [];
    for (let i = 0; i < lineCount; i++) {
      const angle = (i * 360) / lineCount;
      lines.push(
        <path
          key={i}
          d="M 100 100 Q 120 40, 140 60 Q 115 90, 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="stroke-slate-200/50 group-hover:stroke-white/10 transition-colors duration-500"
          transform={`rotate(${angle} 100 100)`}
        />
      );
    }
    return (
      <svg viewBox="0 0 200 200" className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[220px] h-[220px] pointer-events-none z-0">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" className="stroke-slate-200/30 group-hover:stroke-white/5" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" className="stroke-slate-200/30 group-hover:stroke-white/5" strokeWidth="1" />
        {lines}
      </svg>
    );
  };

  // Render sunburst pattern behind doctor (Card 2 style)
  const renderSunburstPattern = () => {
    const lineCount = 24;
    const wedges = [];
    for (let i = 0; i < lineCount; i++) {
      const angle = (i * 360) / lineCount;
      wedges.push(
        <polygon
          key={i}
          points="100,100 97,0 103,0"
          fill="currentColor"
          className="text-slate-200/40 group-hover:text-white/10 transition-colors duration-500"
          transform={`rotate(${angle} 100 100)`}
        />
      );
    }
    return (
      <svg viewBox="0 0 200 200" className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[220px] h-[220px] pointer-events-none z-0">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" className="stroke-slate-200/30 group-hover:stroke-white/5" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" className="stroke-slate-200/30 group-hover:stroke-white/5" strokeWidth="1" />
        {wedges}
      </svg>
    );
  };

  // Render logo pattern behind doctor (Card 3 style)
  const renderLogoPattern = () => {
    return (
      <svg viewBox="0 0 200 200" className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[220px] h-[220px] pointer-events-none z-0 text-slate-200/40 group-hover:text-white/5 transition-colors duration-500">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 50 100 C 50 50, 150 50, 150 100 C 150 150, 50 150, 50 100" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M 70 100 C 70 70, 130 70, 130 100 C 130 130, 70 130, 70 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 100 30 A 70 70 0 0 1 100 170" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M 100 30 A 70 70 0 0 0 100 170" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
      </svg>
    );
  };

  // Render starburst/flower pattern behind doctor (Card 4 style)
  const renderFlowerPattern = () => {
    const petalCount = 8;
    const petals = [];
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 360) / petalCount;
      petals.push(
        <path
          key={i}
          d="M 100 100 Q 80 40, 100 20 Q 120 40, 100 100"
          fill="currentColor"
          className="text-slate-200/40 group-hover:text-white/5 transition-colors duration-500"
          transform={`rotate(${angle} 100 100)`}
        />
      );
    }
    return (
      <svg viewBox="0 0 200 200" className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[220px] h-[220px] pointer-events-none z-0">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" className="stroke-slate-200/30 group-hover:stroke-white/5" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" className="stroke-slate-200/30 group-hover:stroke-white/5" strokeWidth="1" />
        {petals}
      </svg>
    );
  };

  // Dynamic selector helper
  const getPatternForIndex = (index) => {
    const mod = index % 4;
    if (mod === 0) return renderSwirlPattern();
    if (mod === 1) return renderSunburstPattern();
    if (mod === 2) return renderLogoPattern();
    return renderFlowerPattern();
  };

  const handleBookNow = (docName, specialty) => {
    localStorage.setItem('selected_booking_doctor', docName);

    // Map doctor specialty to treatment category if possible
    let categoryKey = 'general';
    const spec = specialty.toLowerCase();
    if (spec.includes('ortho')) categoryKey = 'ortho';
    else if (spec.includes('implant')) categoryKey = 'implant';
    else if (spec.includes('cosmetic') || spec.includes('whitening')) categoryKey = 'cosmetic';
    else if (spec.includes('pediatric') || spec.includes('child')) categoryKey = 'pediatric';
    else if (spec.includes('surgery') || spec.includes('canal')) categoryKey = 'surgery';

    localStorage.setItem('selected_booking_category', categoryKey);
    
    if (window.openBookingModal) {
      window.openBookingModal();
    } else {
      navigate('booking');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans">
      <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} setPortalSubTab={setPortalSubTab} navigate={navigate} />

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-16 px-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/70 text-[0.7rem] font-bold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-full">
            <Award size={12} className="text-yellow-500" />
            ClearDent Clinical Specialists
          </span>
          <h1 className="text-[2.25rem] md:text-[3.25rem] font-medium tracking-tight text-white leading-tight font-serif">
            Meet Our Team of <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">Expert Doctors</span>
          </h1>
          <p className="text-white/60 text-[0.95rem] md:text-[1.05rem] leading-relaxed max-w-xl font-light">
            Our certified clinical specialists bring decades of combined experience, state-of-the-art procedures, and dedicated care to every treatment.
          </p>

          {/* Integrated Search Bar inside Hero */}
          {!selectedDoctor && (
            <div className="w-full max-w-xl mt-4 animate-[fadeIn_0.4s_ease-out]">
              <div className="relative bg-white rounded-full shadow-[0_10px_35px_rgba(15,23,42,0.2)] flex items-center py-3.5 px-6">
                <Search size={18} className="text-[#1d4ed8] mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-[0.9rem] text-slate-800 placeholder-slate-400 focus:outline-none font-sans"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-12">
        {selectedDoctor ? (
          /* ========================================================
             DETAIL VIEW
             ======================================================== */
          <div className="animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            {/* Header / Back Action */}
            <div className="flex justify-between items-center mb-10">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-bold text-[0.8rem] uppercase tracking-wider px-5 py-3 rounded-full shadow-sm hover:shadow transition-all duration-300 cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back to Team Directory
              </button>

              <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Shield size={12} className="text-blue-500" /> Verified Medical Staff
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Portrait & Quick Info Card */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-sm flex flex-col items-center relative overflow-hidden">
                  {/* Subtle sunburst in details */}
                  <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[220px] h-[220px] text-slate-100 pointer-events-none z-0">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" className="stroke-slate-200/20" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" className="stroke-slate-200/20" strokeWidth="1" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <line key={i} x1="100" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="1.5" className="stroke-slate-200/20" transform={`rotate(${(i * 360) / 24} 100 100)`} />
                    ))}
                  </div>

                  <img
                    src={selectedDoctor.photo}
                    alt={selectedDoctor.name}
                    className="w-[200px] h-[200px] rounded-full object-cover border-4 border-white shadow-sm z-10 relative"
                  />

                  <h2 className="text-[1.65rem] font-bold text-slate-900 font-serif mt-6 text-center z-10 relative">
                    {selectedDoctor.name}
                  </h2>
                  <span className="text-[0.88rem] font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-100/50 px-3.5 py-1 rounded-full uppercase mt-2 z-10 relative">
                    {selectedDoctor.specialization}
                  </span>

                  <div className="w-full border-t border-slate-100 mt-6 pt-6 flex flex-col gap-3.5 z-10 relative">
                    <div className="flex items-center justify-between text-[0.88rem] text-slate-600">
                      <span className="flex items-center gap-2"><Star size={16} className="text-yellow-500 fill-yellow-500" /> Rating</span>
                      <span className="font-bold text-slate-900">5.0 ★ (Perfect Score)</span>
                    </div>
                    <div className="flex items-center justify-between text-[0.88rem] text-slate-600">
                      <span className="flex items-center gap-2"><Users size={16} className="text-blue-500" /> Patients</span>
                      <span className="font-bold text-slate-900">120+ Treated</span>
                    </div>
                    <div className="flex items-center justify-between text-[0.88rem] text-slate-600">
                      <span className="flex items-center gap-2"><Briefcase size={16} className="text-emerald-500" /> Clinic Status</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio & Weekly availability */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-sm flex flex-col gap-6">
                  {/* Bio block */}
                  <div>
                    <h3 className="text-[1.25rem] font-bold text-slate-900 border-b border-slate-100 pb-3 font-serif flex items-center gap-2">
                      <Star size={18} className="text-yellow-500" /> Professional Summary
                    </h3>
                    <p className="text-slate-600 text-[0.98rem] leading-relaxed mt-4">
                      {selectedDoctor.bio}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-[1.25rem] font-bold text-slate-900 border-b border-slate-100 pb-3 font-serif flex items-center gap-2">
                      <Phone size={18} className="text-indigo-500" /> Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-[0.92rem]">
                      <div className="flex items-center gap-3 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
                        <Phone size={16} className="text-slate-500" />
                        <div>
                          <span className="block text-[0.72rem] text-slate-400 font-bold uppercase tracking-wider">Office Phone</span>
                          <span className="font-semibold text-slate-800">{selectedDoctor.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
                        <Mail size={16} className="text-slate-500" />
                        <div>
                          <span className="block text-[0.72rem] text-slate-400 font-bold uppercase tracking-wider">Email Address</span>
                          <span className="font-semibold text-slate-800">{selectedDoctor.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Availability schedule */}
                  <div>
                    <h3 className="text-[1.25rem] font-bold text-slate-900 border-b border-slate-100 pb-3 font-serif flex items-center gap-2">
                      <Calendar size={18} className="text-emerald-500" /> Weekly Availability Schedule
                    </h3>
                    <div className="flex flex-col gap-3 mt-4">
                      {selectedDoctor.availability && selectedDoctor.availability.length > 0 ? (
                        selectedDoctor.availability.map((sched, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 px-4 border border-slate-100 bg-emerald-50/10 rounded-xl">
                            <span className="font-bold text-slate-800 flex items-center gap-2">
                              <CheckCircle size={14} className="text-emerald-600" />
                              {sched.day}
                            </span>
                            <div className="flex gap-2 flex-wrap">
                              {sched.slots && sched.slots.length > 0 ? (
                                sched.slots.map((slot, sIdx) => (
                                  <span key={sIdx} className="bg-white border border-emerald-100 text-emerald-800 text-[0.78rem] font-bold py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                                    <Clock size={10} />
                                    {slot.start} - {slot.end || 'Available'}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[0.8rem] text-slate-400">Availability Custom Configured</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[0.88rem] text-slate-500 italic">This doctor has configured their slots dynamically. Please proceed to the booking desk for full availability slots.</p>
                      )}
                    </div>
                  </div>

                  {/* Book CTA Action */}
                  <div className="border-t border-slate-100 mt-4 pt-6">
                    <button
                      onClick={() => handleBookNow(selectedDoctor.name, selectedDoctor.specialization)}
                      className="w-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-[0.95rem] tracking-wide py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-950/10 hover:shadow-xl hover:shadow-blue-950/20 transition-all duration-300 border-none cursor-pointer"
                    >
                      <Calendar size={18} />
                      Book An Appointment with {selectedDoctor.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-[fadeIn_0.4s_ease]">

            {/* Doctor Cards Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
                <span className="text-[0.9rem] font-semibold">Loading Specialist Records...</span>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-[24px] p-16 text-center shadow-sm">
                <h3 className="text-[1.25rem] font-bold text-slate-900 font-serif">No Doctors Found</h3>
                <p className="text-slate-500 text-[0.88rem] max-w-sm mx-auto mt-2">
                  No specialists match your search criteria. Try modifying your filters or search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredDoctors.map((doc, index) => (
                  <div
                    key={doc._id}
                    onClick={() => setSelectedDoctor(doc)}
                    className="group relative bg-white hover:bg-[#1e3a8a] border border-slate-100 rounded-[32px] text-center cursor-pointer transition-all duration-500 ease-out shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_45px_rgba(30,58,138,0.18)] hover:-translate-y-2 flex flex-col justify-between h-[420px] overflow-hidden"
                  >
                    {/* Concentric Circle & Radial backdrop shape (swirl, sunburst, logo, or flower) */}
                    {getPatternForIndex(index)}

                    {/* Image Container with Soft Gradient Fade at the Bottom */}
                    <div className="relative w-full h-[320px] overflow-hidden z-10 flex items-end justify-center">
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top select-none transition-all duration-500 ease-out group-hover:scale-105 mix-blend-multiply group-hover:opacity-90"
                      />
                      {/* Gradient overlay to fade portrait into the card background */}
                      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-white group-hover:from-[#1e3a8a] to-transparent transition-all duration-500 z-20 pointer-events-none" />
                    </div>

                    {/* Metadata Header (Name and Specialty) overlayed at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-30 flex flex-col items-center justify-center pointer-events-none">
                      <h3 className="text-[1.25rem] font-bold text-slate-800 group-hover:text-white transition-colors duration-300 font-sans leading-snug">
                        {doc.name}
                      </h3>
                      <span className="text-[0.82rem] text-slate-500 group-hover:text-blue-200 transition-colors duration-300 font-sans mt-0.5">
                        {doc.specialization}
                      </span>
                    </div>

                    {/* Center hover view profile overlay button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-40 pointer-events-none">
                      <div className="bg-white rounded-full py-2.5 pl-6 pr-2.5 flex items-center gap-3 shadow-[0_10px_25px_rgba(0,0,0,0.15)] pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105">
                        <span className="text-[#1e3a8a] font-bold text-[0.88rem] tracking-wide whitespace-nowrap">View Profile</span>
                        <div className="w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

export default OurDoctors;
