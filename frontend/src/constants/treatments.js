import {
  Stethoscope,
  Smile,
  Activity,
  Sparkles,
  Baby,
  Scissors
} from 'lucide-react';

export const TREATMENTS_DATA = [
  {
    id: 'general',
    category: 'General Dentistry',
    icon: Stethoscope,
    items: [
      { name: 'Comprehensive Exam & X-Rays', duration: '45 mins', price: '₹1,500', desc: 'Full digital scan and comprehensive diagnosis of teeth and gums.' },
      { name: 'Professional Hygiene Cleaning', duration: '60 mins', price: '₹2,500', desc: 'Thorough scaling, polishing, and plaque removal for fresh breath.' },
      { name: 'Composite Dental Fillings', duration: '30 mins', price: '₹3,000', desc: 'Natural-looking, tooth-colored composite restorations.' }
    ]
  },
  {
    id: 'ortho',
    category: 'Orthodontics',
    icon: Smile,
    items: [
      { name: 'Clear Aligner Therapy', duration: 'Varies', price: '₹1,20,000+', desc: 'Virtually invisible aligners customized for comfortable straightening.' },
      { name: 'Traditional Ceramic Braces', duration: 'Varies', price: '₹65,000+', desc: 'Discreet tooth-colored brackets to fix complex bite issues.' },
      { name: 'Retainers & Post-Care', duration: '30 mins', price: '₹8,000', desc: 'Custom night retainers to protect and maintain your straight smile.' }
    ]
  },
  {
    id: 'implant',
    category: 'Dental Implants',
    icon: Activity,
    items: [
      { name: 'Single Tooth Implant', duration: '90 mins', price: '₹45,000', desc: 'Bio-compatible titanium post topped with a custom porcelain crown.' },
      { name: 'All-on-4 Full Arch', duration: '180 mins', price: '₹3,50,000', desc: 'Full-arch teeth replacement secured by four advanced implants.' },
      { name: 'Bone Grafting Procedure', duration: '60 mins', price: '₹15,000', desc: 'Bone density enhancement to ensure solid implant integration.' }
    ]
  },
  {
    id: 'cosmetic',
    category: 'Cosmetic Dentistry',
    icon: Sparkles,
    items: [
      { name: 'Laser Teeth Whitening', duration: '60 mins', price: '₹9,999', desc: 'Professional medical-grade bleaching up to 8 shades lighter.' },
      { name: 'Premium Porcelain Veneers', duration: 'Varies', price: '₹25,000/tooth', desc: 'Ultra-thin custom shells bonded to hide chips, gaps, or stains.' },
      { name: 'Dental Bonding & Contouring', duration: '45 mins', price: '₹6,500', desc: 'Direct composite shaping to correct minor irregularities.' }
    ]
  },
  {
    id: 'pediatric',
    category: 'Pediatric Dentistry',
    icon: Baby,
    items: [
      { name: 'Child Cleaning & Fluoride', duration: '30 mins', price: '₹2,000', desc: 'Fun, stress-free cleaning combined with cavity-fighting fluoride.' },
      { name: 'Fissure Sealants', duration: '20 mins', price: '₹1,500/tooth', desc: 'Protective thin coatings on back molars to lock out decay.' },
      { name: 'Gentle Pediatric Extractions', duration: '30 mins', price: '₹3,000', desc: 'Comfortable, safe removal of troubled baby teeth.' }
    ]
  },
  {
    id: 'surgery',
    category: 'Oral & Dental Surgery',
    icon: Scissors,
    items: [
      { name: 'Root Canal Therapy', duration: '75 mins', price: '₹8,500', desc: 'Saves infected teeth by removing nerve damage and sealing canals.' },
      { name: 'Wisdom Tooth Extraction', duration: '60 mins', price: '₹6,000', desc: 'Safe removal of impacted or painful wisdom teeth.' },
      { name: 'Emergency Dental Care', duration: '45 mins', price: '₹4,500', desc: 'Instant pain relief and diagnosis for urgent dental concerns.' }
    ]
  }
];
