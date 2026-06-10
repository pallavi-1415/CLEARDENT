import React, { useState, useEffect } from 'react';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Home from '../pages/home';
import OurServices from '../pages/Ourservices';
import BookingPage from '../pages/booking';
import AdminDashboard from '../dashboards/admin';
import DoctorDashboard from '../dashboards/doctor';
import OurDoctors from '../pages/doctor';
import ContactUs from '../pages/contact';
import FaqPage from '../pages/faq';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';
import ToothLoader from '../components/ui/ToothLoader';
import BookingModal from '../components/ui/BookingModal';
import { useAuth } from '../context/AuthContext';

function AppRoutes() {
  const { currentUser, isLoggedIn, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('website'); // 'website' or 'portal'
  const [portalSubTab, setPortalSubTab] = useState('appointments'); // 'appointments', 'profile', 'notifications'
  const [redirectTo, setRedirectTo] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(() => {
    return sessionStorage.getItem('isBookingModalOpen') === 'true';
  });

  // Sync modal open state to sessionStorage
  useEffect(() => {
    if (bookingModalOpen) {
      sessionStorage.setItem('isBookingModalOpen', 'true');
    } else {
      sessionStorage.removeItem('isBookingModalOpen');
    }
  }, [bookingModalOpen]);

  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    if (path === '/signup') return 'signup';
    if (path === '/login') return 'login';
    if (path === '/services') return 'services';
    if (path === '/doctors') return 'doctors';
    if (path === '/booking') return 'booking';
    if (path === '/contact') return 'contact';
    if (path === '/faq') return 'faq';
    if (path === '/privacy-policy') return 'privacy-policy';
    if (path === '/terms-conditions') return 'terms-conditions';
    if (path === '/admin-dashboard') return 'admin-dashboard';
    if (path === '/doctor-dashboard') return 'doctor-dashboard';
    return 'home'; // default landing page
  });

  // Global function to open the booking modal from any component
  useEffect(() => {
    window.openBookingModal = () => {
      const isAuth = !!currentUser || !!localStorage.getItem('token');
      if (!isAuth) {
        setRedirectTo({ route: route, openModal: true });
        window.history.pushState(null, '', '/login');
        setRoute('login');
      } else {
        setBookingModalOpen(true);
      }
    };
    return () => { delete window.openBookingModal; };
  }, [currentUser, route]);

  const [renderedRoute, setRenderedRoute] = useState(route);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle route transitions with page loader
  useEffect(() => {
    if (route !== renderedRoute) {
      setIsTransitioning(true);
    }
  }, [route, renderedRoute]);

  // Handle popstate for browser back/forward routing
  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname;
      const isAuth = !!currentUser || !!localStorage.getItem('token');
      const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const role = savedUser?.role || 'patient';

      if (path === '/signup') {
        setRoute('signup');
      } else if (path === '/login') {
        setRoute('login');
      } else if (path === '/services') {
        setRoute('services');
      } else if (path === '/doctors') {
        setRoute('doctors');
      } else if (path === '/contact') {
        setRoute('contact');
      } else if (path === '/faq') {
        setRoute('faq');
      } else if (path === '/privacy-policy') {
        setRoute('privacy-policy');
      } else if (path === '/terms-conditions') {
        setRoute('terms-conditions');
      } else if (path === '/booking') {
        if (!isAuth) {
          setRedirectTo('booking');
          window.history.pushState(null, '', '/login');
          setRoute('login');
        } else {
          setRoute('booking');
        }
      } else if (path === '/admin-dashboard') {
        if (!isAuth || role !== 'admin') {
          window.history.pushState(null, '', '/login');
          setRoute('login');
        } else {
          setRoute('admin-dashboard');
        }
      } else if (path === '/doctor-dashboard') {
        if (!isAuth || role !== 'doctor') {
          window.history.pushState(null, '', '/login');
          setRoute('login');
        } else {
          setRoute('doctor-dashboard');
        }
      } else {
        setRoute('home');
      }
    };

    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, [currentUser]);

  // Global scroll to top on routing/tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [renderedRoute, activeTab, portalSubTab]);

  const navigate = (page) => {
    const isAuth = !!currentUser || !!localStorage.getItem('token');
    const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const role = savedUser?.role || 'patient';

    if (page === 'booking' && !isAuth) {
      setRedirectTo('booking');
      window.history.pushState(null, '', '/login');
      setRoute('login');
      return;
    }
    if (page === 'admin-dashboard' && (!isAuth || role !== 'admin')) {
      window.history.pushState(null, '', '/login');
      setRoute('login');
      return;
    }
    if (page === 'doctor-dashboard' && (!isAuth || role !== 'doctor')) {
      window.history.pushState(null, '', '/login');
      setRoute('login');
      return;
    }
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(null, '', path);
    setRoute(page);
  };

  const handleLoginSuccess = (user, token) => {
    login(user, token);
    
    // Redirect if there is a pending destination
    if (redirectTo) {
      if (typeof redirectTo === 'object') {
        const dest = redirectTo.route;
        setRedirectTo(null);
        navigate(dest);
        if (redirectTo.openModal) {
          setTimeout(() => {
            if (window.openBookingModal) window.openBookingModal();
          }, 100);
        }
      } else {
        const dest = redirectTo;
        setRedirectTo(null);
        navigate(dest);
      }
    } else {
      if (user.role === 'admin') {
        navigate('admin-dashboard');
      } else if (user.role === 'doctor') {
        navigate('doctor-dashboard');
      } else {
        navigate('home');
      }
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('website');
    setPortalSubTab('appointments');
    navigate('home');
  };

  return (
    <>
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        navigate={navigate}
      />
      {isTransitioning && (
        <ToothLoader 
          onClose={() => {
            setRenderedRoute(route);
            setIsTransitioning(false);
          }} 
        />
      )}

      {renderedRoute === 'signup' && <Signup navigate={navigate} onLoginSuccess={handleLoginSuccess} />}
      {renderedRoute === 'services' && (
        <OurServices
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalSubTab={portalSubTab}
          setPortalSubTab={setPortalSubTab}
        />
      )}
      {renderedRoute === 'doctors' && (
        <OurDoctors
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalSubTab={portalSubTab}
          setPortalSubTab={setPortalSubTab}
        />
      )}
      {renderedRoute === 'contact' && (
        <ContactUs
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalSubTab={portalSubTab}
          setPortalSubTab={setPortalSubTab}
        />
      )}
      {renderedRoute === 'booking' && (
        <BookingPage
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalSubTab={portalSubTab}
          setPortalSubTab={setPortalSubTab}
        />
      )}
      {renderedRoute === 'home' && (
        <Home
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalSubTab={portalSubTab}
          setPortalSubTab={setPortalSubTab}
        />
      )}
      {renderedRoute === 'faq' && (
        <FaqPage
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalSubTab={portalSubTab}
          setPortalSubTab={setPortalSubTab}
        />
      )}
      {renderedRoute === 'privacy-policy' && (
        <PrivacyPolicy
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalSubTab={portalSubTab}
          setPortalSubTab={setPortalSubTab}
        />
      )}
      {renderedRoute === 'terms-conditions' && (
        <TermsConditions
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portalSubTab={portalSubTab}
          setPortalSubTab={setPortalSubTab}
        />
      )}
      {renderedRoute === 'login' && <Login navigate={navigate} onLoginSuccess={handleLoginSuccess} />}
      {renderedRoute === 'admin-dashboard' && (
        <AdminDashboard navigate={navigate} currentUser={currentUser} onLogout={handleLogout} />
      )}
      {renderedRoute === 'doctor-dashboard' && (
        <DoctorDashboard navigate={navigate} currentUser={currentUser} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default AppRoutes;
