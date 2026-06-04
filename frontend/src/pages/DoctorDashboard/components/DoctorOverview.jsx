import React from 'react';
import { Calendar, Clock, CheckCircle, Users, Check, X, Shield, Edit } from 'lucide-react';

function DoctorOverview({ stats, appointments, profile, actionLoading, handleStatusUpdate, setActiveSubTab }) {
  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');

  const doctorInitials = profile?.name
    ? profile.name.replace(/^Dr\.\s+/i, '').split(' ').pop().substring(0, 2).toUpperCase()
    : 'DR';

  return (
    <div className="space-y-8 animate-fade-in font-sans">

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Bookings Card */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div>
            <span className="block text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">Assigned Bookings</span>
            <span className="block text-[1.8rem] font-bold text-slate-800 tracking-tight mt-1">{stats.totalAppointments}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#5F7EF7] flex items-center justify-center">
            <Calendar size={20} />
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div>
            <span className="block text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <span className="block text-[1.8rem] font-bold text-[#5F7EF7] tracking-tight mt-1">{stats.upcoming}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5F7EF7] flex items-center justify-center">
            <Clock size={20} className="animate-[pulse_2s_infinite]" />
          </div>
        </div>

        {/* Approved Sessions Card */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div>
            <span className="block text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">Approved Sessions</span>
            <span className="block text-[1.8rem] font-bold text-slate-800 tracking-tight mt-1">{stats.approved}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
        </div>

        {/* Total Unique Patients Card */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div>
            <span className="block text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">Total Patients</span>
            <span className="block text-[1.8rem] font-bold text-slate-800 tracking-tight mt-1">{stats.uniquePatientsCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Split Row for Upcoming Consultations and Doctor Profile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Upcoming Consultations list */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-100">
              <h3 className="text-[1.1rem] font-bold text-slate-800 font-sans tracking-tight">Upcoming Consultations</h3>
              <span className="bg-[#FDEDEC] text-[#CB4335] text-[0.65rem] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                Requires action
              </span>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-350 mb-4 border border-slate-100">
                  <Calendar size={20} />
                </div>
                <h4 className="text-[0.92rem] font-bold text-slate-700">All caught up</h4>
                <p className="text-[0.8rem] text-slate-450 max-w-[220px] mt-1.5 leading-normal">Your upcoming schedule is clear.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {upcomingAppointments.slice(0, 4).map(appt => {
                  const patientInitials = appt.userId?.name
                    ? appt.userId.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'P';
                  return (
                    <div key={appt._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/80 rounded-2xl transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.01)]">

                      {/* Patient details block */}
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-blue-50/70 border border-blue-100 text-blue-600 flex items-center justify-center text-[0.85rem] font-bold shrink-0">
                          {patientInitials}
                        </div>
                        <div>
                          <h4 className="text-[0.95rem] font-bold text-slate-800 leading-tight">
                            {appt.userId?.name || 'Guest Patient'}
                          </h4>
                          <span className="text-[0.75rem] text-slate-400 font-semibold block mt-1.5">
                            {appt.treatmentName}
                          </span>
                        </div>
                      </div>

                      {/* Scheduled Date & Slot Capsule */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <span className="bg-indigo-50 border border-indigo-100 text-[#5F7EF7] text-[0.75rem] font-bold py-1.5 px-4 rounded-full flex items-center gap-1.5">
                          <Clock size={11} />
                          {appt.appointmentDate} • {appt.timeSlot}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleStatusUpdate(appt._id, 'Approved')}
                          disabled={actionLoading}
                          className="bg-emerald-50 text-emerald-700 border border-emerald-250/60 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-[0.72rem] font-extrabold uppercase px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer tracking-wider inline-flex items-center gap-2 shadow-sm"
                        >
                          <Check size={13} className="stroke-[2.5]" /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appt._id, 'Cancelled')}
                          disabled={actionLoading}
                          className="bg-rose-50 text-rose-700 border border-rose-250/60 hover:bg-rose-500 hover:text-white hover:border-rose-500 text-[0.72rem] font-extrabold uppercase px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer tracking-wider inline-flex items-center gap-2 shadow-sm"
                        >
                          <X size={13} className="stroke-[2.5]" /> Decline
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveSubTab('appointments')}
            className="w-full text-center text-slate-400 hover:text-slate-700 text-[0.72rem] font-extrabold uppercase tracking-widest border-t border-slate-100 pt-6 mt-6 bg-transparent border-none cursor-pointer"
          >
            View all appointments →
          </button>
        </div>

        {/* Right Column: Specialist Profile details card */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between items-center text-center">
          <div className="w-full">
            {/* Top Avatar section */}
            <div className="flex flex-col items-center pb-5 border-b border-slate-100/60">
              <div
                className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-[#5F7EF7] to-[#8FA4FF] flex items-center justify-center font-bold text-white text-[1.8rem] shadow-[0_10px_25px_rgba(95,126,247,0.15)] mb-4"
              >
                {doctorInitials}
              </div>
              <h4 className="text-[1.25rem] font-bold text-slate-800 tracking-tight leading-tight">{profile?.name}</h4>
              <span className="text-[0.75rem] text-[#5F7EF7] font-extrabold uppercase tracking-wider bg-blue-50/70 border border-blue-100/50 px-3.5 py-1 rounded-full mt-2.5">
                {profile?.specialization}
              </span>
              {profile?.phone && (
                <span className="block text-[0.8rem] font-bold text-[#5F7EF7] hover:text-[#4F6EF2] mt-3">
                  {profile.phone}
                </span>
              )}
              {profile?.email && (
                <span className="block text-[0.75rem] text-slate-450 mt-1">
                  {profile.email}
                </span>
              )}
            </div>

            {/* General Information lists */}
            <div className="w-full pt-5 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[0.78rem] font-bold text-slate-450 uppercase tracking-wide">General Info</span>
                <button
                  onClick={() => setActiveSubTab('profile')}
                  className="p-1 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit size={14} />
                </button>
              </div>

              <div className="space-y-3.5 text-[0.85rem]">
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100/70">
                  <span className="text-slate-400 font-medium">Role:</span>
                  <span className="font-semibold text-slate-800">Lead Specialist</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100/70">
                  <span className="text-slate-400 font-medium">Office:</span>
                  <span className="font-semibold text-slate-800">Room 104</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100/70">
                  <span className="text-slate-400 font-medium">Date of Birth:</span>
                  <span className="font-semibold text-slate-800">
                    {profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'Not configured'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Shield size={10} className="fill-emerald-100" /> Active Staff
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveSubTab('profile')}
            className="w-full text-center text-[#5F7EF7] hover:text-[#4F6EF2] text-[0.72rem] font-extrabold uppercase tracking-widest border border-slate-200 hover:border-[#5F7EF7]/55 py-3 rounded-full mt-6 transition-all bg-transparent cursor-pointer"
          >
            Edit profile settings
          </button>
        </div>

      </div>

    </div>
  );
}

export default DoctorOverview;

