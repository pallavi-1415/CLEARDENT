import React, { useState, useEffect } from 'react';
import { updateDoctorProfile } from '../../../services/doctor';
import { Settings, Shield, Check, AlertCircle, Edit, Clock, Calendar, Save, X } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function DoctorProfile({ profile, token, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'availability'
  const [selectedSchedDay, setSelectedSchedDay] = useState('Monday');
  const [startSlotTime, setStartSlotTime] = useState('');
  const [endSlotTime, setEndSlotTime] = useState('');

  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  
  const [availability, setAvailability] = useState(() => {
    const initial = {};
    DAYS_OF_WEEK.forEach(day => {
      initial[day] = [];
    });
    return initial;
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Sync state with incoming profile when not editing
  useEffect(() => {
    if (!isEditing && profile) {
      setName(profile.name || '');
      setSpecialization(profile.specialization || '');
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
      setDob(profile.dob ? profile.dob.substring(0, 10) : '');
      
      const initial = {};
      DAYS_OF_WEEK.forEach(day => {
        initial[day] = [];
      });
      if (profile.availability) {
        profile.availability.forEach(item => {
          if (item.slots && item.day) {
            initial[item.day] = item.slots.map(s => `${s.start} - ${s.end}`);
          }
        });
      }
      setAvailability(initial);
    }
  }, [profile, isEditing]);

  const handleCancel = () => {
    if (profile) {
      setName(profile.name || '');
      setSpecialization(profile.specialization || '');
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
      setDob(profile.dob ? profile.dob.substring(0, 10) : '');
      
      const initial = {};
      DAYS_OF_WEEK.forEach(day => {
        initial[day] = [];
      });
      if (profile.availability) {
        profile.availability.forEach(item => {
          if (item.slots && item.day) {
            initial[item.day] = item.slots.map(s => `${s.start} - ${s.end}`);
          }
        });
      }
      setAvailability(initial);
    }
    setMsg({ text: '', type: '' });
    setIsEditing(false);
  };

  const formatTo12Hour = (time24) => {
    if (!time24) return '';
    const [hoursStr, minutesStr] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleAddSlot = (day, start24, end24) => {
    if (!start24 || !end24) {
      window.showError?.('Please select both start and end times.');
      return;
    }
    
    // Check if start is before end
    const [startH, startM] = start24.split(':').map(Number);
    const [endH, endM] = end24.split(':').map(Number);
    const startVal = startH * 60 + startM;
    const endVal = endH * 60 + endM;
    
    if (startVal >= endVal) {
      window.showError?.('Start time must be earlier than end time.');
      return;
    }

    const start12 = formatTo12Hour(start24);
    const end12 = formatTo12Hour(end24);
    const slotStr = `${start12} - ${end12}`;

    if (availability[day].includes(slotStr)) {
      window.showError?.('This slot already exists.');
      return;
    }

    setAvailability(prev => ({
      ...prev,
      [day]: [...prev[day], slotStr].sort((a, b) => {
        const getMinutes = (s) => {
          const t = s.split(' - ')[0];
          const [time, modifier] = t.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          if (hours === 12) hours = 0;
          if (modifier === 'PM') hours += 12;
          return hours * 60 + minutes;
        };
        return getMinutes(a) - getMinutes(b);
      })
    }));
  };

  const handleRemoveSlot = (day, slotStr) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter(s => s !== slotStr)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      // Build availability payload mapping days to arrays of slot strings
      const payloadAvailability = {};
      DAYS_OF_WEEK.forEach(day => {
        payloadAvailability[day] = availability[day];
      });

      const data = await updateDoctorProfile({
        name,
        specialization,
        bio,
        phone,
        dob,
        availability: payloadAvailability
      }, token);
      
      onProfileUpdate(data.user);
      setMsg({ text: 'Profile and availability updated successfully!', type: 'success' });
      window.showToast?.('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setMsg({ text: err.message || 'Failed to update profile', type: 'error' });
      window.showError?.(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (docName) => {
    if (!docName) return 'DR';
    const cleanName = docName.replace(/^Dr\.\s+/i, '');
    const parts = cleanName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return 'DR';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in font-sans">
      
      {/* ── LEFT PANEL: PERSISTENT PROFILE PREVIEW (REAL-TIME SYNC) ── */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col items-center text-center relative overflow-hidden h-fit">
          
          {/* Accent radial glow decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-bl-full pointer-events-none z-0" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-50/20 rounded-full pointer-events-none z-0" />

          {/* Premium Initials Avatar with shadow */}
          <div 
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#5F7EF7] to-[#8FA4FF] flex items-center justify-center font-bold text-white text-[1.8rem] tracking-[0.05em] shadow-[0_10px_25px_rgba(95,126,247,0.18)] mb-4 z-10 shrink-0 border-4 border-white"
          >
            {getInitials(name)}
          </div>

          {/* Live Sync Name */}
          <h2 className="text-[1.3rem] font-bold text-slate-800 leading-snug tracking-tight z-10 break-words max-w-full font-sans">
            {name || 'Dr. Specialist'}
          </h2>

          {/* Live Sync Specialty */}
          <p className="text-[0.72rem] text-[#5F7EF7] font-extrabold uppercase tracking-wider bg-blue-50/70 border border-blue-100/50 px-3.5 py-1 rounded-full mt-2.5 z-10">
            {specialization || 'Clinical Specialist'}
          </p>

          {/* Phone (cyan color like reference) & Email */}
          <div className="w-full text-center mt-3.5 pb-4 border-b border-slate-100/60 z-10">
            {phone && (
              <span className="block text-[0.85rem] font-bold text-[#00A3FF] hover:underline cursor-pointer">
                {phone}
              </span>
            )}
            <span className="block text-[0.74rem] text-slate-400 font-semibold mt-1">
              {profile?.email || 'N/A'}
            </span>
          </div>

          {/* Table display for details */}
          <div className="w-full pt-4 space-y-3.5 text-left z-10 text-[0.82rem] text-slate-650">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-450 font-medium">Role:</span>
              <span className="font-bold text-slate-800">Lead Specialist</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-450 font-medium">Registration:</span>
              <span className="font-bold text-slate-800">Verified Partner</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-450 font-medium">Date of Birth:</span>
              <span className="font-bold text-slate-800">
                {profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'Not configured'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-450 font-medium">Verification:</span>
              {profile?.isApproved ? (
                <span className="text-[0.62rem] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-250/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Shield size={10} className="fill-emerald-100" /> Approved
                </span>
              ) : (
                <span className="text-[0.62rem] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-250/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  Pending
                </span>
              )}
            </div>
          </div>



          {/* Action Trigger */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-6 bg-[#5F7EF7] hover:bg-[#4E6DF5] text-white font-extrabold text-[0.75rem] uppercase tracking-wider py-3 rounded-full transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-[#5F7EF7]/10"
            >
              <Edit size={14} />
              Configure Settings
            </button>
          )}

          {isEditing && (
            <div className="w-full mt-6 bg-amber-50 border border-amber-100 text-amber-700 text-[0.68rem] font-bold py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 animate-pulse uppercase tracking-wider">
              <AlertCircle size={13} /> Editing mode active
            </div>
          )}

        </div>
      </div>

      {/* ── RIGHT PANEL: DETAILS SETTINGS VIEW (VIEW / EDIT FORM) ── */}
      <div className="lg:col-span-8">
        
        {/* VIEW MODE SUMMARY */}
        {!isEditing ? (
          <div className="grid grid-cols-1 gap-6">
            


            {/* Active Schedule */}
            <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
              <h3 className="text-[0.92rem] font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-[#5F7EF7]" />
                Active Clinical Working Hours
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DAYS_OF_WEEK.map(day => {
                  const slots = availability[day] || [];
                  const isAvailable = slots.length > 0;
                  return (
                    <div 
                      key={day} 
                      className={`flex flex-col justify-between p-4 border rounded-2xl transition-all duration-200 ${
                        isAvailable 
                          ? 'border-blue-100 bg-blue-50/10' 
                          : 'border-slate-100 bg-slate-50/40 opacity-60'
                      }`}
                    >
                      <span className={`font-bold text-[0.8rem] ${isAvailable ? 'text-[#5F7EF7]' : 'text-slate-405'}`}>
                        {day}
                      </span>
                      <div className="flex gap-1.5 flex-wrap mt-2.5">
                        {isAvailable ? (
                          slots.map((slot, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="bg-white border border-blue-100 text-[#5F7EF7] text-[0.7rem] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 shadow-sm shrink-0"
                            >
                              <Clock size={10} className="text-[#5F7EF7]" />
                              {slot}
                            </span>
                          ))
                        ) : (
                          <span className="text-[0.68rem] text-slate-400 font-semibold bg-slate-100/70 border border-slate-200/50 py-1 px-2.5 rounded-full">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          
          /* EDIT MODE CONFIGURATION FORM */
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
              <h3 className="text-[1.05rem] font-bold text-slate-800 flex items-center gap-2">
                <Settings size={18} className="text-slate-450" />
                Configure Settings
              </h3>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider rounded-full transition-all border cursor-pointer ${
                    activeTab === 'profile' 
                      ? 'bg-blue-50 text-[#5F7EF7] border-blue-200' 
                      : 'bg-white border-slate-100 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('availability')}
                  className={`px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider rounded-full transition-all border cursor-pointer ${
                    activeTab === 'availability' 
                      ? 'bg-blue-50 text-[#5F7EF7] border-blue-200' 
                      : 'bg-white border-slate-100 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Schedule
                </button>
              </div>
            </div>

            {msg.text && (
              <div className={`p-4 rounded-2xl mb-6 flex items-center gap-2 text-[0.82rem] ${
                msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
              }`}>
                {msg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                <span className="font-semibold">{msg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Full Professional Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[0.85rem] focus:outline-none focus:border-[#5F7EF7] focus:bg-white transition-all text-slate-700 font-semibold shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Medical Specialization</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[0.85rem] focus:outline-none focus:border-[#5F7EF7] focus:bg-white transition-all text-slate-700 font-semibold shadow-sm"
                      placeholder="e.g. Orthodontist, General Dentist"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Contact Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[0.85rem] focus:outline-none focus:border-[#5F7EF7] focus:bg-white transition-all text-slate-700 font-semibold shadow-sm"
                      placeholder="e.g. +1 (555) 019-2834"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[0.85rem] focus:outline-none focus:border-[#5F7EF7] focus:bg-white transition-all text-slate-700 font-semibold shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Email Address (Read-only)</label>
                    <input
                      type="text"
                      value={profile?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-[0.85rem] text-slate-400 font-semibold shadow-sm cursor-not-allowed select-none"
                    />
                  </div>


                </div>
              )}

              {activeTab === 'availability' && (
                <div className="space-y-5">
                  <div className="bg-slate-50/80 border border-slate-200/50 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.005)]">
                    <h4 className="text-[0.8rem] font-bold text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                      <Clock size={14} className="text-[#5F7EF7]" /> Custom Schedule Editor
                    </h4>
                    <p className="text-[0.72rem] text-slate-400 leading-normal font-semibold">
                      Select a day of the week to configure active slots. Day settings will instantly synchronize with the clinical patient calendar.
                    </p>
                  </div>

                  {/* Horizontal Day Tabs selection list - extremely compact! */}
                  <div className="flex flex-wrap gap-2.5 py-1">
                    {DAYS_OF_WEEK.map(day => {
                      const isSelected = selectedSchedDay === day;
                      const slotCount = availability[day]?.length || 0;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedSchedDay(day)}
                          className={`px-4 py-2 rounded-full text-[0.7rem] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                            isSelected 
                              ? 'bg-[#5F7EF7] text-white border-[#5F7EF7] shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-350'
                          }`}
                        >
                          {day.substring(0, 3)}
                          {slotCount > 0 && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[0.6rem] font-extrabold ${
                              isSelected ? 'bg-white text-[#5F7EF7]' : 'bg-[#5F7EF7] text-white'
                            }`}>
                              {slotCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Redesigned Single Day configuration card */}
                  <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-[20px] space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.005)]">
                    <div className="flex items-center justify-between border-b border-slate-200/40 pb-2.5">
                      <span className="font-bold text-slate-800 text-[0.92rem]">{selectedSchedDay} Working Slots</span>
                      <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-450 bg-white border border-slate-100 px-2.5 py-0.5 rounded-full">
                        {availability[selectedSchedDay]?.length || 0} configured
                      </span>
                    </div>

                    {/* Active Slots list */}
                    <div className="flex flex-wrap gap-2">
                      {(!availability[selectedSchedDay] || availability[selectedSchedDay].length === 0) ? (
                        <div className="w-full text-center py-6 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-[0.76rem] italic">
                          Unavailable (No active time slots configured for {selectedSchedDay})
                        </div>
                      ) : (
                        availability[selectedSchedDay].map((slot, index) => (
                          <span key={index} className="inline-flex items-center gap-1.5 bg-white border border-blue-100 text-[#5F7EF7] text-[0.72rem] font-bold px-3 py-1 rounded-full shadow-sm">
                            <Clock size={10} className="text-[#5F7EF7]" />
                            {slot}
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(selectedSchedDay, slot)}
                              className="text-[#93c5fd] hover:text-[#5F7EF7] border-none bg-transparent cursor-pointer font-bold text-[0.95rem] pl-1 leading-none flex items-center justify-center transition-colors"
                              title="Remove slot"
                            >
                              &times;
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Inline Time Adder */}
                    <div className="pt-3.5 border-t border-slate-200/40 space-y-3">
                      <span className="block text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-400">Add New Active Slot Range</span>
                      <div className="flex flex-wrap items-center gap-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.68rem] font-bold uppercase text-slate-400 tracking-wider">From</span>
                          <input
                            type="time"
                            value={startSlotTime}
                            onChange={(e) => setStartSlotTime(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[0.8rem] focus:outline-none focus:border-[#5F7EF7] text-slate-700 font-semibold shadow-sm transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[0.68rem] font-bold uppercase text-slate-400 tracking-wider">To</span>
                          <input
                            type="time"
                            value={endSlotTime}
                            onChange={(e) => setEndSlotTime(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[0.8rem] focus:outline-none focus:border-[#5F7EF7] text-slate-700 font-semibold shadow-sm transition-all"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleAddSlot(selectedSchedDay, startSlotTime, endSlotTime);
                            setStartSlotTime('');
                            setEndSlotTime('');
                          }}
                          className="bg-[#5F7EF7] hover:bg-[#4E6DF5] text-white font-extrabold text-[0.68rem] px-4.5 py-2 rounded-lg tracking-wider uppercase transition-colors border-none cursor-pointer shadow-sm"
                        >
                          Add Slot
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#5F7EF7] hover:bg-[#4E6DF5] text-white font-extrabold py-3.5 rounded-full transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-[#5F7EF7]/10 text-[0.75rem] uppercase tracking-wider"
                >
                  <Save size={14} />
                  {loading ? 'Saving Changes...' : 'Save Settings'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-full transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 text-[0.75rem] uppercase tracking-wider"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorProfile;
