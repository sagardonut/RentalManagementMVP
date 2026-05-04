import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import DashboardStats from '../components/admin/DashboardStats';
import AgenciesManagement from '../components/admin/AgenciesManagement';
import RecentPayments from '../components/admin/RecentPayments';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [agencies, setAgencies] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('user') 
          ? JSON.parse(localStorage.getItem('user')).token 
          : null;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch Data from previously exposed backend endpoints
        const [agenciesRes, bookingsRes, agentsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/users/agencies', config),
          axios.get('http://localhost:5001/api/bookings/all', config),
          axios.get('http://localhost:5001/api/users/agents-with-rooms', config)
        ]);

        setAgencies(agenciesRes.data);
        setRecentBookings(bookingsRes.data);
        setAgents(agentsRes.data || []);

        // Calculate stats from real data
        const totalRev = bookingsRes.data.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
        
        setStats({
          totalUsers: agenciesRes.data.length * 5, // Estimated users per agency for display
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
    <div className="bg-surface text-on-surface min-h-screen flex">
      {/* Sidebar - Fixed width */}
      <div className="w-72 fixed h-full z-20">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-72 min-h-screen flex flex-col">
        <AdminTopbar />

        <main className="p-8 space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Dashboard Header */}
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-on-surface">Main Dashboard</h1>
                  <p className="text-on-surface-variant font-medium mt-1">Welcome back, SuperAdmin. Here is what's happening today.</p>
                </div>
                <div className="flex space-x-3">
                   <button className="bg-surface-container border border-outline-variant/20 text-on-surface px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors shadow-sm">
                     Download Report
                   </button>
                   <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-container transition-colors shadow-lg shadow-primary/20">
                     Manage Platform
                   </button>
                </div>
              </div>

              {/* Stats Grid */}
              <DashboardStats stats={stats} loading={loading} />

              {/* Data Section: Agencies & Payments */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Table Area (2/3 width) */}
                <div className="xl:col-span-2">
                  <AgenciesManagement agencies={agencies} loading={loading} />
                </div>

                {/* Recent Payments Area (1/3 width) */}
                <div className="xl:col-span-1">
                  <RecentPayments bookings={recentBookings} loading={loading} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'payments' && (
            <>
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-on-surface">All Bookings & Payments</h1>
                  <p className="text-on-surface-variant font-medium mt-1">View and manage all platform bookings</p>
                </div>
              </div>
              <RecentPayments bookings={recentBookings} loading={loading} />
            </>
          )}

          {activeTab === 'agencies' && (
            <>
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-on-surface">Agencies Management</h1>
                  <p className="text-on-surface-variant font-medium mt-1">Manage all registered agencies</p>
                </div>
              </div>
              <AgenciesManagement agencies={agencies} loading={loading} />
            </>
          )}

          {activeTab === 'agents' && (
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-on-surface mb-2">All Agents</h3>
                <p className="text-on-surface-variant text-sm">Manage all agents across all agencies</p>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Loading agents...</p>
                  </div>
                </div>
              ) : agents.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">badge</span>
                    <h3 className="text-xl font-bold text-on-surface-variant mb-2">No Agents Found</h3>
                    <p className="text-on-surface-variant text-sm">No agents have been registered yet</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agents.map((agent, index) => (
                    <div key={index} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                          <span className="text-lg font-bold text-on-primary">
                            {agent.fullName ? agent.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AG'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-on-surface">{agent.fullName}</h4>
                          <p className="text-sm text-on-surface-variant">Agent</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-lg align-middle mr-2">email</span>
                          {agent.email}
                        </p>
                        <p className="text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-lg align-middle mr-2">phone</span>
                          {agent.phone}
                        </p>
                        {agent.specialization && (
                          <p className="text-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-lg align-middle mr-2">star</span>
                            {agent.specialization}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">bed</span>
                <h3 className="text-xl font-bold text-on-surface-variant mb-2">Rooms Management</h3>
                <p className="text-on-surface-variant text-sm">This section is under development</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">group</span>
                <h3 className="text-xl font-bold text-on-surface-variant mb-2">Users Management</h3>
                <p className="text-on-surface-variant text-sm">This section is under development</p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">analytics</span>
                <h3 className="text-xl font-bold text-on-surface-variant mb-2">Reports</h3>
                <p className="text-on-surface-variant text-sm">This section is under development</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
