import React, { useState } from 'react';
import { 
  MapPin, Clock, Phone, Copy, Mail, 
  Lock, Send, CheckCircle2, Loader2, ArrowLeft 
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';



function ContactUs({ navigate, isLoggedIn, currentUser, onLogout, activeTab, setActiveTab, portalSubTab, setPortalSubTab }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [selectedService, setSelectedService] = useState('General Checkup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const services = [
    { id: 'general', label: 'General Checkup' },
    { id: 'cosmetic', label: 'Cosmetic Dentistry' },
    { id: 'ortho', label: 'Orthodontics' },
    { id: 'implants', label: 'Implants' },
    { id: 'emergency', label: '🚨 Emergency', isEmergency: true }
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const showToastNotification = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => showToastNotification(`${type} copied to clipboard`))
      .catch(err => console.error('Could not copy text: ', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          service: selectedService
        })
      });

      let data = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        // Fallback for non-JSON responses (like 404 html pages)
      }

      setIsSubmitting(false);

      if (response.ok && data && data.success) {
        setShowSuccess(true);
        window.showToast?.('Request received! We will contact you shortly.');
      } else {
        const errorMsg = data?.message || `Server returned error (${response.status}). Please make sure backend is restarted and running.`;
        window.showError?.(errorMsg);
      }
    } catch (err) {
      console.error('Submit contact error:', err);
      setIsSubmitting(false);
      window.showError?.('Could not connect to server. Please make sure backend is running on port 5000.');
    }
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    setSelectedService('General Checkup');
    setShowSuccess(false);
  };

  return (
    <div className="antialiased flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        currentUser={currentUser}
        navigate={navigate}
        setPortalSubTab={setPortalSubTab}
      />

      <main className="flex-grow relative overflow-hidden flex items-center justify-center py-8 lg:py-12 px-4">
        
        {/* Ambient Blobs */}
        <div className="absolute w-[400px] h-[400px] bg-[#1653E0] rounded-full filter blur-[100px] opacity-10 -top-[100px] -left-[100px]"></div>
        <div className="absolute w-[300px] h-[300px] bg-[#60A5FA] rounded-full filter blur-[100px] opacity-10 -bottom-[50px] -right-[50px] [animation-delay:-5s]"></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
          
          {/* Left Column: Brand Messaging & Contact Cards */}
          <div className="lg:col-span-5 flex flex-col justify-center animate-fade-up">
            
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 w-max mb-6 shadow-sm">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-[#0F172A]">Accepting New Patients</span>
              <span className="text-gray-300 mx-1">|</span>
              <span className="text-sm text-[#64748B] flex items-center gap-1">
                <Clock size={14} /> Est. reply: 10 mins
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-[#0F172A] leading-tight mb-4 tracking-tight">
              Let's perfect <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1653E0] to-blue-400">your smile.</span>
            </h1>
            
            <p className="text-[#64748B] text-base mb-6 leading-relaxed max-w-md">
              Whether you need a routine checkup, advanced cosmetic care, or have a general inquiry, our concierge team is here to assist you instantly.
            </p>

            {/* Glassmorphic Contact Info Cards */}
            <div className="space-y-3 w-full max-w-md">
              
              <div 
                className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_20px_40px_-10px_rgba(22,83,224,0.1)] p-4 flex items-center gap-4 cursor-pointer group animate-fade-up stagger-1"
                onClick={() => handleCopy('+1 (800) 555-0199', 'Phone number')}
              >
                <div className="w-10 h-10 rounded-full bg-[#EBF1FF] flex items-center justify-center text-[#1653E0] group-hover:scale-110 transition-transform shrink-0">
                  <Phone size={18} className="fill-current" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">Call Us Directly</p>
                  <p className="text-base font-bold text-[#0F172A]">+1 (800) 555-0199</p>
                </div>
                <Copy size={16} className="text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div 
                className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_20px_40px_-10px_rgba(22,83,224,0.1)] p-4 flex items-center gap-4 cursor-pointer group animate-fade-up stagger-2"
                onClick={() => handleCopy('hello@cleardent.com', 'Email address')}
              >
                <div className="w-10 h-10 rounded-full bg-[#EBF1FF] flex items-center justify-center text-[#1653E0] group-hover:scale-110 transition-transform shrink-0">
                  <Mail size={18} className="fill-current" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">Email Concierge</p>
                  <p className="text-base font-bold text-[#0F172A]">hello@cleardent.com</p>
                </div>
                <Copy size={16} className="text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_20px_40px_-10px_rgba(22,83,224,0.1)] p-4 flex items-center gap-4 animate-fade-up stagger-3">
                <div className="w-10 h-10 rounded-full bg-[#EBF1FF] flex items-center justify-center text-[#1653E0] shrink-0">
                  <MapPin size={18} className="fill-current" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">Headquarters</p>
                  <p className="text-sm font-medium text-[#0F172A]">1200 Healthway Drive, Suite 400<br/>San Francisco, CA 94103</p>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-7 relative animate-fade-up stagger-4">
            
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100 relative z-10 overflow-hidden min-h-[500px]">
              
              {/* Form State */}
              <div className={`transition-all duration-500 ${showSuccess ? 'opacity-0 pointer-events-none translate-x-8 absolute' : 'opacity-100 translate-x-0 relative'}`}>
                <h2 className="text-xl font-bold text-[#0F172A] mb-1">Send a Request</h2>
                <p className="text-[#64748B] text-sm mb-6">Fill out the fields below and we'll get right back to you.</p>

                <form onSubmit={handleSubmit}>
                  
                  {/* Service Chips */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-[#0F172A] mb-2.5">What can we help you with?</label>
                    <div className="flex flex-wrap gap-2">
                      {services.map((svc) => {
                        const isActive = selectedService === svc.label;
                        
                        let baseClasses = "px-3.5 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all select-none ";
                        
                        if (svc.isEmergency) {
                          if (isActive) baseClasses += "bg-red-600 text-white border-red-600 shadow-[0_4px_10px_rgba(220,38,38,0.2)] scale-[1.02] ";
                          else baseClasses += "text-red-600 border-red-200 hover:bg-red-50 bg-white ";
                        } else {
                          if (isActive) baseClasses += "bg-[#1653E0] text-white border-[#1653E0] shadow-[0_4px_10px_rgba(22,83,224,0.2)] scale-[1.02] ";
                          else baseClasses += "bg-white border-gray-200 text-[#64748B] hover:border-gray-300 hover:bg-gray-50 ";
                        }

                        return (
                          <div 
                            key={svc.id}
                            className={baseClasses}
                            onClick={() => setSelectedService(svc.label)}
                          >
                            {svc.label}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Input Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-semibold text-[#0F172A] mb-1.5">First Name</label>
                      <input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[0.95rem] text-slate-900 transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:border-[#1653E0] focus:shadow-[0_0_0_4px_rgba(22,83,224,0.15)] placeholder-slate-400" placeholder="e.g. Jane" required />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs font-semibold text-[#0F172A] mb-1.5">Last Name</label>
                      <input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[0.95rem] text-slate-900 transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:border-[#1653E0] focus:shadow-[0_0_0_4px_rgba(22,83,224,0.15)] placeholder-slate-400" placeholder="e.g. Smith" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-[#0F172A] mb-1.5">Email Address</label>
                      <input type="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[0.95rem] text-slate-900 transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:border-[#1653E0] focus:shadow-[0_0_0_4px_rgba(22,83,224,0.15)] placeholder-slate-400" placeholder="jane@example.com" required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-[#0F172A] mb-1.5">Phone Number</label>
                      <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[0.95rem] text-slate-900 transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:border-[#1653E0] focus:shadow-[0_0_0_4px_rgba(22,83,224,0.15)] placeholder-slate-400" placeholder="(555) 000-0000" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-xs font-semibold text-[#0F172A] mb-1.5">Additional Details</label>
                    <textarea id="message" value={formData.message} onChange={handleInputChange} rows="3" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[0.95rem] text-slate-900 transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:border-[#1653E0] focus:shadow-[0_0_0_4px_rgba(22,83,224,0.15)] placeholder-slate-400 resize-none" placeholder="Tell us a little more about what you need..." required></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-[#64748B] max-w-[240px] flex items-start gap-1.5">
                      <Lock size={12} className="mt-0.5 shrink-0" /> 
                      Your information is strictly confidential and securely encrypted.
                    </p>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:transition-all after:duration-500 hover:after:left-full w-full sm:w-auto bg-[#1653E0] text-white font-semibold py-3 px-6 rounded-xl shadow-[0_10px_20px_-10px_rgba(22,83,224,0.5)] hover:shadow-[0_10px_20px_-10px_rgba(22,83,224,0.8)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed disabled:transform-none text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Request</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Success State */}
              <div className={`absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-6 transition-all duration-500 ${showSuccess ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none -translate-x-8'}`}>
                {showSuccess && (
                  <div className="w-16 h-16 bg-[#EBF1FF] rounded-full flex items-center justify-center mb-4 text-[#1653E0] animate-scale-in">
                    <CheckCircle2 size={36} className="fill-current text-white" strokeWidth={1.5} />
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#0F172A] mb-1.5">Request Received</h3>
                <p className="text-[#64748B] text-sm max-w-sm mb-6">
                  Thank you, <span className="font-semibold text-[#0F172A]">{formData.firstName}</span>. We have securely received your inquiry regarding <span className="font-semibold text-[#0F172A]">{selectedService.replace('🚨 ', '')}</span>. Our team will contact you shortly.
                </p>
                <button 
                  onClick={resetForm} 
                  className="text-[#1653E0] font-semibold hover:text-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <ArrowLeft size={16} /> Send another request
                </button>
              </div>

            </div>

            {/* Decorative background blurs behind card */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#1653E0]/10 rounded-full blur-2xl z-0"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl z-0"></div>
          </div>
        </div>
      </main>

      {/* Custom Toast */}
      <div className={`fixed bottom-6 right-6 bg-[#0F172A] text-white px-6 py-3.5 rounded-xl shadow-2xl transition-all duration-300 z-50 flex items-center gap-3 ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <CheckCircle2 size={20} className="text-green-400 fill-current" />
        <span className="font-medium text-sm">{toast.message}</span>
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}

export default ContactUs;
