import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
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
    photo: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80',
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
    photo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=60',
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
    photo: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80',
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
    photo: 'https://images.unsplash.com/photo-1513415277900-a62401e50853?w=600&auto=format&fit=crop&q=60',
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
    photo: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80',
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
    photo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=60',
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
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=60',
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
    photo: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=60',
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
    photo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=60',
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
    photo: 'https://plus.unsplash.com/premium_photo-1661281397737-9b5d75b52606?w=600&auto=format&fit=crop&q=60',
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
    photo: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=60',
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

  return (
    <div className="category-card" onClick={() => setExpanded(!expanded)}>
      {/* Inset Photo container */}
      <div className="card-img-container">
        <img
          src={item.photo}
          alt={item.name}
          className="card-img"
        />
      </div>

      {/* Title & Icon Header */}
      <div className="card-header">
        <div className="card-icon-box" style={{ background: item.iconBg, color: item.iconColor }}>
          <Icon size={20} />
        </div>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: item.iconColor, letterSpacing: '0.05em' }}>
            {item.category}
          </span>
          <h3 className="card-title" style={{ marginTop: '2px' }}>{item.name}</h3>
        </div>
      </div>

      {/* Horizontal Divider */}
      <hr className="card-divider" />

      {/* Description & Inline More Extra Info */}
      <p className="card-desc-box">
        {item.description}
        {expanded && (
          <span className="extra-info-text">
            {" "}{item.extraInfo}
          </span>
        )}
        <button
          className="more-btn"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </p>

      {/* Duration & Price Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
          Duration: {item.duration}
        </span>
        <span style={{ fontSize: '0.9rem', color: '#059669', fontWeight: '800', background: '#ecfdf5', padding: '3px 8px', borderRadius: '8px' }}>
          {item.price}
        </span>
      </div>

      {/* Make An Appointment CTA */}
      <div className="card-cta-row">
        <span
          className="cta-link"
          onClick={(e) => {
            e.stopPropagation();
            onBook(item.categoryId, item.name);
          }}
        >
          Make An Appointment
          <ArrowUpRight size={16} />
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
      {/* ── Scoped Redesigned styles ── */}
      <style>{`
        /* ── BASE PAGE ── */
        .services-page {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* ── HERO BANNER ── */
        .services-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 3.5rem 2rem;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          max-width: 800px;
          width: 100%;
          position: relative;
          z-index: 2;
        }
        .services-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }
        .services-hero::after {
          content: '';
          position: absolute;
          width: 600px; height: 300px;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          top: -100px;
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          width: fit-content;
        }
        .hero-title {
          font-size: clamp(2rem, 4.5vw, 2.75rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin: 0;
        }
        .hero-title span {
          background: linear-gradient(90deg, #93c5fd 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Search input bar */
        .search-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          padding: 0 18px;
          transition: all 0.3s;
          backdrop-filter: blur(8px);
        }
        .search-container:focus-within {
          background: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
        }
        .search-icon {
          color: rgba(255, 255, 255, 0.4);
          flex-shrink: 0;
          margin-right: 10px;
          transition: color 0.3s;
        }
        .search-container:focus-within .search-icon {
          color: #3b82f6;
        }
        .search-input {
          width: 100%;
          background: transparent;
          border: none;
          padding: 14px 0;
          font-size: 0.95rem;
          color: #ffffff;
          font-family: inherit;
          outline: none;
        }
        .search-container:focus-within .search-input {
          color: #0f172a;
        }
        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .search-container:focus-within .search-input::placeholder {
          color: #94a3b8;
        }
        .search-clear-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .search-container:focus-within .search-clear-btn {
          color: #64748b;
        }
        .search-clear-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .search-container:focus-within .search-clear-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        /* ── STICKY FILTER BAR ── */
        .filter-bar {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
          padding: 0.8rem 2rem;
          position: sticky;
          top: 72px;
          z-index: 40;
          display: flex;
          justify-content: center;
          overflow-x: auto;
          scrollbar-width: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }
        .filter-bar::-webkit-scrollbar { display: none; }
        .filter-pill-group {
          display: flex;
          gap: 0.4rem;
          background: #f1f5f9;
          padding: 0.25rem;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
        }
        .filter-pill {
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          white-space: nowrap;
          color: #64748b;
          background: transparent;
        }
        .filter-pill:hover { color: #0f172a; background: rgba(15,23,42,0.04); }
        .filter-pill.active {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(15,23,42,0.15);
        }

        /* ── CONTENT AREA ── */
        .services-content-wrapper {
          background: #f8fafc;
          display: flex;
          justify-content: center;
          width: 100%;
          min-height: 50vh;
        }
        .services-content {
          flex: 1;
          padding: 4rem 2rem;
          max-width: 1200px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── CARD GRID ── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .services-grid { grid-template-columns: 1fr; } }

        /* ── CATEGORY CARD ── */
        .category-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e8edf5;
          padding: 16px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.015);
        }
        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
          border-color: #cbd5e1;
        }

        /* Inset Image Box */
        .card-img-container {
          width: 100%;
          height: 200px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 16px;
          position: relative;
          background: #f1f5f9;
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .category-card:hover .card-img {
          transform: scale(1.05);
        }

        /* Card Header (Icon + Title) */
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          padding: 0 4px;
        }
        .card-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* Separator Divider */
        .card-divider {
          border: none;
          border-top: 1px solid #eef2f6;
          margin: 0 0 14px 0;
          width: 100%;
        }

        /* Description Text */
        .card-desc-box {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 20px 0;
          padding: 0 4px;
          flex-grow: 1;
        }
        .extra-info-text {
          color: #475569;
          font-weight: 400;
          transition: all 0.3s;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        
        .more-btn {
          color: #2563eb;
          font-weight: 700;
          cursor: pointer;
          border: none;
          background: transparent;
          padding: 0;
          margin-left: 6px;
          font-size: inherit;
          transition: color 0.2s;
        }
        .more-btn:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        /* CTA Bottom Link */
        .card-cta-row {
          margin-top: auto;
          padding: 0 4px 4px;
        }
        .cta-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #f97316;
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .cta-link svg {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cta-link:hover {
          color: #ea580c;
        }
        .cta-link:hover svg {
          transform: translate(3px, -3px);
        }

        /* No results state */
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          width: 100%;
          max-width: 500px;
          margin: 4rem auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.015);
        }
        .no-results h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
        }
        .no-results p {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        /* ── RESPONSIVE ADAPTATIONS ── */
        @media (max-width: 768px) {
          .services-hero { padding: 3rem 1.5rem; }
          .services-content { padding: 2.5rem 1rem; }
          .filter-bar { padding: 0.65rem 1rem; top: 60px; }
        }
      `}</style>

      <div className="services-page">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          currentUser={currentUser}
          navigate={navigate}
          setPortalSubTab={setPortalSubTab}
        />

        {/* ── HERO BANNER with Search ── */}
        <section className="services-hero">
          <div className="hero-inner">
            <span className="hero-badge">
              <Sparkles size={10} />
              ClearDent Clinical Services
            </span>
            <h1 className="hero-title">
              Our Specialized <span>Dental Services</span>
            </h1>

            {/* Search Input Bar */}
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search dental treatments, categories..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── STICKY CATEGORIES FILTER BAR ── */}
        <div className="filter-bar">
          <div className="filter-pill-group">
            <button
              className={`filter-pill${selectedCategory === 'all' ? ' active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Services
            </button>
            {CATEGORIES_DATA.map(cat => (
              <button
                key={cat.id}
                className={`filter-pill${selectedCategory === cat.id ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* ── SERVICES GRID ── */}
        <div className="services-content-wrapper">
          <div className="services-content">
            {filteredServices.length === 0 ? (
              <div className="no-results">
                <h3>No treatments found</h3>
                <p>Try searching for a different keyword or category.</p>
              </div>
            ) : (
              <div className="services-grid">
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
    </>
  );
}

export default OurServices;
