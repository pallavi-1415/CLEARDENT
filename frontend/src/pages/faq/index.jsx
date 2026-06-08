import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ArrowUpRight, ChevronRight, ChevronUp,
  MessageSquare, Smile, X
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// Dental FAQ categories and questions mapping
const faqData = [
  {
    id: 'general',
    title: 'General questions',
    link: '#general',
    questions: [
      {
        q: 'Are you accepting new patients?',
        a: 'Yes, we are always happy to welcome new patients of all ages to the ClearDent family! You can schedule your first comprehensive exam and cleaning online or call our reception desk directly.'
      },
      {
        q: 'What should I bring to my first appointment?',
        a: 'Please bring a valid photo ID, your dental insurance card (if applicable), and any completed patient forms. If you have had dental X-rays taken in the last 12 months, you can request them to be forwarded to us.'
      },
      {
        q: 'Do you offer emergency dental services?',
        a: 'Absolutely. We provide same-day emergency dental care for urgent issues like severe toothaches, knocked-out teeth, broken restorations, or facial swelling. Contact our office immediately for emergency slots.'
      }
    ]
  },
  {
    id: 'bookings',
    title: 'Appointments & booking',
    link: '#bookings',
    questions: [
      {
        q: 'How do I schedule an appointment online?',
        a: 'Scheduling is easy! Click the "Book an appointment" button on the top-right of any page to open our real-time portal. Choose your treatment type, select a preferred doctor, and pick a time slot that works for you.'
      },
      {
        q: 'What is your cancellation policy?',
        a: 'We kindly request at least 24 hours\' notice if you need to cancel or reschedule your appointment. This allows us to offer the time slot to other patients who may need urgent care. Cancellations under 24 hours may incur a fee.'
      },
      {
        q: 'Can I reschedule my appointment online?',
        a: 'Yes. If you booked through your patient portal account, you can reschedule or cancel your upcoming appointments directly in the portal up to 24 hours before your scheduled time.'
      }
    ]
  },
  {
    id: 'billing',
    title: 'Billing & insurance',
    link: '#billing',
    questions: [
      {
        q: 'Which dental insurance plans do you accept?',
        a: 'We accept most major PPO dental insurance plans. Our front desk team is happy to verify your benefits, submit claims on your behalf, and help you maximize your annual coverage limits.'
      },
      {
        q: 'Do you offer payment plans or financing?',
        a: 'Yes, we offer flexible payment options to fit your budget. We partner with CareCredit to provide interest-free monthly financing plans for qualifying dental treatments and cosmetic procedures.'
      },
      {
        q: 'What should I do if my insurance doesn\'t cover a procedure?',
        a: 'We believe in full financial transparency. Before any treatment begins, we will provide a detailed breakdown of costs. If a service isn\'t covered, we will discuss alternative treatments or customize a payment plan.'
      }
    ]
  },
  {
    id: 'treatments',
    title: 'Treatments & services',
    link: '#treatments',
    questions: [
      {
        q: 'What\'s the difference between standard and deep cleaning?',
        a: 'A standard cleaning (prophylaxis) focuses on the crowns of the teeth above the gumline to maintain healthy teeth. A deep cleaning (scaling and root planing) is a therapeutic treatment targeting plaque and calculus buildup below the gumline to halt gum disease.'
      },
      {
        q: 'How long does a professional teeth whitening treatment take?',
        a: 'Our in-office whitening treatments take about 60 to 90 minutes. We apply a prescription-strength whitening gel activated by a specialized light, leaving your teeth up to 8 shades brighter in a single visit.'
      },
      {
        q: 'Are dental X-rays safe?',
        a: 'Yes, dental X-rays are extremely safe. We use advanced digital radiography, which reduces radiation exposure by up to 90% compared to traditional film X-rays. We also utilize protective lead aprons for absolute safety.'
      }
    ]
  },
  {
    id: 'postcare',
    title: 'Post-operative care',
    link: '#postcare',
    questions: [
      {
        q: 'What should I do after a tooth extraction?',
        a: 'To promote healing, keep gauze on the extraction site for 30-45 minutes. Avoid spitting, drinking through a straw, smoking, or strenuous exercise for 24 hours. Eat soft foods, stay hydrated, and take prescribed medication as directed.'
      },
      {
        q: 'How do I care for my new dental crown?',
        a: 'Maintain your dental crown just like natural teeth: brush twice a day, floss daily (sliding the floss out sideways rather than pulling up), and visit us for regular cleanings. Avoid chewing extremely hard candy or ice.'
      },
      {
        q: 'What is normal sensitivity after a root canal?',
        a: 'It is normal to experience mild soreness or sensitivity to pressure for a few days after a root canal as the surrounding tissue heals. This is temporary and can usually be managed with over-the-counter anti-inflammatories.'
      }
    ]
  }
];

