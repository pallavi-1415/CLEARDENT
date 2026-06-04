import React from 'react';

function DateSlider({
  datesList,
  selectedDate,
  setSelectedDate
}) {
  return (
    <div className="form-group-relative">
      <label className="form-section-label">3. Scheduled Date</label>
      <div className="inline-calendar-row">
        {datesList.map((d, idx) => (
          <button
            key={idx}
            type="button"
            className={`calendar-date-card${selectedDate && selectedDate.isoString === d.isoString ? ' selected' : ''}`}
            onClick={() => setSelectedDate(d)}
          >
            <span className="date-day-name">{d.dayName}</span>
            <span className="date-day-num">{d.dayNum}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DateSlider;
