import React, { useState } from 'react';
import { Search } from 'lucide-react';

function AdminAppointments({ appointments }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAppointments = appointments.filter(appt => {
    const patientName = appt.userId?.name || 'Unknown Patient';
    const matchesSearch = patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          appt.treatmentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appt.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs font-sans">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Patient, Doctor, Treatment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-[0.85rem] text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['all', 'upcoming', 'approved', 'completed', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-[4px] text-[0.78rem] font-semibold uppercase tracking-[0.08em] transition-all cursor-pointer ${
                statusFilter === st 
                  ? 'bg-blue-600 text-slate-900 border-none' 
                  : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="bg-white border border-slate-200 rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[0.72rem] font-bold text-slate-500 uppercase tracking-[0.1em]">
                <th className="py-4 px-6">Patient</th>
                <th className="py-4 px-6">Treatment</th>
                <th className="py-4 px-6">Doctor Assigned</th>
                <th className="py-4 px-6">Date / Time Slot</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[0.85rem]">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">No appointments recorded.</td>
                </tr>
              ) : (
                filteredAppointments.map(appt => (
                  <tr key={appt._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <span className="block font-bold text-slate-900">{appt.userId?.name || 'Guest User'}</span>
                        <span className="block text-[0.72rem] text-slate-500">{appt.userId?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-250">
                      <div>
                        <span className="block font-semibold">{appt.treatmentName}</span>
                        <span className="block text-[0.72rem] text-slate-500">{appt.treatmentCategory}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium font-sans">
                      {appt.doctorName}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="block font-semibold text-blue-600">{appt.appointmentDate}</span>
                        <span className="block text-[0.72rem] text-slate-500">{appt.timeSlot}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="block font-semibold text-slate-600">{appt.price}</span>
                      <span className="inline-flex mt-1 text-[0.65rem] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
                        {appt.paymentMethod === 'Razorpay / Online Payment' ? 'ONLINE' : appt.paymentMethod || 'AT CLINIC'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[0.72rem] font-bold px-2 py-0.5 rounded uppercase ${
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAppointments;
