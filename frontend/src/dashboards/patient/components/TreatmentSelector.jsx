import React from 'react';
import { Stethoscope, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { TREATMENTS_DATA } from '../../../constants/treatments';

function TreatmentSelector({
  selectedCategory,
  setSelectedCategory,
  selectedTreatment,
  setSelectedTreatment,
  treatmentDropdownOpen,
  setTreatmentDropdownOpen
}) {
  return (
    <div className="form-group-relative">
      <label className="form-section-label">1. Choose Treatment &amp; Procedure</label>
      <button
        type="button"
        className={`custom-select-trigger${treatmentDropdownOpen ? ' active' : ''}`}
        onClick={() => setTreatmentDropdownOpen(!treatmentDropdownOpen)}
      >
        <div className="trigger-value-block">
          <div className="trigger-icon-box">
            {selectedTreatment ? (
              React.createElement(selectedCategory.icon || Stethoscope, { size: 18 })
            ) : (
              <Stethoscope size={18} />
            )}
          </div>
          <div>
            {selectedTreatment ? (
              <>
                <div className="trigger-main-text">{selectedTreatment.name}</div>
                <div className="trigger-sub-text">
                  {selectedCategory.category} &bull; {selectedTreatment.duration}
                </div>
              </>
            ) : (
              <span className="trigger-placeholder">Choose procedure...</span>
            )}
          </div>
        </div>
        {treatmentDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {treatmentDropdownOpen && (
        <div className="interactive-popover-list max-h-[360px] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {TREATMENTS_DATA.map((cat) => (
              <div key={cat.id} className="flex flex-col">
                {/* Category Header */}
                <div
                  className="text-[0.72rem] font-extrabold text-[#4f46e5] uppercase tracking-[0.12em] pt-2 px-3 pb-1 bg-[#faf5ff] rounded-lg mt-1.5 mb-1 border-l-[3px] border-[#6366f1]"
                >
                  {cat.category}
                </div>
                {/* Procedures list */}
                <div className="flex flex-col gap-1">
                  {cat.items.map((proc, index) => (
                    <div
                      key={index}
                      className="popover-item-card"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedTreatment(proc);
                        setTreatmentDropdownOpen(false);
                      }}
                    >
                      <div className="item-card-header">
                        <span className="item-card-title">{proc.name}</span>
                        <span className="item-card-price">{proc.price}</span>
                      </div>
                      <span className="item-card-desc">{proc.desc}</span>
                      <div className="item-card-meta">
                        <Clock size={11} />
                        <span>{proc.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TreatmentSelector;
