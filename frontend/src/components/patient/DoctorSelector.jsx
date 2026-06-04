import React from 'react';
import { User, Star, ChevronUp, ChevronDown } from 'lucide-react';

function DoctorSelector({
  selectedDoctor,
  setSelectedDoctor,
  doctorDropdownOpen,
  setDoctorDropdownOpen,
  setTreatmentDropdownOpen,
  dbDoctors
}) {
  return (
    <div className="form-group-relative">
      <label className="form-section-label">2. Attending Specialist Dentist</label>
      <button
        type="button"
        className={`custom-select-trigger${doctorDropdownOpen ? ' active' : ''}`}
        onClick={() => {
          setDoctorDropdownOpen(!doctorDropdownOpen);
          if (setTreatmentDropdownOpen) setTreatmentDropdownOpen(false);
        }}
      >
        <div className="trigger-value-block">
          {selectedDoctor ? (
            <>
              <div className="popover-doc-avatar" style={{ marginRight: '6px' }}>
                <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="popover-doc-img" />
              </div>
              <div>
                <div className="trigger-main-text" style={{ color: '#0f172a' }}>{selectedDoctor.name}</div>
                <div className="trigger-sub-text" style={{ color: '#475569', fontWeight: '600' }}>
                  {selectedDoctor.specialty}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="trigger-icon-box">
                <User size={18} />
              </div>
              <span className="trigger-placeholder">Choose specialist...</span>
            </>
          )}
        </div>
        {doctorDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {doctorDropdownOpen && (
        <div className="interactive-popover-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {dbDoctors.map((doc, index) => (
              <div
                key={index}
                className="popover-doc-row"
                onClick={() => {
                  setSelectedDoctor(doc);
                  setDoctorDropdownOpen(false);
                }}
              >
                <div className="popover-doc-left">
                  <div className="popover-doc-avatar">
                    <img src={doc.photo} alt={doc.name} className="popover-doc-img" />
                  </div>
                  <div>
                    <div className="popover-doc-name">{doc.name}</div>
                    <div className="popover-doc-spec">{doc.specialty}</div>
                  </div>
                </div>
                <div className="popover-doc-meta">
                  <div className="popover-doc-rating">
                    <Star size={12} fill="#d97706" /> {doc.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorSelector;
