import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getMyAppointments, cancelAppointment } from '../../services/appointments';
import { API_BASE_URL } from '../../config';
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
import ConfirmModal from '../../components/ui/ConfirmModal';

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
        message: 'EHR Profile successfully linked with Secure ClearDent Network.',
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
    const socket = io(API_BASE_URL);

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

      <div className="grid grid-cols-[260px_1fr] min-h-[80vh] w-full max-w-[1300px] mx-auto gap-8 p-8 box-border max-[900px]:grid-cols-1 max-[900px]:p-4">
        
        {/* Left Sidebar */}
        <aside className="bg-white border border-slate-200 rounded-[20px] p-6 flex flex-col gap-1.5 h-fit shadow-[0_4px_15px_rgba(15,23,42,0.01)] max-[900px]:flex-row max-[900px]:overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[0.72rem] uppercase tracking-[0.08em] text-[#94a3b8] font-bold px-3 pt-1.5 pb-3 max-[900px]:hidden">Menu Navigation</span>
          
          <button
            className={`flex items-center gap-3 px-4 py-3 border-none text-[0.88rem] font-semibold rounded-xl cursor-pointer transition-all duration-200 text-left hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap shrink-0 ${
              currentTab === 'appointments' ? 'bg-slate-900 text-white' : 'bg-transparent text-[#475569]'
            }`}
            onClick={() => setPortalSubTab('appointments')}
          >
            <Calendar size={16} />
            <span>Appointments</span>
          </button>
          
          <button
            className={`flex items-center gap-3 px-4 py-3 border-none text-[0.88rem] font-semibold rounded-xl cursor-pointer transition-all duration-200 text-left hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap shrink-0 ${
              currentTab === 'profile' ? 'bg-slate-900 text-white' : 'bg-transparent text-[#475569]'
            }`}
            onClick={() => setPortalSubTab('profile')}
          >
            <User size={16} />
            <span>My Profile</span>
          </button>

          <div className="h-[1px] bg-slate-200 my-3 max-[900px]:hidden" />

          <button
            className="flex items-center gap-3 px-4 py-3 border-none bg-transparent text-[#475569] text-[0.88rem] font-semibold rounded-xl cursor-pointer transition-all duration-200 text-left hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap shrink-0"
            onClick={() => setActiveTab('website')}
          >
            <ArrowLeft size={16} />
            <span>Clinic Website</span>
          </button>
        </aside>

        {/* Right Dashboard Window */}
        <main className="bg-white border border-slate-200 rounded-[24px] p-10 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col min-h-[500px] max-[640px]:p-6">
          
          {/* Header */}
          <header className="flex justify-between items-center border-b border-[#f1f5f9] pb-4 mb-6">
            <div>
              <h1 className="text-[1.6rem] font-extrabold text-slate-900 m-0 mb-1.5 tracking-[-0.02em]">
                {currentTab === 'appointments' && 'Appointment History'}
                {currentTab === 'profile' && 'Patient Profile Details'}
              </h1>
              <p className="text-[0.88rem] text-slate-500 m-0 mt-1 leading-[1.5]">
                {currentTab === 'appointments' && 'Manage your clinical appointments and view history details.'}
                {currentTab === 'profile' && 'Review your patient profile information stored in our secure EHR network.'}
              </p>
            </div>

            {/* Notification Bell */}
            <div className="relative flex items-center">
              <button 
                onClick={() => setNotifOpen(true)}
                className="bg-transparent border-none cursor-pointer p-2 relative flex items-center justify-center rounded-full transition-all duration-200"
                title="Notifications Drawer"
              >
                <Bell size={20} className="text-slate-500 hover:text-slate-800" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white" />
                )}
              </button>
            </div>
          </header>



          {/* ── CASE 2: APPOINTMENT HISTORY ── */}
          {currentTab === 'appointments' && (
            <div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
                  <Loader className="animate-spin" size={24} />
                  <span>Loading appointment history...</span>
                </div>
              ) : errorMsg ? (
                <div className="text-center px-4 py-12 border-[1.5px] border-solid border-red-300 rounded-[18px] text-red-500 bg-red-50">
                  <span className="text-[1.05rem] font-bold text-red-900 m-0 mb-1.5 block">Database Connection Offline</span>
                  <p className="text-[0.82rem] m-0 mb-4">{errorMsg}</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center px-4 py-12 border-[1.5px] border-dashed border-slate-300 rounded-[18px] text-slate-500">
                  <span className="text-[1.05rem] font-bold text-slate-900 m-0 mb-1.5 block">No appointments found</span>
                  <p className="text-[0.82rem] m-0 mb-4">You haven't booked any dental appointments yet.</p>
                  <button className="border-none bg-slate-900 text-white text-[0.8rem] font-bold px-5 py-2.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-slate-800" onClick={() => { setActiveTab('website'); window.location.hash = '#/services'; }}>
                    Book Your First Appointment
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {appointments.map((apt) => {
                    const avatar = DOCTOR_AVATARS[apt.doctorName] || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80';
                    
                    let badgeColorClasses = "";
                    if (apt.status === "Upcoming") badgeColorClasses = "bg-amber-50 text-amber-800 border border-amber-200";
                    else if (apt.status === "Approved") badgeColorClasses = "bg-emerald-50 text-emerald-700 border border-emerald-200";
                    else if (apt.status === "Completed") badgeColorClasses = "bg-blue-50 text-blue-700 border border-blue-200";
                    else if (apt.status === "Cancelled") badgeColorClasses = "bg-red-50 text-red-700 border border-red-200";

                    return (
                      <div key={apt._id} className="bg-white border-[1.5px] border-slate-200 rounded-[20px] overflow-hidden transition-all duration-200 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-[#cbd5e1] hover:shadow-[0_6px_24px_rgba(15,23,42,0.08)] hover:-translate-y-[1px]">

                        {/* ─── HEADER: Doctor + Status ─── */}
                        <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-slate-100 bg-[#fafbfc] gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-[14px] overflow-hidden border-2 border-slate-200 shrink-0 bg-slate-100">
                              <img src={avatar} alt={apt.doctorName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="text-[0.97rem] font-bold text-slate-900 block leading-[1.2]">{apt.doctorName}</span>
                              <span className="text-[0.74rem] text-slate-500 font-medium block mt-[3px]">{apt.treatmentCategory}</span>
                            </div>
                          </div>
                          <span className={`text-[0.68rem] font-extrabold uppercase tracking-[0.07em] px-3 py-1.5 rounded-full shrink-0 ${badgeColorClasses}`}>
                            {apt.status}
                          </span>
                        </div>

                        {/* ─── BODY: Treatment | Schedule | Price ─── */}
                        <div className="grid grid-cols-3 gap-0 border-b border-slate-100 max-[640px]:grid-cols-1">
                          <div className="px-[22px] py-[16px] border-r border-slate-100 last:border-r-0 max-[640px]:border-r-0 max-[640px]:border-b max-[640px]:border-slate-100 max-[640px]:last:border-b-0">
                            <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#94a3b8] block mb-1.25">Treatment</span>
                            <span className="text-[0.88rem] font-bold text-slate-900 block">{apt.treatmentName}</span>
                            <span className="text-[0.72rem] text-slate-500 font-medium block mt-0.5">{apt.treatmentCategory}</span>
                          </div>
                          <div className="px-[22px] py-[16px] border-r border-slate-100 last:border-r-0 max-[640px]:border-r-0 max-[640px]:border-b max-[640px]:border-slate-100 max-[640px]:last:border-b-0">
                            <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#94a3b8] block mb-1.25">Schedule</span>
                            <span className="text-[0.88rem] font-bold text-slate-900 block">{apt.appointmentDate}</span>
                            <span className="text-[0.72rem] text-slate-500 font-medium block mt-0.5">{apt.timeSlot}</span>
                          </div>
                          <div className="px-[22px] py-[16px] border-r border-slate-100 last:border-r-0 max-[640px]:border-r-0 max-[640px]:border-b max-[640px]:border-slate-100 max-[640px]:last:border-b-0">
                            <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#94a3b8] block mb-1.25">Procedure Fee</span>
                            <span className="text-[1rem] font-extrabold text-slate-900 block">{apt.price}</span>
                            <span className="text-[0.72rem] text-slate-500 font-medium block mt-0.5">{apt.paymentMethod === 'Razorpay / Online Payment' ? 'Online' : apt.paymentMethod || 'Pay at Clinic'}</span>
                          </div>
                        </div>

                        {/* ─── FOOTER: Location + Notes + Cancel ─── */}
                        <div className="flex items-center justify-between px-[22px] py-[13px] gap-4 flex-wrap">
                          <div className="flex items-center gap-4.5 flex-wrap">
                            {apt.location && (
                              <span className="flex items-center gap-1.25 text-[0.72rem] text-slate-500 font-medium">
                                <svg className="text-slate-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                {apt.location}
                              </span>
                            )}
                            {apt.notes && (
                              <span className="flex items-center gap-1.25 text-[0.72rem] text-slate-500 font-medium">
                                <svg className="text-slate-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                {apt.notes.length > 50 ? apt.notes.substring(0, 50) + '...' : apt.notes}
                              </span>
                            )}
                          </div>
                          {apt.status === 'Upcoming' && (
                            <button
                              className="bg-transparent border-[1.5px] border-red-300 text-[#ef4444] h-8 px-3.5 rounded-lg inline-flex items-center gap-1.5 text-[0.72rem] font-bold cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-red-50 hover:border-red-500"
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
              <div className="grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
                <div className="border border-slate-200 bg-slate-50 rounded-[14px] px-5 py-4">
                  <div className="text-[0.72rem] font-bold text-[#94a3b8] uppercase tracking-[0.06em] mb-1">Full Name</div>
                  <div className="text-[0.95rem] font-bold text-slate-900">{currentUser?.name || 'Alex Mercer'}</div>
                </div>

                <div className="border border-slate-200 bg-slate-50 rounded-[14px] px-5 py-4">
                  <div className="text-[0.72rem] font-bold text-[#94a3b8] uppercase tracking-[0.06em] mb-1">Email Address</div>
                  <div className="text-[0.95rem] font-bold text-slate-900">{currentUser?.email || 'alex.mercer@gmail.com'}</div>
                </div>

                <div className="border border-slate-200 bg-slate-50 rounded-[14px] px-5 py-4">
                  <div className="text-[0.72rem] font-bold text-[#94a3b8] uppercase tracking-[0.06em] mb-1">Date of Birth</div>
                  <div className="text-[0.95rem] font-bold text-slate-900">
                    {currentUser?.dob
                      ? new Date(currentUser.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'October 14, 1994'}
                  </div>
                </div>

                <div className="border border-slate-200 bg-slate-50 rounded-[14px] px-5 py-4">
                  <div className="text-[0.72rem] font-bold text-[#94a3b8] uppercase tracking-[0.06em] mb-1">Care Account Tier</div>
                  <div className="text-[0.95rem] font-bold text-orange-500">Premium VIP Member</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-3.5 items-start mt-6">
                <Award className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <h4 className="text-[0.9rem] font-bold text-blue-900 m-0 mb-1">Membership Rewards Activated</h4>
                  <p className="text-[0.78rem] text-blue-600 leading-[1.5] m-0">
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
