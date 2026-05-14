import React from 'react';

export default function AgencyDashboardTest() {
  return (
    <div className="bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 flex min-h-screen">
      {/* Simple Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-surface dark:bg-slate-800 py-6 gap-2 z-40 hidden md:flex shadow-sm">
        <div className="px-6 mb-8">
          <h1 className="text-lg font-bold text-primary tracking-tight">Admin Console</h1>
          <p className="text-[0.75rem] text-on-surface dark:text-slate-400/70 uppercase tracking-widest font-semibold">Agency Access</p>
        </div>
        
        <nav className="flex flex-col gap-1 px-2 flex-1">
          <button className="w-full px-4 py-3 flex items-center gap-3 rounded-xl text-left bg-surface dark:bg-slate-800 text-primary font-semibold">
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span className="text-[0.875rem]">Dashboard</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-primary">The Urban Sanctuary</h2>
            <p className="text-on-surface dark:text-slate-400 text-sm font-medium">Agency Overview & Performance</p>
          </div>
        </header>

        <div className="text-center py-20">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-blue-600 text-3xl">business</span>
          </div>
          <h3 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-2">Agency Dashboard</h3>
          <p className="text-on-surface dark:text-slate-400">This is a test version to verify the dashboard loads correctly.</p>
        </div>
      </main>
    </div>
  );
}
