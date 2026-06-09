import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { createAppointment } from '../../services/appointments';
import { fetchApprovedDoctors } from '../../services/login';
import { TREATMENTS_DATA } from '../../constants/treatments';
import { io } from 'socket.io-client';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Phone,
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const DOCTOR_AVATARS_LIST = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'
];

const getDoctorPhoto = (name, index) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('sarah') || lowercaseName.includes('emily') || lowercaseName.includes('bianchi') || lowercaseName.includes('maria') || lowercaseName.includes('jenkins') || lowercaseName.includes('carter') || lowercaseName.includes('sophia') || lowercaseName.includes('bennett')) {
    return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';
  }
  if (lowercaseName.includes('serhii') || lowercaseName.includes('kinash') || lowercaseName.includes('luca') || lowercaseName.includes('novak') || lowercaseName.includes('michael')) {
    return 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
  }
  if (lowercaseName.includes('marcus') || lowercaseName.includes('thorne') || lowercaseName.includes('annette')) {
    return 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80';
  }
  if (lowercaseName.includes('daniel') || lowercaseName.includes('rossi')) {
    return 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80';
  }
  return DOCTOR_AVATARS_LIST[index % DOCTOR_AVATARS_LIST.length];
};

const CLINIC_LOCATIONS = [
  {
    id: 'downtown',
    name: 'ClearDent Smile Studio - Downtown',
    address: '120 Medical Plaza, Suite 400, Downtown',
    hours: '8:00 AM - 8:00 PM',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 'westside',
    name: 'ClearDent Westside Dental Hub',
    address: '450 Wellness Blvd, Block B, Westside',
    hours: '9:00 AM - 7:00 PM',
    phone: '+1 (555) 765-4321'
  }
];

