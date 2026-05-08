import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginEntryTest() {
  return (
    <div className="bg-[#FAFBFE] min-h-screen flex flex-col">
      <header className="w-full py-6 px-8 border-b border-slate-200/20 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#0040A1]">home</span>
            <span className="text-xl font-black text-slate-900">The Urban Sanctuary</span>
          </div>
        </div>
      </header>
      
      <main className="flex-grow pt-32 pb-20 px-6 max-w-screen-xl mx-auto w-full">
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-black tracking-[0.2em] text-[#0040A1] uppercase mb-4 block">Secure Authentication</span>
          <h1 className="text-[52px] font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">Choose your entry point.</h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">Select your role to access the appropriate portal for your needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link to="/signin" className="group">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 h-full">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-white text-3xl">person</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Member</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Sign in as a resident or property seeker to manage your bookings and explore Kathmandu.</p>
              
              <div className="flex items-center gap-2 font-black text-[11px] tracking-widest uppercase text-slate-900 group-hover:text-[#0040A1] transition-colors">
                Get Started
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </div>
          </Link>

          <Link to="/agent/signin" className="group">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 h-full">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-white text-3xl">real_estate_agent</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Property Agent</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Access the Agent Portal to manage your property listings, verify amenities, and assist seekers.</p>
              
              <div className="flex items-center gap-2 font-black text-[11px] tracking-widest uppercase text-slate-900 group-hover:text-[#0040A1] transition-colors">
                Get Started
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </div>
          </Link>

          <Link to="/signin" className="group">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 h-full">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-white text-3xl">business</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Agency Admin</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Manage your agency portfolio, oversee agent performance, and access high-level analytics.</p>
              
              <div className="flex items-center gap-2 font-black text-[11px] tracking-widest uppercase text-slate-900 group-hover:text-[#0040A1] transition-colors">
                Get Started
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600">admin_panel_settings</span>
                </div>
                <div>
                    <h4 className="text-lg font-black text-slate-900 leading-none mb-1.5">System Administrator?</h4>
                    <p className="text-slate-500 text-xs font-medium">Access the central management console for platform-wide operations.</p>
                </div>
            </div>
            <Link 
              to="/signin" 
              className="px-8 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-black tracking-widest uppercase hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap"
            >
                Admin Access
            </Link>
        </div>
      </main>
    </div>
  );
}
