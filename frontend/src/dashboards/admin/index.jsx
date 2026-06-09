import React, { useState, useRef } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  LogOut, 
  Home, 
  Activity, 
  Loader2
} from 'lucide-react';
import { 
  getAdminStats, 
  getAllDoctors, 
  approveDoctor, 
  rejectDoctor, 
  getAllPatients, 
  getAllAppointmentsAdmin 
} from '../../services/admin';
import { usePolling } from '../../hooks/usePolling';
import ConfirmModal from '../../components/ui/ConfirmModal';

// Sub-components
import AdminOverview from './components/AdminOverview';
import ManageDoctors from './components/ManageDoctors';
import PatientsIndex from './components/PatientsIndex';
import AdminAppointments from './components/AdminAppointments';

function AdminDashboard({ navigate, currentUser, onLogout }) {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview', 'doctors', 'patients', 'appointments'
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, docId: null });
  const [logoutConfirm, setLogoutConfirm] = useState({ isOpen: false });
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
  const token = localStorage.getItem('token');
  const isFirstLoad = useRef(true);

  const loadData = async () => {
    if (!token) {
      navigate('login');
      return;
    }
    const silent = !isFirstLoad.current;
    if (!silent) setLoading(true);
    try {
      const [statsData, doctorsData, patientsData, apptsData] = await Promise.all([
        getAdminStats(token),
        getAllDoctors(token),
        getAllPatients(token),
        getAllAppointmentsAdmin(token)
      ]);
      setStats(statsData);
      setDoctors(doctorsData);
      setPatients(patientsData);
      setAppointments(apptsData);
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

  const handleApproveClick = (id) => {
    setConfirmDialog({ isOpen: true, type: 'approve', docId: id });
  };

  const handleRejectClick = (id) => {
    setConfirmDialog({ isOpen: true, type: 'reject', docId: id });
  };

  const handleConfirmAction = async () => {
    const { type, docId } = confirmDialog;
    setConfirmDialog({ isOpen: false, type: null, docId: null });

    if (!docId || !type) return;

    setActionLoading(true);
    try {
      if (type === 'approve') {
        await approveDoctor(docId, token);
        window.showToast?.('Doctor approved successfully!');
      } else if (type === 'reject') {
        await rejectDoctor(docId, token);
        window.showToast?.('Doctor registration rejected/deleted');
      }
      
      // Reload immediately
      const [statsData, doctorsData] = await Promise.all([
        getAdminStats(token),
        getAllDoctors(token)
      ]);
      setStats(statsData);
      setDoctors(doctorsData);
    } catch (err) {
      window.showError?.(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelAction = () => {
    setConfirmDialog({ isOpen: false, type: null, docId: null });
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[0.9rem] font-sans tracking-[0.05em] uppercase text-slate-500">Loading Secure Admin Environment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans overflow-x-hidden">
      
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'approve' ? 'Approve Doctor' : 'Reject Doctor'}
        message={
          confirmDialog.type === 'approve'
            ? 'Are you sure you want to approve this doctor?'
            : 'Are you sure you want to reject/delete this doctor registration?'
        }
        confirmText={confirmDialog.type === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col justify-between p-6 shrink-0 shadow-sm">
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-serif font-bold text-slate-900 text-[1rem] tracking-[0.05em] shadow-sm">C</div>
            <div>
              <span className="block font-serif text-[1rem] font-semibold tracking-[0.1em] uppercase text-slate-900 leading-none">ClearDent</span>
              <span className="text-[0.62rem] text-blue-700 font-bold uppercase tracking-[0.15em]">Admin Control</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[0.88rem] font-semibold tracking-[0.02em] transition-all duration-200 ${
                activeSubTab === 'overview' 
                  ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600 pl-[14px]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Activity size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveSubTab('doctors')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-[8px] text-[0.88rem] font-semibold tracking-[0.02em] transition-all duration-200 ${
                activeSubTab === 'doctors' 
                  ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600 pl-[14px]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck size={18} />
                Manage Doctors
              </div>
              {stats?.pendingDoctors > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold text-[0.68rem] px-2 py-0.5 rounded-full">
                  {stats.pendingDoctors}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSubTab('patients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[0.88rem] font-semibold tracking-[0.02em] transition-all duration-200 ${
                activeSubTab === 'patients' 
                  ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600 pl-[14px]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Users size={18} />
              Patients Index
            </button>
            <button
              onClick={() => setActiveSubTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[0.88rem] font-semibold tracking-[0.02em] transition-all duration-200 ${
                activeSubTab === 'appointments' 
                  ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600 pl-[14px]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Calendar size={18} />
              Appointments
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="border-t border-slate-200 pt-6 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-600">
              AD
            </div>
            <div>
              <span className="block text-[0.85rem] font-bold text-slate-900 leading-tight">{currentUser?.name || 'Administrator'}</span>
              <span className="block text-[0.7rem] text-slate-500 truncate">{currentUser?.email || 'admin@cleardent.com'}</span>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[0.85rem] font-semibold tracking-[0.02em] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 border-none bg-transparent cursor-pointer"
          >
            <LogOut size={16} />
            Secure Sign Out
          </button>
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
      <main className="flex-1 p-10 overflow-y-auto max-h-screen">
        
        {/* Top Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-blue-700">ClearDent Medical Control Center</span>
            <h1 className="font-serif text-[1.85rem] font-light text-slate-900 tracking-[0.02em] capitalize mt-1">
              Admin {activeSubTab}
            </h1>
          </div>
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-[0.82rem] font-bold tracking-[0.1em] uppercase bg-slate-50 hover:bg-[#1E293B] text-slate-600 hover:text-slate-900 px-4 py-2 rounded-[4px] border border-slate-200 transition-colors"
          >
            <Home size={15} />
            Go to Site
          </button>
        </header>

        {/* Overview Tab */}
        {activeSubTab === 'overview' && stats && (
          <AdminOverview
            stats={stats}
            doctors={doctors}
            appointments={appointments}
            actionLoading={actionLoading}
            handleApprove={handleApproveClick}
            handleReject={handleRejectClick}
            setActiveSubTab={setActiveSubTab}
          />
        )}

        {/* Manage Doctors Tab */}
        {activeSubTab === 'doctors' && (
          <ManageDoctors
            doctors={doctors}
            actionLoading={actionLoading}
            handleApprove={handleApproveClick}
            handleReject={handleRejectClick}
          />
        )}

        {/* Patients Index Tab */}
        {activeSubTab === 'patients' && (
          <PatientsIndex
            patients={patients}
          />
        )}

        {/* Appointments Tab */}
        {activeSubTab === 'appointments' && (
          <AdminAppointments
            appointments={appointments}
          />
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;
