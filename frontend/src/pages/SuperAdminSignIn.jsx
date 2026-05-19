import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

export default function SuperAdminSignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'superadmin') {
      navigate('/admin/super');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(formData.email, formData.password, 'superadmin');

    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser?.role === 'superadmin') {
        navigate('/admin/super');
      } else {
        setError('Unauthorized role.');
        setIsLoading(false);
      }
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 min-h-screen flex flex-col pt-20">
      <header className="fixed top-0 w-full z-50 bg-[#faf8ff]/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 w-full max-w-screen-2xl mx-auto">
          <div className="text-xl font-bold tracking-tighter text-slate-800 dark:text-slate-100">Super Admin Portal</div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">System Login</h1>
            <p className="text-on-surface dark:text-slate-400">Restricted Area. Authorized personnel only.</p>
          </div>

          {error && (
            <div className="bg-error-container dark:bg-red-900/30 text-on-error-container dark:text-red-400 p-4 rounded-xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="bg-surface dark:bg-slate-800 p-8 rounded-xl shadow-[0_8px_24px_-8px_rgba(25,27,35,0.06)] border border-outline-variant/20 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400 ml-1">Admin Email</label>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-800/20 dark:focus:ring-slate-100/20 transition-all text-on-surface dark:text-slate-100" 
                  placeholder="admin@urbansanctuary.com" 
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400 ml-1">Password</label>
                <input 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-800/20 dark:focus:ring-slate-100/20 transition-all text-on-surface dark:text-slate-100" 
                  placeholder="••••••••" 
                  type="password"
                  autoComplete="current-password"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
