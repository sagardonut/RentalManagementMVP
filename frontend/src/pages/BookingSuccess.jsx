import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, room } = location.state || {};

  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!booking || !room) return null;

  return (
    <div className="bg-[#FAFBFE] dark:bg-slate-950 min-h-screen font-['Inter']">
      <Navbar />
      
      <main className="max-w-screen-xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center">
        {/* Success Icon */}
        <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#0040A1] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,64,161,0.3)]">
                <span className="material-symbols-outlined !text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
        </div>

        {/* Header Text */}
        <div className="text-center mb-16 max-w-2xl">
            <h1 className="text-[52px] font-black text-[#0040A1] leading-tight mb-4 tracking-tight">Booking Successful!</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
              A confirmation email with the room details and agent contact has been sent to your registered email.
            </p>
        </div>

        {/* Main Content Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            
            {/* Left Card: Room Details */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[32px] p-4 border border-slate-100 dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden mb-8">
                    <img 
                      src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'} 
                      alt={room.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-4 left-4 inline-flex px-4 py-2 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-full items-center gap-2 border border-white/20 shadow-sm">
                        <span className="material-symbols-outlined text-blue-600 text-sm">verified</span>
                        <span className="text-[10px] font-black tracking-widest text-[#0040A1] uppercase leading-none mt-0.5">VERIFIED LISTING</span>
                    </div>
                </div>
                
                <div className="px-6 pb-6">
                    <div className="text-[10px] font-black tracking-[0.2em] text-[#0040A1]/60 uppercase mb-2">PREMIUM RESIDENCE</div>
                    <h2 className="text-[32px] font-black text-slate-900 dark:text-white mb-2 tracking-tight leading-tight">{room.title}</h2>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="text-sm">{room.location}</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Agent & Stay Summary */}
            <div className="lg:col-span-5 space-y-8">
                
                {/* Agent Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
                    <h3 className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase mb-6">ASSIGNED PROPERTY AGENT</h3>
                    
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#0040A1]/5 border border-[#0040A1]/10 flex items-center justify-center overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                              alt="Rajesh Shakya" 
                              className="w-full h-full object-cover" 
                            />
                        </div>
                        <div>
                            <div className="text-[17px] font-black text-slate-900 dark:text-white mb-0.5">Rajesh Shakya</div>
                            <div className="text-[12px] text-slate-400 font-semibold">Senior Portfolio Manager</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 h-12 bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors rounded-xl text-slate-900 dark:text-white text-xs font-bold">
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                            Message
                        </button>
                        <button className="flex items-center justify-center gap-2 h-12 bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors rounded-xl text-slate-900 dark:text-white text-xs font-bold">
                            <span className="material-symbols-outlined text-[18px]">call</span>
                            Call
                        </button>
                    </div>
                </div>

                {/* Stay Summary Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border-l-4 border-l-[#0040A1]">
                    <h3 className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase mb-6">STAY SUMMARY</h3>
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Check-in</span>
                            <span className="text-[13px] font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Guests</span>
                            <span className="text-[13px] font-bold text-slate-900 dark:text-white">2 Adults</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800">
                            <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Status</span>
                            <span className="px-3 py-1 bg-[#0040A1] text-white text-[9px] font-black tracking-widest rounded-full uppercase">CONFIRMED</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-center gap-10">
            <Link 
              to="/user/dashboard"
              className="px-10 h-16 bg-[#0040A1] hover:bg-[#00358a] text-white rounded-2xl flex items-center justify-center font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-[#0040A1]/20"
            >
              Go to Dashboard
            </Link>
            <Link 
              to="/user/dashboard"
              className="text-[#0040A1] dark:text-blue-400 font-bold text-lg hover:underline underline-offset-4"
            >
              View My Bookings
            </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
