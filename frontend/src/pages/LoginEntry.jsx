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
      path: '/signin?role=user',
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
      path: '/signin?role=agency',
      icon: 'business',
      description: 'Manage your agency portfolio, oversee agent performance, and access high-level analytics.',
      color: 'bg-slate-800',
      lightColor: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-800 dark:text-slate-100'
    }
  ];

  if (user) {
    // Redirect based on user role
    if (user.role === 'agent') {
      return <Navigate to="/agent/dashboard" replace />;
    } else if (user.role === 'agency') {
      return <Navigate to="/agency/dashboard" replace />;
    } else if (user.role === 'superadmin') {
      return <Navigate to="/admin/super" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return (
    <div className="bg-surface dark:bg-slate-900 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6 max-w-screen-xl mx-auto w-full">
        <div className="max-w-3xl mb-16 mx-auto text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary dark:text-blue-400 uppercase mb-4 block">Secure Authentication</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface dark:text-slate-100 leading-tight mb-6 tracking-tight">Choose your entry point.</h1>
          <p className="text-on-surface dark:text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Select your account type to access the specialized tools and dashboards of The Urban Sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {roles.map((role) => (
            <Link 
              key={role.id}
              to={role.path}
              className="group relative flex flex-col bg-surface dark:bg-slate-800 rounded-3xl p-8 border border-outline-variant/20 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Accent */}
              <div className={`absolute -right-8 -top-8 w-32 h-32 ${role.lightColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className={`w-14 h-14 ${role.lightColor} rounded-2xl flex items-center justify-center mb-10 transition-transform duration-300 group-hover:scale-110`}>
                <span className={`material-symbols-outlined !text-3xl ${role.textColor}`}>{role.icon}</span>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold text-on-surface dark:text-slate-100 mb-4 tracking-tight">{role.title}</h3>
                <p className="text-on-surface dark:text-slate-400 text-sm font-medium leading-relaxed mb-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  {role.description}
                </p>
                
                <div className="flex items-center gap-2 font-bold text-xs tracking-widest uppercase text-on-surface dark:text-slate-100 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                  Get Started
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>


      </main>

      <Footer />
    </div>
  );
}
