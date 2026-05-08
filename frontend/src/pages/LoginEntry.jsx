import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LoginEntry() {
  const { user } = useAuth();
  
  // Roles and their landing pages
  const roles = [
    {
      title: 'Member',
      id: 'user',
      path: '/signin',
      icon: 'person',
      description: 'Sign in as a resident or property seeker to manage your bookings and explore Kathmandu.',
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Property Agent',
      id: 'agent',
      path: '/agent/signin',
      icon: 'real_estate_agent',
      description: 'Access the Agent Portal to manage your property listings, verify amenities, and assist seekers.',
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      title: 'Agency Admin',
      id: 'agency',
      path: '/agency/signin',
      icon: 'business',
      description: 'Manage your agency portfolio, oversee agent performance, and access high-level analytics.',
      color: 'bg-primary',
      lightColor: 'bg-blue-50',
      textColor: 'text-primary'
    }
  ];

  if (user) {
    // Redirect based on user role
    if (user.role === 'agent') {
      return <Navigate to="/agent/dashboard" replace />;
    } else if (user.role === 'agency') {
      return <Navigate to="/admin/agency" replace />;
    } else if (user.role === 'superadmin') {
      return <Navigate to="/admin/super" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return (
    <div className="bg-[#FAFBFE] min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6 max-w-screen-xl mx-auto w-full">
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-black tracking-[0.2em] text-[#0040A1] uppercase mb-4 block">Secure Authentication</span>
          <h1 className="text-[52px] font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">Choose your entry point.</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
            Select your account type to access the specialized tools and dashboards of The Urban Sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {roles.map((role) => (
            <Link 
              key={role.id}
              to={role.path}
              className="group relative flex flex-col bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Accent */}
              <div className={`absolute -right-8 -top-8 w-32 h-32 ${role.lightColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className={`w-14 h-14 ${role.lightColor} rounded-2xl flex items-center justify-center mb-10 transition-transform duration-300 group-hover:scale-110`}>
                <span className={`material-symbols-outlined !text-3xl ${role.textColor}`}>{role.icon}</span>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{role.title}</h3>
                <p className="text-slate-500 text-[13px] font-medium leading-relaxed mb-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  {role.description}
                </p>
                
                <div className="flex items-center gap-2 font-black text-[11px] tracking-widest uppercase text-slate-900 group-hover:text-[#0040A1] transition-colors">
                  Get Started
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
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
              to="/superadmin/signin"
              className="px-8 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-black tracking-widest uppercase hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap"
            >
                Admin Access
            </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
