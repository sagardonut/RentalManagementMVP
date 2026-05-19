import React from 'react';
import Navbar from '../components/layout/Navbar';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-['Inter'] flex flex-col transition-colors">
      <Navbar />
      
      <div className="pt-32 pb-20 bg-blue-900 text-white px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            How we collect, use, and protect your data at The Urban Sanctuary.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full space-y-12">
        <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-slate-900 dark:text-white">2. Use of Information</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            We may use the information we collect about you to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
            <li>Provide, maintain, and improve our services.</li>
            <li>Perform internal operations, including troubleshooting, data analysis, testing, and research.</li>
            <li>Send you communications we think will be of interest to you, including information about products, services, promotions, news, and events of The Urban Sanctuary.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 mt-8 text-slate-900 dark:text-white">3. Data Security</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error free.
          </p>
        </section>
      </div>
    </div>
  );
}
