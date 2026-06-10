import React, { useState, useEffect, useRef } from 'react';
import { createAppointment } from '../../services/appointments';
import { fetchApprovedDoctors } from '../../services/login';
import { TREATMENTS_DATA } from '../../constants/treatments';
import { API_BASE_URL } from '../../config';
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
const CustomSelect = ({ options, value, onChange, placeholder, icon, hasError }) => {
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
    <div className="relative w-full select-none" ref={dropdownRef}>
      <div 
        className={`flex items-center w-full border-[1.5px] rounded-lg p-[14px_16px] cursor-pointer transition-all duration-200 ${
          isOpen ? 'border-[var(--brand-green)] bg-white' : 'border-[#d1d5db] bg-[#f9fafb] hover:border-[var(--brand-green)] hover:bg-white'
        } ${hasError ? 'border-[#ef4444] bg-[#fef2f2]' : ''} ${
          isOpen ? (hasError ? 'shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'shadow-[0_0_0_4px_var(--brand-green-glow)]') : ''
        }`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && (
          <span className={`mr-3 flex items-center transition-colors duration-200 ${(selectedOption || isOpen) ? 'text-[var(--brand-green)]' : 'text-[#9ca3af]'}`}>
            {icon}
          </span>
        )}
        <span className={`flex-1 text-[0.95rem] transition-colors duration-200 ${selectedOption ? 'text-[#111827] font-medium' : 'text-[#6b7280] font-normal'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronRight 
          size={18} 
          className={`text-[#9ca3af] transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`} 
        />
      </div>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-[#e5e7eb] rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-[100] max-h-[250px] overflow-y-auto animate-[bmOptionsIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
          {options.length > 0 ? options.map((opt) => (
            <div 
              key={opt.value}
              className={`p-[12px_16px] text-[0.95rem] cursor-pointer flex items-center justify-between transition-colors duration-100 ${
                value === opt.value ? 'bg-[var(--brand-green-bg-select)] text-[var(--brand-green)] font-semibold' : 'text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827]'
              }`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
              {value === opt.value && <Check size={16} className="text-[var(--brand-green)]" />}
            </div>
          )) : (
            <div className="p-[12px_16px] text-[0.95rem] text-slate-400 cursor-not-allowed">No options available</div>
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
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    };
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

        // Restore saved state after doctors are loaded
        const savedState = localStorage.getItem('booking_form_state');
        if (savedState) {
          try {
            const parsed = JSON.parse(savedState);
            if (parsed.currentStep) setCurrentStep(parsed.currentStep);
            if (parsed.notes) setNotes(parsed.notes);
            if (parsed.patientName && !currentUser) setPatientName(parsed.patientName);
            if (parsed.patientEmail && !currentUser) setPatientEmail(parsed.patientEmail);
            if (parsed.patientPhone && !currentUser) setPatientPhone(parsed.patientPhone);
            if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
            if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
            if (parsed.selectedTimeSlot) setSelectedTimeSlot(parsed.selectedTimeSlot);
            if (parsed.selectedCategoryId) {
                const cat = TREATMENTS_DATA.find(c => c.id === parsed.selectedCategoryId);
                if (cat) setSelectedCategory(cat);
                if (cat && parsed.selectedTreatmentName) {
                    const trt = cat.items.find(t => t.name === parsed.selectedTreatmentName);
                    if (trt) setSelectedTreatment(trt);
                }
            }
            if (parsed.selectedLocationId) {
                const loc = CLINIC_LOCATIONS.find(l => l.id === parsed.selectedLocationId);
                if (loc) setSelectedLocation(loc);
            }
            if (parsed.selectedDoctorName && formatted.length > 0) {
                const doc = formatted.find(d => d.name === parsed.selectedDoctorName);
                if (doc) setSelectedDoctor(doc);
            }
          } catch (e) { console.error('Failed to parse saved state', e); }
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
      }
    };
    if (isOpen) loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        localStorage.removeItem('selected_booking_doctor');
      }
    }
  }, [isOpen, dbDoctors]);

  /* ── Form State Persistence (LocalStorage) ── */
  useEffect(() => {
    if (isOpen && dbDoctors.length > 0 && !bookingSuccessData) {
      const stateToSave = {
        currentStep,
        selectedCategoryId: selectedCategory?.id,
        selectedTreatmentName: selectedTreatment?.name,
        selectedDoctorName: selectedDoctor?.name,
        selectedDate: selectedDate || null,
        selectedTimeSlot,
        selectedLocationId: selectedLocation?.id,
        notes,
        patientName,
        patientEmail,
        patientPhone,
        paymentMethod
      };
      localStorage.setItem('booking_form_state', JSON.stringify(stateToSave));
    }
  }, [isOpen, dbDoctors, currentStep, selectedCategory, selectedTreatment, selectedDoctor, selectedDate, selectedTimeSlot, selectedLocation, notes, patientName, patientEmail, patientPhone, paymentMethod, bookingSuccessData]);

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
    const socket = io(API_BASE_URL);
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
        const res = await fetch(`${API_BASE_URL}/api/appointments/booked?doctorName=${encodeURIComponent(selectedDoctor.name)}&date=${encodeURIComponent(selectedDate.fullDateString)}`, {
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

      if (paymentMethod === 'Pay at Clinic') {
        const payload = {
          ...appointmentData,
          paymentStatus: 'Pending',
          paymentMethod: 'Pay at Clinic'
        };
        const created = await createAppointment(payload);
        localStorage.removeItem('booking_form_state');
        setBookingSuccessData(created);
        setCurrentStep(6);
        setLoading(false);
        return;
      }

      if (paymentMethod === 'Razorpay / Online Payment') {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          window.showError?.('Razorpay SDK failed to load. Are you online?');
          setLoading(false);
          return;
        }

        let numericPrice = selectedTreatment.price.replace(/[^0-9.]/g, '');
        if (!numericPrice) numericPrice = '500'; // fallback
        
        const orderResponse = await fetch(`${API_BASE_URL}/api/payment/order`, {
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
              const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
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
                window.showToast?.('success', 'Payment successful! Appointment confirmed.');
                localStorage.removeItem('booking_form_state');
                setBookingSuccessData(result.appointment);
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
            color: '#1d4ed8'
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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[99999] flex items-center justify-center p-4 animate-[bmOverlayIn_0.2s_ease_forwards] font-sans" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
        <div className="bg-[#f4f7f6] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-[1000px] h-[600px] max-md:h-[90vh] max-md:max-h-[620px] flex overflow-hidden relative animate-[bmCardIn_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards] before:content-[''] before:absolute before:-bottom-[100px] before:-left-[100px] before:w-[400px] before:h-[400px] before:bg-[radial-gradient(circle,_var(--brand-green-gradient-1)_0%,_transparent_70%)] before:pointer-events-none before:z-0 after:content-[''] after:absolute after:-top-[50px] after:-right-[50px] after:w-[300px] after:h-[300px] after:bg-[radial-gradient(circle,_var(--brand-green-gradient-2)_0%,_transparent_70%)] after:pointer-events-none after:z-0">
          <div className="flex flex-col md:flex-row flex-1 w-full z-[1] overflow-hidden">
            
            {/* ─── DESKTOP SIDEBAR ─── */}
            <div className="hidden md:flex w-[280px] shrink-0 p-[40px_30px] flex-col border-r border-black/[0.04]">
              <div className="flex items-center gap-2.5 mb-[50px]">
                <svg className="text-[var(--brand-green)] w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6a3.5 3.5 0 0 0-3.5 3.5c0 3.5 3.5 6.5 3.5 6.5s3.5-3 3.5-6.5A3.5 3.5 0 0 0 12 6z" />
                </svg>
                <span className="text-xl font-bold text-[#111827] tracking-[-0.01em]">ClearDent</span>
              </div>
 
              <nav className="flex flex-col flex-1 relative">
                {STEPS.map((step) => {
                  const isDone = currentStep > step.number;
                  const isActive = currentStep === step.number;
                  
                  const dotStatusClass = isDone 
                    ? 'border-[1.5px] border-[var(--brand-green)] text-[var(--brand-green)]' 
                    : isActive 
                      ? 'bg-[var(--brand-green)] border-[1.5px] border-[var(--brand-green)] text-white' 
                      : 'border-[1.5px] border-[#d1d5db] text-[#9ca3af]';

                  const labelStatusClass = isDone
                    ? 'text-[#4b5563]'
                    : isActive
                      ? 'text-[#111827] font-semibold'
                      : 'text-[#9ca3af]';

                  return (
                    <div key={step.number} className={`flex items-start gap-4 relative pb-[30px] last:pb-0 after:content-[''] after:absolute after:left-[15px] after:top-8 after:bottom-2 after:w-[1.5px] ${isDone ? 'after:bg-[var(--brand-green)]' : 'after:bg-[#d1d5db]'} last:after:hidden`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.85rem] font-semibold shrink-0 relative z-[2] bg-[#f4f7f6] ${dotStatusClass}`}>
                        {isDone ? <Check size={16} strokeWidth={3} /> : step.number}
                      </div>
                      <span className={`text-[0.95rem] font-medium mt-1.5 ${labelStatusClass}`}>
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </nav>
              <div className="flex items-center gap-2 text-[0.85rem] text-[#4b5563] mt-auto font-medium">
                <HelpCircle size={16} />
                Need help with booking?
              </div>
            </div>

            {/* ─── MOBILE HEADER STEPPER ─── */}
            <div className="flex md:hidden w-full p-4 border-b border-black/[0.04] bg-[#e8f1ed] flex-col gap-2 shrink-0 select-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="text-[var(--brand-green)] w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 6a3.5 3.5 0 0 0-3.5 3.5c0 3.5 3.5 6.5 3.5 6.5s3.5-3 3.5-6.5A3.5 3.5 0 0 0 12 6z" />
                  </svg>
                  <span className="text-base font-bold text-[#111827] tracking-[-0.01em]">ClearDent</span>
                </div>
                <button className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-700 p-1 text-xs font-bold uppercase tracking-wider" onClick={handleClose}>
                  Cancel
                </button>
              </div>
              <div className="flex items-center justify-between px-1 relative w-full mt-1">
                {/* Connecting Line */}
                <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#cbdad6] z-0" />
                
                {STEPS.map((step) => {
                  const isDone = currentStep > step.number;
                  const isActive = currentStep === step.number;
                  
                  return (
                    <div key={step.number} className="relative z-10">
                      {isDone ? (
                        <div className="w-6 h-6 rounded-full bg-white border border-[var(--brand-green)] text-[var(--brand-green)] flex items-center justify-center shadow-xs">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      ) : isActive ? (
                        <div className="w-6 h-6 rounded-full bg-[var(--brand-green)] text-white flex items-center justify-center font-bold text-xs shadow-md border border-[var(--brand-green)]">
                          {step.number}
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white text-[#9ca3af] border border-[#d1d5db] flex items-center justify-center font-semibold text-xs">
                          {step.number}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-1">
                <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-[var(--brand-green)]">
                  Step {currentStep} of 6: {STEPS[currentStep - 1]?.name}
                </span>
              </div>
            </div>
 
            {/* ─── CONTENT AREA ─── */}
            <div className="flex-1 flex flex-col p-10 max-md:p-5 overflow-y-auto">
              
              {/* STEP 1: Service */}
              {currentStep === 1 && (
                <div className="flex-1 overflow-y-auto">
                  <div className="flex justify-between items-center mb-[30px]">
                    <h2 className="text-[1.45rem] font-bold text-[#1f2937] m-0">Select Service</h2>
                  </div>
                  <div className="bg-white border border-gray-200/50 rounded-xl p-[30px] max-md:p-5 mb-6 max-md:mb-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="relative mb-6">
                      <span className="text-[0.85rem] font-semibold text-[#4b5563] mb-2 block">Category</span>
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
                        hasError={!!errors.category}
                      />
                      {errors.category && <div className="text-[#ef4444] text-[0.8rem] font-medium mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.category}</div>}
                    </div>
 
                    <div className="relative mb-6">
                      <span className="text-[0.85rem] font-semibold text-[#4b5563] mb-2 block">Procedure</span>
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
                        hasError={!!errors.treatment}
                      />
                      {errors.treatment && <div className="text-[#ef4444] text-[0.8rem] font-medium mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.treatment}</div>}
                    </div>
 
                    <div className="relative mb-6">
                      <span className="text-[0.85rem] font-semibold text-[#4b5563] mb-2 block">Assigned Dentist</span>
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
                        hasError={!!errors.doctor}
                      />
                      {errors.doctor && <div className="text-[#ef4444] text-[0.8rem] font-medium mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.doctor}</div>}
                    </div>
                  </div>
                </div>
              )}
 
              {/* STEP 2: Personal Details */}
              {currentStep === 2 && (
                <div className="flex-1 overflow-y-auto">
                  <div className="flex justify-between items-center mb-[30px]">
                    <h2 className="text-[1.45rem] font-bold text-[#1f2937] m-0">Personal Details</h2>
                  </div>
                  <div className="bg-white border border-gray-200/50 rounded-xl p-[30px] max-md:p-5 mb-6 max-md:mb-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="relative mb-6">
                        <span className="text-[0.85rem] font-semibold text-[#4b5563] mb-2 block">Full Name</span>
                        <input className={`peer w-full border-[1.5px] rounded-lg p-[14px_16px] pl-[42px] text-[0.95rem] text-[#111827] outline-none transition-all duration-200 font-sans focus:bg-white ${errors.name ? 'border-[#ef4444] bg-[#fef2f2] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#d1d5db] bg-[#f9fafb] focus:border-[var(--brand-green)] focus:shadow-[0_0_0_4px_var(--brand-green-glow)]'}`} type="text" placeholder="John Doe" value={patientName} onChange={(e) => { setPatientName(e.target.value); setErrors(prev => ({...prev, name: null})); }} />
                        <User className={`absolute left-3.5 top-[39px] pointer-events-none transition-colors duration-200 peer-focus:text-[var(--brand-green)] ${errors.name ? 'text-[#ef4444]' : 'text-[#9ca3af]'}`} size={18} />
                        {errors.name && <div className="text-[#ef4444] text-[0.8rem] font-medium mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.name}</div>}
                      </div>
                      <div className="relative mb-6">
                        <span className="text-[0.85rem] font-semibold text-[#4b5563] mb-2 block">Phone Number</span>
                        <input 
                          className={`peer w-full border-[1.5px] rounded-lg p-[14px_16px] pl-[42px] text-[0.95rem] text-[#111827] outline-none transition-all duration-200 font-sans focus:bg-white ${errors.phone ? 'border-[#ef4444] bg-[#fef2f2] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#d1d5db] bg-[#f9fafb] focus:border-[var(--brand-green)] focus:shadow-[0_0_0_4px_var(--brand-green-glow)]'}`} 
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
                        <Phone className={`absolute left-3.5 top-[39px] pointer-events-none transition-colors duration-200 peer-focus:text-[var(--brand-green)] ${errors.phone ? 'text-[#ef4444]' : 'text-[#9ca3af]'}`} size={18} />
                        {errors.phone && <div className="text-[#ef4444] text-[0.8rem] font-medium mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.phone}</div>}
                      </div>
                    </div>
                    <div className="relative mb-6">
                      <span className="text-[0.85rem] font-semibold text-[#4b5563] mb-2 block">Email Address</span>
                      <input className={`peer w-full border-[1.5px] rounded-lg p-[14px_16px] pl-[42px] text-[0.95rem] text-[#111827] outline-none transition-all duration-200 font-sans focus:bg-white ${errors.email ? 'border-[#ef4444] bg-[#fef2f2] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#d1d5db] bg-[#f9fafb] focus:border-[var(--brand-green)] focus:shadow-[0_0_0_4px_var(--brand-green-glow)]'}`} type="email" placeholder="john@example.com" value={patientEmail} onChange={(e) => { setPatientEmail(e.target.value); setErrors(prev => ({...prev, email: null})); }} />
                      <Mail className={`absolute left-3.5 top-[39px] pointer-events-none transition-colors duration-200 peer-focus:text-[var(--brand-green)] ${errors.email ? 'text-[#ef4444]' : 'text-[#9ca3af]'}`} size={18} />
                      {errors.email && <div className="text-[#ef4444] text-[0.8rem] font-medium mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.email}</div>}
                    </div>
                    <div className="relative mb-6">
                      <span className="text-[0.85rem] font-semibold text-[#4b5563] mb-2 block">Notes (Optional)</span>
                      <textarea className="w-full border-[1.5px] border-[#d1d5db] rounded-lg p-[14px_16px] pl-4 text-[0.95rem] text-[#111827] bg-[#f9fafb] outline-none transition-all duration-200 font-sans focus:border-[var(--brand-green)] focus:bg-white focus:shadow-[0_0_0_4px_var(--brand-green-glow)]" placeholder="Any specific requirements..." rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Location */}
              {currentStep === 3 && (
                <div className="flex-1 overflow-y-auto">
                  <div className="flex justify-between items-center mb-[30px]">
                    <h2 className="text-[1.45rem] font-bold text-[#1f2937] m-0">Clinic Location</h2>
                  </div>
                  <div className="bg-white border border-gray-200/50 rounded-xl p-5 mb-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                    {CLINIC_LOCATIONS.map((loc) => (
                      <div
                        key={loc.id}
                        className={`border-2 rounded-xl p-5 mb-4 cursor-pointer bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.06)] ${selectedLocation?.id === loc.id ? 'border-[var(--brand-green)] bg-[var(--brand-green-bg)]' : 'border-transparent'}`}
                        onClick={() => setSelectedLocation(loc)}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200 ${selectedLocation?.id === loc.id ? 'bg-[var(--brand-green)] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                           <MapPin size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[#111827] mb-1.5 text-[1.05rem]">{loc.name}</div>
                          <div className="text-[0.9rem] text-[#4b5563] mb-3 leading-[1.4]">{loc.address}</div>
                          <div className="flex gap-4 text-[0.8rem] text-[#6b7280] font-medium">
                            <span className="flex items-center gap-1"><Clock size={14} /> {loc.hours}</span>
                            <span className="flex items-center gap-1"><Phone size={14} /> {loc.phone}</span>
                          </div>
                          <a href={loc.mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[0.85rem] text-[var(--brand-green)] font-semibold no-underline hover:underline" onClick={(e) => e.stopPropagation()}>
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
                <div className="flex-1 flex flex-col">
                  <div className="bg-white border border-gray-200/50 rounded-xl p-[30px] max-md:p-4 mb-6 max-md:mb-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex-1 flex flex-col mb-5">
                    
                    <div className="flex justify-between items-center mb-[30px]">
                      <h2 className="text-[1.45rem] font-bold text-[#1f2937] m-0">Select Date and Time</h2>
                      <div className="flex items-center gap-3 p-[8px_16px] border border-[#e5e7eb] rounded-md text-[0.9rem] font-semibold text-[#374151]">
                        <button className="bg-none border-none cursor-pointer text-[#9ca3af] p-0 hover:text-[#111827]" onClick={handlePrevMonth}><ChevronLeft size={18} /></button>
                        <span>{currentMonthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
                        <button className="bg-none border-none cursor-pointer text-[#9ca3af] p-0 hover:text-[#111827]" onClick={handleNextMonth}><ChevronRight size={18} /></button>
                      </div>
                    </div>
 
                    <div className="flex items-center gap-4 border-b border-[#e5e7eb] pb-3 mb-5 overflow-x-auto scrollable-dates no-scrollbar">
                      {datesList.map((d, i) => {
                        let label = d.dayName;
                        if (i === 0) label = 'Today';
                        else if (i === 1) label = 'Tomorrow';
                        const isSelected = selectedDate?.isoString === d.isoString;
                        return (
                          <div 
                            key={d.isoString} 
                            className={`flex flex-col items-center gap-1.5 cursor-pointer shrink-0 min-w-[52px] pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:rounded-t-[2px] ${isSelected ? 'after:bg-[#111827]' : 'after:bg-transparent'}`}
                            onClick={() => { setSelectedDate(d); setSelectedTimeSlot(null); }}
                          >
                            <span className={`text-[0.78rem] font-medium ${isSelected ? 'text-[#111827] font-bold' : 'text-[#6b7280]'}`}>{label}</span>
                            <span className={`text-[1.08rem] font-extrabold ${isSelected ? 'text-[#111827]' : 'text-[#374151]'}`}>{d.dayNum}</span>
                          </div>
                        );
                      })}
                    </div>
 
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3 mb-2">
                      {(showAllSlots ? allDoctorSlots : allDoctorSlots.slice(0, 12)).map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = selectedTimeSlot === slot;
                        const btnClass = `p-[12px_10px] rounded-lg text-[0.85rem] font-semibold transition-all duration-200 text-center ` +
                          (isBooked 
                            ? 'opacity-40 cursor-not-allowed bg-[#f3f4f6] line-through border border-[#d1d5db] text-[#374151]' 
                            : isSelected 
                              ? 'bg-[var(--brand-green)] border border-[var(--brand-green)] text-white shadow-[0_4px_10px_var(--brand-green-glow-strong)]' 
                              : errors.timeSlot 
                                ? 'border border-[#ef4444] bg-[#fef2f2] text-[#ef4444]' 
                                : 'bg-white border border-[#d1d5db] text-[#374151] hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] hover:bg-[var(--brand-green-light)]');
                        return (
                          <button
                            key={slot}
                            className={btnClass}
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
                    {errors.timeSlot && <div className="text-[#ef4444] text-[0.8rem] font-medium mt-1.5 flex items-center gap-1 mb-4"><span>⚠</span> {errors.timeSlot}</div>}
                    
                    {allDoctorSlots.length > 12 && (
                      <div className="mt-auto pt-2.5">
                        <button className="flex items-center gap-1 bg-none border-none cursor-pointer text-[var(--brand-green)] text-[0.85rem] font-semibold p-0" onClick={() => setShowAllSlots(p => !p)}>
                          Show {showAllSlots ? 'fewer' : 'more'} slots
                          <ChevronRight size={16} className={`transition-transform duration-200 ${showAllSlots ? '-rotate-90' : 'rotate-90'}`} />
                          <span>({Math.max(0, allDoctorSlots.length - bookedSlots.length)} available)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
 
              {/* STEP 5: Payment */}
              {currentStep === 5 && (
                <div className="flex-1 overflow-y-auto">
                  <div className="flex justify-between items-center mb-[30px]">
                    <h2 className="text-[1.45rem] font-bold text-[#1f2937] m-0">Payment Method</h2>
                  </div>
                  <div className="bg-white border border-gray-200/50 rounded-xl p-[30px] max-md:p-5 mb-6 max-md:mb-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="grid grid-cols-1 gap-4">
                      {['Pay at Clinic', 'Razorpay / Online Payment', 'Health Insurance'].map((method) => {
                        const isSelected = paymentMethod === method;
                        return (
                          <div
                            key={method}
                            className={`border-2 rounded-xl p-[18px_20px] flex items-center gap-4 cursor-pointer bg-white transition-all duration-200 ${isSelected ? 'border-[var(--brand-green)] bg-[var(--brand-green-bg-alt)] shadow-[0_4px_12px_var(--brand-green-glow)]' : 'border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#f9fafb]'}`}
                            onClick={() => setPaymentMethod(method)}
                          >
                            <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors duration-200 ${isSelected ? 'bg-[var(--brand-green)] text-white' : 'bg-[#f3f4f6] text-[#4b5563]'}`}>
                              {method === 'Pay at Clinic' && <Banknote size={24} />}
                              {method === 'Razorpay / Online Payment' && <CreditCard size={24} />}
                              {method === 'Health Insurance' && <ShieldCheck size={24} />}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-[#111827] text-base mb-1">{method}</div>
                              <div className="text-[0.85rem] text-[#6b7280]">
                                {method === 'Pay at Clinic' ? 'Pay cash, UPI, or card at the reception.' : method === 'Razorpay / Online Payment' ? 'Secure online transaction using Razorpay.' : 'Submit your policy details at the clinic.'}
                              </div>
                            </div>
                            <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-[var(--brand-green)] bg-[var(--brand-green)]' : 'border-[#d1d5db]'}`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Confirmation */}
              {currentStep === 6 && (
                <div className="flex-1 overflow-y-auto">
                  <div className="bg-white border border-gray-200/50 rounded-xl p-[30px] max-md:p-5 mb-6 max-md:mb-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center py-10 px-5 !m-0">
                    <div className="w-full max-w-[500px]">
                      <div className="no-print flex justify-center mb-4">
                        <div className="w-[60px] h-[60px] rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <Check size={36} strokeWidth={3} />
                        </div>
                      </div>
                      <h2 className="text-[1.45rem] font-bold text-[#1f2937] mb-2 text-center">Booking Confirmed!</h2>
                      <p className="text-slate-500 mb-8 text-center no-print">
                        Thank you for choosing ClearDent.
                      </p>
 
                      {/* Receipt Block */}
                      <div ref={receiptRef} className="text-left bg-slate-50 border border-slate-200 rounded-xl p-8 mb-7">
                        <h3 className="text-[1.1rem] font-bold text-slate-900 m-0 mb-5 border-b border-slate-200 pb-2.5">Appointment Receipt</h3>
                        
                        <div className="grid grid-cols-[1fr_2fr] gap-3 text-[0.9rem] mb-2">
                          <span className="text-slate-500 font-medium">Reference ID</span>
                          <span className="text-slate-900 font-bold">LUM-{(bookingSuccessData?._id || '7A8B9C').slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-3 text-[0.9rem] mb-2">
                          <span className="text-slate-500 font-medium">Patient Name</span>
                          <span className="text-slate-900 font-semibold">{patientName}</span>
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-3 text-[0.9rem] mb-2">
                          <span className="text-slate-500 font-medium">Procedure</span>
                          <span className="text-slate-900 font-semibold">{bookingSuccessData?.treatmentName || selectedTreatment?.name}</span>
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-3 text-[0.9rem] mb-2">
                          <span className="text-slate-500 font-medium">Dentist</span>
                          <span className="text-slate-900 font-semibold">{bookingSuccessData?.doctorName || selectedDoctor?.name}</span>
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-3 text-[0.9rem] mb-2">
                          <span className="text-slate-500 font-medium">Date & Time</span>
                          <span className="text-slate-900 font-semibold">{bookingSuccessData?.appointmentDate} | {bookingSuccessData?.timeSlot}</span>
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-3 text-[0.9rem] mb-2">
                          <span className="text-slate-500 font-medium">Location</span>
                          <span className="text-slate-900 font-semibold">{bookingSuccessData?.location || selectedLocation?.name}</span>
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-3 text-[0.9rem] mt-4 pt-4 border-t border-slate-200">
                          <span className="text-slate-900 font-bold text-[1rem]">Total Amount</span>
                          <span className="text-[var(--brand-green)] font-extrabold text-[1.1rem]">{selectedTreatment?.price}</span>
                        </div>
                      </div>
 
                      <div className="no-print flex gap-4 justify-center">
                        <button 
                          className="p-[12px_32px] border border-[#d1d5db] rounded-lg bg-transparent text-[#4b5563] text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-[#f3f4f6] hover:text-[#111827] flex items-center gap-2" 
                          onClick={handleDownloadPDF}
                        >
                          <Download size={18} />
                          Download Receipt
                        </button>
                        <button className="p-[12px_40px] border-none rounded-lg bg-[var(--brand-green)] text-white text-base font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_12px_var(--brand-green-glow-strong)] hover:bg-[var(--brand-green-hover)] hover:shadow-[0_6px_16px_var(--brand-green-glow-stronger)] disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleClose}>
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
 
              {/* Actions Footer */}
              {currentStep < 6 && (
                <div className="flex justify-end gap-4 mt-auto">
                  <button className="p-[12px_32px] border border-[#d1d5db] rounded-lg bg-transparent text-[#4b5563] text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-[#f3f4f6] hover:text-[#111827]" onClick={currentStep === 1 ? handleClose : handleBackStep}>
                    {currentStep === 1 ? 'Cancel' : 'Back'}
                  </button>
                  {currentStep < 5 ? (
                    <button className="p-[12px_40px] border-none rounded-lg bg-[var(--brand-green)] text-white text-base font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_12px_var(--brand-green-glow-strong)] hover:bg-[var(--brand-green-hover)] hover:shadow-[0_6px_16px_var(--brand-green-glow-stronger)] disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleNextStep}>
                      Next Step
                    </button>
                  ) : (
                    <button className="p-[12px_40px] border-none rounded-lg bg-[var(--brand-green)] text-white text-base font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_12px_var(--brand-green-glow-strong)] hover:bg-[var(--brand-green-hover)] hover:shadow-[0_6px_16px_var(--brand-green-glow-stronger)] disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleBookingSubmit} disabled={loading}>
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
