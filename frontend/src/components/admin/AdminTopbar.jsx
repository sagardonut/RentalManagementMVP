import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserProfileDropdown from '../common/UserProfileDropdown';
import useTheme from '../../hooks/useTheme';

const AdminTopbar = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex justify-between items-center mb-10 transition-colors">
      <div>
        <h2 className="text-[28px] font-black text-slate-800 dark:text-slate-100 tracking-tight">Overview</h2>
        <p className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Welcome back, Super Admin.</p>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[24px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <button className="relative p-2 text-slate-400 hover:text-[#0040A1] dark:hover:text-blue-400 transition-colors group">
          <span className="material-symbols-outlined text-[26px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
        </button>

        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default AdminTopbar;
