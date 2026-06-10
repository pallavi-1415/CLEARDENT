import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import laserImg from '../../assets/laser.jpg';
import veneersImg from '../../assets/72e73c84e980e834943641d6f0a7e909.jpg';
import pediatricImg from '../../assets/Gentle Pediatric Extractions.jpg';
import {
  Sparkles,
  Activity,
  Baby,
  Scissors,
  Stethoscope,
  Smile,
  ArrowUpRight,
  Search,
  X
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CATEGORIES_DATA = [
  { id: 'general', category: 'General Dentistry' },
  { id: 'ortho', category: 'Orthodontics' },
  { id: 'implant', category: 'Dental Implants' },
  { id: 'cosmetic', category: 'Cosmetic Dentistry' },
  { id: 'pediatric', category: 'Pediatric Dentistry' },
  { id: 'surgery', category: 'Oral & Dental Surgery' }
];

const SERVICES_DATA = [
  // General Dentistry
  {
    id: 'comprehensive-exam',
    categoryId: 'general',
    category: 'General Dentistry',
    name: 'Comprehensive Exam & X-Rays',
    duration: '45 mins',
    price: '₹1,500',
    icon: Stethoscope,
    tagline: 'Precision Diagnosis',
    description: 'Full digital scan and comprehensive diagnosis of teeth and gums.',
    extraInfo: 'Includes low-radiation digital X-rays, detailed gum health check, oral cancer screening, and a customized treatment plan.',
    photo: 'https://images.unsplash.com/photo-1744829903372-6e6f254780bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fENvbXByZWhlbnNpdmUlMjBFeGFtJTIwJTI2JTIwWC1SYXlzfGVufDB8MXwwfHx8MA%3D%3D',
    iconBg: '#ccfbf1',
    iconColor: '#0d9488'
  },
  {
    id: 'professional-cleaning',
    categoryId: 'general',
    category: 'General Dentistry',
    name: 'Professional Hygiene Cleaning',
    duration: '60 mins',
    price: '₹2,500',
    icon: Stethoscope,
    tagline: 'Fresh & Clean Smile',
    description: 'Thorough scaling, polishing, and plaque removal for fresh breath.',
    extraInfo: 'Utilizes ultrasonic scaling technology to remove stubborn tartar, followed by gentle air polishing to lift surface stains.',
    photo: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=600&auto=format&fit=crop&q=60',
    iconBg: '#ccfbf1',
    iconColor: '#0d9488'
  },
  {
    id: 'composite-fillings',
    categoryId: 'general',
    category: 'General Dentistry',
    name: 'Composite Dental Fillings',
    duration: '30 mins',
    price: '₹3,000',
    icon: Stethoscope,
    tagline: 'Invisible Restoration',
    description: 'Natural-looking, tooth-colored composite restorations.',
    extraInfo: 'Restores decayed or chipped teeth using high-grade composite resin, shaded to match your natural tooth color seamlessly.',
    photo: 'https://images.unsplash.com/photo-1626736985932-c0df2ae07a2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8',
    iconBg: '#ccfbf1',
    iconColor: '#0d9488'
  },

  // Orthodontics
  {
    id: 'clear-aligners',
    categoryId: 'ortho',
    category: 'Orthodontics',
    name: 'Clear Aligner Therapy',
    duration: 'Varies',
    price: '₹1,20,000+',
    icon: Smile,
    tagline: 'Discreet Straightening',
    description: 'Virtually invisible aligners customized for comfortable straightening.',
    extraInfo: 'Includes advanced 3D scanning, customized clear aligner treatment plans, and step-by-step progress monitoring for a perfect smile.',
    photo: 'https://plus.unsplash.com/premium_photo-1677174625851-508b71ac2df3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fENsZWFyJTIwQWxpZ25lciUyMFRoZXJhcHl8ZW58MHwxfDB8fHww',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5'
  },
  {
    id: 'ceramic-braces',
    categoryId: 'ortho',
    category: 'Orthodontics',
    name: 'Traditional Ceramic Braces',
    duration: 'Varies',
    price: '₹65,000+',
    icon: Smile,
    tagline: 'Low-Profile Alignment',
    description: 'Discreet tooth-colored brackets to fix complex bite issues.',
    extraInfo: 'Offers durable, aesthetic ceramic brackets that blend with your teeth, providing effective alignment for complex orthodontic cases.',
    photo: 'https://plus.unsplash.com/premium_photo-1661436629100-ba3c5ea70514?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5'
  },
  {
    id: 'retainers-postcare',
    categoryId: 'ortho',
    category: 'Orthodontics',
    name: 'Retainers & Post-Care',
    duration: '30 mins',
    price: '₹8,000',
    icon: Smile,
    tagline: 'Lock In Your Smile',
    description: 'Custom night retainers to protect and maintain your straight smile.',
    extraInfo: 'Customized removable retainers designed to prevent tooth relapse after completing orthodontic treatments.',
    photo: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5'
  },

  // Dental Implants
  {
    id: 'single-implant',
    categoryId: 'implant',
    category: 'Dental Implants',
    name: 'Single Tooth Implant',
    duration: '90 mins',
    price: '₹45,000',
    icon: Activity,
    tagline: 'Natural Looking Replacement',
    description: 'Bio-compatible titanium post topped with a custom porcelain crown.',
    extraInfo: 'Provides a stable, lifelong solution to replace a single missing tooth, matching the strength and look of a natural tooth.',
    photo: 'https://images.unsplash.com/photo-1660737216887-7bdf4402bc89?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2luZ2xlJTIwVG9vdGglMjBJbXBsYW50fGVufDB8MXwwfHx8MA%3D%3D',
    iconBg: '#ffe4e6',
    iconColor: '#e11d48'
  },
  {
    id: 'all-on-4',
    categoryId: 'implant',
    category: 'Dental Implants',
    name: 'All-on-4 Full Arch',
    duration: '180 mins',
    price: '₹3,50,000',
    icon: Activity,
    tagline: 'Complete Smile Rebuilding',
    description: 'Full-arch teeth replacement secured by four advanced implants.',
    extraInfo: 'Restores a complete arch of teeth with just four dental implants, offering immediate functionality and high aesthetic value.',
    photo: 'https://images.unsplash.com/photo-1664529845836-433c172142ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEFsbC1vbi00JTIwRnVsbCUyMEFyY2glMjB0ZWV0aHxlbnwwfDF8MHx8fDA%3D',
    iconBg: '#ffe4e6',
    iconColor: '#e11d48'
  },
  {
    id: 'bone-grafting',
    categoryId: 'implant',
    category: 'Dental Implants',
    name: 'Bone Grafting Procedure',
    duration: '60 mins',
    price: '₹15,000',
    icon: Activity,
    tagline: 'Foundation Rebuilding',
    description: 'Bone density enhancement to ensure solid implant integration.',
    extraInfo: 'Strengthens the jawbone when bone mass is insufficient to support a secure and long-lasting dental implant placement.',
    photo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=60',
    iconBg: '#ffe4e6',
    iconColor: '#e11d48'
  },

  // Cosmetic Dentistry
  {
    id: 'laser-whitening',
    categoryId: 'cosmetic',
    category: 'Cosmetic Dentistry',
    name: 'Laser Teeth Whitening',
    duration: '60 mins',
    price: '₹9,999',
    icon: Sparkles,
    tagline: 'Instant Brightness',
    description: 'Professional medical-grade bleaching up to 8 shades lighter.',
    extraInfo: 'Utilizes advanced, safe laser activation and professional-strength bleaching gels to safely lift stains and brightens teeth in one hour.',
    photo: laserImg,
    iconBg: '#f3e8ff',
    iconColor: '#9333ea'
  },
  {
    id: 'porcelain-veneers',
    categoryId: 'cosmetic',
    category: 'Cosmetic Dentistry',
    name: 'Premium Porcelain Veneers',
    duration: 'Varies',
    price: '₹25,000/tooth',
    icon: Sparkles,
    tagline: 'Hollywood Smile Transformation',
    description: 'Ultra-thin custom shells bonded to hide chips, gaps, or stains.',
    extraInfo: 'Individually sculpted custom porcelain veneers designed to fit over your teeth, transforming alignment, color, and spacing permanently.',
    photo: veneersImg,
    iconBg: '#f3e8ff',
    iconColor: '#9333ea'
  },
  {
    id: 'dental-bonding',
    categoryId: 'cosmetic',
    category: 'Cosmetic Dentistry',
    name: 'Dental Bonding & Contouring',
    duration: '45 mins',
    price: '₹6,500',
    icon: Sparkles,
    tagline: 'Quick Minor Adjustments',
    description: 'Direct composite shaping to correct minor irregularities.',
    extraInfo: 'Painless application of composite resin directly to the tooth surface to close gaps, fix chips, and improve contour aesthetics.',
    photo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=60',
    iconBg: '#f3e8ff',
    iconColor: '#9333ea'
  },

  // Pediatric Dentistry
  {
    id: 'child-cleaning',
    categoryId: 'pediatric',
    category: 'Pediatric Dentistry',
    name: 'Child Cleaning & Fluoride',
    duration: '30 mins',
    price: '₹2,000',
    icon: Baby,
    tagline: 'Friendly First Steps',
    description: 'Fun, stress-free cleaning combined with cavity-fighting fluoride.',
    extraInfo: 'Specialized, gentle plaque cleaning and tooth polishing for kids, combined with high-grade cavity prevention fluoride treatment.',
    photo: 'https://plus.unsplash.com/premium_photo-1663956053875-41e6f5e4a85a?w=600&auto=format&fit=crop&q=60',
    iconBg: '#fef3c7',
    iconColor: '#d97706'
  },
  {
    id: 'fissure-sealants',
    categoryId: 'pediatric',
    category: 'Pediatric Dentistry',
    name: 'Fissure Sealants',
    duration: '20 mins',
    price: '₹1,500/tooth',
    icon: Baby,
    tagline: 'Lock Out Tooth Decay',
    description: 'Protective thin coatings on back molars to lock out decay.',
    extraInfo: 'Applied directly to the deep grooves of kids\' molars, creating a protective shield against bacteria and decay.',
    photo: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&auto=format&fit=crop&q=60',
    iconBg: '#fef3c7',
    iconColor: '#d97706'
  },
  {
    id: 'pediatric-extractions',
    categoryId: 'pediatric',
    category: 'Pediatric Dentistry',
    name: 'Gentle Pediatric Extractions',
    duration: '30 mins',
    price: '₹3,000',
    icon: Baby,
    tagline: 'Painless Extractions',
    description: 'Comfortable, safe removal of troubled baby teeth.',
    extraInfo: 'Ensures the safe and pain-free removal of loose, damaged, or overcrowded baby teeth in a comforting environment.',
    photo: pediatricImg,
    iconBg: '#fef3c7',
    iconColor: '#d97706'
  },

  // Oral & Dental Surgery
  {
    id: 'root-canal',
    categoryId: 'surgery',
    category: 'Oral & Dental Surgery',
    name: 'Root Canal Therapy',
    duration: '75 mins',
    price: '₹8,500',
    icon: Scissors,
    tagline: 'Save Your Tooth',
    description: 'Saves infected teeth by removing nerve damage and sealing canals.',
    extraInfo: 'Painless microscopic cleaning and sealing of the infected inner canal, relieving pain and preventing extraction.',
    photo: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&auto=format&fit=crop&q=60',
    iconBg: '#dcfce7',
    iconColor: '#16a34a'
  },
  {
    id: 'wisdom-extraction',
    categoryId: 'surgery',
    category: 'Oral & Dental Surgery',
    name: 'Wisdom Tooth Extraction',
    duration: '60 mins',
    price: '₹6,000',
    icon: Scissors,
    tagline: 'Safe Impacted Tooth Removal',
    description: 'Safe removal of impacted or painful wisdom teeth.',
    extraInfo: 'Utilizes advanced surgical techniques for safe removal of wisdom teeth under local anesthesia, with a swift recovery plan.',
    photo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=60',
    iconBg: '#dcfce7',
    iconColor: '#16a34a'
  },
  {
    id: 'emergency-care',
    categoryId: 'surgery',
    category: 'Oral & Dental Surgery',
    name: 'Emergency Dental Care',
    duration: '45 mins',
    price: '₹4,500',
    icon: Scissors,
    tagline: 'Instant Relief',
    description: 'Instant pain relief and diagnosis for urgent dental concerns.',
    extraInfo: 'Priority urgent booking for relief of severe toothache, dental trauma, swelling, or knocked-out teeth.',
    photo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=60',
    iconBg: '#dcfce7',
    iconColor: '#16a34a'
  }
];

/* ─────────────────────────────────────────────
   SERVICE PHOTO CARD (with inline text expansion)
   ───────────────────────────────────────────── */
function ServicePhotoCard({ item, onBook }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = item.icon;

  const getTailwindBg = (hex) => {
    const map = {
      '#ccfbf1': 'bg-teal-100',
      '#e0e7ff': 'bg-indigo-100',
      '#ffe4e6': 'bg-rose-100',
      '#f3e8ff': 'bg-purple-100',
      '#fef3c7': 'bg-amber-100',
      '#dcfce7': 'bg-green-100'
    };
    return map[hex] || 'bg-slate-100';
  };

  const getTailwindText = (hex) => {
    const map = {
      '#0d9488': 'text-teal-600',
      '#4f46e5': 'text-indigo-600',
      '#e11d48': 'text-rose-600',
      '#9333ea': 'text-purple-600',
      '#d97706': 'text-amber-600',
      '#16a34a': 'text-green-600'
    };
    return map[hex] || 'text-slate-600';
  };

  return (
    <div
      className="group bg-white rounded-[24px] border border-slate-200/80 p-4 flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_35px_rgba(15,23,42,0.08)] hover:border-slate-300"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Inset Photo container */}
      <div className="w-full h-[200px] rounded-2xl overflow-hidden mb-4 relative bg-slate-100">
        <img
          src={item.photo}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Title & Icon Header */}
      <div className="flex items-center gap-3 mb-3.5 px-1">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getTailwindBg(item.iconBg)} ${getTailwindText(item.iconColor)}`}>
          <Icon size={20} />
        </div>
        <div>
          <span className={`text-[0.68rem] font-extrabold uppercase tracking-wider ${getTailwindText(item.iconColor)}`}>
            {item.category}
          </span>
          <h3 className="text-[1.15rem] font-bold text-slate-900 m-0 tracking-tight mt-0.5">{item.name}</h3>
        </div>
      </div>

      {/* Horizontal Divider */}
      <hr className="border-none border-t border-slate-100 my-3.5 w-full" />

      {/* Description & Inline More Extra Info */}
      <p className="text-[0.88rem] text-slate-500 leading-relaxed mb-5 px-1 flex-grow">
        {item.description}
        {expanded && (
          <span className="text-slate-700 font-normal transition-all duration-300 animate-slide-down ml-1">
            {" "}{item.extraInfo}
          </span>
        )}
        <button
          className="text-blue-600 font-bold cursor-pointer border-none bg-transparent p-0 ml-1.5 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </p>

      {/* Duration & Price Details */}
      <div className="flex justify-between items-center px-1 mb-4">
        <span className="text-[0.78rem] text-slate-400 font-semibold">
          Duration: {item.duration}
        </span>
        <span className="text-[0.9rem] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-lg">
          {item.price}
        </span>
      </div>

      {/* Make An Appointment CTA */}
      <div className="mt-auto px-1 pb-1">
        <span
          className="inline-flex items-center gap-1.5 text-orange-500 font-bold text-[0.92rem] cursor-pointer transition-all duration-200 hover:text-orange-600 select-none group/cta"
          onClick={(e) => {
            e.stopPropagation();
            onBook(item.categoryId, item.name);
          }}
        >
          Make An Appointment
          <ArrowUpRight size={16} className="transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────── */
function OurServices({ navigate, isLoggedIn, currentUser, onLogout, activeTab, setActiveTab, setPortalSubTab }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBook = (categoryId, treatmentName) => {
    if (categoryId) {
      localStorage.setItem('selected_booking_category', categoryId);
    }
    if (treatmentName) {
      localStorage.setItem('selected_booking_treatment', treatmentName);
    }
    if (window.openBookingModal) {
      window.openBookingModal();
    } else {
      navigate('booking');
    }
  };

  // Filter based on selectedCategory tab and searchQuery
  const filteredServices = SERVICES_DATA.filter(section => {
    const categoryMatches = selectedCategory === 'all' || section.categoryId === selectedCategory;
    if (!categoryMatches) return false;

    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const nameMatch = section.name.toLowerCase().includes(query);
    const categoryMatchText = section.category.toLowerCase().includes(query);
    const descMatch = section.description.toLowerCase().includes(query);
    const extraMatch = section.extraInfo.toLowerCase().includes(query);

    return nameMatch || categoryMatchText || descMatch || extraMatch;
  });

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          currentUser={currentUser}
          navigate={navigate}
          setPortalSubTab={setPortalSubTab}
        />

        <div className="flex-1 flex flex-col animate-fade-in">
          {/* ── HERO BANNER with Search ── */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-14 px-8 relative overflow-hidden flex justify-center items-center">
          {/* Grid background lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
          {/* Radial blob */}
          <div className="absolute w-[600px] h-[300px] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_70%)] -top-[100px] pointer-events-none"></div>

          <div className="flex flex-col items-center text-center gap-6 max-w-3xl w-full relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/5 text-white/70 text-[0.7rem] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-white/10 w-fit">
              <Sparkles size={10} />
              ClearDent Clinical Services
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
              Our Specialized <span className="bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">Dental Services</span>
            </h1>

            {/* Search Input Bar */}
            <div className="relative w-full max-w-[500px] flex items-center bg-white/10 border border-white/12 rounded-full px-5 transition-all duration-300 backdrop-blur-md focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-[0_10px_30px_rgba(59,130,246,0.15)] group">
              <Search size={18} className="text-white/40 shrink-0 mr-2.5 transition-colors duration-300 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search dental treatments, categories..."
                className="w-full bg-transparent border-none py-3.5 text-[0.95rem] text-white outline-none focus:text-slate-900 placeholder-white/40 focus:placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="bg-transparent border-none text-white/40 cursor-pointer flex items-center justify-center p-1 rounded-full transition-all duration-200 hover:bg-white/10 hover:text-white focus-within:text-slate-500 focus-within:hover:bg-slate-100 focus-within:hover:text-slate-900"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── STICKY CATEGORIES FILTER BAR ── */}
        <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 sticky top-[72px] z-40 flex md:justify-center overflow-x-auto no-scrollbar shadow-sm">
          <div className="flex flex-row flex-nowrap gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200 overflow-x-auto no-scrollbar max-w-full select-none shrink-0">
            <button
              className={`border-none px-5 py-2 rounded-full text-[0.8rem] font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap ${selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-[0_4px_12px_rgba(15,23,42,0.15)] hover:bg-slate-900 hover:text-white'
                : 'text-slate-500 bg-transparent hover:text-slate-900 hover:bg-black/5'
                }`}
              onClick={() => setSelectedCategory('all')}
            >
              All Services
            </button>
            {CATEGORIES_DATA.map(cat => (
              <button
                key={cat.id}
                className={`border-none px-5 py-2 rounded-full text-[0.8rem] font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap ${selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-[0_4px_12px_rgba(15,23,42,0.15)] hover:bg-slate-900 hover:text-white'
                  : 'text-slate-500 bg-transparent hover:text-slate-900 hover:bg-black/5'
                  }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* ── SERVICES GRID ── */}
        <div className="bg-slate-50 flex justify-center w-full min-h-[50vh]">
          <div className="flex-1 px-8 py-16 max-w-[1200px] w-full box-border">
            {filteredServices.length === 0 ? (
              <div className="text-center py-16 px-8 bg-white rounded-[24px] border border-slate-200 w-full max-w-[500px] mx-auto my-16 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
                <h3 className="text-[1.25rem] font-bold text-slate-900 mb-2 m-0">No treatments found</h3>
                <p className="text-[0.9rem] text-slate-500 m-0">Try searching for a different keyword or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((section) => (
                  <ServicePhotoCard
                    key={section.id}
                    item={section}
                    onBook={handleBook}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer navigate={navigate} />
        </div>
      </div>
    </>
  );
}

export default OurServices;
