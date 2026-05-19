import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'agencies', icon: 'corporate_fare', label: 'Agencies' },
    { id: 'agents', icon: 'badge', label: 'Agents' },
    { id: 'rooms', icon: 'bed', label: 'Rooms' },
    { id: 'pending_rooms', icon: 'pending_actions', label: 'Pending Rooms' },
    { id: 'users', icon: 'group', label: 'Users' },
    { id: 'payments', icon: 'payments', label: 'Payments' },
    { id: 'reports', icon: 'analytics', label: 'Reports' },
  ];

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col z-50 transition-colors">
      <div className="p-8 pb-12">
        <h1 className="text-xl font-bold text-[#0040A1] dark:text-blue-400 tracking-tight">Admin Console</h1>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">the urban sanctuary</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-[#0040A1] dark:bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none' 
                : 'text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeTab === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-[#0040A1] dark:group-hover:text-blue-400'}`}>
              {item.icon}
            </span>
            <span className="text-[15px] font-semibold tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-4">
        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-1">
          <Link to="/help" className="w-full flex items-center gap-4 px-6 py-3 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors">
            <span className="material-symbols-outlined text-xl text-slate-400 dark:text-slate-500 dark:text-slate-400">help</span>
            <span className="text-sm font-semibold">Help Center</span>
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-6 py-3 text-slate-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-colors group"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400">logout</span>
            <span className="text-sm font-semibold">Sign-out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
