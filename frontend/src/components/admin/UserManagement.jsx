import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Initial Mock Data (removed)
// chartData and activities can stay as static UI placeholders or be replaced later.

const chartData6Months = [
  { name: 'Jan', users: 120 }, { name: 'Feb', users: 180 }, { name: 'Mar', users: 250 },
  { name: 'Apr', users: 310 }, { name: 'May', users: 450 }, { name: 'Jun', users: 590 }
];

const chartData1Year = [
  { name: 'Q1', users: 300 }, { name: 'Q2', users: 550 },
  { name: 'Q3', users: 800 }, { name: 'Q4', users: 1200 }
];

const initialActivities = [
  { id: 1, user: 'Sita Gurung', action: 'completed a booking in Patan', time: '10 mins ago', icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-500/20' },
  { id: 2, user: 'Kiran KC', action: 'added a property to favorites', time: '1 hour ago', icon: 'favorite', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-500/20' },
  { id: 3, user: 'Aarav Sharma', action: 'updated profile information', time: '2 hours ago', icon: 'person', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20' },
  { id: 4, user: 'New User', action: 'registered an account', time: '5 hours ago', icon: 'person_add', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/20' },
];

const UserManagement = () => {
  // Main State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState(initialActivities);
  
  // Filtering & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Chart State
  const [chartTimeframe, setChartTimeframe] = useState('6months');

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Forms State
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '' });

  // Alerts State
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/users/all');
      if (response.ok) {
        const data = await response.json();
        const mappedUsers = data.map(u => ({
          id: u._id,
          name: u.fullName,
          email: u.email,
          phone: u.phone || 'N/A',
          registered: new Date(u.createdAt).toISOString().split('T')[0],
          status: u.isActive ? 'active' : 'inactive',
          activity: u.role
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      triggerAlert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // --- Derived Data ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const bounceRate = Math.max(10, 35 - (activeUsersCount * 2)); // Mock dynamic calc

  // --- Handlers ---
  const triggerAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return triggerAlert('Name and email are required.');
    
    const createdUser = {
      id: Date.now().toString(),
      ...newUser,
      registered: new Date().toISOString().split('T')[0],
      status: 'active',
      activity: 'Just registered'
    };
    
    setUsers([createdUser, ...users]);
    setActivities([
      { id: Date.now(), user: createdUser.name, action: 'registered an account', time: 'Just now', icon: 'person_add', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/20' },
      ...activities
    ]);
    
    setNewUser({ name: '', email: '', phone: '' });
    setShowAddModal(false);
    triggerAlert('User successfully added!');
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setShowSettingsModal(false);
    triggerAlert('User settings updated successfully!');
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'inactive' : 'active';
        triggerAlert(`${u.name} is now ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleLoadMoreActivity = () => {
    setActivities([
      ...activities,
      { id: Date.now() + 1, user: 'System', action: 'ran automated backups', time: '1 day ago', icon: 'cloud_sync', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-700' },
      { id: Date.now() + 2, user: 'Priya Thapa', action: 'updated billing info', time: '1 day ago', icon: 'credit_card', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-500/20' }
    ]);
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert */}
      {alertMsg && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in-down">
          <span className="material-symbols-outlined text-green-400">check_circle</span>
          <span className="font-bold text-sm tracking-wide">{alertMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface dark:text-slate-100">Users Management</h1>
          <p className="text-on-surface dark:text-slate-400 font-medium mt-1">Manage and analyze platform users dynamically</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">person_add</span>
          Add User
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: users.length.toString(), trend: '+12.5%', isPositive: true, icon: 'group', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20' },
          { label: 'Active Status', value: activeUsersCount.toString(), trend: '+5.2%', isPositive: true, icon: 'bolt', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/20' },
          { label: 'New Registrations', value: '145', trend: '+18.1%', isPositive: true, icon: 'person_add', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/20' },
          { label: 'Bounce Rate', value: `${bounceRate}%`, trend: '-2.4%', isPositive: true, icon: 'trending_down', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/20' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface dark:bg-slate-800 p-6 rounded-2xl border border-surface-container shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
              </div>
              <span className={`flex items-center gap-1 text-sm font-bold ${stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.trend}
                <span className="material-symbols-outlined text-sm">{stat.isPositive ? 'trending_up' : 'trending_down'}</span>
              </span>
            </div>
            <h3 className="text-on-surface dark:text-slate-400 text-sm font-bold tracking-wider uppercase mb-1">{stat.label}</h3>
            <p className="text-3xl font-extrabold text-on-surface dark:text-slate-100 transition-all">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Table + Chart) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-surface dark:bg-slate-800 p-6 rounded-2xl border border-surface-container shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-on-surface dark:text-slate-100">User Growth</h2>
              <select 
                value={chartTimeframe}
                onChange={(e) => setChartTimeframe(e.target.value)}
                className="bg-surface dark:bg-slate-900 border border-surface-container text-sm font-bold text-on-surface dark:text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors hover:border-primary/50"
              >
                <option value="6months">Last 6 Months</option>
                <option value="1year">This Year</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTimeframe === '6months' ? chartData6Months : chartData1Year} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#60a5fa' }}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-surface dark:bg-slate-800 rounded-2xl border border-surface-container shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-6 border-b border-surface-container flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 bg-surface dark:bg-slate-900 border border-surface-container rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary text-on-surface dark:text-slate-100 placeholder-slate-400 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select 
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="bg-surface dark:bg-slate-900 border border-surface-container text-sm font-bold text-on-surface dark:text-slate-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary flex-1 sm:flex-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button onClick={() => {setSearchTerm(''); setFilterStatus('all'); setCurrentPage(1);}} className="p-2 border border-surface-container rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors" title="Clear Filters">
                  <span className="material-symbols-outlined">filter_list_off</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2 animate-spin">refresh</span>
                        <p className="text-slate-500 font-bold">Loading users...</p>
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">person_off</span>
                        <p className="text-slate-500 font-bold">No users found matching your criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shadow-inner">
                              {getInitials(user.name)}
                            </div>
                            <div>
                              <div className="font-bold text-on-surface dark:text-slate-100 group-hover:text-primary transition-colors">{user.name}</div>
                              <div className="text-xs font-medium text-slate-500">Reg: {user.registered}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-on-surface dark:text-slate-300">{user.email}</div>
                          <div className="text-xs font-medium text-slate-500">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30' 
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setSelectedUser(user); setShowSettingsModal(true); }} className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors" title="User Settings">
                              <span className="material-symbols-outlined text-xl">settings</span>
                            </button>
                            <button onClick={() => { setSelectedUser(user); setShowDetailsModal(true); }} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="View Details">
                              <span className="material-symbols-outlined text-xl">visibility</span>
                            </button>
                            <button onClick={() => handleToggleStatus(user.id)} className={`p-2 rounded-lg transition-colors ${user.status === 'active' ? 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' : 'text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'}`} title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}>
                              <span className="material-symbols-outlined text-xl">{user.status === 'active' ? 'block' : 'check_circle'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="p-4 border-t border-surface-container flex justify-between items-center text-sm font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-900/20">
              <span>Showing {paginatedUsers.length} of {filteredUsers.length} users</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-surface-container hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <div className="flex items-center px-2">
                  Page {currentPage} of {Math.max(1, totalPages)}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-lg border border-surface-container hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Activity Panel */}
        <div className="space-y-6">
          <div className="bg-surface dark:bg-slate-800 p-6 rounded-2xl border border-surface-container shadow-sm flex flex-col h-[520px]">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h2 className="text-lg font-bold text-on-surface dark:text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Activity
              </h2>
            </div>
            
            <div className="space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4 group">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 transition-transform group-hover:scale-110 ${activity.bg}`}>
                    <span className={`material-symbols-outlined text-lg ${activity.color}`}>{activity.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface dark:text-slate-300 leading-snug">
                      <span className="font-bold text-on-surface dark:text-slate-100">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleLoadMoreActivity}
              className="w-full mt-4 py-3 flex items-center justify-center gap-2 border border-surface-container border-dashed rounded-xl text-sm font-bold text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex-shrink-0"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              Load More Activity
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent p-6 rounded-2xl border border-primary/20">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">flash_on</span>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button onClick={() => triggerAlert('Preparing CSV download...')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm font-bold text-on-surface dark:text-slate-200 border border-transparent hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </div>
                  Export Data
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Add New User
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. Ram Bahadur" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. ram@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input type="text" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="+977..." />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-colors shadow-lg shadow-primary/30">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
              <button onClick={() => setShowDetailsModal(false)} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full p-1 backdrop-blur-md">
                <span className="material-symbols-outlined block">close</span>
              </button>
            </div>
            <div className="px-8 pb-8 pt-0 relative">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full p-1.5 absolute -top-12 shadow-lg">
                <div className="w-full h-full bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-black">
                  {getInitials(selectedUser.name)}
                </div>
              </div>
              
              <div className="mt-14 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{selectedUser.name}</h2>
                  <p className="text-sm font-bold text-primary mt-1">{selectedUser.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${selectedUser.status === 'active' ? 'text-green-600' : 'text-slate-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${selectedUser.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                      {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Registered</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedUser.registered}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-slate-400">call</span>
                    {selectedUser.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-slate-400">history</span>
                    {selectedUser.activity}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Settings Modal */}
      {showSettingsModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">manage_accounts</span>
                User Settings
              </h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input required type="text" value={selectedUser.name} onChange={e => setSelectedUser({...selectedUser, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input required type="email" value={selectedUser.email} onChange={e => setSelectedUser({...selectedUser, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input type="text" value={selectedUser.phone} onChange={e => setSelectedUser({...selectedUser, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-purple-600/30">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tailwind Custom Animations CSS Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}} />
    </div>
  );
};

export default UserManagement;
