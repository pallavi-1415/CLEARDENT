import React, { useState, useEffect, useRef } from 'react';
import { createAppointment } from '../../services/appointments';
import { fetchApprovedDoctors } from '../../services/login';
import { TREATMENTS_DATA } from '../../constants/treatments';
import { io } from 'socket.io-client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  MapPin,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CreditCard,
  Banknote,
  ShieldCheck,
  Map,
  Download,
  Phone,
  User,
  Mail,
  Stethoscope,
  Activity,
  HeartPulse
} from 'lucide-react';

/* ─── Doctor avatar lookup ─────────────────────────────────────── */
const DOCTOR_AVATARS_LIST = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'
];
const getDoctorPhoto = (name, index) => {
  const n = name.toLowerCase();
  if (n.includes('sarah') || n.includes('emily') || n.includes('jenkins') || n.includes('carter') || n.includes('bennett'))
    return DOCTOR_AVATARS_LIST[0];
  if (n.includes('serhii') || n.includes('kinash') || n.includes('luca') || n.includes('michael'))
    return DOCTOR_AVATARS_LIST[1];
  if (n.includes('marcus') || n.includes('thorne') || n.includes('annette'))
    return DOCTOR_AVATARS_LIST[2];
  return DOCTOR_AVATARS_LIST[index % DOCTOR_AVATARS_LIST.length];
};

const CLINIC_LOCATIONS = [
  { id: 'mumbai', name: 'ClearDent — Mumbai', address: 'Bandra West, Link Road, Mumbai, MH 400050', hours: '8:00 AM – 8:00 PM', phone: '+91 98765 43210', mapUrl: 'https://maps.google.com/?q=Bandra+West,Mumbai' },
  { id: 'delhi', name: 'ClearDent — Delhi', address: 'Connaught Place, Block C, New Delhi, DL 110001', hours: '9:00 AM – 7:00 PM', phone: '+91 91234 56789', mapUrl: 'https://maps.google.com/?q=Connaught+Place,Delhi' },
  { id: 'bangalore', name: 'ClearDent — Bangalore', address: 'Indiranagar 100ft Road, Bangalore, KA 560038', hours: '8:30 AM – 7:30 PM', phone: '+91 99887 76655', mapUrl: 'https://maps.google.com/?q=Indiranagar,Bangalore' }
];

const STEPS = [
  { number: 1, name: 'Service' },
  { number: 2, name: 'Personal details' },
  { number: 3, name: 'Location' },
  { number: 4, name: 'Appointment' },
  { number: 5, name: 'Payment' },
  { number: 6, name: 'Confirmation' }
];

/* ─── Format Time Helpers ──────────────────────────────────────── */
const formatTimeTo12Hour = (timeStr) => {
  let [hours, minutes] = timeStr.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
};

const getSlotDurationText = (startTimeStr) => {
  const [h, m] = startTimeStr.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(h, m, 0);
  
  const endDate = new Date(startDate.getTime() + 30 * 60000);
  
  const startStr = formatTimeTo12Hour(`${startDate.getHours().toString().padStart(2,'0')}:${startDate.getMinutes().toString().padStart(2,'0')}`);
  const endStr = formatTimeTo12Hour(`${endDate.getHours().toString().padStart(2,'0')}:${endDate.getMinutes().toString().padStart(2,'0')}`);
  
  return `${startStr} to ${endStr}`;
};

