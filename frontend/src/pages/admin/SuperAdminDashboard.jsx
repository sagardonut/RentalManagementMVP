import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';
import DashboardStats from '../../components/admin/DashboardStats';
import AgenciesManagement from '../../components/admin/AgenciesManagement';
import RecentPayments from '../../components/admin/RecentPayments';

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [agencies, setAgencies] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('userInfo') 
          ? JSON.parse(localStorage.getItem('userInfo')).token 
          : null;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch Stats (Mocked for now as we haven't built the aggregate endpoint, but backend is ready for expansion)
        // In a real scenario, we'd have a specific /api/users/admin-stats endpoint
        const [agenciesRes, bookingsRes] = await Promise.all([
          axios.get('/api/users/agencies', config),
          axios.get('/api/bookings/all', config)
        ]);

        setAgencies(agenciesRes.data);
        setRecentBookings(bookingsRes.data);

        // Calculate basic stats from fetched data
        const totalRev = bookingsRes.data.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
        
        setStats({
          totalUsers: agenciesRes.data.length * 10, // Mocked user ratio
          totalAgents: agenciesRes.data.reduce((acc, curr) => acc + (curr.agentCount || 0), 0),
          totalBookings: bookingsRes.data.length,
          totalRevenue: totalRev
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      {/* Sidebar - Fixed width */}
      <div className="w-80 fixed h-full">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-80 min-h-screen flex flex-col">
        <AdminTopbar />

        <main className="p-10 space-y-10">
          {/* Dashboard Header */}
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Main Dashboard</h1>
            <p className="text-slate-400 font-medium mt-1">Welcome back to your administration command center.</p>
          </div>

          {/* Stats Grid */}
          <DashboardStats stats={stats} loading={loading} />

          {/* Data Section: Agencies & Payments */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Table Area (2/3 width) */}
            <div className="xl:col-span-2">
              <AgenciesManagement agencies={agencies} loading={loading} />
            </div>

            {/* Recent Payments Area (1/3 width) */}
            <div className="xl:col-span-1">
              <RecentPayments bookings={recentBookings} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
