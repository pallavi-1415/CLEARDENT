import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';

function DoctorAppointments({ appointments, actionLoading, handleStatusUpdate }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments.filter(appt => {
    const patientName = appt.userId?.name || 'Unknown Patient';
    const matchesSearch = patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appt.treatmentName.toLowerCase().includes(searchQuery.toLowerCase());
                          
    let matchesStatus = false;
    if (statusFilter === 'all') matchesStatus = true;
    else if (statusFilter === 'pending') matchesStatus = appt.status === 'Upcoming';
    else if (statusFilter === 'upcoming') matchesStatus = appt.status === 'Approved';
    else if (statusFilter === 'completed') matchesStatus = appt.status === 'Completed';
    else if (statusFilter === 'cancelled') matchesStatus = appt.status === 'Cancelled' || appt.status === 'Declined';
    else matchesStatus = appt.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
        
        {/* Search Field */}
        <div className="relative w-full md:max-w-xs">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient or treatment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-5 py-3 bg-slate-50/70 border border-slate-200/70 rounded-full text-[0.88rem] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5F7EF7] focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
          {['all', 'pending', 'upcoming', 'completed', 'cancelled'].map(st => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-6 py-2.5 rounded-full text-[0.75rem] font-bold uppercase tracking-wider transition-all border cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#5F7EF7] text-white border-[#5F7EF7] shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-450 hover:text-slate-705 hover:border-slate-350'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

      </div>

      {/* Appointments Container */}
      <div className="mt-4">
        {filteredAppointments.length === 0 ? (
          <div className="no-data-box text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Calendar size={24} />
              </div>
              <span className="font-bold text-[1.1rem] text-slate-700">No Appointments Found</span>
              <p className="text-[0.85rem] text-slate-450 mt-1 max-w-sm">No schedule entries match your search filters.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredAppointments.map(appt => {
              const patientName = appt.userId?.name || 'Guest User';
              const patientInitials = patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

              const statusBadgeClasses = {
                upcoming: 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]',
                approved: 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]',
                completed: 'bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]',
                cancelled: 'bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]',
                declined: 'bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]'
              };
              const badgeClass = statusBadgeClasses[appt.status.toLowerCase()] || 'bg-slate-100 text-slate-700 border border-slate-200';

              return (
                <div key={appt._id} className="bg-white border-[1.5px] border-slate-200 rounded-[20px] overflow-hidden transition-all duration-200 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:shadow-[0_6px_24px_rgba(15,23,42,0.08)] hover:-translate-y-[1px]">
                  
                  {/* ─── HEADER: Patient + Status ─── */}
                  <div className="flex items-center justify-between p-[18px_22px] border-b border-slate-100 bg-[#fafbfc] gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-[14px] overflow-hidden border-2 border-slate-200 shrink-0 bg-slate-100">
                        <div className="w-full h-full flex items-center justify-center bg-doctor-primary-light text-doctor-primary font-bold text-sm">
                          {patientInitials}
                        </div>
                      </div>
                      <div>
                        <span className="text-[0.97rem] font-bold text-slate-900 block leading-[1.2]">{patientName}</span>
                        <span className="text-[0.74rem] text-slate-500 font-medium block mt-0.75">{appt.userId?.email || 'No email provided'}</span>
                      </div>
                    </div>
                    <span className={`text-[0.68rem] font-extrabold uppercase tracking-[0.07em] py-1 px-3 rounded-full shrink-0 ${badgeClass}`}>
                      {appt.status}
                    </span>
                  </div>

                  {/* ─── BODY: Treatment | Schedule | Procedure Fee ─── */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-b border-slate-100">
                    <div className="p-[16px_22px] border-b border-[#f1f5f9] sm:border-b-0 sm:border-r sm:border-[#f1f5f9] last:border-none sm:last:border-none">
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-slate-400 block mb-1.25">Treatment</span>
                      <span className="text-[0.88rem] font-bold text-slate-900 block">{appt.treatmentName}</span>
                      <span className="text-[0.72rem] text-slate-500 font-medium block mt-0.5">{appt.treatmentCategory}</span>
                    </div>
                    <div className="p-[16px_22px] border-b border-[#f1f5f9] sm:border-b-0 sm:border-r sm:border-[#f1f5f9] last:border-none sm:last:border-none">
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-slate-400 block mb-1.25">Schedule</span>
                      <span className="text-[0.88rem] font-bold text-slate-900 block">{appt.appointmentDate}</span>
                      <span className="text-[0.72rem] text-slate-500 font-medium block mt-0.5">{appt.timeSlot}</span>
                    </div>
                    <div className="p-[16px_22px] border-b border-[#f1f5f9] sm:border-b-0 sm:border-r sm:border-[#f1f5f9] last:border-none sm:last:border-none">
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-slate-400 block mb-1.25">Procedure Fee</span>
                      <span className="text-[1rem] font-extrabold text-slate-900 block">{appt.price || 'Standard Fee'}</span>
                      <span className="text-[0.72rem] text-slate-500 font-medium block mt-0.5">
                        {appt.paymentMethod === 'Razorpay / Online Payment' ? 'Online' : appt.paymentMethod || 'Pay at Clinic'}
                      </span>
                    </div>
                  </div>

                  {/* ─── FOOTER: Location + Notes + Actions ─── */}
                  <div className="flex items-center justify-between p-[13px_22px] gap-4 flex-wrap">
                    <div className="flex items-center gap-4.5 flex-wrap">
                      <span className="flex items-center gap-1.25 text-[0.72rem] text-slate-500 font-medium">
                        <svg className="text-slate-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {appt.location || 'ClearDent — Clinic'}
                      </span>
                      {appt.notes && (
                        <span className="flex items-center gap-1.25 text-[0.72rem] text-slate-500 font-medium">
                          <svg className="text-slate-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          {appt.notes}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {appt.status === 'Upcoming' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appt._id, 'Approved')}
                            disabled={actionLoading}
                            className="h-8 px-3.5 rounded-lg inline-flex items-center gap-1.5 text-[0.72rem] font-bold whitespace-nowrap transition-all duration-200 border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appt._id, 'Cancelled')}
                            disabled={actionLoading}
                            className="h-8 px-3.5 rounded-lg inline-flex items-center gap-1.5 text-[0.72rem] font-bold whitespace-nowrap transition-all duration-200 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {appt.status === 'Approved' && (
                        <button
                          onClick={() => handleStatusUpdate(appt._id, 'Completed')}
                          disabled={actionLoading}
                          className="h-8 px-3.5 rounded-lg inline-flex items-center gap-1.5 text-[0.72rem] font-bold whitespace-nowrap transition-all duration-200 border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 cursor-pointer"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;
