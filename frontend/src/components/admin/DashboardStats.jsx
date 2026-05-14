import React from 'react';

const StatCard = ({ label, value, trend, isRevenue, loading }) => {
  if (loading) {
    return (
      <div className={`p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-50 animate-pulse ${isRevenue ? 'col-span-2' : ''}`}>
        <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
        <div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (isRevenue) {
    return (
      <div className="p-10 rounded-[40px] bg-[#0040A1] text-white flex flex-col justify-between relative overflow-hidden group">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-slate-900/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white dark:bg-slate-900/10 transition-colors duration-700"></div>
        
        <div>
          <p className="text-white/60 text-sm font-bold uppercase tracking-[0.15em] mb-2">Total Revenue</p>
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 text-2xl font-medium">Rs.</span>
            <h3 className="text-5xl font-black tracking-tighter">{value}</h3>
          </div>
        </div>

        <div className="mt-8 flex items-end gap-[6px] h-12">
          {[40, 70, 45, 90, 60, 100].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 rounded-sm bg-white dark:bg-slate-900/20 group-hover:bg-white dark:bg-slate-900/30 transition-all duration-500" 
              style={{ height: `${h}%` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-[36px] bg-white dark:bg-slate-900 border border-slate-50 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.15em]">{label}</p>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
          <span className="material-symbols-outlined text-sm">{trend.startsWith('+') ? 'trending_up' : 'trending_down'}</span>
          {trend}
        </div>
      </div>
      <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter group-hover:scale-105 transition-transform origin-left duration-500">{value}</h3>
    </div>
  );
};

const DashboardStats = ({ stats, loading }) => {
  return (
    <section className="grid grid-cols-5 gap-6 mb-12">
      <StatCard 
        label="Total Agencies" 
        value={stats.totalAgencies || 24} 
        trend="+12%" 
        loading={loading}
      />
      <StatCard 
        label="Total Agents" 
        value={stats.totalAgents || 156} 
        trend="+14%" 
        loading={loading}
      />
      <StatCard 
        label="Total Rooms" 
        value={stats.totalRooms || 342} 
        trend="+8%" 
        loading={loading}
      />
      <StatCard 
        label="Total Users" 
        value={stats.totalUsers || '2.4k'} 
        trend="+15%" 
        loading={loading}
      />
      <StatCard 
        label="Total Revenue" 
        value={(stats.totalRevenue ? (stats.totalRevenue / 1000000).toFixed(1) + 'M' : '1.5M')} 
        isRevenue 
        loading={loading}
      />
    </section>
  );
};

export default DashboardStats;
