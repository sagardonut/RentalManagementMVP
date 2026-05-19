import React, { useState, useEffect, useMemo } from 'react';

// generateMockPayments removed.
import { useAuth } from '../../context/AuthContext';

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { user } = useAuth();
  const token = user?.token;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/api/bookings/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      
      const mappedPayments = data.map(booking => ({
        id: booking._id.slice(-8).toUpperCase(), // Use last 8 chars of Mongo ID as TXN ID
        date: new Date(booking.createdAt).toISOString().split('T')[0],
        amount: booking.totalAmount || 0,
        customer: booking.userId?.fullName || 'Unknown User',
        method: booking.paymentMethod || 'Bank Transfer',
        status: booking.status === 'confirmed' ? 'completed' : booking.status,
      }));
      setPayments(mappedPayments);
    } catch (err) {
      setError('Failed to fetch payment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = payments.length;
    const completed = payments.filter(p => p.status === 'completed');
    const pending = payments.filter(p => p.status === 'pending');
    const failed = payments.filter(p => p.status === 'failed');
    const revenue = completed.reduce((sum, p) => sum + p.amount, 0);

    return {
      revenue,
      total,
      pending: pending.length,
      failed: failed.length
    };
  }, [payments]);

  // Filter and search
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Completed</span>;
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>;
      case 'failed':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Failed</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Payments Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Monitor and manage all transactions</p>
        </div>
        <button 
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl hover:bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-slate-200 disabled:opacity-50 transition-all shadow-sm"
        >
          <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
          Refresh Data
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Revenue</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600">payments</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            ${loading ? '...' : metrics.revenue.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transactions</h3>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600">receipt_long</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {loading ? '...' : metrics.total}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending</h3>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600">schedule</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {loading ? '...' : metrics.pending}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Failed</h3>
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-rose-600">error</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
            {loading ? '...' : metrics.failed}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-[400px]">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search by Transaction ID or Customer..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent text-slate-800 dark:text-slate-100 font-medium rounded-xl focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:font-normal placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-bold tracking-wide">STATUS:</span>
          <select 
            className="bg-slate-50 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300 font-medium rounded-xl px-4 py-3 focus:bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Skeleton Loading
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4"><div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse w-20"></div></td>
                    <td className="px-6 py-4 flex justify-end"><div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-8"></div></td>
                  </tr>
                ))
              ) : error ? (
                // Error State
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Data Fetch Failed</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 text-center">{error}</p>
                      <button 
                        onClick={fetchData}
                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-slate-400 text-3xl">search_off</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">No payments found</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-center">We couldn't find any transactions matching your current search criteria.</p>
                      <button 
                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                        className="mt-6 px-6 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:bg-slate-800 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 dark:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{payment.id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{payment.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {payment.customer.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{payment.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">
                          {payment.method === 'Credit Card' ? 'credit_card' : payment.method === 'PayPal' ? 'account_balance_wallet' : 'account_balance'}
                        </span>
                        <span className="font-medium">{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 dark:text-slate-100">${payment.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </td>
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

export default PaymentsManagement;
