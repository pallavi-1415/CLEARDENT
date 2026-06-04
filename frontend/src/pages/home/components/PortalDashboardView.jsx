import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getMyAppointments, cancelAppointment } from '../../../services/appointments';
import {
  Calendar,
  User,
  Award,
  Trash2,
  ArrowLeft,
  Loader,
  Bell,
  X
} from 'lucide-react';
import ConfirmModal from '../../../components/ui/ConfirmModal';

/* Doctor images mapper to keep avatar cards uniform */
const DOCTOR_AVATARS = {
  'Dr. Sarah Jenkins': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
  'Dr. Serhii Kinash': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
  'Dr. Marcus Thorne': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80'
};

function PortalDashboardView({ setActiveTab, currentUser, portalSubTab, setPortalSubTab }) {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, aptId: null });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications_patient');
    return saved ? JSON.parse(saved) : [
      {
        id: 'default-patient-notif',
        type: 'system',
        message: 'EHR Profile successfully linked with Secure Lumina Network.',
        time: 'Yesterday'
      }
    ];
  });
  const [notifOpen, setNotifOpen] = useState(false);

  const currentTab = portalSubTab || 'appointments';

  // Fetch appointments from API
  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getMyAppointments(token);
      setAppointments(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load appointments. Make sure the database and backend are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = !!currentUser || !!localStorage.getItem('token');
    if (checkUser && (currentTab === 'appointments' || currentTab === 'notifications')) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, currentUser]);

  useEffect(() => {
    // Connect to backend socket server
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('🔌 Connected to patient real-time notification socket');
    });

    socket.on('appointmentCreated', (data) => {
      // Check if this is for the logged in patient
      const apptUserId = data.appointment && data.appointment.userId && (data.appointment.userId._id || data.appointment.userId);
      if (currentUser && apptUserId === currentUser.id) {
        const newNotif = {
          id: (data.appointment._id || Date.now().toString()) + '-' + Date.now(),
          type: 'booking',
          message: `You booked a new appointment with ${data.appointment.doctorName}.`,
          appointment: data.appointment,
          time: 'Just now'
        };
        setNotifications(prev => {
          const updated = [newNotif, ...prev];
          localStorage.setItem('notifications_patient', JSON.stringify(updated));
          return updated;
        });
        window.showToast?.(`Appointment booked with ${data.appointment.doctorName}`);
        fetchAppointments();
      }
    });

    socket.on('appointmentStatusUpdated', (data) => {
      // Check if this status update is for the logged in patient
      if (currentUser && data.appointment && data.appointment.userId === currentUser.id) {
        const status = data.appointment.status;
        const isApproved = status === 'Approved';
        const isCancelled = status === 'Cancelled';
        
        const newNotif = {
          id: (data.appointment._id || Date.now().toString()) + '-' + Date.now(),
          type: isApproved ? 'approved' : isCancelled ? 'cancelled' : 'update',
          message: data.message || `Your appointment status was updated to ${status}.`,
          appointment: data.appointment,
          time: 'Just now'
        };
        
        setNotifications(prev => {
          const updated = [newNotif, ...prev];
          localStorage.setItem('notifications_patient', JSON.stringify(updated));
          return updated;
        });
        
        if (isApproved) {
          window.showToast?.(`Appointment Approved: ${data.appointment.treatmentName}`);
        } else if (isCancelled) {
          window.showError?.(`Appointment Declined/Cancelled: ${data.appointment.treatmentName}`);
        } else {
          window.showToast?.(`Appointment update: ${status}`);
        }
        
        // Refresh appointment lists in real-time
        fetchAppointments();
      }
    });

    socket.on('availabilityUpdated', (data) => {
      const docName = data.doctorName || 'A doctor';
      const newNotif = {
        id: 'availability-' + data.doctorId + '-' + Date.now(),
        type: 'system',
        message: `${docName} updated their clinical availability. Check the booking page for new slots!`,
        time: 'Just now'
      };
      setNotifications(prev => {
        const updated = [newNotif, ...prev];
        localStorage.setItem('notifications_patient', JSON.stringify(updated));
        return updated;
      });
      window.showToast?.(`${docName} updated availability.`);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleCancelClick = (aptId) => {
    setConfirmDialog({ isOpen: true, aptId });
  };

  const handleCancelConfirm = async () => {
    const aptId = confirmDialog.aptId;
    setConfirmDialog({ isOpen: false, aptId: null });
    
    setActionLoading(true);
    const token = localStorage.getItem('token');
    try {
      await cancelAppointment(aptId, token);
      fetchAppointments();
      window.showToast?.('Appointment cancelled successfully.');
    } catch (err) {
      console.error(err);
      window.showError?.(err.message || 'Failed to cancel appointment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelAbort = () => {
    setConfirmDialog({ isOpen: false, aptId: null });
  };



  return (
    <>
      <style>{`
        .portal-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: 80vh;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          gap: 2rem;
          padding: 2rem;
          box-sizing: border-box;
        }
        @media (max-width: 900px) {
          .portal-layout { grid-template-columns: 1fr; padding: 1rem; }
        }

        /* ── SIDEBAR NAVIGATION ── */
        .portal-sidebar {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          height: fit-content;
          box-shadow: 0 4px 15px rgba(15,23,42,0.01);
        }
        @media (max-width: 900px) {
          .portal-sidebar { flex-direction: row; overflow-x: auto; scrollbar-width: none; }
        }
        .portal-sidebar-title {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
          font-weight: 700;
          padding: 6px 12px 12px;
        }
        @media (max-width: 900px) { .portal-sidebar-title { display: none; } }

        .sidebar-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #475569;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-family: inherit;
        }
        .sidebar-nav-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .sidebar-nav-btn.active {
          background: #0f172a;
          color: #ffffff;
        }
        .sidebar-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 12px 0;
        }
        @media (max-width: 900px) { .sidebar-divider { display: none; } }

        /* ── PORTAL VIEW CONTAINER ── */
        .portal-view-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(15,23,42,0.015);
          display: flex;
          flex-direction: column;
          min-height: 500px;
        }
        @media (max-width: 640px) { .portal-view-container { padding: 1.5rem; } }

        /* Welcome Section */
        .welcome-header {
          margin-bottom: 2rem;
        }
        .welcome-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }
        .welcome-subtitle {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        /* ── APPOINTMENT CARD (STRUCTURED CLEAN LAYOUT) ── */
        .apt-list-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Main Card Wrapper */
        .apt-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
        }
        .apt-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 6px 24px rgba(15,23,42,0.08);
          transform: translateY(-1px);
        }

        /* Card Top Row: Doctor info + Status badge */
        .apt-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbfc;
          gap: 16px;
        }
        .apt-card-doctor {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .apt-avatar-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
          flex-shrink: 0;
          background: #f1f5f9;
        }
        .apt-avatar-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .apt-doctor-info {}
        .apt-doctor-name-text {
          font-size: 0.97rem;
          font-weight: 700;
          color: #0f172a;
          display: block;
          line-height: 1.2;
        }
        .apt-doctor-spec {
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 500;
          display: block;
          margin-top: 3px;
        }

        /* Status Badge - top right */
        .apt-status-badge {
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          padding: 5px 12px;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .apt-status-badge.upcoming { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
        .apt-status-badge.approved { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .apt-status-badge.completed { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .apt-status-badge.cancelled { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

        /* Card Body: Treatment details + Date + Price in a structured row */
        .apt-card-body {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0;
          border-bottom: 1px solid #f1f5f9;
        }
        @media (max-width: 640px) {
          .apt-card-body { grid-template-columns: 1fr; }
        }

        .apt-body-cell {
          padding: 16px 22px;
          border-right: 1px solid #f1f5f9;
        }
        .apt-body-cell:last-child {
          border-right: none;
        }
        @media (max-width: 640px) {
          .apt-body-cell { border-right: none; border-bottom: 1px solid #f1f5f9; }
          .apt-body-cell:last-child { border-bottom: none; }
        }

        .apt-cell-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
          display: block;
          margin-bottom: 5px;
        }
        .apt-cell-value {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
          display: block;
        }
        .apt-cell-value.price-highlight {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
        }
        .apt-cell-sub {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 500;
          display: block;
          margin-top: 2px;
        }

        /* Card Footer: location, payment, actions */
        .apt-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 22px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .apt-footer-meta {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .apt-footer-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 500;
        }
        .apt-footer-icon {
          color: #94a3b8;
        }

        /* Cancel action button */
        .cancel-btn-action {
          background: transparent;
          border: 1.5px solid #fca5a5;
          color: #ef4444;
          height: 32px;
          padding: 0 14px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .cancel-btn-action:hover {
          background: #fef2f2;
          border-color: #ef4444;
        }

        /* ── PROFILE VIEW ── */
        .profile-card-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 768px) { .profile-card-layout { grid-template-columns: 1fr; } }
        
        .profile-field-box {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 14px;
          padding: 16px 20px;
        }
        .profile-field-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }
        .profile-field-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }

        .portal-helper-card {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-top: 1.5rem;
        }
        .helper-icon {
          color: #2563eb;
          margin-top: 2px;
        }
        .helper-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e3a8a;
          margin: 0 0 4px;
        }
        .helper-desc {
          font-size: 0.78rem;
          color: #2563eb;
          line-height: 1.5;
          margin: 0;
        }

        /* Loading / Error states */
        .portal-loader-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          gap: 12px;
          color: #64748b;
        }
        .portal-spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .no-data-box {
          text-align: center;
          padding: 3rem 1rem;
          border: 1.5px dashed #cbd5e1;
          border-radius: 18px;
          color: #64748b;
        }
        .no-data-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
        }
        .no-data-desc {
          font-size: 0.82rem;
          margin: 0 0 16px;
        }
        .book-cta-btn {
          border: none;
          background: #0f172a;
          color: white;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .book-cta-btn:hover {
          background: #1e293b;
        }
      `}</style>

      <ConfirmModal 
        isOpen={confirmDialog.isOpen}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this dental appointment?"
        confirmText="Yes, Cancel"
        cancelText="No, Keep It"
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelAbort}
      />

      {/* Patient Notifications Side Panel Drawer (Slides out like Windows notifications) */}
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
                localStorage.setItem('notifications_patient', JSON.stringify([]));
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
                You're all caught up! Real-time updates from doctors will appear here.
              </p>
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => {
                  if (notif.appointment) {
                    setPortalSubTab('appointments');
                  }
                  setNotifOpen(false);
                }}
                className={`p-4 rounded-2xl border text-[0.8rem] leading-normal transition-all hover:-translate-y-0.5 hover:shadow-xs cursor-pointer text-left ${
                  notif.type === 'approved' 
                    ? 'bg-emerald-50/40 border-emerald-100/60 hover:bg-emerald-50 text-slate-750'
                    : notif.type === 'cancelled'
                    ? 'bg-red-50/30 border-red-100/40 hover:bg-red-50/50 text-slate-750'
                    : notif.type === 'booking'
                    ? 'bg-blue-50/40 border-blue-100/60 hover:bg-blue-50 text-slate-750'
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-650'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[0.62rem] font-extrabold uppercase tracking-wider ${
                    notif.type === 'approved' ? 'text-emerald-600' : notif.type === 'cancelled' ? 'text-red-500' : notif.type === 'booking' ? 'text-[#5F7EF7]' : 'text-slate-450'
                  }`}>
                    {notif.type === 'approved' ? 'Approved' : notif.type === 'cancelled' ? 'Declined/Cancelled' : notif.type === 'booking' ? 'Booking' : 'EHR System'}
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

      <div className="portal-layout">
        
        {/* Left Sidebar */}
        <aside className="portal-sidebar">
          <span className="portal-sidebar-title">Menu Navigation</span>
          
          <button
            className={`sidebar-nav-btn${currentTab === 'appointments' ? ' active' : ''}`}
            onClick={() => setPortalSubTab('appointments')}
          >
            <Calendar size={16} />
            <span>Appointments</span>
          </button>
          
          <button
            className={`sidebar-nav-btn${currentTab === 'profile' ? ' active' : ''}`}
            onClick={() => setPortalSubTab('profile')}
          >
            <User size={16} />
            <span>My Profile</span>
          </button>

          <div className="sidebar-divider" />

          <button
            className="sidebar-nav-btn"
            onClick={() => setActiveTab('website')}
          >
            <ArrowLeft size={16} />
            <span>Clinic Website</span>
          </button>
        </aside>

        {/* Right Dashboard Window */}
        <main className="portal-view-container">
          
          {/* Header */}
          <header className="welcome-header" style={{ display: 'flex', justifyItems: 'center', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
            <div>
              <h1 className="welcome-title" style={{ margin: 0 }}>
                {currentTab === 'appointments' && 'Appointment History'}
                {currentTab === 'profile' && 'Patient Profile Details'}
              </h1>
              <p className="welcome-subtitle" style={{ margin: '4px 0 0' }}>
                {currentTab === 'appointments' && 'Manage your clinical appointments and view history details.'}
                {currentTab === 'profile' && 'Review your patient profile information stored in our secure EHR network.'}
              </p>
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={() => setNotifOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.2s'
                }}
                title="Notifications Drawer"
              >
                <Bell size={20} className="text-slate-500 hover:text-slate-800" />
                {notifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    border: '1.5px solid #ffffff'
                  }} />
                )}
              </button>
            </div>
          </header>



          {/* ── CASE 2: APPOINTMENT HISTORY ── */}
          {currentTab === 'appointments' && (
            <div>
              {loading ? (
                <div className="portal-loader-box">
                  <Loader className="portal-spinner" size={24} />
                  <span>Loading appointment history...</span>
                </div>
              ) : errorMsg ? (
                <div className="no-data-box" style={{ borderStyle: 'solid', borderColor: '#fca5a5', background: '#fef2f2' }}>
                  <span className="no-data-title" style={{ color: '#b91c1c' }}>Database Connection Offline</span>
                  <p className="no-data-desc">{errorMsg}</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="no-data-box">
                  <span className="no-data-title">No appointments found</span>
                  <p className="no-data-desc">You haven't booked any dental appointments yet.</p>
                  <button className="book-cta-btn" onClick={() => { setActiveTab('website'); window.location.hash = '#/services'; }}>
                    Book Your First Appointment
                  </button>
                </div>
              ) : (
                <div className="apt-list-container">
                  {appointments.map((apt) => {
                    const avatar = DOCTOR_AVATARS[apt.doctorName] || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80';
                    return (
                      <div key={apt._id} className="apt-card">

                        {/* ─── HEADER: Doctor + Status ─── */}
                        <div className="apt-card-header">
                          <div className="apt-card-doctor">
                            <div className="apt-avatar-wrap">
                              <img src={avatar} alt={apt.doctorName} />
                            </div>
                            <div className="apt-doctor-info">
                              <span className="apt-doctor-name-text">{apt.doctorName}</span>
                              <span className="apt-doctor-spec">{apt.treatmentCategory}</span>
                            </div>
                          </div>
                          <span className={`apt-status-badge ${apt.status.toLowerCase()}`}>
                            {apt.status}
                          </span>
                        </div>

                        {/* ─── BODY: Treatment | Schedule | Price ─── */}
                        <div className="apt-card-body">
                          <div className="apt-body-cell">
                            <span className="apt-cell-label">Treatment</span>
                            <span className="apt-cell-value">{apt.treatmentName}</span>
                            <span className="apt-cell-sub">{apt.treatmentCategory}</span>
                          </div>
                          <div className="apt-body-cell">
                            <span className="apt-cell-label">Schedule</span>
                            <span className="apt-cell-value">{apt.appointmentDate}</span>
                            <span className="apt-cell-sub">{apt.timeSlot}</span>
                          </div>
                          <div className="apt-body-cell">
                            <span className="apt-cell-label">Procedure Fee</span>
                            <span className="apt-cell-value price-highlight">{apt.price}</span>
                            <span className="apt-cell-sub">{apt.paymentMethod || 'Pay at Clinic'}</span>
                          </div>
                        </div>

                        {/* ─── FOOTER: Location + Notes + Cancel ─── */}
                        <div className="apt-card-footer">
                          <div className="apt-footer-meta">
                            {apt.location && (
                              <span className="apt-footer-item">
                                <svg className="apt-footer-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                {apt.location}
                              </span>
                            )}
                            {apt.notes && (
                              <span className="apt-footer-item">
                                <svg className="apt-footer-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                {apt.notes.length > 50 ? apt.notes.substring(0, 50) + '...' : apt.notes}
                              </span>
                            )}
                          </div>
                          {apt.status === 'Upcoming' && (
                            <button
                              className="cancel-btn-action"
                              onClick={() => handleCancelClick(apt._id)}
                              disabled={actionLoading}
                              title="Cancel Appointment"
                            >
                              <Trash2 size={13} />
                              Cancel
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── CASE 3: PATIENT PROFILE ── */}
          {currentTab === 'profile' && (
            <div>
              <div className="profile-card-layout">
                <div className="profile-field-box">
                  <div className="profile-field-label">Full Name</div>
                  <div className="profile-field-val">{currentUser?.name || 'Alex Mercer'}</div>
                </div>

                <div className="profile-field-box">
                  <div className="profile-field-label">Email Address</div>
                  <div className="profile-field-val">{currentUser?.email || 'alex.mercer@gmail.com'}</div>
                </div>

                <div className="profile-field-box">
                  <div className="profile-field-label">Date of Birth</div>
                  <div className="profile-field-val">
                    {currentUser?.dob
                      ? new Date(currentUser.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'October 14, 1994'}
                  </div>
                </div>

                <div className="profile-field-box">
                  <div className="profile-field-label">Care Account Tier</div>
                  <div className="profile-field-val" style={{ color: '#f97316' }}>Premium VIP Member</div>
                </div>
              </div>

              <div className="portal-helper-card">
                <Award className="helper-icon" size={20} />
                <div>
                  <h4 className="helper-title">Membership Rewards Activated</h4>
                  <p className="helper-desc">
                    Your ClearDent VIP profile grants you 10% off orthodontic reviews, free digital 3D Smile alignments, and priority scheduling fast-track support.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default PortalDashboardView;
