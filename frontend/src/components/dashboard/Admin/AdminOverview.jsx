import React from 'react';
import { Users, UserCheck, FileCheck, Clock, CheckCircle, FileText, Check, X } from 'lucide-react';

function AdminOverview({ stats, doctors, appointments, actionLoading, handleApprove, handleReject, setActiveSubTab }) {
  const pendingDoctors = doctors.filter(d => !d.isApproved);

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-[12px] p-6 flex items-center justify-between">
          <div>
            <span className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-[0.08em]">Total Patients</span>
            <span className="block font-serif text-[1.8rem] font-normal text-slate-900 mt-1">{stats.totalPatients}</span>
          </div>
          <div className="w-12 h-12 rounded-[10px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[12px] p-6 flex items-center justify-between">
          <div>
            <span className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-[0.08em]">Approved Doctors</span>
            <span className="block font-serif text-[1.8rem] font-normal text-slate-900 mt-1">{stats.totalDoctors}</span>
          </div>
          <div className="w-12 h-12 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[12px] p-6 flex items-center justify-between">
          <div>
            <span className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-[0.08em]">Pending Approvals</span>
            <span className="block font-serif text-[1.8rem] font-normal text-amber-400 mt-1">{stats.pendingDoctors}</span>
          </div>
          <div className="w-12 h-12 rounded-[10px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 animate-pulse">
            <FileCheck size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[12px] p-6 flex items-center justify-between">
          <div>
            <span className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-[0.08em]">Today's Bookings</span>
            <span className="block font-serif text-[1.8rem] font-normal text-blue-600 mt-1">{stats.todayAppointments}</span>
          </div>
          <div className="w-12 h-12 rounded-[10px] bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Main Action Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Doctors Review Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[16px] p-6">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
            <h3 className="font-serif text-[1.1rem] font-light text-slate-900">Pending Specialists Review</h3>
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[0.7rem] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded">
              Requires Verification
            </span>
          </div>

          {pendingDoctors.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="mx-auto text-emerald-500 mb-3" size={32} />
              <p className="text-[0.85rem] text-slate-500">All registered specialist applications are approved.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingDoctors.map(doc => (
                <div key={doc._id} className="bg-slate-50 border border-slate-200 rounded-[8px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-[0.95rem] font-bold text-slate-900">{doc.name}</h4>
                    <span className="inline-block text-[0.7rem] font-semibold text-blue-600 bg-blue-600/10 border border-blue-600/20 px-2 py-0.5 rounded">
                      {doc.specialization}
                    </span>
                    <span className="block text-[0.75rem] text-slate-500">{doc.email}</span>
                    <span className="block text-[0.72rem] text-slate-500">Registered on: {new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {doc.licenseUrl && (
                      <a 
                        href={`http://localhost:5000${doc.licenseUrl}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-blue-400 hover:text-blue-300 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer"
                      >
                        <FileText size={14} />
                        View License
                      </a>
                    )}
                    <button
                      onClick={() => handleApprove(doc._id)}
                      disabled={actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-semibold text-[0.75rem] px-3.5 py-1.5 rounded-[4px] transition-colors border-none cursor-pointer flex items-center gap-1"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(doc._id)}
                      disabled={actionLoading}
                      className="bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-200 font-semibold text-[0.75rem] px-3.5 py-1.5 rounded-[4px] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings Snapshot */}
        <div className="bg-white border border-slate-200 rounded-[16px] p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-[1.1rem] font-light text-slate-900 mb-6 border-b border-slate-200 pb-4">
              Latest Appointments
            </h3>
            
            {appointments.length === 0 ? (
              <p className="text-[0.82rem] text-slate-500 text-center py-6">No appointments booked yet.</p>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 4).map(appt => (
                  <div key={appt._id} className="flex items-start justify-between text-[0.8rem] border-b border-slate-200/40 pb-3 last:border-0 last:pb-0">
                    <div>
                      <span className="block font-bold text-slate-900">{appt.userId?.name || 'Guest Patient'}</span>
                      <span className="block text-slate-500 text-[0.72rem] mt-0.5">{appt.treatmentName}</span>
                      <span className="block text-slate-500 text-[0.68rem]">{appt.doctorName}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-semibold text-blue-600">{appt.appointmentDate}</span>
                      <span className="block text-slate-500 text-[0.72rem]">{appt.timeSlot}</span>
                      <span className={`inline-block text-[0.6rem] font-bold px-1.5 py-0.5 rounded mt-1 uppercase ${
                        appt.status === 'Upcoming' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : appt.status === 'Approved' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : appt.status === 'Completed' 
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => setActiveSubTab('appointments')}
            className="w-full text-center text-blue-600 hover:text-slate-900 text-[0.8rem] font-bold uppercase tracking-[0.1em] border border-slate-200 hover:border-blue-600/40 py-2.5 rounded-[4px] transition-all bg-transparent mt-6 cursor-pointer"
          >
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
