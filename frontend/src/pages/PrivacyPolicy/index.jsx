import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

function PrivacyPolicy({ isLoggedIn, currentUser, onLogout, activeTab, setActiveTab, setPortalSubTab, navigate }) {
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
        <h1 className="text-[2.5rem] font-medium text-slate-800 mb-8 font-serif">Privacy Policy</h1>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-6 text-slate-600 leading-relaxed">
          <p>
            At ClearDent, we are committed to protecting your privacy and ensuring the security of your personal and medical information. 
            This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">1. Information We Collect</h2>
          <p>
            When you register, book an appointment, or use our services, we may collect personal details such as your name, email address, phone number, and relevant medical history necessary for dental treatments.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">2. How We Use Your Information</h2>
          <p>
            We use your data solely for the purpose of providing dental care, managing appointments, processing payments, and sending essential notifications related to your treatment.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">3. Data Security & HIPAA Compliance</h2>
          <p>
            Your health records and personal data are encrypted and stored securely. We adhere to industry-standard protocols to prevent unauthorized access, alteration, or disclosure of your information.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">4. Sharing of Information</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may only share data with authorized medical professionals involved in your care or when required by law.
          </p>

          <h2 className="text-[1.25rem] font-semibold text-slate-800 mt-4">5. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding our Privacy Policy, please contact us at <a href="mailto:privacy@cleardent.com" className="text-blue-600 hover:underline">privacy@cleardent.com</a>.
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

export default PrivacyPolicy;