/* ─── Custom Select Component ───────────────────────────────────── */
const CustomSelect = ({ options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="bm-custom-select" ref={dropdownRef}>
      <div 
        className={`bm-select-header ${isOpen ? 'open' : ''} ${selectedOption ? 'has-value' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <span className="bm-select-icon">{icon}</span>}
        <span className="bm-select-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronRight 
          size={18} 
          className="bm-select-arrow" 
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} 
        />
      </div>
      {isOpen && (
        <div className="bm-select-options">
          {options.length > 0 ? options.map((opt) => (
            <div 
              key={opt.value}
              className={`bm-select-option ${value === opt.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
              {value === opt.value && <Check size={16} className="bm-select-check" />}
            </div>
          )) : (
            <div className="bm-select-option disabled">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};


/* ════════════════════════════════════════════════════════════════
   BookingModal – Redesigned for Lumina (Teal/Light theme)
════════════════════════════════════════════════════════════════ */
function BookingModal({ isOpen, onClose, currentUser, isLoggedIn, navigate }) {

  /* ── Form State ── */
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(TREATMENTS_DATA[0]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(CLINIC_LOCATIONS[0]);
  const [notes, setNotes] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pay at Clinic');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [dbDoctors, setDbDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [errors, setErrors] = useState({});
  const prevCategory = useRef(selectedCategory);
  const contentRef = useRef(null);
  const receiptRef = useRef(null);

  /* ── Sync user data ── */
  useEffect(() => {
    if (currentUser) {
      setPatientName(currentUser.name || '');
      setPatientEmail(currentUser.email || '');
      setPatientPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  /* ── Lock body scroll when modal open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── Load approved doctors ── */
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const docs = await fetchApprovedDoctors();
        const formatted = docs.map((d, i) => ({
          name: d.name,
          specialty: d.specialization || 'Dental Specialist',
          rating: '5.0',
          exp: 'Clinical Specialist',
          photo: getDoctorPhoto(d.name, i),
          timeSlots: (d.timeSlots && d.timeSlots.length > 0) ? d.timeSlots : ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'],
          availability: d.availability || []
        }));
        setDbDoctors(formatted);
      } catch (err) {
        console.error('Failed to load doctors:', err);
      }
    };
    if (isOpen) loadDoctors();
  }, [isOpen]);

  /* ── Pre-fill from localStorage ── */
  useEffect(() => {
    if (!isOpen) return;
    const savedCategory = localStorage.getItem('selected_booking_category');
    const savedTreatment = localStorage.getItem('selected_booking_treatment');
    if (savedCategory) {
      const catObj = TREATMENTS_DATA.find(c => c.id === savedCategory);
      if (catObj) {
        setSelectedCategory(catObj);
        if (savedTreatment) {
          const tObj = catObj.items.find(t => t.name === savedTreatment);
          if (tObj) setSelectedTreatment(tObj);
        }
      }
      localStorage.removeItem('selected_booking_category');
      localStorage.removeItem('selected_booking_treatment');
    }
  }, [isOpen]);

  useEffect(() => {
    const savedDoctor = localStorage.getItem('selected_booking_doctor');
    if (savedDoctor && dbDoctors.length > 0) {
      const docObj = dbDoctors.find(d => d.name === savedDoctor);
      if (docObj) {
        setSelectedDoctor(docObj);
        const spec = docObj.specialty.toLowerCase();
        const matchedCat = TREATMENTS_DATA.find(c => spec.includes(c.category.toLowerCase().split(' ')[0]));
        if (matchedCat) setSelectedCategory(matchedCat);
      }
      localStorage.removeItem('selected_booking_doctor');
    }
  }, [dbDoctors]);

  /* ── Auto-select doctor when category changes ── */
  useEffect(() => {
    if (selectedCategory && dbDoctors.length > 0 && prevCategory.current !== selectedCategory) {
      let matched = dbDoctors.find(d => d.specialty.toLowerCase().includes(selectedCategory.category.toLowerCase().split(' ')[0]));
      if (!matched) matched = dbDoctors[0];
      setSelectedDoctor(matched || null);
      setSelectedTimeSlot(null);
      prevCategory.current = selectedCategory;
    }
  }, [selectedCategory, dbDoctors]);

  /* ── Socket.io real-time slots ── */
  useEffect(() => {
    if (!isOpen) return;
    const socket = io('http://localhost:5000');
    socket.on('availabilityUpdated', (data) => {
      setDbDoctors(prev => prev.map(doc =>
        doc.name.toLowerCase() === data.doctorName.toLowerCase()
          ? { ...doc, availability: data.availability, timeSlots: data.timeSlots }
          : doc
      ));
    });
    socket.on('appointmentCreated', (data) => {
      if (selectedDoctor && selectedDate && data.appointment.doctorName === selectedDoctor.name && data.appointment.appointmentDate === selectedDate.fullDateString) {
        setBookedSlots(prev => prev.includes(data.appointment.timeSlot) ? prev : [...prev, data.appointment.timeSlot]);
      }
    });
    socket.on('appointmentStatusUpdated', (data) => {
      if (selectedDoctor && selectedDate && data.appointment.doctorName === selectedDoctor.name && data.appointment.appointmentDate === selectedDate.fullDateString) {
        if (data.appointment.status === 'Cancelled') {
          setBookedSlots(prev => prev.filter(s => s !== data.appointment.timeSlot));
        } else {
          setBookedSlots(prev => prev.includes(data.appointment.timeSlot) ? prev : [...prev, data.appointment.timeSlot]);
        }
      }
    });
    return () => socket.disconnect();
  }, [isOpen, selectedDoctor, selectedDate]);

  /* ── Fetch booked slots ── */
  useEffect(() => {
    const fetchBooked = async () => {
      if (!selectedDoctor || !selectedDate) { setBookedSlots([]); return; }
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/appointments/booked?doctorName=${encodeURIComponent(selectedDoctor.name)}&date=${encodeURIComponent(selectedDate.fullDateString)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookedSlots(data.map(a => a.timeSlot));
        }
      } catch (err) { console.error('Error fetching booked slots:', err); }
    };
    fetchBooked();
  }, [selectedDoctor, selectedDate]);

  /* ── Calendar helpers ── */
  const getDatesForMonth = (monthDate) => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const year = monthDate.getFullYear(), month = monthDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      if (d < today) continue;
      dates.push({
        dayName: days[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()],
        monthFull: d.toLocaleString('en-US', { month: 'long' }),
        year: d.getFullYear(),
        fullDateString: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
        isoString: d.toISOString().split('T')[0],
        dateObj: d
      });
    }
    return dates;
  };

  const datesList = getDatesForMonth(currentMonthDate);
  useEffect(() => { if (datesList.length > 0 && !selectedDate) setSelectedDate(datesList[0]); }, [datesList, selectedDate]);

  const handlePrevMonth = () => {
    const today = new Date();
    if (currentMonthDate.getFullYear() === today.getFullYear() && currentMonthDate.getMonth() === today.getMonth()) return;
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null); setSelectedTimeSlot(null);
  };
  const handleNextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null); setSelectedTimeSlot(null);
  };

  const getDoctorSlotsForSelectedDate = () => {
    if (!selectedDoctor || !selectedDate) return [];
    let slotsToReturn = [];
    const dayMap = { 'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday' };
    const dayAvail = selectedDoctor.availability?.find(item => item.day === dayMap[selectedDate.dayName]);
    
    if (dayAvail && dayAvail.slots && dayAvail.slots.length > 0) {
      slotsToReturn = dayAvail.slots.map(s => {
        const match = s.start.match(/(\d+):(\d+)/);
        if (match) return getSlotDurationText(`${match[1].padStart(2, '0')}:${match[2]}`);
        return s.start;
      });
    } else {
      const rawSlots = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];
      slotsToReturn = rawSlots.map(time => getSlotDurationText(time));
    }
    return slotsToReturn;
  };

  const allDoctorSlots = getDoctorSlotsForSelectedDate();

  /* ── Step navigation & Validation ── */
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!selectedCategory) newErrors.category = 'Please select a category';
      if (!selectedTreatment) newErrors.treatment = 'Please select a procedure';
      if (!selectedDoctor) newErrors.doctor = 'Please select a dentist';
    }
    if (step === 2) {
      if (!patientName.trim()) {
        newErrors.name = 'Full name is required';
      } else if (patientName.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      
      const phoneRegex = /^\d{10}$/;
      if (!patientPhone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(patientPhone)) {
        newErrors.phone = 'Please enter exactly 10 digits';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!patientEmail.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(patientEmail)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    if (step === 3) {
      if (!selectedLocation) newErrors.location = 'Please select a clinic location';
    }
    if (step === 4) {
      if (!selectedDate) newErrors.date = 'Please select an appointment date';
      if (!selectedTimeSlot) newErrors.timeSlot = 'Please select a time slot';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
      window.showError?.('Please fix the errors before continuing.');
      return;
    }
    if (currentStep === 5) {
      const token = localStorage.getItem('token');
      if (!token) {
        window.showError?.('You must be logged in to book an appointment. Please log in.');
        onClose();
        navigate('login');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
    setTimeout(() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };
  const handleBackStep = () => { setErrors({}); setCurrentStep(prev => Math.max(1, prev - 1)); };

  /* ── Submit ── */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBookingSubmit = async () => {
    if (!selectedTreatment || !selectedDoctor || !selectedDate || !selectedTimeSlot) {
      window.showError?.('Please complete all required booking details.'); return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const appointmentData = {
        treatmentCategory: selectedCategory.category,
        treatmentName: selectedTreatment.name,
        price: selectedTreatment.price,
        doctorName: selectedDoctor.name,
        appointmentDate: selectedDate.fullDateString,
        timeSlot: selectedTimeSlot, 
        notes,
        location: selectedLocation.name,
        paymentMethod
      };

      if (paymentMethod === 'Razorpay / Online Payment') {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          window.showError?.('Razorpay SDK failed to load. Are you online?');
          setLoading(false);
          return;
        }

        let numericPrice = selectedTreatment.price.replace(/[^0-9.]/g, '');
        if (!numericPrice) numericPrice = '500'; // fallback
        
        const orderResponse = await fetch('http://localhost:5000/api/payment/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ amount: numericPrice })
        });
        const orderData = await orderResponse.json();
        if (!orderData.success) {
           window.showError?.(orderData.message || 'Failed to create payment order.');
           setLoading(false);
           return;
        }

        const options = {
          key: 'rzp_test_SxtsLJgL1kjYsy', // Your actual Razorpay Key ID
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'ClearDent Studio',
          description: `Payment for ${selectedTreatment.name}`,
          image: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                const result = await createAppointment(appointmentData, token);
                setBookingSuccessData(result.appointment);
                window.showToast?.('Payment successful & Appointment booked!');
                setCurrentStep(6);
              } else {
                window.showError?.('Payment verification failed!');
              }
            } catch (err) {
              console.error(err);
              window.showError?.('Server error during payment verification.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: patientName,
            email: patientEmail,
            contact: patientPhone
          },
          theme: {
            color: '#0e8374'
          },
          modal: {
            ondismiss: function() {
               setLoading(false);
               window.showToast?.('Payment process was cancelled.');
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        return;
      }

      const result = await createAppointment(appointmentData, token);
      setBookingSuccessData(result.appointment);
      window.showToast?.('Appointment booked successfully!');
      setCurrentStep(6);
    } catch (err) {
      console.error(err);
      window.showError?.(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      if (paymentMethod !== 'Razorpay / Online Payment') {
        setLoading(false);
      }
    }
  };

  /* ── Download PDF ── */
  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ClearDent_Receipt_${bookingSuccessData?._id?.slice(-6) || 'Booking'}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedCategory(TREATMENTS_DATA[0]);
    setSelectedTreatment(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSelectedLocation(CLINIC_LOCATIONS[0]);
    setNotes('');
    setPaymentMethod('Pay at Clinic');
    setBookingSuccessData(null);
    setShowAllSlots(false);
    setErrors({});
    setCurrentMonthDate(new Date());
    prevCategory.current = TREATMENTS_DATA[0];
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  /* ── Filtered doctors ── */
  const filteredDoctors = dbDoctors.filter(d => {
    if (!selectedCategory) return true;
    return d.specialty.toLowerCase().includes(selectedCategory.category.toLowerCase().split(' ')[0]);
  });
  
  // Custom Select Options Format
  const categoryOptions = TREATMENTS_DATA.map(cat => ({ value: cat.id, label: cat.category }));
  const procedureOptions = selectedCategory ? selectedCategory.items.map(t => ({ value: t.name, label: `${t.name} — ${t.price}` })) : [];
  const dentistOptions = (filteredDoctors.length > 0 ? filteredDoctors : dbDoctors).map(doc => ({ value: doc.name, label: `${doc.name} - ${doc.specialty}` }));

  return (
    <>
      <style>{`
        .bm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: bmOverlayIn 0.2s ease forwards;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        @keyframes bmOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .bm-card {
          background: #f4f7f6;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 1000px;
          height: 600px;
          display: flex;
          overflow: hidden;
          position: relative;
          animation: bmCardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .bm-card::before {
          content: ''; position: absolute; bottom: -100px; left: -100px; width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(144, 224, 203, 0.4) 0%, transparent 70%); pointer-events: none; z-index: 0;
        }
        .bm-card::after {
          content: ''; position: absolute; top: -50px; right: -50px; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(144, 224, 203, 0.3) 0%, transparent 70%); pointer-events: none; z-index: 0;
        }
        @keyframes bmCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .bm-layout { display: flex; flex: 1; width: 100%; z-index: 1; }

        /* Sidebar */
        .bm-sidebar { width: 280px; flex-shrink: 0; padding: 40px 30px; display: flex; flex-direction: column; border-right: 1px solid rgba(0,0,0,0.04); }
        .bm-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 50px; }
        .bm-brand svg { color: #1A907C; width: 28px; height: 28px; }
        .bm-brand-text { font-size: 1.25rem; font-weight: 700; color: #111827; letter-spacing: -0.01em; }

        /* Stepper */
        .bm-stepper { display: flex; flex-direction: column; flex: 1; position: relative; }
        .bm-step-item { display: flex; align-items: flex-start; gap: 16px; position: relative; padding-bottom: 30px; }
        .bm-step-item:last-child { padding-bottom: 0; }
        .bm-step-item:not(:last-child)::after { content: ''; position: absolute; left: 15px; top: 32px; bottom: 8px; width: 1.5px; background: #d1d5db; }
        .bm-step-item.done:not(:last-child)::after { background: #1A907C; }
        
        .bm-step-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; flex-shrink: 0; position: relative; z-index: 2; background: #f4f7f6; }
        .bm-step-dot.done { border: 1.5px solid #1A907C; color: #1A907C; }
        .bm-step-dot.active { background: #1A907C; border: 1.5px solid #1A907C; color: #ffffff; }
        .bm-step-dot.pending { border: 1.5px solid #d1d5db; color: #9ca3af; }
        .bm-step-label { font-size: 0.95rem; font-weight: 500; margin-top: 6px; }
        .bm-step-label.active { color: #111827; font-weight: 600; }
        .bm-step-label.done { color: #4b5563; }
        .bm-step-label.pending { color: #9ca3af; }

        /* Content Area */
        .bm-content-wrapper { flex: 1; display: flex; flex-direction: column; padding: 40px; }
        .bm-content-card { background: #ffffff; border: 1px solid rgba(229, 231, 235, 0.5); border-radius: 12px; padding: 30px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }

        .bm-step-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .bm-step-title { font-size: 1.45rem; font-weight: 700; color: #1f2937; margin: 0; }

        /* Custom Select UI */
        .bm-custom-select { position: relative; width: 100%; user-select: none; }
        .bm-select-header {
          display: flex;
          align-items: center;
          width: 100%;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          padding: 14px 16px;
          background: #f9fafb;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .bm-select-header:hover, .bm-select-header.open { border-color: #1A907C; background: #ffffff; }
        .bm-select-header.error { border-color: #ef4444; background: #fef2f2; }
        .bm-select-header.open { box-shadow: 0 0 0 4px rgba(26, 144, 124, 0.1); }
        .bm-select-header.error.open { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
        .bm-select-icon { color: #9ca3af; margin-right: 12px; display: flex; align-items: center; }
          color: #9ca3af;
          margin-right: 12px;
          display: flex;
          align-items: center;
        }
        .bm-select-header.has-value .bm-select-icon, .bm-select-header.open .bm-select-icon {
          color: #1A907C;
        }
        .bm-select-value {
          flex: 1;
          font-size: 0.95rem;
          color: #111827;
          font-weight: 500;
        }
        .bm-select-header:not(.has-value) .bm-select-value {
          color: #6b7280;
          font-weight: 400;
        }
        .bm-select-arrow {
          color: #9ca3af;
        }
        .bm-select-options {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          z-index: 100;
          max-height: 250px;
          overflow-y: auto;
          animation: bmOptionsIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes bmOptionsIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bm-select-option {
          padding: 12px 16px;
          font-size: 0.95rem;
          color: #374151;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.1s;
        }
        .bm-select-option:hover {
          background: #f3f4f6;
          color: #111827;
        }
        .bm-select-option.selected {
          background: rgba(26, 144, 124, 0.05);
          color: #1A907C;
          font-weight: 600;
        }
        .bm-select-check {
          color: #1A907C;
        }

        /* Inputs & Textareas */
        .bm-input-wrap { position: relative; margin-bottom: 24px; }
        .bm-label { font-size: 0.85rem; font-weight: 600; color: #4b5563; margin-bottom: 8px; display: block; }
        .bm-input, .bm-textarea { width: 100%; border: 1.5px solid #d1d5db; border-radius: 8px; padding: 14px 16px; padding-left: 42px; font-size: 0.95rem; color: #111827; background: #f9fafb; outline: none; transition: all 0.2s ease; font-family: inherit; }
        .bm-input:focus, .bm-textarea:focus { border-color: #1A907C; background: #ffffff; box-shadow: 0 0 0 4px rgba(26, 144, 124, 0.1); }
        .bm-input.error { border-color: #ef4444; background: #fef2f2; }
        .bm-input.error:focus { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
        .bm-input-icon { position: absolute; left: 14px; top: 38px; color: #9ca3af; pointer-events: none; transition: color 0.2s; }
        .bm-input:focus ~ .bm-input-icon { color: #1A907C; }
        .bm-input.error ~ .bm-input-icon { color: #ef4444; }
        .bm-error-text { color: #ef4444; font-size: 0.8rem; font-weight: 500; margin-top: 6px; display: flex; align-items: center; gap: 4px; }
        .bm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        /* Action Buttons */
        .bm-actions { display: flex; justify-content: flex-end; gap: 16px; margin-top: auto; }
        .bm-btn-back { padding: 12px 32px; border: 1px solid #d1d5db; border-radius: 8px; background: transparent; color: #4b5563; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .bm-btn-back:hover { background: #f3f4f6; color: #111827; }
        .bm-btn-next { padding: 12px 40px; border: none; border-radius: 8px; background: #1A907C; color: #ffffff; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(26, 144, 124, 0.2); }
        .bm-btn-next:hover { background: #137563; box-shadow: 0 6px 16px rgba(26, 144, 124, 0.3); }
        .bm-btn-next:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Other Styles Keep Intact... */
        .bm-location-card { border: 2px solid transparent; border-radius: 12px; padding: 20px; margin-bottom: 16px; cursor: pointer; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; align-items: flex-start; gap: 16px; transition: all 0.2s; }
        .bm-location-card:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.06); }
        .bm-location-card.selected { border-color: #1A907C; background: rgba(26,144,124,0.03); }
        .bm-loc-icon-wrap { width: 48px; height: 48px; border-radius: 12px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #6b7280; }
        .bm-location-card.selected .bm-loc-icon-wrap { background: #1A907C; color: #ffffff; }
        .bm-location-name { font-weight: 700; color: #111827; margin-bottom: 6px; font-size: 1.05rem; }
        .bm-location-addr { font-size: 0.9rem; color: #4b5563; margin-bottom: 12px; line-height: 1.4; }
        .bm-location-meta { display: flex; gap: 16px; font-size: 0.8rem; color: #6b7280; font-weight: 500; }
        .bm-map-btn { margin-top: 12px; display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #1A907C; font-weight: 600; text-decoration: none; }
        .bm-map-btn:hover { text-decoration: underline; }

        .bm-payment-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .bm-payment-card { border: 2px solid #e5e7eb; border-radius: 12px; padding: 18px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; background: #ffffff; transition: all 0.2s; }
        .bm-payment-card:hover { border-color: #d1d5db; background: #f9fafb; }
        .bm-payment-card.selected { border-color: #1A907C; background: rgba(26, 144, 124, 0.04); box-shadow: 0 4px 12px rgba(26, 144, 124, 0.1); }
        .bm-payment-icon { width: 44px; height: 44px; border-radius: 10px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #4b5563; }
        .bm-payment-card.selected .bm-payment-icon { background: #1A907C; color: #ffffff; }
        .bm-payment-info { flex: 1; }
        .bm-payment-name { font-weight: 700; color: #111827; font-size: 1rem; margin-bottom: 4px; }
        .bm-payment-desc { font-size: 0.85rem; color: #6b7280; }
        .bm-payment-radio { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; }
        .bm-payment-card.selected .bm-payment-radio { border-color: #1A907C; background: #1A907C; }
        .bm-payment-card.selected .bm-payment-radio::after { content: ''; width: 8px; height: 8px; background: #fff; border-radius: 50%; }

        .bm-month-selector { display: flex; align-items: center; gap: 12px; padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.9rem; font-weight: 600; color: #374151; }
        .bm-month-btn { background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0; }
        .bm-month-btn:hover { color: #111827; }
        .bm-date-row { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; }
        .bm-date-nav { color: #9ca3af; background: none; border: none; cursor: pointer; padding: 4px; }
        .bm-date-nav:hover { color: #111827; }
        .bm-date-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; min-width: 60px; position: relative; }
        .bm-date-day { font-size: 0.85rem; color: #6b7280; font-weight: 500; }
        .bm-date-num { font-size: 1.15rem; color: #374151; font-weight: 500; }
        .bm-date-item.active .bm-date-day, .bm-date-item.active .bm-date-num { color: #111827; font-weight: 700; }
        .bm-date-item.active::after { content: ''; position: absolute; bottom: -17px; left: 0; right: 0; height: 3px; background: #111827; border-radius: 3px 3px 0 0; }

        .bm-slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; margin-bottom: 8px; }
        .bm-slot-btn { padding: 12px 10px; background: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; color: #374151; transition: all 0.2s; text-align: center; }
        .bm-slot-btn:hover:not(:disabled):not(.selected) { border-color: #1A907C; color: #1A907C; background: #f0fdfa; }
        .bm-slot-btn.selected { background: #1A907C; border-color: #1A907C; color: #ffffff; box-shadow: 0 4px 10px rgba(26, 144, 124, 0.2); }
        .bm-slot-btn.error { border-color: #ef4444; background: #fef2f2; color: #ef4444; }
        .bm-slot-btn:disabled { opacity: 0.4; cursor: not-allowed; background: #f3f4f6; text-decoration: line-through; border-color: #d1d5db; color: #374151; }

        @media print {
          body * { visibility: hidden; }
          .bm-overlay { background: transparent !important; backdrop-filter: none !important; }
          .bm-card { box-shadow: none !important; margin: 0 !important; width: 100% !important; height: auto !important; max-width: none !important; }
          .bm-sidebar { display: none !important; }
          .bm-content-wrapper, .bm-content-wrapper * { visibility: visible !important; }
          .bm-content-wrapper { position: absolute; left: 0; top: 0; padding: 20px !important; width: 100% !important; }
          .bm-btn-next, .bm-btn-back, .no-print { display: none !important; }
          .bm-content-card { border: none !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="bm-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
        <div className="bm-card">
          <div className="bm-layout">
            
            {/* ─── SIDEBAR ─── */}
            <div className="bm-sidebar">
              <div className="bm-brand">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6a3.5 3.5 0 0 0-3.5 3.5c0 3.5 3.5 6.5 3.5 6.5s3.5-3 3.5-6.5A3.5 3.5 0 0 0 12 6z" />
                </svg>
                <span className="bm-brand-text">ClearDent</span>
              </div>

              <nav className="bm-stepper">
                {STEPS.map((step) => {
                  const isDone = currentStep > step.number;
                  const isActive = currentStep === step.number;
                  return (
                    <div key={step.number} className={`bm-step-item ${isDone ? 'done' : ''}`}>
                      <div className={`bm-step-dot ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                        {isDone ? <Check size={16} strokeWidth={3} /> : step.number}
                      </div>
                      <span className={`bm-step-label ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </nav>
              <div className="bm-sidebar-footer">
                <HelpCircle size={16} />
                Need help with booking?
              </div>
            </div>

            {/* ─── CONTENT AREA ─── */}
            <div className="bm-content-wrapper">
              
              {/* STEP 1: Service */}
              {currentStep === 1 && (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div className="bm-step-title-row">
                    <h2 className="bm-step-title">Select Service</h2>
                  </div>
                  <div className="bm-content-card">
                    <div className="bm-input-wrap">
                      <span className="bm-label">Category</span>
                      <CustomSelect 
                        options={categoryOptions}
                        value={selectedCategory?.id || ''}
                        onChange={(val) => {
                          const cat = TREATMENTS_DATA.find(c => c.id === val);
                          setSelectedCategory(cat); 
                          setSelectedTreatment(null);
                          setErrors(prev => ({ ...prev, category: null, treatment: null }));
                        }}
                        placeholder="Select a category"
                        icon={<Activity size={18} />}
                      />
                      {errors.category && <div className="bm-error-text"><span>⚠</span> {errors.category}</div>}
                    </div>

                    <div className="bm-input-wrap">
                      <span className="bm-label">Procedure</span>
                      <div className={`bm-custom-select ${errors.treatment ? 'error' : ''}`}>
                        <CustomSelect 
                          options={procedureOptions}
                          value={selectedTreatment?.name || ''}
                          onChange={(val) => {
                            const t = selectedCategory?.items.find(i => i.name === val);
                            setSelectedTreatment(t || null);
                            setErrors(prev => ({ ...prev, treatment: null }));
                          }}
                          placeholder="— Select a procedure —"
                          icon={<HeartPulse size={18} />}
                        />
                      </div>
                      {errors.treatment && <div className="bm-error-text"><span>⚠</span> {errors.treatment}</div>}
                    </div>

                    <div className="bm-input-wrap">
                      <span className="bm-label">Assigned Dentist</span>
                      <div className={`bm-custom-select ${errors.doctor ? 'error' : ''}`}>
                        <CustomSelect 
                          options={dentistOptions}
                          value={selectedDoctor?.name || ''}
                          onChange={(val) => {
                            const doc = dbDoctors.find(d => d.name === val);
                            setSelectedDoctor(doc || null);
                            setErrors(prev => ({ ...prev, doctor: null }));
                          }}
                          placeholder="— Select a dentist —"
                          icon={<Stethoscope size={18} />}
                        />
                      </div>
                      {errors.doctor && <div className="bm-error-text"><span>⚠</span> {errors.doctor}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Personal Details */}
              {currentStep === 2 && (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div className="bm-step-title-row">
                    <h2 className="bm-step-title">Personal Details</h2>
                  </div>
                  <div className="bm-content-card">
                    <div className="bm-grid-2">
                      <div className="bm-input-wrap">
                        <span className="bm-label">Full Name</span>
                        <input className={`bm-input ${errors.name ? 'error' : ''}`} type="text" placeholder="John Doe" value={patientName} onChange={(e) => { setPatientName(e.target.value); setErrors(prev => ({...prev, name: null})); }} />
                        <User className="bm-input-icon" size={18} style={{ top: '39px' }} />
                        {errors.name && <div className="bm-error-text"><span>⚠</span> {errors.name}</div>}
                      </div>
                      <div className="bm-input-wrap">
                        <span className="bm-label">Phone Number</span>
                        <input 
                          className={`bm-input ${errors.phone ? 'error' : ''}`} 
                          type="tel" 
                          placeholder="9876543210" 
                          maxLength={10}
                          value={patientPhone} 
                          onChange={(e) => { 
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) {
                              setPatientPhone(val); 
                              setErrors(prev => ({...prev, phone: null})); 
                            }
                          }} 
                        />
                        <Phone className="bm-input-icon" size={18} style={{ top: '39px' }} />
                        {errors.phone && <div className="bm-error-text"><span>⚠</span> {errors.phone}</div>}
                      </div>
                    </div>
                    <div className="bm-input-wrap">
                      <span className="bm-label">Email Address</span>
                      <input className={`bm-input ${errors.email ? 'error' : ''}`} type="email" placeholder="john@example.com" value={patientEmail} onChange={(e) => { setPatientEmail(e.target.value); setErrors(prev => ({...prev, email: null})); }} />
                      <Mail className="bm-input-icon" size={18} style={{ top: '39px' }} />
                      {errors.email && <div className="bm-error-text"><span>⚠</span> {errors.email}</div>}
                    </div>
                    <div className="bm-input-wrap">
                      <span className="bm-label">Notes (Optional)</span>
                      <textarea className="bm-textarea" style={{ paddingLeft: '16px' }} placeholder="Any specific requirements..." rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Location */}
              {currentStep === 3 && (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div className="bm-step-title-row">
                    <h2 className="bm-step-title">Clinic Location</h2>
                  </div>
                  <div className="bm-content-card" style={{ padding: '20px' }}>
                    {CLINIC_LOCATIONS.map((loc) => (
                      <div
                        key={loc.id}
                        className={`bm-location-card ${selectedLocation?.id === loc.id ? 'selected' : ''}`}
                        onClick={() => setSelectedLocation(loc)}
                      >
                        <div className="bm-loc-icon-wrap">
                          <MapPin size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="bm-location-name">{loc.name}</div>
                          <div className="bm-location-addr">{loc.address}</div>
                          <div className="bm-location-meta">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {loc.hours}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> {loc.phone}</span>
                          </div>
                          <a href={loc.mapUrl} target="_blank" rel="noreferrer" className="bm-map-btn" onClick={(e) => e.stopPropagation()}>
                            <Map size={14} /> View on Google Maps
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Appointment (Date/Time) */}
              {currentStep === 4 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="bm-content-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                    
                    <div className="bm-step-title-row">
                      <h2 className="bm-step-title">Select Date and Time</h2>
                      <div className="bm-month-selector">
                        <button className="bm-month-btn" onClick={handlePrevMonth}><ChevronLeft size={18} /></button>
                        <span>{currentMonthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
                        <button className="bm-month-btn" onClick={handleNextMonth}><ChevronRight size={18} /></button>
                      </div>
                    </div>

                    <div className="bm-date-row">
                      <button className="bm-date-nav"><ChevronLeft size={20} /></button>
                      {datesList.slice(0, 7).map((d, i) => {
                        let label = d.dayName;
                        if (i === 0) label = 'Today';
                        else if (i === 1) label = 'Tomorrow';
                        return (
                          <div 
                            key={d.isoString} 
                            className={`bm-date-item ${selectedDate?.isoString === d.isoString ? 'active' : ''}`}
                            onClick={() => { setSelectedDate(d); setSelectedTimeSlot(null); }}
                          >
                            <span className="bm-date-day">{label}</span>
                            <span className="bm-date-num">{d.dayNum}</span>
                          </div>
                        );
                      })}
                      <button className="bm-date-nav"><ChevronRight size={20} /></button>
                    </div>

                    <div className="bm-slots-grid">
                      {(showAllSlots ? allDoctorSlots : allDoctorSlots.slice(0, 12)).map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            className={`bm-slot-btn ${selectedTimeSlot === slot ? 'selected' : ''} ${errors.timeSlot ? 'error' : ''}`}
                            disabled={isBooked}
                            onClick={() => {
                              if (!isBooked) {
                                setSelectedTimeSlot(slot);
                                setErrors(prev => ({ ...prev, timeSlot: null }));
                              }
                            }}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    {errors.timeSlot && <div className="bm-error-text" style={{ marginBottom: '16px' }}><span>⚠</span> {errors.timeSlot}</div>}
                    
                    {allDoctorSlots.length > 12 && (
                      <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                        <button className="bm-more-slots" onClick={() => setShowAllSlots(p => !p)}>
                          Show {showAllSlots ? 'fewer' : 'more'} slots
                          <ChevronRight size={16} style={{ transform: showAllSlots ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                          <span>({Math.max(0, allDoctorSlots.length - bookedSlots.length)} available)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Payment */}
              {currentStep === 5 && (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div className="bm-step-title-row">
                    <h2 className="bm-step-title">Payment Method</h2>
                  </div>
                  <div className="bm-content-card">
                    <div className="bm-payment-grid">
                      {['Pay at Clinic', 'Razorpay / Online Payment', 'Health Insurance'].map((method) => {
                        const isSelected = paymentMethod === method;
                        return (
                          <div
                            key={method}
                            className={`bm-payment-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod(method)}
                          >
                            <div className="bm-payment-icon">
                              {method === 'Pay at Clinic' && <Banknote size={24} />}
                              {method === 'Razorpay / Online Payment' && <CreditCard size={24} />}
                              {method === 'Health Insurance' && <ShieldCheck size={24} />}
                            </div>
                            <div className="bm-payment-info">
                              <div className="bm-payment-name">{method}</div>
                              <div className="bm-payment-desc">
                                {method === 'Pay at Clinic' ? 'Pay cash, UPI, or card at the reception.' : method === 'Razorpay / Online Payment' ? 'Secure online transaction using Razorpay.' : 'Submit your policy details at the clinic.'}
                              </div>
                            </div>
                            <div className="bm-payment-radio"></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Confirmation */}
              {currentStep === 6 && (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div className="bm-content-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', margin: '0' }}>
                    <div className="bm-success-content" style={{ width: '100%', maxWidth: '500px' }}>
                      <div className="bm-success-icon no-print" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                          <Check size={36} strokeWidth={3} />
                        </div>
                      </div>
                      <h2 className="bm-step-title" style={{ marginBottom: '8px', textAlign: 'center' }}>Booking Confirmed!</h2>
                      <p style={{ color: '#6b7280', marginBottom: '32px', textAlign: 'center' }} className="no-print">
                        Thank you for choosing ClearDent.
                      </p>

                      {/* Receipt Block */}
                      <div ref={receiptRef} style={{ textAlign: 'left', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: '0 0 20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Appointment Receipt</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '0.9rem', marginBottom: '8px' }}>
                          <span style={{ color: '#6b7280', fontWeight: '500' }}>Reference ID</span>
                          <span style={{ color: '#111827', fontWeight: '700' }}>LUM-{(bookingSuccessData?._id || '7A8B9C').slice(-6).toUpperCase()}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '0.9rem', marginBottom: '8px' }}>
                          <span style={{ color: '#6b7280', fontWeight: '500' }}>Patient Name</span>
                          <span style={{ color: '#111827', fontWeight: '600' }}>{patientName}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '0.9rem', marginBottom: '8px' }}>
                          <span style={{ color: '#6b7280', fontWeight: '500' }}>Procedure</span>
                          <span style={{ color: '#111827', fontWeight: '600' }}>{bookingSuccessData?.treatmentName || selectedTreatment?.name}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '0.9rem', marginBottom: '8px' }}>
                          <span style={{ color: '#6b7280', fontWeight: '500' }}>Dentist</span>
                          <span style={{ color: '#111827', fontWeight: '600' }}>{bookingSuccessData?.doctorName || selectedDoctor?.name}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '0.9rem', marginBottom: '8px' }}>
                          <span style={{ color: '#6b7280', fontWeight: '500' }}>Date & Time</span>
                          <span style={{ color: '#111827', fontWeight: '600' }}>{bookingSuccessData?.appointmentDate} | {bookingSuccessData?.timeSlot}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '0.9rem', marginBottom: '8px' }}>
                          <span style={{ color: '#6b7280', fontWeight: '500' }}>Location</span>
                          <span style={{ color: '#111827', fontWeight: '600' }}>{bookingSuccessData?.location || selectedLocation?.name}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '0.9rem', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                          <span style={{ color: '#111827', fontWeight: '700', fontSize: '1rem' }}>Total Amount</span>
                          <span style={{ color: '#1A907C', fontWeight: '800', fontSize: '1.1rem' }}>{selectedTreatment?.price}</span>
                        </div>
                      </div>

                      <div className="no-print" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button 
                          className="bm-btn-back" 
                          onClick={handleDownloadPDF}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <Download size={18} />
                          Download Receipt
                        </button>
                        <button className="bm-btn-next" onClick={handleClose}>
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              {currentStep < 6 && (
                <div className="bm-actions">
                  <button className="bm-btn-back" onClick={currentStep === 1 ? handleClose : handleBackStep}>
                    {currentStep === 1 ? 'Cancel' : 'Back'}
                  </button>
                  {currentStep < 5 ? (
                    <button className="bm-btn-next" onClick={handleNextStep}>
                      Next Step
                    </button>
                  ) : (
                    <button className="bm-btn-next" onClick={handleBookingSubmit} disabled={loading}>
                      {loading ? 'Processing...' : 'Confirm Appointment'}
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingModal;
