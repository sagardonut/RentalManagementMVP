import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserProfileDropdown from '../common/UserProfileDropdown';
import ThemeToggle from '../common/ThemeToggle';

const AdminTopbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center mb-10 transition-colors">
      <div>
        <h2 className="text-[28px] font-black text-slate-800 dark:text-slate-100 tracking-tight">Overview</h2>
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">Welcome back, Super Admin.</p>
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggle />
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default AdminTopbar;

