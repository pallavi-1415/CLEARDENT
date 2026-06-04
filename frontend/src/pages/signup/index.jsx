import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Activity, Calendar, Upload, CheckCircle2, ArrowLeft } from 'lucide-react';
import { signupUser } from '../../services/login';

function Signup({ navigate, onLoginSuccess }) {
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [specialization, setSpecialization] = useState('General Dentistry');
  const [licenseFile, setLicenseFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

      if (!validTypes.includes(fileType)) {
        setErrors(prev => ({ ...prev, license: 'Only JPG, PNG images and PDF files are allowed.' }));
        setLicenseFile(null);
      } else if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, license: 'File size must be under 10MB.' }));
        setLicenseFile(null);
      } else {
        setLicenseFile(file);
        setErrors(prev => ({ ...prev, license: '' }));
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name) newErrors.name = 'Please enter your full name.';
    if (!email) {
      newErrors.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    if (!dob) {
      newErrors.dob = 'Please enter your date of birth.';
    }
    if (!password) {
      newErrors.password = 'Please create a password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the privacy policy.';
    }

    if (role === 'doctor' && !licenseFile) {
      newErrors.license = 'Medical license file is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      // Create FormData
      const formData = new FormData();
      formData.append('name', role === 'doctor' && !name.toLowerCase().startsWith('dr.') ? `Dr. ${name}` : name);
      formData.append('email', email);
      formData.append('dob', dob);
      formData.append('password', password);
      formData.append('role', role);
      if (role === 'doctor') {
        formData.append('specialization', specialization);
        formData.append('license', licenseFile);
      }

      const data = await signupUser(formData);

      if (data.pending) {
        setIsPendingApproval(true);
      } else {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        navigate('home');
      }
    } catch (err) {
      console.error('Signup error:', err);
      window.showError?.(err.message || 'Could not connect to the backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  if (isPendingApproval) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-secondary w-screen m-0 p-6 animate-fade-in">
        <div className="bg-bg-primary border border-border-light rounded-[12px] p-10 max-w-[500px] text-center shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="font-serif text-[1.8rem] font-medium tracking-[0.02em] text-text-primary mb-3">
            Application Submitted
          </h1>
          <p className="text-[0.92rem] text-text-secondary leading-[1.6] mb-6">
            Thank you for registering with Lumina Medical, <strong>{name.toLowerCase().startsWith('dr.') ? name : `Dr. ${name}`}</strong>.
          </p>
          <div className="bg-bg-secondary border border-border-light rounded-[6px] p-5 text-left mb-8">
            <h4 className="text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-text-primary mb-2">What happens next?</h4>
            <ul className="text-[0.82rem] text-text-secondary leading-[1.5] space-y-2 pl-4 list-disc">
              <li>Our administration panel will verify your uploaded medical license details.</li>
              <li>Your credential checks will be completed in 24 to 48 hours.</li>
              <li>You will receive approval confirmation, after which you can log in to your Doctor Dashboard.</li>
            </ul>
          </div>
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center justify-center gap-2 p-[0.75rem_2rem] bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-[4px] text-white font-sans text-[0.85rem] font-semibold uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_4px_15px_rgba(197,160,89,0.25)] hover:shadow-[0_6px_20px_rgba(197,160,89,0.35)] hover:-translate-y-[1px]"
          >
            <ArrowLeft size={16} /> Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden flex bg-bg-secondary w-screen m-0 p-0 animate-fade-in">
      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-screen max-h-screen overflow-hidden">

        {/* Left Side: Brand & Visual Panel */}
        <div
          className="hidden md:flex relative flex-col justify-between p-12 bg-cover bg-center text-white h-full"
          style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.15)), url('/luxury_medical_blue.png')" }}
        >
          {/* Top Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-[8px] flex items-center justify-center font-serif font-bold text-[1rem] tracking-[0.05em] border border-white/30">L</div>
            <span className="font-serif text-[1.05rem] font-medium tracking-[0.15em] uppercase">Lumina Medical</span>
          </div>

          {/* Center Text Block */}
          <div className="bg-white/8 backdrop-blur-[12px] border border-white/15 rounded-[6px] py-10 px-8 max-w-[460px] my-8 shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
            <h2 className="font-serif text-[1.6rem] font-normal leading-[1.4] mb-4 tracking-[0.02em] text-white">
              {role === 'patient'
                ? 'Dedicated to the art of healing, guided by the science of medicine.'
                : 'Join our team of elite practitioners and manage your clinic seamlessly.'}
            </h2>
            <p className="text-[0.85rem] text-white/80 tracking-[0.04em] uppercase m-0">
              {role === 'patient' ? 'Patient Portal Registration' : 'Medical Specialist Registration'}
            </p>
          </div>

          {/* Bottom Security Badge */}
          <div className="flex items-center gap-2 opacity-85">
            <Activity size={18} />
            <span className="text-[0.75rem] tracking-[0.05em] font-medium">HIPAA Compliant &amp; Encrypted</span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="flex items-center justify-center p-6 max-md:px-5 max-md:py-6 bg-bg-primary h-full overflow-hidden">
          <div className="w-full max-w-[400px]">

            {/* Back Button */}
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-1.5 bg-none border-none cursor-pointer text-text-secondary text-[0.78rem] font-medium p-0 mb-2 font-sans transition-colors duration-200 hover:text-text-primary"
            >
              <ArrowLeft size={13} />
              Back to Home
            </button>

            {/* Header */}
            <div className="mb-2.5">
              <h1 className="font-serif text-[1.4rem] font-normal tracking-[0.05em] uppercase text-text-primary mb-0.5">Registration</h1>
              <p className="text-[0.78rem] text-text-secondary tracking-[0.01em] m-0">
                Choose account type to get started.
              </p>
            </div>

            {/* Role Switcher */}
            <div className="flex bg-bg-secondary p-[3px] rounded-[6px] border border-border-light mb-3">
              <button
                type="button"
                className={`flex-1 py-[6px] text-[0.72rem] font-semibold uppercase tracking-[0.1em] rounded-[4px] transition-all duration-200 ${role === 'patient' ? 'bg-bg-primary text-gold-dark shadow-sm border border-border-light' : 'text-text-secondary hover:text-text-primary bg-transparent border-0'}`}
                onClick={() => {
                  setRole('patient');
                  setErrors({});
                }}
              >
                Patient Portal
              </button>
              <button
                type="button"
                className={`flex-1 py-[6px] text-[0.72rem] font-semibold uppercase tracking-[0.1em] rounded-[4px] transition-all duration-200 ${role === 'doctor' ? 'bg-bg-primary text-gold-dark shadow-sm border border-border-light' : 'text-text-secondary hover:text-text-primary bg-transparent border-0'}`}
                onClick={() => {
                  setRole('doctor');
                  setErrors({});
                }}
              >
                Medical Doctor
              </button>
            </div>



            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-2.5">
              {/* Full Name */}
              <div className="relative">
                <label className={`block text-[0.66rem] font-semibold uppercase tracking-[0.1em] mb-[2px] ${errors.name ? 'text-[#ef4444]' : 'text-text-secondary'}`} htmlFor="name">
                  {role === 'doctor' ? 'Doctor Full Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
                    <User size={14} />
                  </span>
                  <input
                    id="name"
                    className={`w-full py-[0.4rem] px-[0.6rem] pl-8 bg-bg-primary border rounded-[4px] text-[0.82rem] text-text-primary font-sans transition-all duration-200 tracking-[0.01em] focus:outline-none ${errors.name ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-2 focus:ring-[rgba(239,68,68,0.12)]' : 'border-border-light focus:border-border-focus focus:ring-2 focus:ring-[rgba(37,99,235,0.12)]'}`}
                    type="text"
                    placeholder={role === 'doctor' ? 'Dr. Sarah Jenkins' : 'Alex Mercer'}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                  />
                </div>
                {errors.name && (
                  <div className="text-[#ef4444] text-[0.64rem] font-medium mt-0.5 leading-none">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <label className={`block text-[0.66rem] font-semibold uppercase tracking-[0.1em] mb-[2px] ${errors.email ? 'text-[#ef4444]' : 'text-text-secondary'}`} htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
                    <Mail size={14} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    autoComplete="email"
                    className={`w-full py-[0.4rem] px-[0.6rem] pl-8 bg-bg-primary border rounded-[4px] text-[0.82rem] text-text-primary font-sans transition-all duration-200 tracking-[0.01em] focus:outline-none ${errors.email ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-2 focus:ring-[rgba(239,68,68,0.12)]' : 'border-border-light focus:border-border-focus focus:ring-2 focus:ring-[rgba(37,99,235,0.12)]'}`}
                    type="email"
                    placeholder="yourname@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                  />
                </div>
                {errors.email && (
                  <div className="text-[#ef4444] text-[0.64rem] font-medium mt-0.5 leading-none">{errors.email}</div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="relative">
                <label className={`block text-[0.66rem] font-semibold uppercase tracking-[0.1em] mb-[2px] ${errors.dob ? 'text-[#ef4444]' : 'text-text-secondary'}`} htmlFor="dob">Date of Birth</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted flex items-center pointer-events-none">
                    <Calendar size={14} />
                  </span>
                  <input
                    id="dob"
                    className={`w-full py-[0.4rem] px-[0.6rem] pl-8 bg-bg-primary border rounded-[4px] text-[0.82rem] text-text-primary font-sans transition-all duration-200 tracking-[0.01em] focus:outline-none ${errors.dob ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-2 focus:ring-[rgba(239,68,68,0.12)]' : 'border-border-light focus:border-border-focus focus:ring-2 focus:ring-[rgba(37,99,235,0.12)]'}`}
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      if (errors.dob) setErrors(prev => ({ ...prev, dob: '' }));
                    }}
                  />
                </div>
                {errors.dob && (
                  <div className="text-[#ef4444] text-[0.64rem] font-medium mt-0.5 leading-none">{errors.dob}</div>
                )}
              </div>

              {/* DOCTOR FIELDS */}
              {role === 'doctor' && (
                <>
                  {/* Specialization */}
                  <div className="relative">
                    <label className="block text-[0.66rem] font-semibold uppercase tracking-[0.1em] mb-[2px] text-text-secondary" htmlFor="specialization">Specialization</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted flex items-center pointer-events-none">
                        <Activity size={14} />
                      </span>
                      <select
                        id="specialization"
                        className="w-full py-[0.4rem] px-[0.6rem] pl-8 bg-bg-primary border border-border-light rounded-[4px] text-[0.82rem] text-text-primary font-sans focus:outline-none focus:border-border-focus"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                      >
                        <option value="General Dentistry">General Dentistry</option>
                        <option value="Orthodontics">Orthodontics &amp; Dentofacial Orthopedics</option>
                        <option value="Endodontics">Endodontics (Root Canal Specialist)</option>
                        <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                        <option value="Periodontics">Periodontics (Gum Care)</option>
                        <option value="Prosthodontics">Prosthodontics (Restorative)</option>
                        <option value="Oral &amp; Maxillofacial Surgery">Oral &amp; Maxillofacial Surgery</option>
                      </select>
                    </div>
                  </div>

                  {/* Medical License Upload */}
                  <div className="relative">
                    <label className={`block text-[0.66rem] font-semibold uppercase tracking-[0.1em] mb-[2px] ${errors.license ? 'text-[#ef4444]' : 'text-text-secondary'}`}>
                      Medical License (PDF, JPG, PNG)
                    </label>
                    <div className="border border-dashed border-border-light rounded-[4px] py-2 px-3 bg-bg-secondary hover:bg-bg-primary transition-all duration-200 relative">
                      <input
                        type="file"
                        id="license"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      <div className="flex items-center justify-center gap-2 text-text-secondary">
                        <Upload size={16} className="text-gold-dark shrink-0" />
                        <span className="text-[0.76rem] font-semibold truncate">
                          {licenseFile ? licenseFile.name : 'Select or Drag License File'}
                        </span>
                        <span className="text-[0.64rem] text-text-muted shrink-0">
                          {licenseFile ? `${(licenseFile.size / 1024 / 1024).toFixed(2)} MB` : 'Max 10MB'}
                        </span>
                      </div>
                    </div>
                    {errors.license && (
                      <div className="text-[#ef4444] text-[0.64rem] font-medium mt-0.5 leading-none">{errors.license}</div>
                    )}
                  </div>
                </>
              )}

              {/* Password */}
              <div className="relative">
                <label className={`block text-[0.66rem] font-semibold uppercase tracking-[0.1em] mb-[2px] ${errors.password ? 'text-[#ef4444]' : 'text-text-secondary'}`} htmlFor="password">Password</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
                    <Lock size={14} />
                  </span>
                  <input
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    className={`w-full py-[0.4rem] px-[0.6rem] pl-8 pr-9 bg-bg-primary border rounded-[4px] text-[0.82rem] text-text-primary font-sans transition-all duration-200 tracking-[0.01em] focus:outline-none ${errors.password ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-2 focus:ring-[rgba(239,68,68,0.12)]' : 'border-border-light focus:border-border-focus focus:ring-2 focus:ring-[rgba(37,99,235,0.12)]'}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create secure password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-text-muted flex items-center p-0"
                  >
                    {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-[#ef4444] text-[0.64rem] font-medium mt-0.5 leading-none">{errors.password}</div>
                )}
              </div>

              {/* Terms Check */}
              <div className="relative">
                <label className="flex items-center gap-2 cursor-pointer text-[0.72rem] text-text-secondary">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.agreeTerms) setErrors(prev => ({ ...prev, agreeTerms: '' }));
                    }}
                    className="accent-gold w-3 h-3 cursor-pointer"
                  />
                  <span className="leading-[1.3]">
                    I agree to the privacy policy and terms of service.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <div className="text-[#ef4444] text-[0.64rem] font-medium mt-0.5 leading-none">{errors.agreeTerms}</div>
                )}
              </div>

              {/* Submit */}
              <button
                className={`inline-flex items-center justify-center w-full py-[0.55rem] px-6 bg-gradient-to-br from-gold-light via-gold to-gold-dark bg-[size:200%_auto] rounded-[4px] text-white font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_4px_15px_rgba(197,160,89,0.25)] hover:bg-[position:right_center] hover:shadow-[0_6px_20px_rgba(197,160,89,0.35)] hover:-translate-y-[1px] active:translate-y-0 ${loading ? 'opacity-80 cursor-wait' : ''}`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : role === 'doctor' ? 'Submit Doctor Application' : 'Register Account'}
              </button>
            </form>

            {/* Footer Redirect */}
            <div className="text-center border-t border-border-light pt-2.5 mt-3 text-[0.78rem] text-text-secondary">
              <span>Already registered? </span>
              <button
                onClick={() => navigate('login')}
                className="bg-none border-none text-gold-dark cursor-pointer font-semibold p-0 text-[0.78rem] no-underline hover:text-text-primary transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Signup;
