import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import DashboardStats from '../components/admin/DashboardStats';
import AgenciesManagement from '../components/admin/AgenciesManagement';
import AgentManagement from '../components/admin/AgentManagement';
import RoomManagement from '../components/admin/RoomManagement';
import RecentPayments from '../components/admin/RecentPayments';
import PaymentsManagement from '../components/admin/PaymentsManagement';
import Reports from '../components/admin/Reports';
import UserManagement from '../components/admin/UserManagement';
import PendingRoomsManagement from '../components/admin/PendingRoomsManagement';

const API = 'http://localhost:5001/api';

const SuperAdminDashboard = () => {
  console.log('SuperAdminDashboard component is rendering...');
  
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
  const [editingAgency, setEditingAgency] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agencyToDelete, setAgencyToDelete] = useState(null);
  const [agencyForm, setAgencyForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [showAgencyDetailsModal, setShowAgencyDetailsModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  
  // Agent CRUD state
  const [editingAgent, setEditingAgent] = useState(null);
  const [showAgentEditModal, setShowAgentEditModal] = useState(false);
  const [showAgentDeleteModal, setShowAgentDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [showAgentCreateModal, setShowAgentCreateModal] = useState(false);
  const [agentForm, setAgentForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    agencyId: ''
  });
  const [agenciesList, setAgenciesList] = useState([]);
  
  // Room CRUD state
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showRoomEditModal, setShowRoomEditModal] = useState(false);
  const [showRoomDeleteModal, setShowRoomDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [showRoomCreateModal, setShowRoomCreateModal] = useState(false);
  const [roomForm, setRoomForm] = useState({
    title: '',
    description: '',
    type: 'single',
    price: '',
    maxOccupancy: 2,
    location: '',
    amenities: [],
    images: [],
    isAvailable: true
  });

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

      // Fetch Data from previously exposed backend endpoints with error handling
      try {
        const [agenciesRes, bookingsRes, agentsRes, roomsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/users/agencies', config).catch(err => {
            console.error('Failed to fetch agencies:', err);
            return { data: [] };
          }),
          axios.get('http://localhost:5001/api/bookings/all', config).catch(err => {
            console.error('Failed to fetch bookings:', err);
            return { data: [] };
          }),
          axios.get('http://localhost:5001/api/users/agents-with-rooms', config).catch(err => {
            console.error('Failed to fetch agents:', err);
            return { data: [] };
          }),
          axios.get('http://localhost:5001/api/rooms/admin/all', config).catch(err => {
            console.error('Failed to fetch rooms:', err);
            return { data: [] };
          })
        ]);

        setAgencies(agenciesRes.data || []);
        setRecentBookings(bookingsRes.data || []);
        setAgents(agentsRes.data || []);
        setAgenciesList(agenciesRes.data || []); // For agent creation dropdown
        setRooms(roomsRes.data?.rooms || (Array.isArray(roomsRes.data) ? roomsRes.data : []));

        // Calculate stats from real data
        const totalRev = (bookingsRes.data || []).reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
        
        setStats({
          totalUsers: (agenciesRes.data || []).length * 5, // Estimated users per agency for display
          totalAgents: (agenciesRes.data || []).reduce((acc, curr) => acc + (curr.agentCount || 0), 0),
          totalBookings: (bookingsRes.data || []).length,
          totalRevenue: totalRev
        });

      } catch (apiError) {
        console.error('API Error:', apiError);
        // Set fallback data to ensure page renders
        setAgencies([]);
        setRecentBookings([]);
        setAgents([]);
        setAgenciesList([]);
        setRooms([]);
        setStats({
          totalUsers: 0,
          totalAgents: 0,
          totalBookings: 0,
          totalRevenue: 0
        });
      }

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      // Ensure page renders even on complete failure
      setAgencies([]);
      setRecentBookings([]);
      setAgents([]);
      setAgenciesList([]);
      setRooms([]);
      setStats({
        totalUsers: 0,
        totalAgents: 0,
        totalBookings: 0,
        totalRevenue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateAgency = async () => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      const response = await fetch(`${API}/users/${editingAgency._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(agencyForm)
      });

      if (response.ok) {
        const updatedAgency = await response.json();
        setAgencies(agencies.map(agency => agency._id === editingAgency._id ? updatedAgency : agency));
        setShowEditModal(false);
        setEditingAgency(null);
        setAgencyForm({
          fullName: '',
          email: '',
          phone: ''
        });
        fetchDashboardData(); // Refresh the agencies list
      } else {
        const error = await response.json();
        alert('Failed to update agency: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating agency:', error);
      alert('Failed to update agency. Please try again.');
    }
  };

  const handleDeleteAgency = async () => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      const response = await fetch(`${API}/users/${agencyToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAgencies(agencies.filter(agency => agency._id !== agencyToDelete._id));
        setShowDeleteModal(false);
        setAgencyToDelete(null);
        fetchDashboardData(); // Refresh the agencies list
      } else {
        const error = await response.json();
        alert('Failed to delete agency: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting agency:', error);
      alert('Failed to delete agency. Please try again.');
    }
  };

  const handleToggleAgencyStatus = async (agency) => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      const newIsActive = agency.isActive === undefined ? false : !agency.isActive;
      
      const response = await fetch(`${API}/users/${agency._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: newIsActive })
      });

      if (response.ok) {
        const updatedAgency = await response.json();
        setAgencies(agencies.map(a => a._id === agency._id ? updatedAgency : a));
        fetchDashboardData(); // Refresh the agencies list
      } else {
        alert('Failed to update agency status');
      }
    } catch (error) {
      console.error('Error toggling agency status:', error);
      alert('Failed to update agency status. Please try again.');
    }
  };

  const openEditModal = (agency) => {
    setEditingAgency(agency);
    setAgencyForm({
      fullName: agency.fullName,
      email: agency.email,
      phone: agency.phone
    });
    setShowEditModal(true);
  };

  const openAgencyDetailsModal = (agency) => {
    setSelectedAgency(agency);
    setShowAgencyDetailsModal(true);
  };

  // Agent CRUD handlers
  const handleCreateAgent = async () => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      // Validate required fields
      if (!agentForm.fullName || !agentForm.email || !agentForm.password || !agentForm.agencyId) {
        alert('Please fill in all required fields: Name, Email, Password, and Agency');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(agentForm.email)) {
        alert('Please enter a valid email address');
        return;
      }

      const response = await fetch(`${API}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...agentForm,
          role: 'agent'
        })
      });

      if (response.ok) {
        const newAgent = await response.json();
        setAgents([...agents, newAgent]);
        setShowAgentCreateModal(false);
        setAgentForm({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          specialization: '',
          agencyId: ''
        });
        fetchDashboardData(); // Refresh data
        alert('Agent created successfully');
      } else {
        const error = await response.json();
        alert('Failed to create agent: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create agent. Please try again.');
    }
  };

  const handleUpdateAgent = async () => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      if (!agentForm.fullName || !agentForm.email) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await fetch(`${API}/users/${editingAgent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(agentForm)
      });

      if (response.ok) {
        const updatedAgent = await response.json();
        setAgents(agents.map(agent => agent._id === editingAgent._id ? updatedAgent : agent));
        setShowAgentEditModal(false);
        setEditingAgent(null);
        setAgentForm({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          specialization: '',
          agencyId: ''
        });
        fetchDashboardData(); // Refresh data
        alert('Agent updated successfully');
      } else {
        const error = await response.json();
        alert('Failed to update agent: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      alert('Failed to update agent. Please try again.');
    }
  };

  const handleDeleteAgent = async () => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      const response = await fetch(`${API}/users/${agentToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAgents(agents.filter(agent => agent._id !== agentToDelete._id));
        setShowAgentDeleteModal(false);
        setAgentToDelete(null);
        fetchDashboardData(); // Refresh data
        alert('Agent deleted successfully');
      } else {
        const error = await response.json();
        alert('Failed to delete agent: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Failed to delete agent. Please try again.');
    }
  };

  const handleToggleAgentStatus = async (agent) => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      const newIsActive = agent.isActive === undefined ? false : !agent.isActive;
      
      const response = await fetch(`${API}/users/${agent._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: newIsActive })
      });

      if (response.ok) {
        const updatedAgent = await response.json();
        setAgents(agents.map(a => a._id === agent._id ? updatedAgent : a));
        fetchDashboardData(); // Refresh data
      } else {
        alert('Failed to update agent status');
      }
    } catch (error) {
      console.error('Error toggling agent status:', error);
      alert('Failed to update agent status. Please try again.');
    }
  };

  const openAgentEditModal = (agent) => {
    setEditingAgent(agent);
    setAgentForm({
      fullName: agent.fullName,
      email: agent.email,
      phone: agent.phone || '',
      password: '',
      specialization: agent.specialization || '',
      agencyId: agent.agencyId || ''
    });
    setShowAgentEditModal(true);
  };

  const openAgentDeleteModal = (agent) => {
    setAgentToDelete(agent);
    setShowAgentDeleteModal(true);
  };

  const refreshAgents = () => {
    fetchDashboardData();
  };

  // Room CRUD handlers
  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      // Validate required fields
      if (!roomForm.title || !roomForm.price || !roomForm.location) {
        alert('Please fill in all required fields: Title, Price, and Location');
        return;
      }

      // Price validation
      if (isNaN(roomForm.price) || parseFloat(roomForm.price) <= 0) {
        alert('Please enter a valid price greater than 0');
        return;
      }

      const response = await fetch(`${API}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...roomForm,
          pricePerMonth: parseFloat(roomForm.price),
          maxOccupancy: parseInt(roomForm.maxOccupancy)
        })
      });

      if (response.ok) {
        const newRoom = await response.json();
        setRooms([...rooms, newRoom]);
        setShowRoomCreateModal(false);
        setRoomForm({
          title: '',
          description: '',
          type: 'single',
          price: '',
          maxOccupancy: 2,
          location: '',
          amenities: [],
          images: [],
          isAvailable: true
        });
        fetchDashboardData(); // Refresh data
        alert('Room created successfully');
      } else {
        const error = await response.json();
        alert('Failed to create room: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  const handleUpdateRoom = async () => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      if (!roomForm.title || !roomForm.price || !roomForm.location) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await fetch(`${API}/rooms/${editingRoom._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...roomForm,
          pricePerMonth: parseFloat(roomForm.price),
          maxOccupancy: parseInt(roomForm.maxOccupancy)
        })
      });

      if (response.ok) {
        const updatedRoom = await response.json();
        setRooms(rooms.map(room => room._id === editingRoom._id ? updatedRoom : room));
        setShowRoomEditModal(false);
        setEditingRoom(null);
        setRoomForm({
          title: '',
          description: '',
          type: 'single',
          price: '',
          maxOccupancy: 2,
          location: '',
          amenities: [],
          images: [],
          isAvailable: true
        });
        fetchDashboardData(); // Refresh data
        alert('Room updated successfully');
      } else {
        const error = await response.json();
        alert('Failed to update room: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room. Please try again.');
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      const response = await fetch(`${API}/rooms/${roomToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setRooms(rooms.filter(room => room._id !== roomToDelete._id));
        setShowRoomDeleteModal(false);
        setRoomToDelete(null);
        fetchDashboardData(); // Refresh data
        alert('Room deleted successfully');
      } else {
        const error = await response.json();
        alert('Failed to delete room: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room. Please try again.');
    }
  };

  const handleToggleRoomAvailability = async (room) => {
    try {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      const newAvailability = !room.isAvailable;
      
      const response = await fetch(`${API}/rooms/${room._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...room,
          isAvailable: newAvailability
        })
      });

      if (response.ok) {
        const updatedRoom = await response.json();
        setRooms(rooms.map(r => r._id === room._id ? updatedRoom : r));
        fetchDashboardData(); // Refresh data
      } else {
        alert('Failed to update room availability');
      }
    } catch (error) {
      console.error('Error toggling room availability:', error);
      alert('Failed to update room availability. Please try again.');
    }
  };

  const openRoomEditModal = (room) => {
    setEditingRoom(room);
    setRoomForm({
      title: room.title,
      description: room.description || '',
      type: room.type || 'single',
      price: room.pricePerMonth ? room.pricePerMonth.toString() : '',
      maxOccupancy: room.maxOccupancy || 2,
      location: room.location || '',
      amenities: room.amenities || [],
      images: room.images || [],
      isAvailable: room.isAvailable !== false
    });
    setShowRoomEditModal(true);
  };

  const openRoomDeleteModal = (room) => {
    setRoomToDelete(room);
    setShowRoomDeleteModal(true);
  };

  const refreshRooms = () => {
    fetchDashboardData();
  };

  // Add error boundary fallback
  if (loading) {
    return (
      <div className="bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 min-h-screen flex">
        {/* Sidebar - Fixed width */}
        <div className="w-72 fixed h-full z-20">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 ml-72 min-h-screen flex flex-col">
          <AdminTopbar />
          <main className="p-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-medium text-on-surface dark:text-slate-100">Loading SuperAdmin Dashboard...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 min-h-screen flex">
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
                  <h1 className="text-3xl font-bold text-on-surface dark:text-slate-100">Main Dashboard</h1>
                  <p className="text-on-surface dark:text-slate-400 font-medium mt-1">Welcome back, SuperAdmin. Here is what's happening today.</p>
                </div>
                <div className="flex space-x-3">
                   <button className="bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-surface dark:bg-slate-800 transition-colors shadow-sm">
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
                  <AgenciesManagement 
                    agencies={agencies} 
                    loading={loading} 
                    onEdit={openEditModal}
                    onDelete={(agency) => {
                      setAgencyToDelete(agency);
                      setShowDeleteModal(true);
                    }}
                    onToggleStatus={handleToggleAgencyStatus}
                    onViewDetails={openAgencyDetailsModal}
                    onRefresh={fetchDashboardData}
                  />
                </div>

                {/* Recent Payments Area (1/3 width) */}
                <div className="xl:col-span-1">
                  <RecentPayments bookings={recentBookings} loading={loading} />
                </div>
              </div>
            </>
          )}

          {/* ─── PENDING ROOMS TAB ─── */}
          {!loading && activeTab === 'pending_rooms' && (
            <PendingRoomsManagement />
          )}

          {/* ─── PAYMENTS TAB ─── */}
          {activeTab === 'payments' && (
            <PaymentsManagement />
          )}

          {activeTab === 'reports' && (
            <Reports />
          )}

          {activeTab === 'agencies' && (
            <>
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-on-surface dark:text-slate-100">Agencies Management</h1>
                  <p className="text-on-surface dark:text-slate-400 font-medium mt-1">Manage all registered agencies</p>
                </div>
              </div>
              <AgenciesManagement 
                agencies={agencies} 
                loading={loading} 
                onEdit={openEditModal}
                onDelete={(agency) => {
                  setAgencyToDelete(agency);
                  setShowDeleteModal(true);
                }}
                onToggleStatus={handleToggleAgencyStatus}
              />
            </>
          )}

          {activeTab === 'agents' && (
            <AgentManagement
              agents={agents}
              loading={loading}
              onEdit={openAgentEditModal}
              onDelete={openAgentDeleteModal}
              onToggleStatus={handleToggleAgentStatus}
              onCreate={() => setShowAgentCreateModal(true)}
              onRefresh={refreshAgents}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomManagement
              rooms={rooms}
              loading={loading}
              onEdit={openRoomEditModal}
              onDelete={openRoomDeleteModal}
              onToggleAvailability={handleToggleRoomAvailability}
              onCreate={() => setShowRoomCreateModal(true)}
              onRefresh={refreshRooms}
            />
          )}

          {activeTab === 'users' && (
            <UserManagement />
          )}
        </main>
      </div>


      {/* Edit Agency Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-6">Edit Agency</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Full Name</label>
                <input
                  type="text"
                  value={agencyForm.fullName}
                  onChange={(e) => setAgencyForm({ ...agencyForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Email</label>
                <input
                  type="email"
                  value={agencyForm.email}
                  onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Phone</label>
                <input
                  type="text"
                  value={agencyForm.phone}
                  onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-6 py-3 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold hover:bg-surface dark:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAgency}
                className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors"
              >
                Update Agency
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Agency Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-2">Delete Agency</h2>
              <p className="text-on-surface dark:text-slate-400 mb-6">
                Are you sure you want to delete <strong>{agencyToDelete?.fullName}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold hover:bg-surface dark:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAgency}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Agent Modal */}
      {showAgentCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-6">Create New Agent</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={agentForm.fullName}
                  onChange={(e) => setAgentForm({ ...agentForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter agent's full name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Email *</label>
                <input
                  type="email"
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="agent@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Phone</label>
                <input
                  type="text"
                  value={agentForm.phone}
                  onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+977 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Password *</label>
                <input
                  type="password"
                  value={agentForm.password}
                  onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Specialization</label>
                <input
                  type="text"
                  value={agentForm.specialization}
                  onChange={(e) => setAgentForm({ ...agentForm, specialization: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Sales, Support"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Agency *</label>
                <select
                  value={agentForm.agencyId}
                  onChange={(e) => setAgentForm({ ...agentForm, agencyId: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an agency</option>
                  {agenciesList.map(agency => (
                    <option key={agency._id} value={agency._id}>
                      {agency.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAgentCreateModal(false)}
                className="flex-1 px-6 py-3 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold hover:bg-surface dark:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAgent}
                className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors"
              >
                Create Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {showAgentEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-6">Edit Agent</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={agentForm.fullName}
                  onChange={(e) => setAgentForm({ ...agentForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Email *</label>
                <input
                  type="email"
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Phone</label>
                <input
                  type="text"
                  value={agentForm.phone}
                  onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">New Password</label>
                <input
                  type="password"
                  value={agentForm.password}
                  onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Leave empty to keep current password"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Specialization</label>
                <input
                  type="text"
                  value={agentForm.specialization}
                  onChange={(e) => setAgentForm({ ...agentForm, specialization: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Agency</label>
                <select
                  value={agentForm.agencyId}
                  onChange={(e) => setAgentForm({ ...agentForm, agencyId: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an agency</option>
                  {agenciesList.map(agency => (
                    <option key={agency._id} value={agency._id}>
                      {agency.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAgentEditModal(false)}
                className="flex-1 px-6 py-3 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold hover:bg-surface dark:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAgent}
                className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors"
              >
                Update Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Agent Modal */}
      {showAgentDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-2">Delete Agent</h2>
              <p className="text-on-surface dark:text-slate-400 mb-6">
                Are you sure you want to delete <strong>{agentToDelete?.fullName}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAgentDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold hover:bg-surface dark:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAgent}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showRoomCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-6">Create New Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Room Title *</label>
                <input
                  type="text"
                  value={roomForm.title}
                  onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter room title"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Description</label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter room description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Room Type *</label>
                <select
                  value={roomForm.type}
                  onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="single">Single Room</option>
                  <option value="double">Double Room</option>
                  <option value="suite">Suite</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="family">Family Room</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Price per Night *</label>
                <input
                  type="number"
                  value={roomForm.price}
                  onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Max Occupancy *</label>
                <input
                  type="number"
                  value={roomForm.maxOccupancy}
                  onChange={(e) => setRoomForm({ ...roomForm, maxOccupancy: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="2"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Location *</label>
                <input
                  type="text"
                  value={roomForm.location}
                  onChange={(e) => setRoomForm({ ...roomForm, location: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter location"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Availability</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={roomForm.isAvailable}
                    onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-primary bg-surface dark:bg-slate-900 border-outline-variant/30 rounded focus:ring-primary"
                  />
                  <label htmlFor="isAvailable" className="ml-2 text-sm text-on-surface dark:text-slate-100">
                    Room is available for booking
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowRoomCreateModal(false)}
                className="flex-1 px-6 py-3 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold hover:bg-surface dark:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showRoomEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-6">Edit Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Room Title *</label>
                <input
                  type="text"
                  value={roomForm.title}
                  onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Description</label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Room Type *</label>
                <select
                  value={roomForm.type}
                  onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="single">Single Room</option>
                  <option value="double">Double Room</option>
                  <option value="suite">Suite</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="family">Family Room</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Price per Night *</label>
                <input
                  type="number"
                  value={roomForm.price}
                  onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Max Occupancy *</label>
                <input
                  type="number"
                  value={roomForm.maxOccupancy}
                  onChange={(e) => setRoomForm({ ...roomForm, maxOccupancy: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Location *</label>
                <input
                  type="text"
                  value={roomForm.location}
                  onChange={(e) => setRoomForm({ ...roomForm, location: e.target.value })}
                  className="w-full px-4 py-3 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface dark:text-slate-100 mb-2">Availability</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={roomForm.isAvailable}
                    onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-primary bg-surface dark:bg-slate-900 border-outline-variant/30 rounded focus:ring-primary"
                  />
                  <label htmlFor="isAvailable" className="ml-2 text-sm text-on-surface dark:text-slate-100">
                    Room is available for booking
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowRoomEditModal(false)}
                className="flex-1 px-6 py-3 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold hover:bg-surface dark:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRoom}
                className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors"
              >
                Update Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Room Modal */}
      {showRoomDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-2">Delete Room</h2>
              <p className="text-on-surface dark:text-slate-400 mb-6">
                Are you sure you want to delete <strong>{roomToDelete?.title}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRoomDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold hover:bg-surface dark:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRoom}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agency Details Modal */}
      {showAgencyDetailsModal && selectedAgency && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-2">Agency Details</h2>
                <p className="text-on-surface dark:text-slate-400">Comprehensive information about {selectedAgency.fullName}</p>
              </div>
              <button
                onClick={() => setShowAgencyDetailsModal(false)}
                className="p-2 text-on-surface dark:text-slate-400 hover:text-on-surface dark:text-slate-100 transition-colors rounded-lg"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agency Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-surface dark:bg-slate-900 rounded-xl p-6 border border-outline-variant/20">
                  <h3 className="text-lg font-bold text-on-surface dark:text-slate-100 mb-4">Agency Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-on-surface dark:text-slate-400 mb-1">Full Name</p>
                      <p className="font-medium text-on-surface dark:text-slate-100">{selectedAgency.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-on-surface dark:text-slate-400 mb-1">Email Address</p>
                      <p className="font-medium text-on-surface dark:text-slate-100">{selectedAgency.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-on-surface dark:text-slate-400 mb-1">Phone Number</p>
                      <p className="font-medium text-on-surface dark:text-slate-100">{selectedAgency.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-on-surface dark:text-slate-400 mb-1">Agency ID</p>
                      <p className="font-medium text-on-surface dark:text-slate-100 font-mono">{selectedAgency._id}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface dark:bg-slate-900 rounded-xl p-6 border border-outline-variant/20">
                  <h3 className="text-lg font-bold text-on-surface dark:text-slate-100 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <span className="material-symbols-outlined text-primary text-2xl">badge</span>
                      </div>
                      <p className="text-2xl font-bold text-on-surface dark:text-slate-100">{selectedAgency.agentCount || 0}</p>
                      <p className="text-sm text-on-surface dark:text-slate-400">Total Agents</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <span className="material-symbols-outlined text-primary text-2xl">bed</span>
                      </div>
                      <p className="text-2xl font-bold text-on-surface dark:text-slate-100">{selectedAgency.roomCount || 0}</p>
                      <p className="text-sm text-on-surface dark:text-slate-400">Total Rooms</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <span className="material-symbols-outlined text-green-600 text-2xl">trending_up</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.min((selectedAgency.agentCount || 0) * 10 + (selectedAgency.roomCount || 0) * 5, 100)}%
                      </p>
                      <p className="text-sm text-on-surface dark:text-slate-400">Performance Score</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <span className="material-symbols-outlined text-blue-600 text-2xl">calendar_today</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">Active</p>
                      <p className="text-sm text-on-surface dark:text-slate-400">Account Status</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface dark:bg-slate-900 rounded-xl p-6 border border-outline-variant/20">
                  <h3 className="text-lg font-bold text-on-surface dark:text-slate-100 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-surface dark:bg-slate-800 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-on-surface dark:text-slate-100">Agency account created</p>
                        <p className="text-xs text-on-surface dark:text-slate-400">System initialization</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-surface dark:bg-slate-800 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600 text-sm">verified</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-on-surface dark:text-slate-100">Verification status: {selectedAgency.status || 'pending'}</p>
                        <p className="text-xs text-on-surface dark:text-slate-400">Current verification status</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-surface dark:bg-slate-900 rounded-xl p-6 border border-outline-variant/20">
                  <h3 className="text-lg font-bold text-on-surface dark:text-slate-100 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setShowAgencyDetailsModal(false);
                        openEditModal(selectedAgency);
                      }}
                      className="w-full px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg align-middle mr-1">edit</span>
                      Edit Agency
                    </button>
                    <button
                      onClick={() => {
                        setShowAgencyDetailsModal(false);
                        handleToggleAgencyStatus(selectedAgency);
                      }}
                      className="w-full px-4 py-2 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold text-sm hover:bg-surface dark:bg-slate-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg align-middle mr-1">toggle_on</span>
                      Toggle Status
                    </button>
                    <button
                      onClick={() => {
                        setShowAgencyDetailsModal(false);
                        setAgencyToDelete(selectedAgency);
                        setShowDeleteModal(true);
                      }}
                      className="w-full px-4 py-2 bg-error-container text-on-error-container rounded-xl font-bold text-sm hover:bg-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg align-middle mr-1">delete</span>
                      Delete Agency
                    </button>
                  </div>
                </div>

                <div className="bg-surface dark:bg-slate-900 rounded-xl p-6 border border-outline-variant/20">
                  <h3 className="text-lg font-bold text-on-surface dark:text-slate-100 mb-4">Status Overview</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface dark:text-slate-400">Account Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedAgency.isActive !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedAgency.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface dark:text-slate-400">Verification</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedAgency.status === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedAgency.status || 'pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface dark:text-slate-400">Performance</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        Math.min((selectedAgency.agentCount || 0) * 10 + (selectedAgency.roomCount || 0) * 5, 100) >= 80
                          ? 'bg-green-100 text-green-800' 
                          : Math.min((selectedAgency.agentCount || 0) * 10 + (selectedAgency.roomCount || 0) * 5, 100) >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {Math.min((selectedAgency.agentCount || 0) * 10 + (selectedAgency.roomCount || 0) * 5, 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-surface-container">
              <button
                onClick={() => setShowAgencyDetailsModal(false)}
                className="flex-1 px-6 py-3 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold hover:bg-surface dark:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
