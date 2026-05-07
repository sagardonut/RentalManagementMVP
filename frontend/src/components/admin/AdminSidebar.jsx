import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'agencies', icon: 'corporate_fare', label: 'Agencies' },
    { id: 'agents', icon: 'badge', label: 'Agents' },
    { id: 'rooms', icon: 'bed', label: 'Rooms' },
    { id: 'users', icon: 'group', label: 'Users' },
    { id: 'payments', icon: 'payments', label: 'Payments' },
    { id: 'reports', icon: 'analytics', label: 'Reports' },
  ];

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col z-50">
      <div className="p-8 pb-12">
        <h1 className="text-xl font-bold text-[#0040A1] tracking-tight">Admin Console</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">the urban sanctuary</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-[#0040A1] text-white shadow-lg shadow-blue-100' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#0040A1]'}`}>
              {item.icon}
            </span>
            <span className="text-[15px] font-semibold tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-4">
        <div className="pt-4 border-t border-slate-50 space-y-1">
          <button className="w-full flex items-center gap-4 px-6 py-3 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <span className="material-symbols-outlined text-xl text-slate-400">help</span>
            <span className="text-sm font-semibold">Help Center</span>
          </button>
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-4 px-6 py-3 text-slate-400 hover:text-red-500 rounded-xl transition-colors group"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-red-500">logout</span>
            <span className="text-sm font-semibold">Sign-out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
