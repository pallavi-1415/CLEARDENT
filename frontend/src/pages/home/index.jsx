import React from 'react';
import Navbar from '../../components/layout/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import SpecialistsSection from './components/SpecialistsSection';
import FeatureBanner from './components/FeatureBanner';
import FaqSection from './components/FaqSection';
import AppointmentCta from './components/AppointmentCta';
import Footer from '../../components/layout/Footer';
import PortalDashboardView from '../../dashboards/patient';

function Home({ navigate, isLoggedIn, onLogout, currentUser, activeTab, setActiveTab, portalSubTab, setPortalSubTab }) {
  return (
    <div className="animate-fade-in min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        currentUser={currentUser}
        navigate={navigate}
        setPortalSubTab={setPortalSubTab}
      />

      {/* Main Container */}
      {activeTab === 'website' ? (
        <div className="flex-1 flex flex-col">
          {/* Hero Section */}
          <HeroSection
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setActiveTab={setActiveTab}
          />

          {/* About Section */}
          <AboutSection />

          {/* Services Section */}
          <ServicesSection
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setActiveTab={setActiveTab}
          />

          {/* Specialists Section */}
          <SpecialistsSection navigate={navigate} />

          {/* Banner Section */}
          <FeatureBanner
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setActiveTab={setActiveTab}
          />

          {/* FAQ Section */}
          <FaqSection
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setActiveTab={setActiveTab}
          />

          {/* Book Appointment CTA Section */}
          <AppointmentCta
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setActiveTab={setActiveTab}
          />

          {/* Footer Section */}
          <Footer navigate={navigate} />
        </div>
      ) : (
        /* Patient Portal Dashboard (Synchronized) */
        <PortalDashboardView
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          portalSubTab={portalSubTab}
          setPortalSubTab={setPortalSubTab}
        />
      )}
    </div>
  );
}

export default Home;
