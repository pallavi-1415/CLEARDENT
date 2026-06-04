import React, { useState, useEffect } from 'react';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';
import OurServices from './pages/Ourservices';
import BookingPage from './pages/booking';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import OurDoctors from './pages/doctor';
import ToothLoader from './components/ui/ToothLoader';
import BookingModal from './components/ui/BookingModal';

function App() {
  // Clear any persisted login state on initial load to ensure no user is auto-logged in
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);
  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('website'); // 'website' or 'portal'
  const [portalSubTab, setPortalSubTab] = useState('appointments'); // 'appointments', 'profile', 'notifications'
  const [redirectTo, setRedirectTo] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Global function to open the booking modal from any component
  useEffect(() => {
    window.openBookingModal = () => setBookingModalOpen(true);
    return () => { delete window.openBookingModal; };
  }, []);

  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    if (path === '/signup') return 'signup';
    if (path === '/login') return 'login';
    if (path === '/services') return 'services';
    if (path === '/doctors') return 'doctors';
    if (path === '/booking') return 'booking';
    if (path === '/admin-dashboard') return 'admin-dashboard';
    if (path === '/doctor-dashboard') return 'doctor-dashboard';
    return 'home'; // default landing page
  });

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

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect if there is a pending destination
    if (redirectTo) {
      const dest = redirectTo;
      setRedirectTo(null);
      navigate(dest);
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
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActiveTab('website');
    setPortalSubTab('appointments');
    navigate('home');
  };

  const [toast, setToast] = useState(null); // { message, type }

  useEffect(() => {
    window.showToast = (message, type = 'success') => {
      setToast({ message, type });
    };
    window.showError = (message) => {
      setToast({ message, type: 'error' });
    };
    return () => {
      delete window.showToast;
      delete window.showError;
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="App-root">
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        currentUser={currentUser}
        isLoggedIn={!!currentUser}
        navigate={navigate}
      />
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-global-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 999999;
          background: #ffffff;
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 12px;
          animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          max-width: 380px;
          border: 1px solid #e2e8f0;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .custom-global-toast.toast-error {
          border-left: 5px solid #ef4444;
          background: #fef2f2;
          color: #991b1b;
        }
        .custom-global-toast.toast-success {
          border-left: 5px solid #10b981;
          background: #ecfdf5;
          color: #065f46;
        }
      `}</style>

      {toast && (
        <div className={`custom-global-toast toast-${toast.type}`}>
          <div style={{ flex: 1 }}>{toast.message}</div>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              padding: '0 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &times;
          </button>
        </div>
      )}

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
          isLoggedIn={!!currentUser}
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
          isLoggedIn={!!currentUser}
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
          isLoggedIn={!!currentUser}
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
          isLoggedIn={!!currentUser}
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
    </div>
  );
}

export default App;
