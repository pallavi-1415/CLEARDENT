import React, { useState } from 'react';
import { Search, Mail, Clock } from 'lucide-react';

function PatientRecords({ appointments }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Group appointments by patient (userId)
  const patientsMap = {};
  appointments.forEach(appt => {
    const userId = appt.userId?._id || appt.userId?.email || 'guest';
    if (!patientsMap[userId]) {
      patientsMap[userId] = {
        id: userId,
        name: appt.userId?.name || 'Guest Patient',
        email: appt.userId?.email || 'N/A',
        dob: appt.userId?.dob ? new Date(appt.userId.dob).toLocaleDateString() : 'N/A',
        history: []
      };
    }
    patientsMap[userId].history.push(appt);
  });

  const patientsList = Object.values(patientsMap);

  const filteredPatients = patientsList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Search Bar & Stats */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-5 flex flex-col sm:flex-row gap-5 items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
        <div className="relative w-full sm:max-w-xs">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-5 py-3 bg-slate-50/70 border border-slate-200/70 rounded-full text-[0.88rem] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5F7EF7] focus:bg-white transition-all font-medium"
          />
        </div>
        <div className="text-[0.72rem] font-extrabold uppercase tracking-widest text-[#5F7EF7] bg-blue-50/50 border border-blue-100 px-4 py-2 rounded-full">
          Total Patients: {patientsList.length}
        </div>
      </div>

      {/* Patients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPatients.length === 0 ? (
          <div className="col-span-2 bg-white border border-slate-100 rounded-[28px] p-20 text-center text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Search size={18} />
            </div>
            <h4 className="font-bold text-[0.92rem] text-slate-700">No patients found</h4>
            <p className="text-[0.8rem] text-slate-455 mt-1">No patient records match your search filters.</p>
          </div>
        ) : (
          filteredPatients.map(patient => {
            const patientInitials = patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            return (
              <div key={patient.id} className="bg-white border border-slate-100 rounded-[28px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <div>
                  
                  {/* Patient Header Block */}
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100/60">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#5F7EF7] flex items-center justify-center font-bold text-[0.88rem] shrink-0 shadow-sm">
                      {patientInitials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-[1.05rem] leading-tight">{patient.name}</h3>
                      <span className="text-[0.72rem] text-slate-400 font-semibold flex items-center gap-1.5 mt-1.5">
                        <Mail size={12} className="inline text-slate-400" />
                        {patient.email}
                      </span>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="space-y-3 text-[0.85rem] text-slate-600">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-400 font-medium">Date of Birth:</span>
                      <span className="font-bold text-slate-800">{patient.dob}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-400 font-medium">Total Consultations:</span>
                      <span className="font-extrabold text-[#5F7EF7] bg-blue-50/70 border border-blue-100/50 px-2.5 py-0.5 rounded-full text-[0.7rem] uppercase tracking-wider">
                        {patient.history.length} {patient.history.length === 1 ? 'Visit' : 'Visits'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Consultation History Snippet */}
                <div className="pt-5 mt-5 border-t border-slate-100">
                  <span className="block text-[0.68rem] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Treatments</span>
                  
                  <div className="space-y-3">
                    {patient.history.slice(0, 2).map((appt, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[0.82rem] bg-slate-50/70 p-4 rounded-2xl border border-slate-100/60">
                        <div>
                          <span className="font-bold text-slate-800 block leading-tight">{appt.treatmentName}</span>
                          <span className="text-[0.72rem] text-slate-400 font-semibold block mt-1.5 flex items-center gap-1.5">
                            <Clock size={11} />
                            {appt.appointmentDate}
                          </span>
                        </div>
                        <span className={`h-fit text-[0.65rem] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                          appt.status === 'Completed' ? 'bg-blue-50 text-[#5F7EF7] border-blue-100' :
                          appt.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                          appt.status === 'Upcoming' ? 'bg-amber-50 text-amber-800 border-amber-100' : 'bg-red-50 text-red-800 border-red-100'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PatientRecords;
