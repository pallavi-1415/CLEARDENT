import React from 'react';

function TimeSlotSelector({
  selectedDoctor,
  hasAnySlotsConfigured,
  selectedTimeSlot,
  setSelectedTimeSlot,
  getDoctorSlotsForSelectedDate
}) {
  const slots = getDoctorSlotsForSelectedDate();

  return (
    <div className="form-group-relative">
      <label className="form-section-label">4. Select Time Hour</label>
      <div
        className={`time-chips-grid ${(!selectedDoctor || !hasAnySlotsConfigured || slots.length === 0) ? 'block' : 'grid'}`}
      >
        {!selectedDoctor ? (
          <div className="text-[#ef4444] text-[0.85rem] italic py-2">
            Please select a specialist dentist first.
          </div>
        ) : !hasAnySlotsConfigured ? (
          <div className="text-[#ef4444] text-[0.85rem] italic py-2">
            This doctor has not configured their weekly availability schedule yet.
          </div>
        ) : slots.length === 0 ? (
          <div className="text-[#ef4444] text-[0.85rem] italic py-2">
            No available slots for this doctor on this day.
          </div>
        ) : (
          slots.map((slot, idx) => (
            <button
              key={idx}
              type="button"
              className={`time-chip-btn${selectedTimeSlot && selectedTimeSlot.time === slot ? ' selected' : ''}`}
              onClick={() => setSelectedTimeSlot({ time: slot, label: 'Available' })}
            >
              {slot}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default TimeSlotSelector;
