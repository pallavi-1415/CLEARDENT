import React, { useState } from 'react';
import { Search } from 'lucide-react';

function PatientsIndex({ patients }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(pat => 
    pat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pat.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-4">
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-[0.85rem] text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Patients Index */}
      <div className="bg-white border border-slate-200 rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[0.72rem] font-bold text-slate-500 uppercase tracking-[0.1em]">
                <th className="py-4 px-6">Patient Name</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Date of Birth</th>
                <th className="py-4 px-6">Date Joined</th>
                <th className="py-4 px-6 text-right">Appointments Booked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[0.85rem]">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">No registered patients.</td>
                </tr>
              ) : (
                filteredPatients.map(pat => (
                  <tr key={pat._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{pat.name}</td>
                    <td className="py-4 px-6 text-slate-600">{pat.email}</td>
                    <td className="py-4 px-6 text-slate-500">
                      {pat.dob ? new Date(pat.dob).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(pat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-blue-600 pr-8">
                      {pat.appointmentCount}
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

export default PatientsIndex;
