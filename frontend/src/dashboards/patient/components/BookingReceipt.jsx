import React from 'react';
import { Check } from 'lucide-react';

function BookingReceipt({
  bookingSuccessData,
  setActiveTab,
  setPortalSubTab,
  navigate,
  handleReset
}) {
  return (
    <div className="success-receipt-wrapper">
      <div className="glowing-check-circle">
        <Check size={32} strokeWidth={2.5} />
      </div>
      <h2 className="success-heading-luxury">Appointment Confirmed</h2>
      <p className="success-sub-luxury">
        Your clinical care spot is secured. We look forward to providing your premium dental care experience.
      </p>

      <div className="receipt-pass-ticket">
        <div className="receipt-ticket-title">Official Receipt Pass</div>
        <div className="receipt-item-row">
          <span className="receipt-item-label">Reference ID</span>
          <span className="receipt-item-val font-mono tracking-[0.05em]">
            CD-{bookingSuccessData._id?.substring(0, 8).toUpperCase() || 'SUCCESS'}
          </span>
        </div>
        <div className="receipt-item-row">
          <span className="receipt-item-label">Procedure</span>
          <span className="receipt-item-val">{bookingSuccessData.treatmentName}</span>
        </div>
        <div className="receipt-item-row">
          <span className="receipt-item-label">Specialist Dentist</span>
          <span className="receipt-item-val">{bookingSuccessData.doctorName}</span>
        </div>
        <div className="receipt-item-row">
          <span className="receipt-item-label">Scheduled Date</span>
          <span className="receipt-item-val">{bookingSuccessData.appointmentDate}</span>
        </div>
        <div className="receipt-item-row">
          <span className="receipt-item-label">Time Slot</span>
          <span className="receipt-item-val">{bookingSuccessData.timeSlot}</span>
        </div>
        <div className="receipt-item-row border-b-0 mt-1.5 pt-3 border-t border-dashed border-t-[#cbd5e1]">
          <span className="receipt-item-label text-[#0f172a]">Est. Pricing</span>
          <span className="receipt-item-val text-[#059669] text-[1.05rem] not-italic font-extrabold">{bookingSuccessData.price}</span>
        </div>
      </div>

      <div className="success-actions-row">
        <button
          className="portal-redirect-btn-luxury"
          onClick={() => {
            if (setActiveTab) setActiveTab('portal');
            if (setPortalSubTab) setPortalSubTab('appointments');
            navigate('home');
          }}
        >
          View Appointment History
        </button>
        <button className="another-booking-btn-luxury" onClick={handleReset}>
          Book Another Care
        </button>
      </div>
    </div>
  );
}

export default BookingReceipt;
