import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      errors.fullName = 'Full name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    console.log('Form data:', formData);
    
    if (!isValid) {
      console.log('Validation failed, stopping submission');
      return;
    }

    setIsLoading(true);
    
    // Skip payment for now - directly create account
    const result = await register({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: 'user',
      hasPaidFee: true, // Set as paid to bypass payment requirement
    });

    if (result.success) {
      navigate('/user/dashboard');
    } else {
      setError(result.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 min-h-screen flex flex-col pt-20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#faf8ff]/80 backdrop-blur-lg shadow-sm">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 w-full max-w-screen-2xl mx-auto">
          <Link to="/" className="text-xl font-bold tracking-tighter text-primary">The Urban Sanctuary</Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-on-surface dark:text-slate-400">
            <span>Already have an account?</span>
            <Link className="text-primary font-bold hover:text-surface-tint transition-all" to="/signin">Login</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-12 pb-20 px-6 md:px-12 w-full max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Registration Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface dark:text-slate-100">Partner with us.</h1>
              <p className="text-on-surface dark:text-slate-400 text-lg max-w-xl">Complete your professional profile to start listing exclusive Kathmandu properties on Nepal's premier sanctuary.</p>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <div className="bg-surface dark:bg-slate-800 p-8 md:p-10 rounded-xl shadow-[0_8px_24px_-8px_rgba(25,27,35,0.06)] border border-outline-variant/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400 ml-1">Full Name</label>
                    <input 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-surface dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-surface-tint/20 transition-all text-on-surface dark:text-slate-100 ${fieldErrors.fullName ? 'ring-2 ring-error' : ''}`} 
                      placeholder="John Doe" 
                      type="text"
                    />
                    {fieldErrors.fullName && (
                      <p className="text-xs text-error font-medium mt-1">{fieldErrors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400 ml-1">Phone Number</label>
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-surface dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-surface-tint/20 transition-all text-on-surface dark:text-slate-100 ${fieldErrors.phone ? 'ring-2 ring-error' : ''}`} 
                      placeholder="+977 980 0000000" 
                      type="tel"
                    />
                    {fieldErrors.phone && (
                      <p className="text-xs text-error font-medium mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400 ml-1">Email Address</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-surface dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-surface-tint/20 transition-all text-on-surface dark:text-slate-100 ${fieldErrors.email ? 'ring-2 ring-error' : ''}`} 
                    placeholder="professional@agency.com.np" 
                    type="email"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-error font-medium mt-1">{fieldErrors.email}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400 ml-1">Password</label>
                    <input 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-surface dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-surface-tint/20 transition-all text-on-surface dark:text-slate-100 ${fieldErrors.password ? 'ring-2 ring-error' : ''}`} 
                      placeholder="••••••••" 
                      type="password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400 ml-1">Confirm Password</label>
                    <input 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-surface dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-surface-tint/20 transition-all text-on-surface dark:text-slate-100 ${fieldErrors.confirmPassword ? 'ring-2 ring-error' : ''}`} 
                      placeholder="••••••••" 
                      type="password"
                      autoComplete="new-password"
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="text-xs text-error font-medium mt-1">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <input required className="mt-1 rounded text-primary border-outline-variant focus:ring-primary" type="checkbox"/>
                  <span className="text-sm text-on-surface dark:text-slate-400 leading-relaxed">I agree to the <a className="text-primary underline" href="#">Partner Terms of Service</a> and confirm that I am a licensed real estate professional in Nepal.</span>
                </div>
                
                {/* Mobile payment selector */}
                <div className="lg:hidden mt-8 space-y-6">
                    {/* Simplified payment display for mobile */}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Payment & Access Fee */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="bg-surface dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
              <div className="relative h-48 w-full">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACF39MK5T6uDr6o7xyPfpoCvG6W30NCarqmWabE6cunUEi7vzgOGXrS3a_K0X266gP3ftkPxAQfjQudIVyH9d41TYgK38iJnNH9G9BgO1NnaDzFLl9j_Olfgt0vFJborYcr4upVO6KFkhzyZGwTDv8ARiiW6wBKzZMajanvEY8mCg-Ivbu3f-qYNPj3yt2BCbd3Fpg4t4OAjWmltG8dx26b7PvnifgCesXQCkmOVJxt5soZMD6whjGq70b2y07mKtJmA-AdLJjKVSb" alt="Modern interior" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                <div className="absolute bottom-6 left-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[0.65rem] font-black uppercase tracking-widest mb-2">Agency Registration</span>
                  <h2 className="text-2xl font-extrabold text-on-surface dark:text-slate-100">Platform Access</h2>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-sm text-on-surface dark:text-slate-400 font-medium">One-time Access Fee</p>
                    <p className="text-xs text-primary font-bold">Lifetime listing privileges</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-on-surface dark:text-slate-100">Rs. 500</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'esewa' ? 'bg-surface dark:bg-slate-800 border-primary shadow-sm' : 'bg-surface dark:bg-slate-800 border-transparent hover:border-outline-variant'}`}
                    >
                      <div className="w-12 h-12 mb-2 flex items-center justify-center bg-emerald-100 rounded-lg">
                        <span className="text-emerald-700 font-black text-xs">eSewa</span>
                      </div>
                      <span className={`text-xs font-bold ${paymentMethod === 'esewa' ? 'text-on-surface dark:text-slate-100' : 'text-on-surface dark:text-slate-400'}`}>eSewa Wallet</span>
                      <div className={`mt-2 w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'esewa' ? 'border-primary' : 'border-outline-variant'}`}>
                        {paymentMethod === 'esewa' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'khalti' ? 'bg-surface dark:bg-slate-800 border-primary shadow-sm' : 'bg-surface dark:bg-slate-800 border-transparent hover:border-outline-variant'}`}
                    >
                      <div className="w-12 h-12 mb-2 flex items-center justify-center bg-purple-100 rounded-lg">
                        <span className="text-purple-700 font-black text-xs">Khalti</span>
                      </div>
                      <span className={`text-xs font-bold ${paymentMethod === 'khalti' ? 'text-on-surface dark:text-slate-100' : 'text-on-surface dark:text-slate-400'}`}>Khalti SDK</span>
                      <div className={`mt-2 w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'khalti' ? 'border-primary' : 'border-outline-variant'}`}>
                        {paymentMethod === 'khalti' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>
                    </button>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-surface dark:bg-slate-900-tint text-white py-5 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                  <p className="text-center text-xs text-on-surface dark:text-slate-400 lowercase">
                    Create your account to start using The Urban Sanctuary platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-surface dark:bg-slate-800 py-10 px-12 border-t border-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400">
          <div className="text-lg font-black text-primary lowercase tracking-tighter">The Urban Sanctuary</div>
          <div className="flex gap-8">
            <Link to="#">Privacy</Link>
            <Link to="#">Terms</Link>
            <Link to="#">Security</Link>
          </div>
          <p>© 2024 The Urban Sanctuary</p>
        </div>
      </footer>
    </div>
  );
}