function BookingPage({ navigate, isLoggedIn, currentUser, onLogout, activeTab, setActiveTab, setPortalSubTab }) {
  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);

  // Selection States
  const [selectedCategory, setSelectedCategory] = useState(TREATMENTS_DATA[0]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(CLINIC_LOCATIONS[0]);
  const [notes, setNotes] = useState('');

  // Personal details states (prefilled from currentUser)
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('Pay at Clinic');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyId, setInsurancePolicyId] = useState('');

  // Calendar month selection state
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // Data lists & loading states
  const [dbDoctors, setDbDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);
  const [showAllSlots, setShowAllSlots] = useState(false);

  // Sync personal details when user loads
  useEffect(() => {
    if (currentUser) {
      setPatientName(currentUser.name || '');
      setPatientEmail(currentUser.email || '');
      setPatientPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Establish Socket.io connection for real-time slot sync
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('🔌 Connected to patient booking real-time notification socket');
    });

    // Listen for doctor availability updates (real-time slot config changes)
    socket.on('availabilityUpdated', (data) => {
      console.log('⚡ Doctor availability updated in real-time:', data);
      setDbDoctors(prevDocs => {
        return prevDocs.map(doc => {
          if (doc.name.toLowerCase() === data.doctorName.toLowerCase()) {
            return {
              ...doc,
              availability: data.availability,
              timeSlots: data.timeSlots
            };
          }
          return doc;
        });
      });
    });

    // Listen for new booking request (dynamic slot booking disable)
    socket.on('appointmentCreated', (data) => {
      if (selectedDoctor && selectedDate && data.appointment.doctorName === selectedDoctor.name && data.appointment.appointmentDate === selectedDate.fullDateString) {
        setBookedSlots(prev => {
          if (!prev.includes(data.appointment.timeSlot)) {
            return [...prev, data.appointment.timeSlot];
          }
          return prev;
        });
      }
    });

    // Listen for cancellation or approval updates (dynamic slot release)
    socket.on('appointmentStatusUpdated', (data) => {
      if (selectedDoctor && selectedDate && data.appointment.doctorName === selectedDoctor.name && data.appointment.appointmentDate === selectedDate.fullDateString) {
        if (data.appointment.status === 'Cancelled') {
          setBookedSlots(prev => prev.filter(s => s !== data.appointment.timeSlot));
        } else {
          setBookedSlots(prev => {
            if (!prev.includes(data.appointment.timeSlot)) {
              return [...prev, data.appointment.timeSlot];
            }
            return prev;
          });
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedDoctor, selectedDate]);

  // Fetch booked slots from backend
  useEffect(() => {
    const fetchBooked = async () => {
      if (!selectedDoctor || !selectedDate) {
        setBookedSlots([]);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/appointments/booked?doctorName=${encodeURIComponent(selectedDoctor.name)}&date=${encodeURIComponent(selectedDate.fullDateString)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setBookedSlots(data.map(a => a.timeSlot));
        }
      } catch (err) {
        console.error('Error fetching booked slots:', err);
      }
    };

    fetchBooked();
  }, [selectedDoctor, selectedDate]);

  // Load approved doctors
  useEffect(() => {
    const loadApprovedDoctors = async () => {
      try {
        const docs = await fetchApprovedDoctors();
        const formattedDocs = docs.map((d, index) => ({
          name: d.name,
          specialty: d.specialization || 'Dental Specialist',
          rating: '5.0',
          exp: 'Clinical Specialist',
          photo: getDoctorPhoto(d.name, index),
          timeSlots: (d.timeSlots && d.timeSlots.length > 0) ? d.timeSlots : ['9:00 AM', '10:30 AM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'],
          availability: d.availability || []
        }));
        setDbDoctors(formattedDocs);
      } catch (err) {
        console.error('Failed to load doctors:', err);
      }
    };

    loadApprovedDoctors();
  }, []);

  // Redirect to login if user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('login');
    }
  }, [isLoggedIn, navigate]);

  // Load pre-selected category/treatment/doctor from localStorage
  useEffect(() => {
    const savedCategory = localStorage.getItem('selected_booking_category');
    const savedTreatment = localStorage.getItem('selected_booking_treatment');
    if (savedCategory) {
      const categoryObj = TREATMENTS_DATA.find(c => c.id === savedCategory);
      if (categoryObj) {
        setSelectedCategory(categoryObj);
        if (savedTreatment) {
          const treatmentObj = categoryObj.items.find(t => t.name === savedTreatment);
          if (treatmentObj) {
            setSelectedTreatment(treatmentObj);
          }
        }
      }
      localStorage.removeItem('selected_booking_category');
      localStorage.removeItem('selected_booking_treatment');
    }
  }, []);

  useEffect(() => {
    const savedDoctor = localStorage.getItem('selected_booking_doctor');
    if (savedDoctor && dbDoctors.length > 0) {
      const docObj = dbDoctors.find(d => d.name === savedDoctor);
      if (docObj) {
        setSelectedDoctor(docObj);
        const spec = docObj.specialty.toLowerCase();
        const matchedCategory = TREATMENTS_DATA.find(c => 
          spec.includes(c.category.toLowerCase().split(' ')[0])
        );
        if (matchedCategory) {
          setSelectedCategory(matchedCategory);
        }
      }
      localStorage.removeItem('selected_booking_doctor');
    }
  }, [dbDoctors]);

  // Automatically update selected doctor when category changes
  const prevCategory = useRef(selectedCategory);
  useEffect(() => {
    if (selectedCategory && dbDoctors.length > 0 && (prevCategory.current !== selectedCategory || !selectedDoctor)) {
      let matchedDoc = dbDoctors.find(d => 
        d.specialty.toLowerCase().includes(selectedCategory.category.toLowerCase().split(' ')[0])
      );
      if (!matchedDoc) {
        matchedDoc = dbDoctors[0]; // fallback
      }
      setSelectedDoctor(matchedDoc || null);
      setSelectedTimeSlot(null);
      prevCategory.current = selectedCategory;
    }
  }, [selectedCategory, dbDoctors, selectedDoctor]);

  // Filter doctors by treatment category
  const filteredDoctors = dbDoctors.filter(d => {
    if (!selectedCategory) return true;
    const catFirstWord = selectedCategory.category.toLowerCase().split(' ')[0];
    return d.specialty.toLowerCase().includes(catFirstWord);
  });

  // Calendar Date helper
  const getDatesForMonth = (monthDate) => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      if (d < today) continue; // skip past dates
      
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

  // Default select date
  useEffect(() => {
    if (datesList.length > 0 && !selectedDate) {
      setSelectedDate(datesList[0]);
    }
  }, [datesList, selectedDate]);

  // Fetch slots based on doctor availability database profile
  const getDoctorSlotsForSelectedDate = () => {
    if (!selectedDoctor || !selectedDate) return [];
    
    const dayMap = {
      'Mon': 'Monday',
      'Tue': 'Tuesday',
      'Wed': 'Wednesday',
      'Thu': 'Thursday',
      'Fri': 'Friday',
      'Sat': 'Saturday',
      'Sun': 'Sunday'
    };
    const fullDayName = dayMap[selectedDate.dayName];
    const dayAvailability = selectedDoctor.availability?.find(item => item.day === fullDayName);
    
    let slots = [];
    if (dayAvailability && dayAvailability.slots && dayAvailability.slots.length > 0) {
      slots = dayAvailability.slots.map(s => `${s.start} - ${s.end}`);
    }
    
    return slots;
  };

  const allDoctorSlots = getDoctorSlotsForSelectedDate();
  const availableSlotsCount = allDoctorSlots.filter(s => !bookedSlots.includes(s)).length;

  const handlePrevMonth = () => {
    const today = new Date();
    if (currentMonthDate.getFullYear() === today.getFullYear() && currentMonthDate.getMonth() === today.getMonth()) {
      return; // prevent going into past months
    }
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const getDayLabel = (dateObj) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const target = new Date(dateObj);
    target.setHours(0, 0, 0, 0);
    
    if (target.getTime() === today.getTime()) return 'Today';
    if (target.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[target.getDay()];
  };

  // Stepper Steps configuration
  const STEPS = [
    { number: 1, name: 'Service' },
    { number: 2, name: 'Personal details' },
    { number: 3, name: 'Location' },
    { number: 4, name: 'Appointment' },
    { number: 5, name: 'Payment' },
    { number: 6, name: 'Confirmation' }
  ];

  // Navigate to next/prev steps
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedTreatment) {
        window.showError?.('Please select a dental treatment procedure.');
        return;
      }
      if (!selectedDoctor) {
        window.showError?.('Please choose an attending dentist.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!patientName.trim()) {
        window.showError?.('Please enter your full name.');
        return;
      }
      if (!patientPhone.trim()) {
        window.showError?.('Please enter your contact phone number.');
        return;
      }
    }
    if (currentStep === 4 && (!selectedDoctor || !selectedDate || !selectedTimeSlot)) {
      window.showError?.('Please select a Date and Time Slot.');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // String formatting helper for selection block (matches pixel reference)
  const getSelectedDateTimeString = () => {
    if (!selectedDate || !selectedTimeSlot) return '';
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdayName = weekdays[selectedDate.dateObj.getDay()];
    const cleanSlotRange = selectedTimeSlot.replace(/\s*[AP]M\s*/gi, ''); // e.g. "07:15 - 07:30"
    return `${weekdayName}, ${selectedDate.monthFull} ${selectedDate.dayNum} , ${cleanSlotRange}`;
  };

  // Submit Booking to MongoDB Atlas
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!selectedTreatment) {
      window.showError?.('Please select a dental treatment.');
      return;
    }
    if (!selectedDoctor) {
      window.showError?.('Please choose an expert dentist.');
      return;
    }
    if (!selectedDate || !selectedTimeSlot) {
      window.showError?.('Please choose an appointment date and time slot.');
      return;
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
        notes: notes,
        location: selectedLocation.name,
        paymentMethod: paymentMethod
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
      window.showError?.(err.message || 'Server error. Failed to book appointment. Please try again.');
    } finally {
      if (paymentMethod !== 'Razorpay / Online Payment') {
        setLoading(false);
      }
    }
  };

  // Reset booking form to start fresh
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
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
    setInsuranceProvider('');
    setInsurancePolicyId('');
    setBookingSuccessData(null);
    setShowAllSlots(false);
    setCurrentMonthDate(new Date());
  };

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(135deg,#e2ece9_0%,#f0f4f3_50%,#e4eff1_100%)] flex flex-col font-sans select-none relative">
        
        {/* Soft atmospheric gradient glows matching the image context */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-teal-250/20 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-10 left-10 w-[550px] h-[550px] rounded-full bg-emerald-200/10 blur-[140px] pointer-events-none z-0" />

        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          currentUser={currentUser}
          navigate={navigate}
          setPortalSubTab={setPortalSubTab}
        />

        {/* Outer Booking Card Container */}
        <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-12 z-10 relative flex items-center justify-center box-border">
          <div className="w-full rounded-[28px] border border-[#cbdad6] shadow-xl flex flex-col md:flex-row bg-[#f4f8f7] overflow-hidden min-h-[580px]">
            
            {/* LEFT COLUMN: STEPPER SIDEBAR */}
            <div className="w-full md:w-[28%] bg-[#e8f1ed] p-8 border-r border-[#cbdad6] flex flex-col justify-between relative min-h-[480px]">
              
              <div className="space-y-10 relative z-10">
                {/* Logo and Brand */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 grid grid-cols-2 gap-1 shrink-0">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#0e8374] flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-white"></div></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#0e8374] flex items-center justify-center opacity-70"><div className="w-1 h-1 rounded-full bg-white"></div></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#0e8374] flex items-center justify-center opacity-80"><div className="w-1 h-1 rounded-full bg-white"></div></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#0e8374] flex items-center justify-center opacity-90"><div className="w-1 h-1 rounded-full bg-white"></div></div>
                  </div>
                  <div>
                    <span className="block text-[1.12rem] font-black tracking-tight text-[#1a332e] leading-none">ClearDent</span>
                    <span className="text-[0.6rem] text-[#0e8374] font-extrabold uppercase tracking-widest block mt-0.5">Dental Studio</span>
                  </div>
                </div>

                {/* Stepper Timeline List */}
                <nav className="relative pl-1.5 space-y-7">
                  <div className="absolute left-[15px] top-1.5 bottom-1.5 w-0.5 bg-[#cbdad6]" />
                  
                  {STEPS.map((step) => {
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;
                    
                    return (
                      <div key={step.number} className="flex items-center gap-4.5 relative z-10">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-white border border-[#0d9488] text-[#0d9488] flex items-center justify-center shadow-xs transition-all">
                            <Check size={14} className="stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-8 h-8 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#0d9488]/20 border border-[#0d9488] transition-all">
                            {step.number}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white text-[#9caea9] border border-[#cbdad6] flex items-center justify-center font-semibold text-sm transition-all">
                            {step.number}
                          </div>
                        )}
                        <span className={`text-[0.7rem] font-bold font-sans tracking-wide uppercase transition-colors ${
                          isActive ? 'text-[#1a332e]' : 'text-[#879d97]'
                        }`}>
                          {step.name}
                        </span>
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer Link */}
              <div className="pt-6 border-t border-[#cbdad6]/50 mt-10 relative z-10 flex items-center gap-1.5 text-[0.72rem] text-[#879d97] font-bold cursor-pointer hover:text-[#1a332e]">
                <HelpCircle size={13} className="text-[#0e8374]" /> Need help with booking?
              </div>
            </div>

            {/* RIGHT COLUMN: MAIN CONTENT wizard forms */}
            <div className="w-full md:w-[72%] p-8 flex flex-col justify-between min-h-[500px]">
              
              {/* STEP 1: SERVICE & DENTIST SELECTOR */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#1a332e] tracking-tight">Select Dental Procedure & Dentist</h2>
                    <p className="text-xs text-[#879d97] mt-0.5">Please choose your category, procedure, and attending dental specialist.</p>
                  </div>

                  {/* White Selection Card Container */}
                  <div className="border border-[#e2ece9] rounded-2xl p-5 bg-white shadow-xs space-y-5">
                    
                    {/* Category Selector Rows */}
                    <div className="space-y-2">
                      <label className="block text-[0.62rem] font-extrabold uppercase tracking-wider text-[#879d97]">1. Treatment Specialty</label>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollable-dates">
                        {TREATMENTS_DATA.map((cat) => {
                          const isSelected = selectedCategory.id === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(cat);
                                setSelectedTreatment(null);
                              }}
                              className={`px-4 py-2 rounded-full text-[0.68rem] font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                                isSelected 
                                  ? 'bg-[#0e8374] text-white border-[#0e8374] shadow-xs'
                                  : 'bg-[#f4f7f6] border-[#cbdad6]/60 text-[#2c4e47] hover:bg-[#e9f0ee]'
                              }`}
                            >
                              {cat.category}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Specific Procedure Select */}
                    <div className="space-y-2">
                      <label className="block text-[0.62rem] font-extrabold uppercase tracking-wider text-[#879d97]">2. Treatment Procedure</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[170px] overflow-y-auto pr-1">
                        {selectedCategory.items.map((treatment) => {
                          const isSelected = selectedTreatment?.name === treatment.name;
                          return (
                            <div
                              key={treatment.name}
                              onClick={() => setSelectedTreatment(treatment)}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-[#0e8374] bg-[#0e8374]/5 shadow-xs'
                                  : 'border-[#cbdad6]/40 bg-[#f4f7f6]/40 hover:bg-[#f4f7f6]'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-xs text-[#1a332e] leading-tight block">{treatment.name}</span>
                                <span className="text-[0.68rem] font-black text-emerald-650 block pl-2">{treatment.price}</span>
                              </div>
                              <p className="text-[0.7rem] text-[#879d97] mt-1.5 leading-normal truncate">{treatment.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Attending Dentist Selection Row */}
                    <div className="space-y-2">
                      <label className="block text-[0.62rem] font-extrabold uppercase tracking-wider text-[#879d97]">3. Attending Specialist</label>
                      <div className="flex gap-3 overflow-x-auto pb-1 scrollable-dates">
                        {filteredDoctors.length === 0 ? (
                          <div className="text-center w-full py-2 text-xs italic text-slate-400">No doctors available.</div>
                        ) : (
                          filteredDoctors.map((doc) => {
                            const isSelected = selectedDoctor?.name === doc.name;
                            return (
                              <div
                                key={doc.name}
                                onClick={() => setSelectedDoctor(doc)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-all shrink-0 select-none ${
                                  isSelected
                                    ? 'border-[#0e8374] bg-[#0e8374]/5 shadow-xs'
                                    : 'border-[#cbdad6]/40 bg-[#f4f7f6]/40 hover:bg-[#f4f7f6]'
                                }`}
                              >
                                <div className="w-7 h-7 rounded-full overflow-hidden border border-white shadow-xs">
                                  <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <span className="block text-[0.74rem] font-bold text-[#1a332e] leading-none">{doc.name}</span>
                                  <span className="block text-[0.62rem] text-[#879d97] mt-1 leading-none font-semibold">{doc.specialty}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#1a332e] tracking-tight">Personal Details</h2>
                    <p className="text-xs text-[#879d97] mt-0.5">Please check patient contact parameters and notes.</p>
                  </div>

                  {/* Form Container */}
                  <div className="border border-[#e2ece9] rounded-2xl p-5 bg-white shadow-xs space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.62rem] font-extrabold uppercase tracking-wider text-[#879d97] mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="w-full px-4 py-3 bg-[#f4f7f6] border border-[#cbdad6] rounded-xl text-xs focus:outline-none focus:border-[#0e8374] focus:bg-white text-slate-700 font-bold transition-all shadow-xs"
                          placeholder="Your Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[0.62rem] font-extrabold uppercase tracking-wider text-[#879d97] mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-[#f4f7f6] border border-[#cbdad6] rounded-xl text-xs focus:outline-none focus:border-[#0e8374] focus:bg-white text-slate-700 font-bold transition-all shadow-xs"
                          placeholder="yourname@example.com"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[0.62rem] font-extrabold uppercase tracking-wider text-[#879d97] mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-[#f4f7f6] border border-[#cbdad6] rounded-xl text-xs focus:outline-none focus:border-[#0e8374] focus:bg-white text-slate-700 font-bold transition-all shadow-xs"
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[0.62rem] font-extrabold uppercase tracking-wider text-[#879d97] mb-1.5">Consultation Notes (Optional)</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full h-24 px-4 py-3 bg-[#f4f7f6] border border-[#cbdad6] rounded-xl text-xs focus:outline-none focus:border-[#0e8374] focus:bg-white text-slate-700 font-semibold transition-all resize-none shadow-xs"
                          placeholder="Describe any tooth issues, dental pain, history or special requests..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: LOCATION SELECTOR */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#1a332e] tracking-tight">Studio Location</h2>
                    <p className="text-xs text-[#879d97] mt-0.5">Choose the ClearDent clinic location for your procedure.</p>
                  </div>

                  {/* Location Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CLINIC_LOCATIONS.map((loc) => {
                      const isSelected = selectedLocation.id === loc.id;
                      return (
                        <div
                          key={loc.id}
                          onClick={() => setSelectedLocation(loc)}
                          className={`p-5 rounded-2xl border cursor-pointer bg-white transition-all ${
                            isSelected
                              ? 'border-[#0e8374] bg-[#0e8374]/5 shadow-xs'
                              : 'border-[#cbdad6]/40 hover:bg-[#f4f7f6]/40'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#e2ece9] border border-[#cbdad6]/45 text-[#0e8374] flex items-center justify-center">
                              <MapPin size={15} />
                            </div>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-[#0e8374] text-white flex items-center justify-center">
                                <Check size={11} className="stroke-[2.5]" />
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-xs text-[#1a332e] tracking-tight">{loc.name}</h4>
                          <p className="text-[0.7rem] text-[#879d97] mt-1 leading-normal">{loc.address}</p>
                          
                          <div className="pt-3 border-t border-[#e2ece9]/60 mt-4 flex flex-col gap-1 text-[0.65rem] text-[#2c4e47] font-bold uppercase">
                            <span className="flex items-center gap-1.5"><Clock size={11} className="text-[#0e8374]" /> Open: {loc.hours}</span>
                            <span className="flex items-center gap-1.5"><Phone size={11} className="text-[#0e8374]" /> Tel: {loc.phone}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: APPOINTMENT (SELECT DATE AND TIME - SAME TO SAME PIXEL UI) */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  
                  {/* Select Date and Time Main Card Panel (SAME TO SAME PIXELS) */}
                  <div className="border border-[#cbdad6]/60 rounded-2xl p-6 bg-white shadow-xs relative">
                    
                    {/* Header: Date and Month Selector */}
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-lg font-extrabold text-[#1a332e] tracking-tight">Select Date and Time</h3>
                      
                      {/* Month Selector container */}
                      <div className="flex items-center gap-3 border border-[#d0ded9] rounded-lg px-2.5 py-1 bg-white shadow-xs select-none">
                        <button 
                          type="button" 
                          onClick={handlePrevMonth}
                          className="p-1.5 hover:bg-[#f4f7f6] rounded-md text-[#2c4e47] cursor-pointer border-none bg-transparent flex items-center justify-center"
                        >
                          <ChevronLeft size={13} />
                        </button>
                        <span className="text-[0.74rem] font-bold text-[#2c4e47] tracking-tight font-sans">
                          {currentMonthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button 
                          type="button" 
                          onClick={handleNextMonth}
                          className="p-1.5 hover:bg-[#f4f7f6] rounded-md text-[#2c4e47] cursor-pointer border-none bg-transparent flex items-center justify-center"
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Date Horizontal Picker Slider with navigation */}
                    <div className="relative mb-5 flex items-center border-b border-[#e2ece9] pb-2">
                      <ChevronLeft size={13} className="text-slate-350 cursor-pointer absolute -left-3" />
                      <div className="flex gap-5 overflow-x-auto pb-1 scrollable-dates w-full px-2">
                        {datesList.map((dt) => {
                          const isSelected = selectedDate?.fullDateString === dt.fullDateString;
                          return (
                            <div
                              key={dt.fullDateString}
                              onClick={() => setSelectedDate(dt)}
                              className="text-center cursor-pointer shrink-0 min-w-[50px] relative transition-all"
                            >
                              <span className="block text-[0.65rem] font-bold text-[#879d97] uppercase tracking-wide">
                                {getDayLabel(dt.dateObj)}
                              </span>
                              <span className={`block text-base font-extrabold font-sans leading-none mt-2 pb-2 ${
                                isSelected ? 'text-[#1a332e]' : 'text-[#879d97]'
                              }`}>
                                {dt.dayNum}
                              </span>
                              {isSelected && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a332e] rounded-full" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <ChevronRight size={13} className="text-slate-350 cursor-pointer absolute -right-3" />
                    </div>

                    {/* Time Slots Grid (SAME TO SAME PIXELS) */}
                    <div className="space-y-4">
                      {allDoctorSlots.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-[#e2ece9] rounded-xl text-slate-450 text-xs italic bg-[#f4f7f6]/30">
                          Unavailable (No active working slots configured for this day)
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                            {(showAllSlots ? allDoctorSlots : allDoctorSlots.slice(0, 14)).map((slot) => {
                              const isBooked = bookedSlots.includes(slot);
                              const isSelected = selectedTimeSlot === slot;
                              const displayTime = slot.split(' - ')[0].replace(/\s*[AP]M\s*/gi, ''); // e.g. "07:15"
                              
                              if (isBooked) {
                                return (
                                  <div
                                    key={slot}
                                    className="bg-[#e9ebea] border border-transparent text-[#cbd1cf] py-3 rounded-lg text-center text-[0.74rem] font-bold cursor-not-allowed select-none"
                                  >
                                    {displayTime}
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={slot}
                                  onClick={() => setSelectedTimeSlot(slot)}
                                  className={`py-3 rounded-lg text-center text-[0.74rem] font-semibold cursor-pointer transition-all border border-transparent ${
                                    isSelected
                                      ? 'bg-[#0e8374] text-white font-bold shadow-xs'
                                      : 'bg-[#f4f7f6] hover:bg-[#e9f0ee] text-[#2c4e47]'
                                  }`}
                                >
                                  {displayTime}
                                </div>
                              );
                            })}
                          </div>

                          {/* Show more/less slots toggle link */}
                          {allDoctorSlots.length > 14 && (
                            <div className="flex items-center gap-1.5 pt-1 select-none">
                              <span
                                onClick={() => setShowAllSlots(!showAllSlots)}
                                className="text-[0.72rem] font-black text-[#0e8374] hover:text-[#0c7265] cursor-pointer flex items-center gap-1 transition-colors uppercase tracking-wider"
                              >
                                {showAllSlots ? 'Show fewer slots ^' : 'Show more slots v'}
                              </span>
                              <span className="text-[0.66rem] text-slate-400 font-bold uppercase tracking-wide">({availableSlotsCount} available)</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Glassmorphic Selected Date Bar (SAME TO SAME PIXEL FORMAT) */}
                  {selectedDate && selectedTimeSlot && (
                    <div 
                      className="rounded-xl p-4 flex items-center gap-3 text-slate-800 shadow-xs bg-[#0e8374]/[0.08] border border-[#0e8374]/[0.15]"
                    >
                      <Clock size={15} className="text-[#0e8374] shrink-0" />
                      <div className="text-[0.72rem]">
                        <span className="block font-bold text-[#879d97] leading-none">Currently Selected:</span>
                        <span className="block font-extrabold text-[#0e8374] mt-1 leading-none">
                          {getSelectedDateTimeString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: PAYMENT SUMMARY & SECURE FORM */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#1a332e] tracking-tight">Payment Details</h2>
                    <p className="text-xs text-[#879d97] mt-0.5">Please review total billing details and complete booking.</p>
                  </div>

                  <div className="border border-[#e2ece9] rounded-2xl p-5 bg-white shadow-xs space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Review details */}
                      <div className="space-y-3.5 text-xs bg-[#f4f7f6]/40 p-4 border border-[#cbdad6]/35 rounded-xl leading-normal">
                        <h4 className="text-[0.62rem] font-extrabold uppercase tracking-wider text-[#879d97] border-b border-[#e2ece9] pb-1.5">Procedure Summary</h4>
                        <div>
                          <span className="block text-[0.62rem] text-slate-400 font-bold uppercase">Procedure</span>
                          <span className="font-extrabold text-[#1a332e] mt-0.5 block">{selectedTreatment?.name}</span>
                        </div>
                        <div>
                          <span className="block text-[0.62rem] text-slate-400 font-bold uppercase">Specialist</span>
                          <span className="font-bold text-slate-700 mt-0.5 block">{selectedDoctor?.name}</span>
                        </div>
                        <div>
                          <span className="block text-[0.62rem] text-slate-400 font-bold uppercase">Studio Clinic</span>
                          <span className="font-semibold text-slate-600 mt-0.5 block">{selectedLocation.name}</span>
                        </div>
                        <div>
                          <span className="block text-[0.62rem] text-slate-400 font-bold uppercase">Schedule Time</span>
                          <span className="font-black text-[#0e8374] mt-0.5 block">
                            {selectedDate?.fullDateString} @ {selectedTimeSlot}
                          </span>
                        </div>
                      </div>

                      {/* Pay setup */}
                      <div className="space-y-4">
                        <div className="bg-[#f4f7f6] p-4 border border-[#cbdad6]/45 rounded-xl text-xs space-y-2">
                          <div className="flex justify-between text-slate-500 font-semibold">
                            <span>Dental Procedure Fee:</span>
                            <span className="font-bold text-slate-800">{selectedTreatment?.price}</span>
                          </div>
                          <div className="flex justify-between text-slate-500 font-semibold">
                            <span>Service & Facility Fee:</span>
                            <span className="font-bold text-slate-800">₹150</span>
                          </div>
                          <div className="border-t border-[#cbdad6]/35 pt-2 flex justify-between font-black text-sm text-slate-800">
                            <span>Total Bill:</span>
                            <span className="text-emerald-650">
                              ₹{(parseInt(selectedTreatment?.price.replace(/[^0-9]/g, '')) + 150).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[0.62rem] font-extrabold uppercase tracking-wider text-[#879d97]">Select Payment Method</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {['Pay at Clinic', 'Credit Card', 'Insurance', 'Razorpay / Online Payment'].map((m) => {
                              const isSelected = paymentMethod === m;
                              return (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setPaymentMethod(m)}
                                  className={`py-2 px-1 rounded-xl text-center text-[0.66rem] font-extrabold cursor-pointer border transition-all uppercase tracking-wider ${
                                    isSelected
                                      ? 'bg-[#0e8374] text-white border-[#0e8374]'
                                      : 'bg-[#f4f7f6] border-[#cbdad6]/60 text-[#2c4e47] hover:bg-[#e9f0ee]'
                                  }`}
                                >
                                  {m}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {paymentMethod === 'Credit Card' && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <input
                              type="text"
                              placeholder="Cardholder Name"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="w-full px-3 py-2 bg-[#f4f7f6] border border-[#cbdad6] rounded-lg text-xs focus:outline-none focus:border-[#0e8374]"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Card Number"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full px-3 py-2 bg-[#f4f7f6] border border-[#cbdad6] rounded-lg text-xs focus:outline-none focus:border-[#0e8374]"
                              required
                            />
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3 py-2 bg-[#f4f7f6] border border-[#cbdad6] rounded-lg text-xs focus:outline-none focus:border-[#0e8374] text-center"
                              required
                            />
                            <input
                              type="password"
                              placeholder="CVV"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full px-3 py-2 bg-[#f4f7f6] border border-[#cbdad6] rounded-lg text-xs focus:outline-none focus:border-[#0e8374] text-center"
                              required
                            />
                          </div>
                        )}

                        {paymentMethod === 'Insurance' && (
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <input
                              type="text"
                              placeholder="Insurance Provider"
                              value={insuranceProvider}
                              onChange={(e) => setInsuranceProvider(e.target.value)}
                              className="w-full px-3 py-2 bg-[#f4f7f6] border border-[#cbdad6] rounded-lg text-xs focus:outline-none focus:border-[#0e8374]"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Policy Number"
                              value={insurancePolicyId}
                              onChange={(e) => setInsurancePolicyId(e.target.value)}
                              className="w-full px-3 py-2 bg-[#f4f7f6] border border-[#cbdad6] rounded-lg text-xs focus:outline-none focus:border-[#0e8374]"
                              required
                            />
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: CONFIRMATION DETAILS */}
              {currentStep === 6 && bookingSuccessData && (
                <div className="space-y-6 text-center py-4 max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={32} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1a332e] tracking-tight">Booking Confirmed!</h2>
                    <p className="text-xs text-[#879d97] mt-0.5">Your dental pass has been successfully configured in the system.</p>
                  </div>

                  {/* Confirmed pass ticket detail */}
                  <div className="border border-dashed border-[#cbdad6] rounded-2xl p-5 text-left bg-white relative overflow-hidden shadow-xs">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-650" />
                    
                    <div className="flex justify-between items-center border-b border-[#e2ece9] pb-3 mb-4 text-xs">
                      <div>
                        <span className="block text-[0.62rem] text-slate-400 font-bold uppercase leading-none">Receipt reference</span>
                        <span className="block text-[0.72rem] font-mono font-bold text-[#2c4e47] mt-1 tracking-wider leading-none">
                          LUM-{(bookingSuccessData._id || '7721').slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[0.62rem] font-extrabold text-emerald-650 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                        Confirmed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs leading-normal">
                      <div>
                        <span className="block text-[0.62rem] text-slate-400 font-bold uppercase">Patient</span>
                        <span className="font-bold text-[#1a332e] block mt-0.5">{patientName}</span>
                      </div>
                      <div>
                        <span className="block text-[0.62rem] text-slate-400 font-bold uppercase">Specialist</span>
                        <span className="font-semibold text-slate-700 block mt-0.5">{bookingSuccessData.doctorName}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[0.62rem] text-slate-400 font-bold uppercase">Dental Procedure</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{bookingSuccessData.treatmentName}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[0.62rem] text-slate-400 font-bold uppercase">Studio Clinic Address</span>
                        <span className="font-semibold text-slate-600 block mt-0.5">{bookingSuccessData.location || selectedLocation.name}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[0.62rem] text-slate-400 font-bold uppercase">Schedule Date & Time</span>
                        <span className="font-black text-[#0e8374] block mt-0.5">
                          {bookingSuccessData.appointmentDate} @ {bookingSuccessData.timeSlot}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('portal');
                        setPortalSubTab('appointments');
                        navigate('home');
                      }}
                      className="bg-[#0e8374] hover:bg-[#0c7265] text-white font-bold text-[0.72rem] uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-xs border-none"
                    >
                      Portal Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="bg-white border border-[#cbdad6] text-[#2c4e47] hover:border-[#879d97] hover:text-[#1a332e] font-bold text-[0.72rem] uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                    >
                      Schedule Another
                    </button>
                  </div>
                </div>
              )}

              {/* BUTTONS BAR FOR PREV / NEXT STEPS */}
              {currentStep < 6 && (
                <div className="pt-6 border-t border-[#cbdad6]/45 flex items-center justify-between mt-8 select-none">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="flex items-center gap-2 bg-[#f4f7f6] hover:bg-[#e9f0ee] border border-[#cbdad6] text-[#2c4e47] font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer"
                    >
                      <ArrowLeft size={13} className="stroke-[2.5]" />
                      Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('services')}
                      className="flex items-center gap-2 bg-[#f4f7f6] hover:bg-[#e9f0ee] border border-[#cbdad6] text-[#2c4e47] font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer"
                    >
                      <ArrowLeft size={13} className="stroke-[2.5]" />
                      Exit Booking
                    </button>
                  )}

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={currentStep === 1 && (!selectedTreatment || !selectedDoctor)}
                      className={`flex items-center gap-2 bg-[#0e8374] hover:bg-[#0c7265] text-white font-bold text-xs py-3 px-8 rounded-xl transition-all shadow-xs cursor-pointer border-none ${
                        currentStep === 1 && (!selectedTreatment || !selectedDoctor) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Next
                      <ArrowRight size={13} className="stroke-[2.5]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBookingSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 bg-[#0e8374] hover:bg-[#0c7265] text-white font-bold text-xs py-3.5 px-8 rounded-xl transition-all shadow-md cursor-pointer border-none uppercase tracking-wider"
                    >
                      {loading ? 'Confirming...' : 'Confirm Appointment'}
                      <ShieldCheck size={14} className="stroke-[2.5]" />
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        <Footer navigate={navigate} />
      </div>
    </>
  );
}

export default BookingPage;
