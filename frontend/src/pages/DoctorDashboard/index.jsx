import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Users, 
  Calendar, 
  LogOut, 
  Activity, 
  Loader2, 
  Settings,
  Bell,
  Menu,
  ChevronDown,
  X
} from 'lucide-react';
import { 
  getDoctorStats, 
  getDoctorAppointments, 
  getDoctorProfile, 
  updateAppointmentStatusDoctor 
} from '../../services/doctor';
import { usePolling } from '../../hooks/usePolling';
import ConfirmModal from '../../components/ui/ConfirmModal';

// Sub-components
import DoctorOverview from './components/DoctorOverview';
import DoctorAppointments from './components/DoctorAppointments';
import PatientRecords from './components/PatientRecords';
import DoctorProfile from './components/DoctorProfile';

function DoctorDashboard({ navigate, onLogout, onLoginSuccess }) {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview', 'appointments', 'patients', 'profile'
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, apptId: null, newStatus: null });
  const [logoutConfirm, setLogoutConfirm] = useState({ isOpen: false });

  // Interactive controls & mobile responsiveness states
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real-time notifications state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications_doctor');
    return saved ? JSON.parse(saved) : [
      {
        id: 'default-notif-1',
        type: 'system',
        message: 'Workspace Configured. Profile and clinical availability settings synchronized.',
        time: 'Yesterday'
      }
    ];
  });

  const token = localStorage.getItem('token');
  const isFirstLoad = useRef(true);

  const handleLogoutClick = () => {
    setLogoutConfirm({ isOpen: true });
  };

  const confirmLogout = () => {
    setLogoutConfirm({ isOpen: false });
    onLogout();
  };

  const cancelLogout = () => {
    setLogoutConfirm({ isOpen: false });
  };

  const loadData = async () => {
    const silent = !isFirstLoad.current;
    if (!silent) setLoading(true);
    try {
      const [statsData, apptsData, profileData] = await Promise.all([
        getDoctorStats(token),
        getDoctorAppointments(token),
        getDoctorProfile(token)
      ]);
      setStats(statsData);
      setAppointments(apptsData);
      setProfile(profileData);
      isFirstLoad.current = false;
    } catch (err) {
      console.error(err);
      if (!silent) {
        window.showError?.(err.message || 'Failed to load dashboard data. Ensure backend is running.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Poll data every 5 seconds
  usePolling(loadData, 5000, [token]);

  useEffect(() => {
    // Establish connection to backend socket.io server
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('🔌 Connected to doctor real-time notification socket');
    });

    // Listen for new booking request from patients
    socket.on('appointmentCreated', (data) => {
      if (profile && data.appointment && new RegExp(profile.name, 'i').test(data.appointment.doctorName)) {
        const newNotif = {
          id: data.appointment._id || Date.now().toString(),
          type: 'booking',
          message: data.message || `New Booking: ${data.appointment.treatmentName} by patient.`,
          appointment: data.appointment,
          time: 'Just now'
        };
        setNotifications(prev => {
          const updated = [newNotif, ...prev];
          localStorage.setItem('notifications_doctor', JSON.stringify(updated));
          return updated;
        });
        window.showToast?.(`New Appointment Request: ${data.appointment.treatmentName}`);
        
        // Reload dashboard stats and appointments in real-time!
        loadData();
      }
    });

    // Listen for appointment status updates (e.g. cancellations)
    socket.on('appointmentStatusUpdated', (data) => {
      if (profile && data.appointment && new RegExp(profile.name, 'i').test(data.appointment.doctorName)) {
        const isCancelled = data.appointment.status === 'Cancelled';
        const newNotif = {
          id: (data.appointment._id || Date.now().toString()) + '-' + Date.now(),
          type: isCancelled ? 'cancel' : 'system',
          message: data.message || `Appointment status updated: ${data.appointment.status}`,
          appointment: data.appointment,
          time: 'Just now'
        };
        setNotifications(prev => {
          const updated = [newNotif, ...prev];
          localStorage.setItem('notifications_doctor', JSON.stringify(updated));
          return updated;
        });
        
        if (isCancelled) {
          window.showError?.(`Appointment Cancelled: ${data.appointment.treatmentName}`);
        } else {
          window.showToast?.(`Appointment Status: ${data.appointment.status}`);
        }
        
        // Reload dashboard stats and appointments in real-time!
        loadData();
      }
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleStatusUpdate = (apptId, newStatus) => {
    setConfirmDialog({ isOpen: true, apptId, newStatus });
  };

  const executeStatusUpdate = async () => {
    const { apptId, newStatus } = confirmDialog;
    setConfirmDialog({ isOpen: false, apptId: null, newStatus: null });
    
    setActionLoading(true);
    try {
      await updateAppointmentStatusDoctor(apptId, newStatus, token);
      // Reload immediately
      const [statsData, apptsData] = await Promise.all([
        getDoctorStats(token),
        getDoctorAppointments(token)
      ]);
      setStats(statsData);
      setAppointments(apptsData);
      window.showToast?.(`Appointment status updated to ${newStatus}`);
    } catch (err) {
      window.showError?.(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelStatusUpdate = () => {
    setConfirmDialog({ isOpen: false, apptId: null, newStatus: null });
  };

  const handleProfileUpdate = (updatedUser) => {
    setProfile(updatedUser);
    if (onLoginSuccess) {
      onLoginSuccess(updatedUser);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
        <Loader2 className="animate-spin text-blue-700 mb-4" size={40} />
        <p className="text-[0.9rem] font-sans tracking-[0.05em] uppercase text-text-muted">Loading Doctor Workspace...</p>
      </div>
    );
  }

  const getSubTabTitle = () => {
    switch (activeSubTab) {
      case 'overview': return 'Overview';
      case 'appointments': return 'My appointments';
      case 'patients': return 'Patient records';
      case 'profile': return 'Doctor profile';
      default: return 'Workspace';
    }
  };

  const doctorInitials = profile?.name ? profile.name.replace(/^Dr\.\s+/i, '').split(' ').pop().substring(0, 2).toUpperCase() : 'DR';

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 flex font-sans overflow-x-hidden">
      
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title="Update Status"
        message={`Are you sure you want to mark this appointment as ${confirmDialog.newStatus}?`}
        confirmText="Yes, Update"
        cancelText="Cancel"
        onConfirm={executeStatusUpdate}
        onCancel={cancelStatusUpdate}
      />
      
      {/* Sidebar Mobile Backdrop Drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Notifications Side Panel Drawer (Slides out like Windows notifications) */}
      {notifOpen && (
        <div 
          onClick={() => setNotifOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-50 transition-opacity"
        />
      )}
      <div className={`fixed top-0 right-0 h-screen w-80 sm:w-96 bg-white border-l border-slate-100 shadow-[0_0_35px_rgba(0,0,0,0.06)] z-50 transform transition-transform duration-300 flex flex-col ${
        notifOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-[1.1rem] font-bold text-slate-800">Notifications</h3>
            <span className="text-[0.68rem] text-slate-400 font-semibold">Real-time alerts</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setNotifications([]);
                localStorage.setItem('notifications_doctor', JSON.stringify([]));
                window.showToast?.('All notifications cleared');
                setNotifOpen(false);
              }}
              className="text-[0.68rem] text-[#5F7EF7] hover:text-[#4F6EF2] font-bold uppercase bg-transparent border-none p-0 cursor-pointer outline-none"
            >
              Clear All
            </button>
            <button 
              onClick={() => setNotifOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-105 rounded-lg transition-colors border-none cursor-pointer"
              title="Close Panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Drawer Alerts Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-20">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 mb-3">
                <Bell size={18} />
              </div>
              <h4 className="text-[0.88rem] font-bold text-slate-700">No new alerts</h4>
              <p className="text-[0.78rem] text-slate-400 max-w-[200px] mt-1 leading-normal">
                You're all caught up! Real-time patient bookings will appear here.
              </p>
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => {
                  if (notif.appointment) {
                    setActiveSubTab('appointments');
                  } else {
                    setActiveSubTab('profile');
                  }
                  setNotifOpen(false);
                }}
                className={`p-4 rounded-2xl border text-[0.8rem] leading-normal transition-all hover:-translate-y-0.5 hover:shadow-xs cursor-pointer text-left ${
                  notif.type === 'booking' 
                    ? 'bg-blue-50/40 border-blue-100/60 hover:bg-blue-50 text-slate-750'
                    : notif.type === 'cancel'
                    ? 'bg-red-50/30 border-red-100/40 hover:bg-red-50/50 text-slate-750'
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-650'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[0.62rem] font-extrabold uppercase tracking-wider ${
                    notif.type === 'booking' ? 'text-[#5F7EF7]' : notif.type === 'cancel' ? 'text-red-500' : 'text-slate-450'
                  }`}>
                    {notif.type === 'booking' ? 'Booking Request' : notif.type === 'cancel' ? 'Cancelled Session' : 'System Alert'}
                  </span>
                  <span className="text-[0.65rem] text-slate-400 font-semibold">{notif.time}</span>
                </div>
                <p className="font-semibold text-slate-800 leading-snug">{notif.message}</p>
                {notif.appointment && (
                  <span className="block text-[0.68rem] text-slate-400 mt-2 font-medium">
                    Schedule: {notif.appointment.appointmentDate} • {notif.appointment.timeSlot}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`w-[280px] bg-[#EEF2FC] flex flex-col justify-between p-6 shrink-0 text-slate-800 border-r border-slate-200/50 fixed inset-y-0 left-0 z-40 transform md:relative md:translate-x-0 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Subtle decorative circles for a premium feel */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#5F7EF7]/5 rounded-full pointer-events-none" />
        
        <div className="space-y-10 relative z-10">
          {/* Logo / Brand */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#5F7EF7] flex items-center justify-center font-bold text-white text-[1.1rem] shadow-sm">
                L
              </div>
              <div>
                <span className="block font-sans text-[1.15rem] font-bold tracking-[0.03em] uppercase text-slate-800 leading-none">LUMINA</span>
                <span className="text-[0.6rem] text-slate-400 font-extrabold uppercase tracking-[0.12em] block mt-1">Doctor portal</span>
              </div>
            </div>
            
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 md:hidden bg-transparent border-none cursor-pointer"
              title="Close Menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveSubTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[0.88rem] font-semibold tracking-[0.02em] transition-all duration-200 border-none bg-transparent cursor-pointer ${
                activeSubTab === 'overview' 
                  ? 'bg-white text-[#5F7EF7] shadow-sm border border-slate-100/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Activity size={18} />
              Workspace Overview
            </button>
            <button
              onClick={() => {
                setActiveSubTab('appointments');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[0.88rem] font-semibold tracking-[0.02em] transition-all duration-200 border-none bg-transparent cursor-pointer ${
                activeSubTab === 'appointments' 
                  ? 'bg-white text-[#5F7EF7] shadow-sm border border-slate-100/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Calendar size={18} />
              My Appointments
            </button>
            <button
              onClick={() => {
                setActiveSubTab('patients');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[0.88rem] font-semibold tracking-[0.02em] transition-all duration-200 border-none bg-transparent cursor-pointer ${
                activeSubTab === 'patients' 
                  ? 'bg-white text-[#5F7EF7] shadow-sm border border-slate-100/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Users size={18} />
              Patient Records
            </button>
            <button
              onClick={() => {
                setActiveSubTab('profile');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[0.88rem] font-semibold tracking-[0.02em] transition-all duration-200 border-none bg-transparent cursor-pointer ${
                activeSubTab === 'profile' 
                  ? 'bg-white text-[#5F7EF7] shadow-sm border border-slate-100/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Settings size={18} />
              Doctor Profile
            </button>
          </nav>
        </div>

        {/* Upgrade Card & User Info */}
        <div className="relative z-10 mt-auto space-y-6 pt-6 border-t border-slate-200/50">
          
          {/* Upgrade to Pro Banner */}
          <div className="bg-gradient-to-tr from-[#5F7EF7]/5 to-[#5F7EF7]/10 border border-[#5F7EF7]/10 rounded-2xl p-4 text-slate-700 text-center shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#5F7EF7]/10 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-[0.82rem] font-extrabold tracking-wide uppercase text-slate-800">Upgrade to PRO</h4>
            <p className="text-[0.68rem] text-slate-500 leading-normal mt-1 mb-3.5">
              Unlock advanced patient metrics, automated prescriptions & priority clinic billing.
            </p>
            <button 
              onClick={() => window.showToast?.('PRO upgrade feature is coming soon!')}
              className="w-full bg-[#5F7EF7] hover:bg-[#4E6DF5] text-white font-bold text-[0.7rem] py-2 px-4 rounded-xl transition-all shadow-sm border-none cursor-pointer uppercase tracking-wider"
            >
              Upgrade Now
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-[#5F7EF7] text-[0.8rem] border border-slate-200/60 shadow-sm">
                {doctorInitials}
              </div>
              <div className="max-w-[120px]">
                <span className="block text-[0.82rem] font-bold text-slate-800 leading-tight truncate">{profile?.name || 'Doctor'}</span>
                <span className="block text-[0.65rem] text-slate-450 truncate mt-0.5">{profile?.specialization || 'Specialist'}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogoutClick}
              className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer p-1.5 rounded-lg hover:bg-white/60 transition-colors"
              title="Secure Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>

          <ConfirmModal
            isOpen={logoutConfirm.isOpen}
            title="Logout Confirmation"
            message="Are you sure you want to logout?"
            confirmText="Yes, Logout"
            cancelText="Cancel"
            onConfirm={confirmLogout}
            onCancel={cancelLogout}
          />
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen flex flex-col">
              {/* Top Header - inspired by Patient profile layout */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/40 relative">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1 text-slate-450 hover:text-slate-700 md:hidden bg-transparent border-none cursor-pointer"
              title="Open Menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-[1.65rem] font-bold text-[#1E293B] tracking-tight font-sans capitalize">
              {getSubTabTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notifications Trigger */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setUserMenuOpen(false);
                }}
                className="p-2 text-slate-450 hover:text-slate-700 bg-transparent border-none cursor-pointer relative"
                title="Notifications Panel"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </button>
            </div>

            {/* Profile Avatar Quick Menu dropdown */}
            <div className="relative">
              <div 
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-85 select-none"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-650 flex items-center justify-center font-bold text-[0.75rem] overflow-hidden border border-slate-100 shadow-sm">
                  {doctorInitials}
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-[20px] shadow-xl py-2 z-50 animate-fade-in text-[0.8rem] font-semibold text-slate-650">
                  <button
                    onClick={() => {
                      setActiveSubTab('profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 border-none bg-transparent cursor-pointer text-slate-700 font-semibold flex items-center gap-2"
                  >
                    <Settings size={14} className="text-slate-400" /> Settings Profile
                  </button>
                  <div className="border-t border-slate-100 my-1.5" />
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 border-none bg-transparent cursor-pointer font-bold flex items-center gap-2"
                  >
                    <LogOut size={14} /> Secure Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1">
          {/* Workspace Overview */}
          {activeSubTab === 'overview' && stats && (
            <DoctorOverview
              stats={stats}
              appointments={appointments}
              profile={profile}
              actionLoading={actionLoading}
              handleStatusUpdate={handleStatusUpdate}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {/* My Appointments */}
          {activeSubTab === 'appointments' && (
            <DoctorAppointments
              appointments={appointments}
              actionLoading={actionLoading}
              handleStatusUpdate={handleStatusUpdate}
            />
          )}

          {/* Patient Records */}
          {activeSubTab === 'patients' && (
            <PatientRecords
              appointments={appointments}
            />
          )}

          {/* Doctor Profile */}
          {activeSubTab === 'profile' && (
            <DoctorProfile
              profile={profile}
              token={token}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </div>

      </main>
    </div>
  );
}

export default DoctorDashboard;
