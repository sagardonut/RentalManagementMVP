import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5001/api';

// Mini sparkline bar chart inside stat cards
function SparkBar({ heights = [], peak = 4 }) {
  return (
    <div className="flex-1 h-8 flex items-end gap-[2px]">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-full rounded-sm transition-colors ${
            i === peak ? 'bg-primary' : 'bg-primary/10 group-hover:bg-primary/20'
          }`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// Stat card component
function StatCard({ label, value, icon, trend, sparkHeights, peakIdx, loading }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(25,27,35,0.04)] flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">{label}</p>
          {loading ? (
            <div className="h-10 w-16 bg-slate-100 animate-pulse rounded-lg" />
          ) : (
            <h3 className="text-4xl font-black text-primary">{value}</h3>
          )}
        </div>
        <span className="material-symbols-outlined text-primary-container p-2 bg-primary-fixed rounded-lg text-2xl">
          {icon}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <SparkBar heights={sparkHeights} peak={peakIdx} />
        <span className="text-xs font-bold text-tertiary">{trend}</span>
      </div>
    </div>
  );
}

export default function AgencyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalAgents: 0, totalRooms: 0, activeListings: 0 });
  const [agents, setAgents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomSearch, setRoomSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [agentForm, setAgentForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    specialization: ''
  });
  const [editingAgent, setEditingAgent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Set default data immediately to prevent blank page
      setStats({ totalAgents: 0, totalRooms: 0, activeListings: 0 });
      setAgents([]);
      setRooms([]);
      
      const token = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')).token 
        : null;

      if (token) {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // Simple fetch without complex dependencies
        try {
          const [statsRes, agentsRes] = await Promise.all([
            fetch(`${API}/users/stats`, config),
            fetch(`${API}/users/agents-with-rooms`, config)
          ]);
          
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData || { totalAgents: 0, totalRooms: 0, activeListings: 0 });
          }
          
          if (agentsRes.ok) {
            const agentsData = await agentsRes.json();
            setAgents(agentsData || []);
          }
        } catch (err) {
          console.log('API calls failed, using defaults');
        }
      }
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddAgent = async () => {
    try {
      const token = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')).token 
        : null;

      const response = await fetch(`${API}/auth/register`, {
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
        setShowAgentModal(false);
        setAgentForm({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          specialization: ''
        });
        fetchAll(); // Refresh the agents list
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
        setShowEditModal(false);
        setEditingAgent(null);
        setAgentForm({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          specialization: ''
        });
        fetchAll(); // Refresh the agents list
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
        setShowDeleteModal(false);
        setAgentToDelete(null);
        fetchAll(); // Refresh the agents list
      } else {
        const error = await response.json();
        alert('Failed to delete agent: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Failed to delete agent. Please try again.');
    }
  };

  const openEditModal = (agent) => {
    setEditingAgent(agent);
    setAgentForm({
      fullName: agent.fullName,
      email: agent.email,
      phone: agent.phone,
      password: '',
      specialization: agent.specialization || ''
    });
    setShowEditModal(true);
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
        fetchAll(); // Refresh the agents list
      } else {
        alert('Failed to update agent status');
      }
    } catch (error) {
      console.error('Error toggling agent status:', error);
      alert('Failed to update agent status. Please try again.');
    }
  };

  const filteredRooms = rooms.filter(r =>
    r.title.toLowerCase().includes(roomSearch.toLowerCase()) ||
    r.location.toLowerCase().includes(roomSearch.toLowerCase())
  );

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'agents', icon: 'group', label: 'Agents Management' },
    { id: 'rooms', icon: 'home_work', label: 'Rooms Overview' },
    { id: 'profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <div className="bg-surface text-on-surface flex min-h-screen">

      {/* ── Sidebar ── */}
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-surface-container py-6 gap-2 z-40 hidden md:flex shadow-sm">
        <div className="px-6 mb-8">
          <h1 className="text-lg font-bold text-primary tracking-tight">Admin Console</h1>
          <p className="text-[0.75rem] text-on-surface-variant/70 uppercase tracking-widest font-semibold">Agency Access</p>
        </div>

        <nav className="flex flex-col gap-1 px-2 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full px-4 py-3 flex items-center gap-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm translate-x-1'
                  : 'text-on-surface-variant hover:bg-surface-container-lowest/50'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-[0.875rem]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-2 flex flex-col gap-1 border-t border-slate-200 pt-4 mt-2">
          <a className="px-4 py-3 flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-lowest/50 rounded-xl transition-all" href="#">
            <span className="material-symbols-outlined text-xl">help</span>
            <span className="text-[0.875rem]">Help Center</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-lowest/50 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-[0.875rem]">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 pb-24 md:pb-10">

        {/* Top Bar */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-primary">The Urban Sanctuary</h2>
            <p className="text-on-surface-variant text-sm font-medium">Agency Overview &amp; Performance</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-on-surface-variant">{user?.fullName || 'Agency Admin'}</span>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-on-primary">
                  {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AA'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-on-surface-variant">Loading dashboard...</p>
            </div>
          </div>
        )}

        {/* ─── DASHBOARD TAB ─── */}
        {!loading && activeTab === 'dashboard' && (
          <>
            {/* Stat Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <StatCard
                label="Total Agents"
                value={stats.totalAgents}
                icon="badge"
                trend="+8%"
                sparkHeights={[50, 67, 33, 75, 100]}
                peakIdx={4}
                loading={loading}
              />
              <StatCard
                label="Total Rooms Listed"
                value={stats.totalRooms}
                icon="location_city"
                trend="+12%"
                sparkHeights={[25, 40, 75, 67, 80]}
                peakIdx={2}
                loading={loading}
              />
              <StatCard
                label="Active Listings"
                value={stats.activeListings}
                icon="check_circle"
                trend="+5%"
                sparkHeights={[75, 100, 67, 80, 50]}
                peakIdx={1}
                loading={loading}
              />
            </section>

            {/* Quick preview: Agents table (first 3) */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-on-surface">Recent Agents</h3>
                <button onClick={() => setActiveTab('agents')} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                  View All <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
              <AgentTable agents={agents.slice(0, 3)} loading={loading} getInitials={getInitials} />
            </section>

            {/* Quick preview: Rooms (first 4) */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-on-surface">Recent Rooms</h3>
                <button onClick={() => setActiveTab('rooms')} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                  View All <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
              <RoomGrid rooms={rooms.slice(0, 4)} loading={loading} getInitials={getInitials} />
            </section>
          </>
        )}

        {/* ─── AGENTS TAB ─── */}
        {!loading && activeTab === 'agents' && (
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Agents Management</h3>
                <p className="text-sm text-on-surface-variant">View and manage your agency's agents</p>
              </div>
            </div>
            <AgentTable 
              agents={agents} 
              loading={loading} 
              getInitials={getInitials}
              onEdit={openEditModal}
              onDelete={(agent) => {
                setAgentToDelete(agent);
                setShowDeleteModal(true);
              }}
              onToggleStatus={handleToggleAgentStatus}
            />
          </section>
        )}

        {/* ─── ROOMS TAB ─── */}
        {!loading && activeTab === 'rooms' && (
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Rooms Overview</h3>
                <p className="text-sm text-on-surface-variant">Live catalog of managed properties</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
                  <input
                    className="bg-surface-container-lowest border-none pl-10 pr-4 py-2 rounded-full text-sm w-64 shadow-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="Search properties..."
                    type="text"
                    value={roomSearch}
                    onChange={e => setRoomSearch(e.target.value)}
                  />
                </div>
                <button className="p-2 bg-surface-container-lowest rounded-full shadow-sm text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>
            <RoomGrid rooms={filteredRooms} loading={loading} getInitials={getInitials} />
          </section>
        )}

        {/* ─── PROFILE TAB ─── */}
        {activeTab === 'profile' && (
          <section className="max-w-lg">
            <h3 className="text-xl font-bold text-on-surface mb-8">Your Profile</h3>
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-2xl font-black">
                  {user ? getInitials(user.fullName) : 'AG'}
                </div>
                <div>
                  <p className="font-bold text-on-surface text-lg">{user?.fullName || 'Agency User'}</p>
                  <p className="text-sm text-on-surface-variant">{user?.email || ''}</p>
                  <span className="inline-block mt-1 px-3 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">{user?.role || 'agency'}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2 text-sm text-on-surface-variant">
                <p><span className="font-semibold text-on-surface">Email:</span> {user?.email}</p>
                <p><span className="font-semibold text-on-surface">Role:</span> {user?.role}</p>
                <p><span className="font-semibold text-on-surface">Access:</span> {user?.hasPaidFee ? 'Full Access (Paid)' : 'Pending'}</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest backdrop-blur-lg flex justify-around py-4 z-50 border-t border-slate-100">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === item.id ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[0.65rem] font-bold uppercase">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ─── Shared Agent Table ─── */
function AgentTable({ agents, loading, getInitials, onEdit, onDelete, onToggleStatus }) {
  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 text-center">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading agents...</p>
      </div>
    );
  }
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low/50">
            {['Agent Name', 'Contact', 'Rooms', 'Status', 'Actions'].map((h, i) => (
              <th key={h} className={`px-6 py-4 text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70 ${i === 4 ? 'text-right' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {agents.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">No agents found in the database.</td>
            </tr>
          ) : agents.map(agent => (
            <tr key={agent._id} className="hover:bg-surface-container-low/30 transition-colors group">
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.fullName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-primary font-bold text-xs">
                      {getInitials(agent.fullName)}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-on-surface">{agent.fullName}</span>
                    {agent.specialization && <p className="text-xs text-on-surface-variant">{agent.specialization}</p>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-sm text-on-surface-variant">{agent.email}</td>
              <td className="px-6 py-5 text-sm font-bold text-primary">{agent.roomCount ?? 0}</td>
              <td className="px-6 py-5">
                <button
                  onClick={() => onToggleStatus(agent)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    (agent.isActive !== false)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      (agent.isActive !== false)
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-2 text-xs font-medium text-gray-600">
                  {(agent.isActive !== false) ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <div className="flex justify-end gap-1">
                  <button 
                    onClick={() => onEdit(agent)}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button 
                    onClick={() => onDelete(agent)}
                    className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                  <button className="p-2 text-primary font-bold text-xs hover:underline">View Details</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Shared Room Grid ─── */
function RoomGrid({ rooms, loading, getInitials }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest p-4 rounded-xl flex gap-4 animate-pulse">
            <div className="w-32 h-24 rounded-lg bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-1/3 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (rooms.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">search_off</span>
        <p className="text-slate-400 font-semibold">No rooms found.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {rooms.map((room, i) => {
        const agentName = room.agentId?.fullName || 'Unknown Agent';
        const isVerified = room.isVerified;
        return (
          <div key={room._id} className="bg-surface-container-lowest p-4 rounded-xl flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
              {room.images?.[0] && (
                <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-on-surface text-base">{room.title}</h4>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {room.location}
                  </p>
                </div>
                <span className="text-primary font-black text-lg">
                  NPR {(room.pricePerMonth / 1000).toFixed(0)}k
                  <span className="text-[0.6rem] font-normal text-on-surface-variant">/mo</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary-fixed flex items-center justify-center text-[0.5rem] font-bold text-primary">
                    {getInitials(agentName)}
                  </div>
                  <span className="text-[0.7rem] text-on-surface-variant font-medium">{agentName}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase ${
                  isVerified
                    ? 'bg-primary/10 text-primary'
                    : 'bg-tertiary/10 text-tertiary'
                }`}>
                  {isVerified ? 'Verified' : 'Available'}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Agent Creation Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Add New Agent</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Full Name</label>
                <input
                  type="text"
                  value={agentForm.fullName}
                  onChange={(e) => setAgentForm({...agentForm, fullName: e.target.value})}
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
                <input
                  type="email"
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="agent@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Phone</label>
                <input
                  type="tel"
                  value={agentForm.phone}
                  onChange={(e) => setAgentForm({...agentForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="+977 9800000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Password</label>
                <input
                  type="password"
                  value={agentForm.password}
                  onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Specialization</label>
                <input
                  type="text"
                  value={agentForm.specialization}
                  onChange={(e) => setAgentForm({...agentForm, specialization: e.target.value})}
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Residential Specialist"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAgentModal(false)}
                className="flex-1 px-4 py-2 border border-outline-variant text-on-surface rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAgent}
                className="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors"
              >
                Add Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Edit Agent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={agentForm.fullName}
                  onChange={(e) => setAgentForm({...agentForm, fullName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={agentForm.phone}
                  onChange={(e) => setAgentForm({...agentForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={agentForm.password}
                  onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={agentForm.specialization}
                  onChange={(e) => setAgentForm({...agentForm, specialization: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAgent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Agent Confirmation Modal */}
      {showDeleteModal && agentToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-2">Delete Agent</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete agent <strong>{agentToDelete.fullName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAgent}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
