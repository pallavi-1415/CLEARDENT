import React from 'react';
import { User, FileText, Star, Calendar, ArrowLeft } from 'lucide-react';

function DentalTicket({
  currentUser,
  selectedTreatment,
  selectedDoctor,
  selectedDate,
  selectedTimeSlot,
  loading,
  handleBookingSubmit,
  navigate
}) {
  return (
    <div className="ticket-preview-panel">
      <div className="form-section-label mb-2">Dental Pass Ticket</div>

      <div className="dental-ticket-card">
        <div className="ticket-header-block">
          <span className="ticket-brand">Clear<span>Dent</span></span>
          <span className="ticket-badge-tag">Care Ticket</span>
        </div>

        <div className="ticket-details-stack">
          <div className="ticket-detail-item">
            <span className="ticket-label-text">Patient Name</span>
            <span className="ticket-val-text">
              <User size={12} className="text-[#4f46e5]" />
              {currentUser?.name || 'Guest Patient'}
            </span>
          </div>

          <div className="ticket-detail-item">
            <span className="ticket-label-text">Clinical Service</span>
            {selectedTreatment ? (
              <span className="ticket-val-text">
                <FileText size={12} className="text-[#4f46e5]" />
                {selectedTreatment.name}
              </span>
            ) : (
              <span className="ticket-val-text empty">No treatment chosen</span>
            )}
          </div>

          <div className="ticket-detail-item">
            <span className="ticket-label-text">Attending Specialist</span>
            {selectedDoctor ? (
              <span className="ticket-val-text">
                <Star size={12} className="text-[#fbbf24]" />
                {selectedDoctor.name} ({selectedDoctor.specialty.split(' ')[0]})
              </span>
            ) : (
              <span className="ticket-val-text empty">No doctor assigned</span>
            )}
          </div>

          <div className="ticket-detail-item">
            <span className="ticket-label-text">Appointment Timing</span>
            {selectedDate && selectedTimeSlot ? (
              <span className="ticket-val-text">
                <Calendar size={12} className="text-[#4f46e5]" />
                {selectedDate.month} {selectedDate.dayNum} at {selectedTimeSlot.time}
              </span>
            ) : (
              <span className="ticket-val-text empty">Choose date &amp; time</span>
            )}
          </div>

          <div className="ticket-detail-item mt-1">
            <span className="ticket-label-text">Est. Cost</span>
            <span className="ticket-val-price">
              {selectedTreatment ? selectedTreatment.price : '₹0'}
            </span>
          </div>
        </div>

        <div className="ticket-bottom-barcodes">
          <div className="mock-barcode-graphic"></div>
          <span className="ticket-serial-code">
            {selectedTreatment
              ? `CD-${selectedTreatment.name.substring(0, 3)}-${selectedDate?.dayNum || '00'}`
              : 'CD-PENDING-00'}
          </span>
        </div>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden md:block">
        <button
          type="button"
          className="confirm-booking-btn-luxury"
          disabled={loading}
          onClick={handleBookingSubmit}
        >
          {loading ? 'Booking clinical slot...' : 'Confirm Appointment'}
        </button>

        <button
          type="button"
          className="back-services-btn-luxury"
          onClick={() => navigate('services')}
        >
          <ArrowLeft size={14} />
          Back to Services
        </button>
      </div>
    </div>
  );
}

export default DentalTicket;
