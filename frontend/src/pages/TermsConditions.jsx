import React from 'react';
import Navbar from '../components/layout/Navbar';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-['Inter'] flex flex-col transition-colors">
      <Navbar />
      
      <div className="pt-32 pb-20 bg-blue-900 text-white px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Terms & Conditions</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Please read these terms carefully before using our platform.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full space-y-12">
        <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Agreement to Terms</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            By accessing or using The Urban Sanctuary platform, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-slate-900 dark:text-white">2. User Accounts</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-8 text-slate-900 dark:text-white">3. Property Listings</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Agents and Agencies are responsible for the accuracy of their property listings. The Urban Sanctuary reserves the right to remove any listing that violates our community guidelines or is found to be misleading.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-8 text-slate-900 dark:text-white">4. Modifications</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}
