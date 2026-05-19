import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const expectedRole = queryParams.get('role') || 'user'; // Default to user if accessed directly

  useEffect(() => {
    if (user) {
      if (user.role === 'agent') {
        navigate('/agent/dashboard');
      } else if (user.role === 'agency') {
        navigate('/agency/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(formData.email, formData.password, expectedRole);

    if (result.success) {
      // Role-based redirection logic
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const role = storedUser?.role;

      if (role === 'agent') {
        navigate('/agent/dashboard');
      } else if (role === 'agency') {
        navigate('/agency/dashboard');
      } else {
        navigate('/user/dashboard'); // default for regular users
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
          <Link to="/" className="text-xl font-bold tracking-tighter text-primary dark:text-blue-400">The Urban Sanctuary</Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-on-surface dark:text-slate-400">
            <span>Don't have an account?</span>
            <Link className="text-primary dark:text-blue-400 font-bold hover:text-surface-tint dark:hover:text-blue-300 transition-all" to="/signup">Join Us</Link>
            <div className="w-px h-4 bg-outline-variant/30 mx-2"></div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome back.</h1>
            <p className="text-on-surface dark:text-slate-400">Enter your credentials to access your sanctuary dashboard.</p>
          </div>

          {error && (
            <div className="bg-error-container dark:bg-red-900/30 text-on-error-container dark:text-red-400 p-4 rounded-xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="bg-surface dark:bg-slate-800 p-8 rounded-xl shadow-[0_8px_24px_-8px_rgba(25,27,35,0.06)] border border-outline-variant/20 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400 ml-1">Email Address</label>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-surface-tint/20 dark:focus:ring-blue-500/20 transition-all text-on-surface dark:text-slate-100" 
                  placeholder="name@company.com" 
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
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-surface-tint/20 dark:focus:ring-blue-500/20 transition-all text-on-surface dark:text-slate-100" 
                  placeholder="••••••••" 
                  type="password"
                  autoComplete="current-password"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary dark:bg-blue-600 hover:bg-primary-container dark:hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 dark:shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-on-surface dark:text-slate-400 uppercase tracking-widest">
            New to Urban Sanctuary? <Link to="/signup" className="text-primary dark:text-blue-400 underline font-bold">Create an account</Link>
          </p>
          <p className="text-center text-xs text-on-surface dark:text-slate-400 uppercase tracking-widest mt-2">
            By signing in, you agree to our <Link to="#" className="text-primary dark:text-blue-400 underline">Terms</Link> & <Link to="#" className="text-primary dark:text-blue-400 underline">Privacy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
