import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { loginUser } from '../../services/login';

function Login({ navigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(email, password);

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

      // Check role to route properly
      if (data.user.role === 'admin') {
        navigate('admin-dashboard');
      } else if (data.user.role === 'doctor') {
        navigate('doctor-dashboard');
      } else {
        navigate('home');
      }
    } catch (err) {
      console.error('Login error:', err);
      window.showError?.(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-secondary w-screen m-0 p-0 animate-fade-in">
      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-screen">

        {/* Left Side: Brand & Visual Panel */}
        <div
          className="hidden md:flex relative flex-col justify-between p-12 bg-cover bg-center text-white min-h-screen"
          style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.15)), url('/luxury_medical_blue.png')" }}
        >
          {/* Top Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-[8px] flex items-center justify-center font-serif font-bold text-[1rem] tracking-[0.05em] border border-white/30">L</div>
            <span className="font-serif text-[1.05rem] font-medium tracking-[0.15em] uppercase">Lumina Medical</span>
          </div>

          {/* Center Text Block (Glassmorphic Card) */}
          <div className="bg-white/8 backdrop-blur-[12px] border border-white/15 rounded-[6px] py-10 px-8 max-w-[460px] my-8 shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
            <h2 className="font-serif text-[1.6rem] font-normal leading-[1.4] mb-4 tracking-[0.02em] text-white">
              Dedicated to the art of healing, guided by the science of medicine.
            </h2>
            <p className="text-[0.85rem] text-white/80 tracking-[0.04em] uppercase m-0">
              Lumina Secure Sign In Portal
            </p>
          </div>

          {/* Bottom Security Badge */}
          <div className="flex items-center gap-2 opacity-85">
            <ShieldCheck size={18} />
            <span className="text-[0.75rem] tracking-[0.05em] font-medium">HIPAA Compliant &amp; Encrypted</span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="flex items-center justify-center p-8 max-md:px-6 max-md:py-12 bg-bg-primary min-h-screen overflow-y-auto">
          <div className="w-full max-w-[380px]">

            {/* Back Button */}
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-1.5 bg-none border-none cursor-pointer text-text-secondary text-[0.82rem] font-medium p-0 mb-[1.8rem] font-sans transition-colors duration-200 hover:text-text-primary"
            >
              <ArrowLeft size={14} />
              Back to Home
            </button>

            {/* Header */}
            <div className="mb-6">
              <h1 className="font-serif text-[1.75rem] font-normal tracking-[0.05em] uppercase text-text-primary mb-2">Secure Login</h1>
              <p className="text-[0.82rem] text-text-secondary tracking-[0.01em] m-0">
                Sign in to your Lumina Medical account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5" autoComplete="on">
              {/* Email */}
              <div className="relative">
                <label className={`block text-[0.75rem] font-medium uppercase tracking-[0.12em] mb-[0.45rem] ${errors.email ? 'text-[#ef4444]' : 'text-text-secondary'}`} htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
                    <Mail size={16} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    autoComplete="username"
                    className={`w-full p-[0.85rem_1rem] pl-10 bg-bg-primary border rounded-[4px] text-[0.9rem] text-text-primary font-sans transition-all duration-200 tracking-[0.02em] focus:outline-none ${errors.email ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[3px] focus:ring-[rgba(239,68,68,0.15)]' : 'border-border-light focus:border-border-focus focus:ring-[3px] focus:ring-[rgba(37,99,235,0.15)]'}`}
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
                  <div className="text-[#ef4444] text-[0.7rem] font-medium mt-1 leading-none tracking-[0.01em]">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className={`block text-[0.75rem] font-medium uppercase tracking-[0.12em] mb-[0.45rem] ${errors.password ? 'text-[#ef4444]' : 'text-text-secondary'}`} htmlFor="password">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
                    <Lock size={16} />
                  </span>
                  <input
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    className={`w-full p-[0.85rem_1rem] pl-10 pr-10 bg-bg-primary border rounded-[4px] text-[0.9rem] text-text-primary font-sans transition-all duration-200 tracking-[0.02em] focus:outline-none ${errors.password ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[3px] focus:ring-[rgba(239,68,68,0.15)]' : 'border-border-light focus:border-border-focus focus:ring-[3px] focus:ring-[rgba(37,99,235,0.15)]'}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-text-muted flex items-center p-0"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-[#ef4444] text-[0.7rem] font-medium mt-1 leading-none tracking-[0.01em]">{errors.password}</div>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center text-[0.8rem]">
                <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-gold w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Submit */}
              <button
                className={`inline-flex items-center justify-center w-full p-[0.9rem_2rem] bg-gradient-to-br from-gold-light via-gold to-gold-dark bg-[size:200%_auto] rounded-[4px] text-white font-sans text-[0.85rem] font-semibold uppercase tracking-[0.15em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_4px_15px_rgba(197,160,89,0.25)] hover:bg-[position:right_center] hover:shadow-[0_6px_20px_rgba(197,160,89,0.35)] hover:-translate-y-[1px] active:translate-y-0 ${loading ? 'opacity-80 cursor-wait' : ''}`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Footer Redirect */}
            <div className="text-center border-t border-border-light pt-4 mt-6 text-[0.82rem] text-text-secondary">
              <span>New patient? </span>
              <button
                onClick={() => navigate('signup')}
                className="bg-none border-none text-gold-dark cursor-pointer font-semibold p-0 text-[0.82rem] no-underline hover:text-text-primary transition-colors duration-200"
              >
                Register Patient Account
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
