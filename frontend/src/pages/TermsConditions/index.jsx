import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

function TermsConditions({ isLoggedIn, currentUser, onLogout, activeTab, setActiveTab, setPortalSubTab, navigate }) {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        currentUser={currentUser} 
        onLogout={onLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setPortalSubTab={setPortalSubTab} 
        navigate={navigate} 
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <h1 className="text-[2.5rem] font-medium text-slate-800 mb-8 font-serif">Terms & Conditions</h1>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-6 text-slate-600 leading-relaxed">
          <p>
            Welcome to ClearDent. By accessing our website or using our services, you agree to comply with and be bound by the following Terms and Conditions.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">1. Appointment Booking & Cancellations</h2>
          <p>
            Appointments can be scheduled online or in person. We require at least 24 hours' notice for any cancellations or rescheduling. Failure to notify us may result in a cancellation fee.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">2. Payments & Fees</h2>
          <p>
            All fees for dental services are due at the time of treatment unless prior arrangements have been made. We accept major credit cards, online payments via Razorpay, and direct clinic payments.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">3. Medical Disclaimer</h2>
          <p>
            The content provided on the ClearDent website is for informational purposes only and does not substitute professional medical advice, diagnosis, or treatment. Always consult with a qualified dentist regarding any dental health issues.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">4. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. Any activity occurring under your account is your responsibility.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">5. Amendments</h2>
          <p>
            ClearDent reserves the right to modify these Terms & Conditions at any time. Continued use of our services constitutes acceptance of the updated terms.
          </p>
          
          <p className="text-[0.85rem] text-slate-400 mt-8 pt-4 border-t border-slate-100">
            Last updated: October 2023
          </p>
        </div>
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

export default TermsConditions;
