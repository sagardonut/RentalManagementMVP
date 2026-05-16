import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function NotFound() {
  return (
    <div className="bg-[#FAFBFE] min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden pt-20">
        {/* Background elements for aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        <h1 className="text-[180px] md:text-[250px] font-black tracking-tighter text-[#0040A1] leading-none mb-4 select-none drop-shadow-xl relative">
          404
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-[200px] md:text-[300px] blur-[2px] -z-10 pointer-events-none">404</span>
        </h1>
        
        <div className="max-w-xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Looks like you're a bit lost...
          </h2>
          
          <p className="text-slate-500 text-lg leading-relaxed font-medium">
            We've searched high and low, but the sanctuary you are looking for has vanished into thin air. Perhaps it was just a mirage?
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="bg-[#0040A1] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#003080] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#0040A1]/20 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">home</span>
              Return Home
            </Link>
            
            <Link 
              to="/rooms" 
              className="bg-white text-slate-700 px-8 py-4 rounded-xl font-bold text-base border-2 border-slate-200 hover:border-[#0040A1] hover:text-[#0040A1] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">search</span>
              Browse Rooms
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
