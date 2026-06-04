import React, { useState } from 'react';
import { Search, Calendar, CheckCircle, Check, X } from 'lucide-react';

function DoctorAppointments({ appointments, actionLoading, handleStatusUpdate }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments.filter(appt => {
    const patientName = appt.userId?.name || 'Unknown Patient';
    const matchesSearch = patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appt.treatmentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appt.status.toLowerCase() === statusFilter.toLowerCase();
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
          {['all', 'upcoming', 'approved', 'cancelled'].map(st => {
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
      <div className="bg-white border border-slate-100 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-105 bg-slate-50/60 text-[0.72rem] font-extrabold text-slate-400 uppercase tracking-widest">
                <th className="py-5.5 px-8">Patient</th>
                <th className="py-5.5 px-8">Treatment</th>
                <th className="py-5.5 px-8">Schedule</th>
                <th className="py-5.5 px-8">Status</th>
                <th className="py-5.5 px-8">Notes</th>
                <th className="py-5.5 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[0.88rem]">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-24 text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <Calendar size={18} />
                      </div>
                      <span className="font-bold text-[0.92rem] text-slate-650">No Appointments Found</span>
                      <span className="text-[0.78rem] text-slate-400 mt-1">No schedule entries match your search filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(appt => {
                  const patientName = appt.userId?.name || 'Guest User';
                  const patientInitials = patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  
                  return (
                    <tr key={appt._id} className="hover:bg-slate-50/20 transition-colors">
                      
                      {/* Patient column with Initials Circle */}
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-[0.82rem] shrink-0 shadow-sm">
                            {patientInitials}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-800 leading-snug">{patientName}</span>
                            <span className="block text-[0.75rem] text-slate-400 font-medium mt-1">{appt.userId?.email || 'Guest Patient'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Treatment details */}
                      <td className="py-6 px-8 text-slate-800">
                        <div>
                          <span className="block font-semibold text-slate-850">{appt.treatmentName}</span>
                          <span className="block text-[0.75rem] text-slate-400 font-medium mt-1 capitalize">{appt.treatmentCategory}</span>
                        </div>
                      </td>

                      {/* Schedule info with clean coloring */}
                      <td className="py-6 px-8 text-slate-600">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-[#5F7EF7] text-[0.85rem]">{appt.appointmentDate}</span>
                          <span className="text-[0.75rem] text-slate-400 font-medium">{appt.timeSlot}</span>
                        </div>
                      </td>

                      {/* Custom styled pills - identical to the reference status capsule styles */}
                      <td className="py-6 px-8">
                        <span className={`inline-flex items-center text-[0.72rem] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border ${
                          appt.status === 'Upcoming' 
                            ? 'bg-amber-50 text-amber-600 border-amber-200/50' 
                            : appt.status === 'Approved' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-250/50'
                            : appt.status === 'Completed'
                              ? 'bg-blue-50 text-[#5F7EF7] border-blue-200/50'
                              : 'bg-red-50 text-red-500 border-red-200/50'
                        }`}>
                          {appt.status === 'Upcoming' 
                            ? 'Pending Approval' 
                            : appt.status === 'Approved' 
                              ? 'Approved' 
                              : appt.status === 'Completed' 
                                ? 'Completed' 
                                : 'Declined'}
                        </span>
                      </td>

                      {/* Patient notes summary */}
                      <td className="py-6 px-8 text-slate-450 italic max-w-[200px] truncate">
                        {appt.notes ? `"${appt.notes}"` : 'None'}
                      </td>

                      {/* Sleek action capsules */}
                      <td className="py-6 px-8 text-right">
                        {appt.status === 'Upcoming' && (
                          <div className="inline-flex gap-3">
                            <button
                              onClick={() => handleStatusUpdate(appt._id, 'Approved')}
                              disabled={actionLoading}
                              className="bg-emerald-50 text-emerald-700 border border-emerald-250/60 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-[0.72rem] font-bold uppercase px-5 py-2 rounded-full transition-all duration-200 cursor-pointer tracking-wider inline-flex items-center gap-1.5 shadow-sm"
                            >
                              <Check size={12} className="stroke-[2.5]" /> Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(appt._id, 'Cancelled')}
                              disabled={actionLoading}
                              className="bg-rose-50 text-rose-700 border border-rose-250/60 hover:bg-rose-500 hover:text-white hover:border-rose-500 text-[0.72rem] font-bold uppercase px-5 py-2 rounded-full transition-all duration-200 cursor-pointer tracking-wider inline-flex items-center gap-1.5 shadow-sm"
                            >
                              <X size={12} className="stroke-[2.5]" /> Decline
                            </button>
                          </div>
                        )}
                        {appt.status === 'Approved' && (
                          <button
                            onClick={() => handleStatusUpdate(appt._id, 'Completed')}
                            disabled={actionLoading}
                            className="bg-blue-50 text-blue-700 border border-blue-200/60 hover:bg-[#5F7EF7] hover:text-white hover:border-[#5F7EF7] text-[0.72rem] font-bold uppercase px-5 py-2 rounded-full transition-all duration-200 cursor-pointer tracking-wider inline-flex items-center gap-1.5 shadow-sm ml-auto"
                          >
                            <CheckCircle size={12} className="stroke-[2.5]" /> Mark Done
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointments;
