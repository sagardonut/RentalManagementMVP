import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AgencySignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'agency') navigate('/admin/agency');
  }, [user, navigate]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password, 'agency');
    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const role = storedUser?.role;

      if (role === 'agency') {
        navigate('/admin/agency');
      } else {
        setError('Access denied. This login is for agencies only.');
        setLoading(false);
      }
    } else {
      setError(result.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-lg border-b border-outline-variant/20 shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-screen-xl mx-auto">
          <Link to="/" className="text-lg font-bold tracking-tight text-primary">The Urban Sanctuary</Link>
          <div className="flex items-center gap-4 text-sm font-medium text-on-surface-variant">
            <span>Not registered?</span>
            <Link to="/signup" className="text-primary font-bold hover:underline">Agency Sign Up</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0_24px_64px_rgba(0,64,161,0.08)] border border-outline-variant/20 overflow-hidden">
            {/* Top Banner */}
            <div className="bg-primary px-8 pt-8 pb-6">
              <p className="text-on-primary/60 text-[0.65rem] font-black uppercase tracking-[0.2em] mb-1">Agency Portal</p>
              <h1 className="text-2xl font-black text-on-primary tracking-tighter">Agency</h1>
              <h2 className="text-3xl font-black text-on-primary/80 tracking-tighter">Administration</h2>
              <p className="text-on-primary/60 text-sm mt-2 font-medium">Sign in to manage your agency and agents</p>
            </div>

            <div className="px-8 py-8">
              {error && (
                <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-bold text-center mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] font-black uppercase tracking-widest text-on-surface-variant">Email Address</label>
                  <input
                    name="email" type="email" required
                    value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface font-medium transition-all"
                    placeholder="agency@urbansanctuary.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] font-black uppercase tracking-widest text-on-surface-variant">Password</label>
                  <input
                    name="password" type="password" required
                    value={formData.password} onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface font-medium transition-all"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-base shadow-[0_8px_24px_rgba(0,64,161,0.2)] hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
                >
                  {loading ? 'Signing In...' : 'Sign In to Agency Dashboard'}
                </button>
              </form>

              <p className="text-center text-sm text-on-surface-variant mt-6">
                New agency?{' '}
                <Link to="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
