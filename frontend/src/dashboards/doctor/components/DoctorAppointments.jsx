import React, { useState } from 'react';
import { Search, Calendar, CheckCircle, Check, X } from 'lucide-react';

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
          <div className="apt-list-container">
            {filteredAppointments.map(appt => {
              const patientName = appt.userId?.name || 'Guest User';
              const patientInitials = patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

              return (
                <div key={appt._id} className="apt-card">
                  
                  {/* ─── HEADER: Patient + Status ─── */}
                  <div className="apt-card-header">
                    <div className="apt-card-doctor">
                      <div className="apt-avatar-wrap">
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff', color: '#5F7EF7', fontWeight: 'bold', fontSize: '14px' }}>
                          {patientInitials}
                        </div>
                      </div>
                      <div className="apt-doctor-info">
                        <span className="apt-doctor-name-text">{patientName}</span>
                        <span className="apt-doctor-spec">{appt.userId?.email || 'No email provided'}</span>
                      </div>
                    </div>
                    <span className={`apt-status-badge ${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </div>

                  {/* ─── BODY: Treatment | Schedule | Procedure Fee ─── */}
                  <div className="apt-card-body">
                    <div className="apt-body-cell">
                      <span className="apt-cell-label">Treatment</span>
                      <span className="apt-cell-value">{appt.treatmentName}</span>
                      <span className="apt-cell-sub">{appt.treatmentCategory}</span>
                    </div>
                    <div className="apt-body-cell">
                      <span className="apt-cell-label">Schedule</span>
                      <span className="apt-cell-value">{appt.appointmentDate}</span>
                      <span className="apt-cell-sub">{appt.timeSlot}</span>
                    </div>
                    <div className="apt-body-cell">
                      <span className="apt-cell-label">Procedure Fee</span>
                      <span className="apt-cell-value price-highlight">{appt.price || 'Standard Fee'}</span>
                      <span className="apt-cell-sub">
                        {appt.paymentMethod === 'Razorpay / Online Payment' ? 'Online' : appt.paymentMethod || 'Pay at Clinic'}
                      </span>
                    </div>
                  </div>

                  {/* ─── FOOTER: Location + Notes + Actions ─── */}
                  <div className="apt-card-footer">
                    <div className="apt-footer-meta">
                      <span className="apt-footer-item">
                        <svg className="apt-footer-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {appt.location || 'ClearDent — Clinic'}
                      </span>
                      {appt.notes && (
                        <span className="apt-footer-item">
                          <svg className="apt-footer-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          {appt.notes}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {appt.status === 'Upcoming' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appt._id, 'Approved')}
                            disabled={actionLoading}
                            className="cancel-btn-action"
                            style={{ background: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appt._id, 'Cancelled')}
                            disabled={actionLoading}
                            className="cancel-btn-action"
                            style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {appt.status === 'Approved' && (
                        <button
                          onClick={() => handleStatusUpdate(appt._id, 'Completed')}
                          disabled={actionLoading}
                          className="cancel-btn-action"
                          style={{ background: '#eff6ff', color: '#3b82f6', borderColor: '#bfdbfe' }}
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
