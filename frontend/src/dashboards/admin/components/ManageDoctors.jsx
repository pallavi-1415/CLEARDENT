import React, { useState } from 'react';
import { Search, CheckCircle, Clock, FileText } from 'lucide-react';
import { API_BASE_URL } from '../../../config';

function ManageDoctors({ doctors, actionLoading, handleApprove, handleReject }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'approved' && doc.isApproved) || 
                          (statusFilter === 'pending' && !doc.isApproved);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[4px] text-[0.85rem] text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {['all', 'approved', 'pending'].map(st => (
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

      {/* Doctors Table */}
      <div className="bg-white border border-slate-200 rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[0.72rem] font-bold text-slate-500 uppercase tracking-[0.1em]">
                <th className="py-4 px-6">Doctor Details</th>
                <th className="py-4 px-6">Specialization</th>
                <th className="py-4 px-6">Registered Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Medical License</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[0.85rem]">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">No doctors matching search criteria.</td>
                </tr>
              ) : (
                filteredDoctors.map(doc => (
                  <tr key={doc._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <span className="block font-bold text-slate-900 text-[0.9rem]">{doc.name}</span>
                        <span className="block text-[0.75rem] text-slate-500">{doc.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block text-[0.72rem] font-semibold text-blue-600 bg-blue-600/15 border border-blue-600/25 px-2.5 py-0.5 rounded">
                        {doc.specialization}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {doc.isApproved ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[0.75rem]">
                          <CheckCircle size={14} /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[0.75rem]">
                          <Clock size={14} className="animate-pulse" /> Pending approval
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {doc.licenseUrl ? (
                        <a
                          href={`${API_BASE_URL}${doc.licenseUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold text-[0.78rem]"
                        >
                          <FileText size={14} /> View File
                        </a>
                      ) : (
                        <span className="text-slate-500">None uploaded</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {!doc.isApproved && (
                        <button
                          onClick={() => handleApprove(doc._id)}
                          disabled={actionLoading}
                          className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-semibold text-[0.72rem] px-3 py-1.5 rounded border-none cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(doc._id)}
                        disabled={actionLoading}
                        className="bg-red-950/60 hover:bg-red-900 border border-red-500/35 text-red-200 font-semibold text-[0.72rem] px-3 py-1.5 rounded cursor-pointer"
                      >
                        Remove
                      </button>
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

export default ManageDoctors;