// Flat list of questions for searching
const allQuestions = faqData.reduce((acc, cat) => {
  const qList = cat.questions.map(q => ({
    ...q,
    categoryId: cat.id,
    categoryTitle: cat.title
  }));
  return [...acc, ...qList];
}, []);

function FaqPage({ navigate, isLoggedIn, currentUser, onLogout, activeTab, setActiveTab, portalSubTab, setPortalSubTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState({ categoryId: null, index: null });
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Set page meta details
  useEffect(() => {
    document.title = "ClearDent Support & Help Center";
    // Setup Cmd+K / Ctrl+K keyboard shortcut
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter questions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSelectedSearchIndex(-1);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = allQuestions.filter(q => 
      q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query)
    );
    setSearchResults(filtered.slice(0, 8)); // Limit to 8 results
    setSelectedSearchIndex(-1);
  }, [searchQuery]);

  // Handle outside clicks to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !searchInputRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation inside search dropdown
  const handleSearchKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSearchIndex >= 0 && selectedSearchIndex < searchResults.length) {
        selectQuestion(searchResults[selectedSearchIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      searchInputRef.current?.blur();
    }
  };

  // Action when a question is selected
  const selectQuestion = (q) => {
    setSearchQuery('');
    setIsFocused(false);
    
    // Find category index and question index
    const category = faqData.find(cat => cat.id === q.categoryId);
    const qIndex = category.questions.findIndex(item => item.q === q.q);
    
    setActiveAccordion({ categoryId: q.categoryId, index: qIndex });
    
    // Smooth scroll to the category card
    setTimeout(() => {
      const el = document.getElementById(`card-${q.categoryId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a temporary glow effect
        el.classList.add('glow-highlight');
        setTimeout(() => el.classList.remove('glow-highlight'), 2000);
      }
    }, 100);
  };

  // Toggle accordion open/closed
  const toggleAccordion = (categoryId, index) => {
    if (activeAccordion.categoryId === categoryId && activeAccordion.index === index) {
      setActiveAccordion({ categoryId: null, index: null });
    } else {
      setActiveAccordion({ categoryId, index });
    }
  };

  // Popular search tags trigger search
  const handlePopularSearch = (term) => {
    setSearchQuery(term);
    searchInputRef.current?.focus();
    setIsFocused(true);
  };

  // Highlight search text matches
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="bg-yellow-100 text-yellow-800 font-medium px-0.5 rounded">{part}</span> 
        : part
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Background layout layers */}
      <div className="grid-bg absolute top-0 left-0 right-0 h-[600px] z-0 pointer-events-none">
        <div className="sketch-grid-lines"></div>
      </div>

      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isLoggedIn={isLoggedIn} 
        onLogout={onLogout} 
        currentUser={currentUser} 
        navigate={navigate}
        setPortalSubTab={setPortalSubTab}
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-22 pb-10 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-[3rem] md:text-[4.2rem] font-sans font-[850] text-[#0F172A] tracking-[-0.04em] mb-4 select-none">
            How can we help?
          </h1>
        </div>
      </section>

      {/* Search Input Section */}
      <section className="relative z-20 px-6 mb-16">
        <div className="max-w-[640px] mx-auto relative">
          
          {/* Main search bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-5 w-5 h-5 text-slate-400 pointer-events-none" />
            
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Ask a question…"
              className="w-full pl-14 pr-24 py-4.5 bg-white border border-slate-200 rounded-full text-[1.05rem] text-slate-900 placeholder-slate-400 outline-none shadow-[0_8px_32px_rgba(15,23,42,0.04)] transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12),0_8px_32px_rgba(15,23,42,0.04)] focus:border-blue-600 font-medium"
              autoComplete="off"
            />

            {/* Keyboard shortcut / Clear input actions */}
            {searchQuery ? (
              <button 
                onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                className="absolute right-5 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute right-5 hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-[0.72rem] font-bold text-slate-400 pointer-events-none select-none">
                <span className="text-[0.6rem] font-bold">Ctrl</span>
                <span>K</span>
              </div>
            )}
          </div>

          {/* Algolia-Style Live Search Dropdown */}
          {isFocused && (searchQuery.trim() !== '' || searchResults.length > 0) && (
            <div 
              ref={dropdownRef}
              className="absolute left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[380px] overflow-y-auto animate-fade-in"
            >
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50 text-[0.72rem] font-bold text-slate-400 uppercase tracking-wider">
                    Matching Questions
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {searchResults.map((result, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => selectQuestion(result)}
                          className={`w-full text-left px-5 py-3.5 flex flex-col gap-1 transition-all ${
                            idx === selectedSearchIndex ? 'bg-slate-50 border-l-4 border-blue-600 pl-4' : 'hover:bg-slate-50/70 border-l-4 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 text-[0.95rem] leading-snug">
                              {highlightMatch(result.q, searchQuery)}
                            </span>
                            <span className="text-[0.7rem] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ml-4">
                              {result.categoryTitle.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-[0.82rem] text-slate-400 line-clamp-1 m-0">
                            {result.a}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                  <Search className="w-8 h-8 text-slate-300" />
                  <p className="font-semibold text-slate-700 m-0">No results found for "{searchQuery}"</p>
                  <p className="text-sm text-slate-400 m-0">Try typing another dental topic or cleaning service.</p>
                </div>
              )}
            </div>
          )}

          {/* Popular / Common Searches section */}
          <div className="mt-5 flex items-center justify-center flex-wrap gap-2.5 text-[0.88rem] text-slate-500 font-medium">
            <span className="text-slate-400">Common searches:</span>
            <button 
              onClick={() => handlePopularSearch('cleaning')}
              className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full font-medium transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 hover:scale-[1.02] border-none cursor-pointer"
            >
              Dental cleanings
            </button>
            <button 
              onClick={() => handlePopularSearch('whitening')}
              className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full font-medium transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 hover:scale-[1.02] border-none cursor-pointer"
            >
              Teeth whitening
            </button>
            <button 
              onClick={() => handlePopularSearch('cancellation')}
              className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full font-medium transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 hover:scale-[1.02] border-none cursor-pointer"
            >
              Cancellation policy
            </button>
          </div>

        </div>
      </section>

      {/* Topics Cards Grid */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 mb-20 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {faqData.map((category) => (
            <div 
              key={category.id} 
              id={`card-${category.id}`}
              className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.015)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.06)] p-6 flex flex-col"
            >
              {/* Card Header Link */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[1.25rem] font-bold text-slate-900 m-0 tracking-tight">
                  {category.title}
                </h3>
                
                {/* Arrow up-right circular button */}
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card List of Questions as Accordions */}
              <div className="flex flex-col divide-y divide-slate-100 flex-grow">
                {category.questions.map((item, idx) => {
                  const isOpen = activeAccordion.categoryId === category.id && activeAccordion.index === idx;
                  return (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                      
                      {/* Accordion Trigger Header */}
                      <button
                        onClick={() => toggleAccordion(category.id, idx)}
                        className="w-full text-left bg-transparent border-none p-0 flex items-center justify-between gap-4 text-slate-700 hover:text-blue-600 transition-colors group cursor-pointer"
                      >
                        <span className="font-semibold text-[0.92rem] leading-snug tracking-tight group-hover:translate-x-0.5 transition-transform duration-200">
                          {item.q}
                        </span>
                        
                        {/* Interactive Chevrons */}
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                        )}
                      </button>

                      {/* Accordion Answer Content */}
                      {isOpen && (
                        <div className="mt-2.5 text-[0.86rem] leading-relaxed text-slate-500 animate-fade-in pr-2">
                          {item.a}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          ))}

          {/* Contact Card in the Grid */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-none text-white flex flex-col justify-between min-h-[260px] rounded-2xl transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.06)] p-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 mb-6">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-[1.4rem] font-bold tracking-tight mb-2 m-0 text-white">
                Haven’t found what you need?
              </h3>
              <p className="text-slate-300 text-[0.92rem] leading-relaxed mb-6 m-0 font-medium">
                Get in touch — we’re happy to help!
              </p>
            </div>
            
            <button
              onClick={() => navigate('contact')}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 border-none font-bold rounded-xl text-[0.92rem] cursor-pointer shadow-md transition-all text-center"
            >
              Contact us
            </button>
          </div>

        </div>
      </section>

      {/* Sticker Links Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-200/60 relative z-10">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Sticker Link 1: Patient registration guide */}
            <div className="flex gap-6 items-start">
              <div className="shrink-0 w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-3 select-none">
                <img 
                  alt="Pencil paper illustration" 
                  src="https://sktch.b-cdn.net/assets/stickers/pencil-paper%404x.png?width=168&quality=95&sharpen=1&token=2lHTC9aS6n2jyIQaJraZfzRVslxoagrPg-cTwFVxs7c&expires=1780826932" 
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[1rem] font-bold text-slate-800 m-0">First visit guidelines</h4>
                <p className="text-[0.88rem] leading-relaxed text-slate-500 m-0 font-medium">
                  Preparing for your appointments? Read our step-by-step <button onClick={() => window.openBookingModal?.()} className="bg-transparent border-none text-blue-600 hover:text-blue-700 hover:underline p-0 font-bold cursor-pointer">Patient Registration Guide</button>.
                </p>
              </div>
            </div>

            {/* Sticker Link 2: Community / Support */}
            <div className="flex gap-6 items-start">
              <div className="shrink-0 w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-3 select-none">
                <img 
                  alt="Chat illustration" 
                  src="https://sktch.b-cdn.net/assets/stickers/chat--green%404x.png?width=168&quality=95&sharpen=1&token=jd-iv5C4g3_y3fyaUo1hBkNAWkF9RpdNKFt34dFtmcs&expires=1780826932" 
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[1rem] font-bold text-slate-800 m-0">Get in touch directly</h4>
                <p className="text-[0.88rem] leading-relaxed text-slate-500 m-0 font-medium">
                  Need to speak with our receptionist? Send us a message through our <button onClick={() => navigate('contact')} className="bg-transparent border-none text-blue-600 hover:text-blue-700 hover:underline p-0 font-bold cursor-pointer">Online Contact Form</button>.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Get Started Section ("Start smiling today") */}
      <section className="py-20 relative z-10 text-center bg-white">
        <div className="max-w-[720px] mx-auto px-6 flex flex-col items-center gap-6">
          
          {/* Dental Icon mimicking app icon */}
          <div className="w-20 h-20 rounded-3xl bg-[#fafafa] border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.03)] flex items-center justify-center text-blue-600 select-none hover:scale-105 transition-transform duration-300">
            <Smile className="w-10 h-10" />
          </div>

          <h2 className="text-[2.2rem] md:text-[2.8rem] font-bold tracking-tight text-slate-900 m-0">
            Start smiling today
          </h2>
          
          <p className="text-slate-500 text-[1.05rem] md:text-[1.15rem] leading-relaxed max-w-[500px] m-0 font-medium">
            Book an appointment online in under two minutes and experience modern, comfortable dental care.
          </p>

          <div className="relative before:content-[''] before:absolute before:-top-0.5 before:-left-0.5 before:-right-0.5 before:-bottom-0.5 before:bg-gradient-to-r before:from-blue-500 before:via-blue-700 before:to-blue-400 before:rounded-xl before:-z-10 before:blur-md before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-60 mt-4">
            <button
              onClick={() => window.openBookingModal?.()}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold border-none rounded-xl text-[0.98rem] shadow-lg shadow-blue-500/10 cursor-pointer transition-colors"
            >
              Book an appointment
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer navigate={navigate} />

    </div>
  );
}

export default FaqPage;
