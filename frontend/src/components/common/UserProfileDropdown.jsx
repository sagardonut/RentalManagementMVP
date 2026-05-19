import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'user': return '/user/dashboard';
      case 'agent': return '/agent/dashboard';
      case 'agency': return '/agency/dashboard';
      default: return '/';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
      >
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
          {getInitials(user?.fullName)}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {user?.fullName ? user.fullName.split(' ')[0] : 'User'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize leading-tight">
            {user?.role || 'Guest'}
          </span>
        </div>
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm ml-1">
          {dropdownOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
          <Link
            to={getDashboardPath()}
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            View Dashboard
          </Link>
          {user?.role === 'user' && (
            <Link
              to="/user/dashboard"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">book</span>
              My Bookings
            </Link>
          )}
          <hr className="my-2 border-slate-100 dark:border-slate-800" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
