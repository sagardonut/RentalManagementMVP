import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 transition-colors">
      <div className="text-center max-w-lg">
        {/* Large 404 */}
        <div className="relative mb-8">
          <h1 className="text-[10rem] md:text-[14rem] font-black text-slate-100 dark:text-slate-800 leading-none select-none transition-colors">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-primary text-4xl">explore_off</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight transition-colors">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed transition-colors">
          The sanctuary you're looking for doesn't exist or has been moved.
          <br className="hidden md:block" />
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="px-8 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] transition-all text-sm uppercase tracking-widest flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Back to Home
          </Link>
          <Link
            to="/rooms"
            className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary dark:hover:text-primary hover:-translate-y-0.5 active:scale-[0.98] transition-all text-sm uppercase tracking-widest flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            Browse Rooms
          </Link>
        </div>

        {/* Subtle branding */}
        <p className="mt-16 text-xs font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] transition-colors">
          The Urban Sanctuary
        </p>
      </div>
    </div>
  );
}
