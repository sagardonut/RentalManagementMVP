import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AgentCard from '../components/common/AgentCard';
import RoomCard from '../components/common/RoomCard';
import UserProfileDropdown from '../components/common/UserProfileDropdown';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('bookings'); // agents, rooms, bookings
  const [agents, setAgents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    maxPrice: 'Price Range',
    location: 'Location',
    roomType: 'Room Type'
  });
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  useEffect(() => {
    // Read tab from URL parameter on mount
    const tabParam = searchParams.get('tab');
    if (tabParam && ['agents', 'rooms', 'bookings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [activeTab, filters, selectedAgentId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'agents') {
        const response = await fetch('http://localhost:5001/api/users/agents-with-rooms');
        const data = await response.json();
        setAgents(data);
      } else if (activeTab === 'rooms') {
        let url = `http://localhost:5001/api/rooms?`;
        if (selectedAgentId) url += `agentId=${selectedAgentId}&`;
        if (filters.location !== 'Location') url += `location=${filters.location}&`;
        if (filters.roomType !== 'Room Type') url += `type=${filters.roomType}&`;
        if (filters.maxPrice !== 'Price Range') url += `maxPrice=${filters.maxPrice}&`;

        const response = await fetch(url + 'limit=100');
        const data = await response.json();
        setRooms(data.rooms || data);
      } else if (activeTab === 'bookings') {
        const token = localStorage.getItem('user') 
          ? JSON.parse(localStorage.getItem('user')).token 
          : null;
        
        const response = await fetch('http://localhost:5001/api/bookings/my-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set default data to prevent blank page
      if (activeTab === 'agents') setAgents([]);
      if (activeTab === 'rooms') setRooms([]);
      if (activeTab === 'bookings') setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewListings = (agentId) => {
    setSelectedAgentId(agentId);
    setActiveTab('rooms');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ maxPrice: 'Price Range', location: 'Location', roomType: 'Room Type' });
    setSelectedAgentId(null);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-40 flex flex-col border-r border-slate-200 dark:border-slate-800 p-4 gap-2 bg-slate-50 dark:bg-slate-950">
        <div className="mb-8 px-4">
          <h1 className="text-lg font-black text-blue-800 dark:text-blue-300 tracking-tighter">The Urban Sanctuary</h1>
          <p className="text-xs text-slate-500 font-medium">Property Management</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all hover:translate-x-1 duration-200 ${activeTab === 'bookings' ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined">bookmark</span>
            <span className="text-sm font-medium">My Bookings</span>
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all hover:translate-x-1 duration-200 ${activeTab === 'agents' ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined">groups</span>
            <span className="text-sm font-medium">Agents</span>
          </button>
          <button
            onClick={() => { setActiveTab('rooms'); setSelectedAgentId(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all hover:translate-x-1 duration-200 ${activeTab === 'rooms' ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined">bed</span>
            <span className="text-sm font-medium">Rooms</span>
          </button>
        </nav>
        <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all hover:translate-x-1 duration-200" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all hover:translate-x-1 duration-200 w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 overflow-y-auto min-h-screen">
        <header className="w-full sticky top-0 z-50 flex justify-between items-center px-10 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm">
          <h2 className="text-2xl font-black tracking-tighter text-blue-900 dark:text-blue-100">
            {activeTab === 'bookings' ? 'My Bookings' : activeTab === 'agents' ? 'Elite Himalayan Living - Agents' : 'Premium Property Listings'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <UserProfileDropdown />
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto space-y-16">
          {activeTab === 'bookings' && (
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-[0.65rem] font-bold tracking-[0.15em] text-primary uppercase">Your Reservations</span>
                  <h3 className="text-3xl font-bold tracking-tight text-on-surface">Booked Properties</h3>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-surface-container-low rounded-3xl border-2 border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">bookmark_border</span>
                  <h3 className="text-xl font-bold text-slate-400 mb-2">No bookings yet</h3>
                  <p className="text-slate-400 text-sm mb-6">Start exploring properties and book your first room!</p>
                  <button
                    onClick={() => setActiveTab('rooms')}
                    className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:bg-primary-container transition-all"
                  >
                    Browse Rooms
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map(booking => (
                    <div key={booking._id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20">
                      <div className="aspect-[4/3] relative">
                        <img
                          src={booking.roomId?.images?.[0] || 'https://via.placeholder.com/400'}
                          alt={booking.roomId?.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                          Confirmed
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-lg mb-2">{booking.roomId?.title || 'Room'}</h4>
                        <p className="text-sm text-on-surface-variant mb-3 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {booking.roomId?.location || 'Location'}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-primary">NPR {booking.roomId?.pricePerMonth?.toLocaleString() || 'N/A'}/mo</span>
                          <span className="text-on-surface-variant">{booking.numRooms || 1} room(s)</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-outline-variant/20">
                          <p className="text-xs text-on-surface-variant">
                            Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'agents' && (
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-[0.65rem] font-bold tracking-[0.15em] text-primary uppercase">Elite Partners</span>
                  <h3 className="text-3xl font-bold tracking-tight text-on-surface">Curated Real Estate Professionals</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => (
                  <AgentCard key={agent._id} agent={agent} onViewListings={handleViewListings} />
                ))}
                {/* Featured Growth Card */}
                <div className="bg-primary text-on-primary rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">Network Growth</span>
                  <h4 className="text-4xl font-black mb-1 relative z-10">24+</h4>
                  <p className="text-primary-fixed leading-relaxed text-sm font-medium relative z-10">New properties added this week across the Kathmandu Valley.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'rooms' && (
            <section className="bg-surface-container-low rounded-3xl p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div className="max-w-md">
                  <h3 className="text-3xl font-black tracking-tight text-on-surface mb-2">Rooms Explorer</h3>
                  <p className="text-on-surface-variant text-sm font-medium">
                    {selectedAgentId ? 'Showing exclusive listings from agent' : 'Browse exclusive listings across Kathmandu'}
                  </p>
                </div>
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-lg">payments</span>
                    <select
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 pr-8"
                    >
                      <option>Price Range</option>
                      <option>NPR 25,000</option>
                      <option>NPR 40,000</option>
                      <option>NPR 90,000</option>
                    </select>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 pr-8"
                    >
                      <option>Location</option>
                      <option>Baneshwor</option>
                      <option>Naxal</option>
                      <option>Lazimpat</option>
                    </select>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-lg">home_work</span>
                    <select
                      value={filters.roomType}
                      onChange={(e) => handleFilterChange('roomType', e.target.value)}
                      className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 pr-8"
                    >
                      <option>Room Type</option>
                      <option>Studio</option>
                      <option>1 BHK</option>
                      <option>Penthouse</option>
                    </select>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center active:scale-95 shadow-lg shadow-primary/20"
                  >
                    <span className="material-symbols-outlined">filter_alt_off</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {rooms.map(room => (
                  <RoomCard
                    key={room._id}
                    id={room._id}
                    title={room.title}
                    price={`NPR ${room.pricePerMonth.toLocaleString()}`}
                    location={room.location}
                    verified={room.isVerified}
                    amenities={room.amenities}
                    image={room.images[0]}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
