import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock Data Generators
const generateMockChartData = (period) => {
  const data = [];
  let points = period === 'daily' ? 7 : period === 'weekly' ? 4 : 12;
  const labels = 
    period === 'daily' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
    period === 'weekly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 0; i < points; i++) {
    data.push({
      name: labels[i],
      revenue: Math.floor(Math.random() * 5000) + 1000,
      bookings: Math.floor(Math.random() * 50) + 5
    });
  }
  return data;
};

const generateMockTableData = () => {
  const statuses = ['Confirmed', 'Pending', 'Cancelled', 'Completed'];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `BKG-${10000 + i}`,
    user: `User ${i + 1}`,
    property: `Apartment ${Math.floor(Math.random() * 10) + 1}`,
    amount: Math.floor(Math.random() * 1000) + 100,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0]
  })).sort((a, b) => new Date(b.date) - new Date(a.date));
};

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [dateRange, setDateRange] = useState('30days');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setChartData(generateMockChartData(chartPeriod));
      setTableData(generateMockTableData());
    } catch (err) {
      setError('Failed to fetch report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [chartPeriod, dateRange]);

  const handleExportCSV = () => {
    if (tableData.length === 0) return;
    const headers = ['Booking ID', 'User', 'Property', 'Amount', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...tableData.map(row => `${row.id},${row.user},${row.property},${row.amount},${row.status},${row.date}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'reports_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed':
      case 'Confirmed':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{status}</span>;
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{status}</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">{status}</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Analytics & Reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Comprehensive overview of platform performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
            Refresh
          </button>
          <button 
            onClick={handleExportCSV}
            disabled={loading || tableData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 dark:shadow-none disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Revenue</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">payments</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {loading ? '...' : '$124,500'}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Bookings</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">book_online</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {loading ? '...' : '1,420'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Users</h3>
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">group</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {loading ? '...' : '8,940'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Occupancy Rate</h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">bed</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {loading ? '...' : '82%'}
          </div>
        </div>
      </div>

      {/* Chart & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Revenue & Booking Trends</h3>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {['daily', 'weekly', 'monthly'].map(period => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg capitalize transition-colors ${
                  chartPeriod === period 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-80 w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse">
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl">monitoring</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#0040A1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Date Range:</span>
            <select 
              className="bg-slate-50 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300 font-medium rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-24"></div></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error</span>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">{error}</p>
                      <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Again</button>
                    </div>
                  </td>
                </tr>
              ) : tableData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-3">analytics</span>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">No activity data found for this period</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{row.id}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{row.user}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{row.property}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">${row.amount}</td>
                    <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{row.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
