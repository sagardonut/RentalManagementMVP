import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AgentSignUp() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '', specialization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'agent') navigate('/agent/dashboard');
  }, [user, navigate]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      specialization: formData.specialization,
      role: 'agent',
    });
    if (result.success) {
      navigate('/agent/dashboard');
    } else {
      setError(result.message || 'Registration failed');
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface font-medium transition-all";
  const labelClass = "text-[0.7rem] font-black uppercase tracking-widest text-on-surface-variant";

  return (
    <div className="bg-surface min-h-screen flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-lg border-b border-outline-variant/20 shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-screen-xl mx-auto">
          <Link to="/" className="text-lg font-bold tracking-tight text-primary">The Urban Sanctuary</Link>
          <div className="flex items-center gap-4 text-sm font-medium text-on-surface-variant">
            <span>Already have an account?</span>
            <Link to="/agent/signin" className="text-primary font-bold hover:underline">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0_24px_64px_rgba(0,64,161,0.08)] border border-outline-variant/20 overflow-hidden">
            {/* Top Banner */}
            <div className="bg-primary px-8 pt-8 pb-6">
              <p className="text-on-primary/60 text-[0.65rem] font-black uppercase tracking-[0.2em] mb-1">Agent Registration</p>
              <h1 className="text-2xl font-black text-on-primary tracking-tighter">Join the</h1>
              <h2 className="text-3xl font-black text-on-primary/80 tracking-tighter">The Urban Sanctuary</h2>
              <p className="text-on-primary/60 text-sm mt-2 font-medium">Create your agent account to start listing properties</p>
            </div>

            <div className="px-8 py-8">
              {error && (
                <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-bold text-center mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Full Name</label>
                    <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="Arjun Shrestha" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Phone</label>
                    <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+977 980 0000000" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Email Address</label>
                  <input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="agent@urbansanctuary.com" />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Specialization</label>
                  <select name="specialization" value={formData.specialization} onChange={handleChange} className={inputClass}>
                    <option value="">Select your specialty</option>
                    <option>Senior Property Manager</option>
                    <option>Residential Specialist</option>
                    <option>Luxury Properties</option>
                    <option>Commercial Leasing</option>
                    <option>Short-Term Rentals</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Password</label>
                    <input name="password" type="password" required value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Confirm Password</label>
                    <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input required type="checkbox" className="mt-1 rounded text-primary border-outline-variant" />
                  <span className="text-sm text-on-surface-variant">I confirm I am a licensed real estate professional and agree to the <a href="#" className="text-primary underline">Agent Terms</a>.</span>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-base shadow-[0_8px_24px_rgba(0,64,161,0.2)] hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Agent Account'}
                </button>
              </form>

              <p className="text-center text-sm text-on-surface-variant mt-6">
                Already registered?{' '}
                <Link to="/agent/signin" className="text-primary font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
