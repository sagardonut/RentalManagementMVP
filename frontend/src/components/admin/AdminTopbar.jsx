import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserProfileDropdown from '../common/UserProfileDropdown';

const AdminTopbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h2 className="text-[28px] font-black text-slate-800 tracking-tight">Overview</h2>
        <p className="text-slate-400 text-sm font-medium mt-1">Welcome back, Super Admin.</p>
      </div>

      <div className="flex items-center gap-8">
        <button className="relative p-2 text-slate-400 hover:text-[#0040A1] transition-colors group">
          <span className="material-symbols-outlined text-[26px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
        </button>

        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default AdminTopbar;
