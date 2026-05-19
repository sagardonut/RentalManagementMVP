import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfileDropdown from '../components/common/UserProfileDropdown';
import ThemeToggle from '../components/common/ThemeToggle';

const API = 'http://localhost:5001/api';

const AMENITY_OPTIONS = ['WiFi', 'Parking', 'AC', 'Water Supply', 'Security', 'Kitchen', 'Furnished', 'Balcony'];

const emptyForm = {
  title: '', description: '', pricePerMonth: '', location: '',
  type: '1 BHK', amenities: [], images: [],
};

export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (user) fetchMyRooms();
  }, [user]);

  const fetchMyRooms = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/rooms/agent/my-rooms?limit=100&page=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored).token : null;
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // ── Form helpers ──
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (a) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setForm(prev => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
    setImageUrl('');
  };

  const removeImage = (idx) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const openAddForm = () => {
    setFormMode('add');
    setEditingRoom(null);
    setForm(emptyForm);
    setFormError('');
    setFormSuccess('');
    setActiveTab('add');
  };

  const openEditForm = (room) => {
    setFormMode('edit');
    setEditingRoom(room);
    setForm({
      title: room.title,
      description: room.description,
      pricePerMonth: room.pricePerMonth,
      location: room.location,
      type: room.type || '1 BHK',
      amenities: room.amenities || [],
      images: room.images || [],
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('add');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!form.title || !form.description || !form.pricePerMonth || !form.location) {
      return setFormError('Please fill all required fields.');
    }
    setFormLoading(true);
    try {
      const token = getToken();
      const url = formMode === 'edit' ? `${API}/rooms/${editingRoom._id}` : `${API}/rooms`;
      const method = formMode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, pricePerMonth: Number(form.pricePerMonth) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setFormSuccess(formMode === 'edit' ? 'Room updated successfully!' : 'Room published successfully!');
      await fetchMyRooms();
      setTimeout(() => { setActiveTab('rooms'); setFormSuccess(''); }, 1500);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    try {
      const token = getToken();
      const res = await fetch(`${API}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setDeleteConfirm(null);
      await fetchMyRooms();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalRooms = rooms.length;
  const activeRooms = rooms.filter(r => r.status === 'approved').length;
  const pendingRooms = rooms.filter(r => r.status === 'pending').length;

  const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'rooms', icon: 'home_work', label: 'My Rooms' },
    { id: 'add', icon: 'add_box', label: 'Add Room' },
    { id: 'profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <div className="bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-black text-on-surface dark:text-slate-100 mb-2">Delete Listing?</h3>
            <p className="text-on-surface dark:text-slate-400 text-sm mb-8">This will permanently remove this property from your listings and the database.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3 rounded-xl border border-outline-variant text-on-surface dark:text-slate-100 font-bold text-sm hover:bg-surface dark:bg-slate-800 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-3 rounded-xl bg-error text-on-error font-bold text-sm hover:opacity-90 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-surface dark:bg-slate-800 py-6 z-40 hidden md:flex shadow-sm border-r border-outline-variant/20 dark:border-slate-700">
        <div className="px-6 mb-8">
          <h1 className="text-lg font-bold text-primary dark:text-blue-400 tracking-tight">Agent Console</h1>
          <p className="text-[0.7rem] text-on-surface dark:text-slate-400 uppercase tracking-widest font-semibold opacity-70">The Urban Sanctuary</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { if (item.id === 'add') { openAddForm(); } else setActiveTab(item.id); }}
              className={`w-full px-4 py-3 flex items-center gap-3 rounded-xl text-left transition-all duration-200 ${activeTab === item.id
                  ? 'bg-surface dark:bg-slate-900 text-primary font-semibold shadow-sm translate-x-1'
                  : 'text-on-surface dark:text-slate-400 hover:bg-surface dark:bg-slate-900/50'
                }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-[0.875rem] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-outline-variant/20 pt-4 px-2 flex flex-col gap-1">
          <Link to="/help" className="px-4 py-3 flex items-center gap-3 text-on-surface dark:text-slate-400 hover:bg-surface dark:bg-slate-900/50 rounded-xl transition-all">
            <span className="material-symbols-outlined text-xl">help</span>
            <span className="text-[0.875rem]">Help Center</span>
          </Link>
          <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center gap-3 text-on-surface dark:text-slate-400 hover:bg-surface dark:bg-slate-900/50 rounded-xl transition-all">
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-[0.875rem]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-64 p-8 lg:p-12 pb-24 md:pb-12 min-h-screen">

        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-primary dark:text-blue-400 mb-2">Agent Dashboard</h2>
            <p className="text-on-surface dark:text-slate-400 font-medium">
              Welcome back, <span className="font-bold text-on-surface dark:text-slate-100">{user?.fullName?.split(' ')[0] || 'Agent'}</span>. Managing the Sanctuary listings.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={openAddForm}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-[0_8px_24px_rgba(0,64,161,0.15)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              New Listing
            </button>
            <UserProfileDropdown />
          </div>
        </header>

        {/* ─── DASHBOARD TAB ─── */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stat Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-surface dark:bg-slate-800 p-8 rounded-xl shadow-[0_8px_24px_rgba(25,27,35,0.04)] flex flex-col justify-between">
                <span className="material-symbols-outlined text-primary mb-4 text-3xl">domain</span>
                <div>
                  <h3 className="text-on-surface dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Rooms Listed</h3>
                  <p className="text-4xl font-black tracking-tighter text-on-surface dark:text-slate-100">
                    {loading ? '—' : String(totalRooms).padStart(2, '0')}
                  </p>
                </div>
              </div>
              <div className="bg-primary p-8 rounded-xl shadow-[0_8px_24px_rgba(0,64,161,0.15)] flex flex-col justify-between">
                <span className="material-symbols-outlined text-on-primary/60 mb-4 text-3xl">verified</span>
                <div>
                  <h3 className="text-on-primary/70 text-xs font-bold uppercase tracking-widest mb-1">Active Listings</h3>
                  <p className="text-4xl font-black tracking-tighter text-on-primary">
                    {loading ? '—' : String(activeRooms).padStart(2, '0')}
                  </p>
                </div>
              </div>
              <div className="bg-surface dark:bg-slate-800 p-8 rounded-xl shadow-[0_8px_24px_rgba(25,27,35,0.04)] flex flex-col justify-between">
                <span className="material-symbols-outlined text-tertiary mb-4 text-3xl">trending_up</span>
                <div>
                  <h3 className="text-on-surface dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Pending Reviews</h3>
                  <p className="text-4xl font-black tracking-tighter text-on-surface dark:text-slate-100">
                    {loading ? '—' : String(pendingRooms).padStart(2, '0')}
                  </p>
                </div>
              </div>
            </section>

            {/* Recent listings preview */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tight text-on-surface dark:text-slate-100">Recent Listings (Top 5)</h3>
                <button onClick={() => setActiveTab('rooms')} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                  View All <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
              <RoomTable rooms={rooms.slice(0, 5)} loading={loading} onEdit={openEditForm} onDelete={setDeleteConfirm} />
            </section>
          </>
        )}

        {/* ─── MY ROOMS TAB ─── */}
        {activeTab === 'rooms' && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-on-surface dark:text-slate-100">My Listings</h3>
                <p className="text-sm text-on-surface dark:text-slate-400">{totalRooms} total properties in database</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-sm font-bold text-primary flex items-center gap-1 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">filter_list</span> Filter
                </span>
                <span className="text-sm font-bold text-on-surface dark:text-slate-400 flex items-center gap-1 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">sort</span> Sort
                </span>
              </div>
            </div>
            <RoomTable rooms={rooms} loading={loading} onEdit={openEditForm} onDelete={setDeleteConfirm} />
          </section>
        )}

        {/* ─── ADD / EDIT ROOM TAB ─── */}
        {activeTab === 'add' && (
          <section className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-lg">
                {formMode === 'edit' ? '✎' : '1'}
              </span>
              <h3 className="text-3xl font-black tracking-tighter">
                {formMode === 'edit' ? 'Edit Property Details' : 'Property Details'}
              </h3>
            </div>

            {formError && <div className="bg-error-container text-on-error-container p-4 rounded-xl font-bold text-sm mb-6">{formError}</div>}
            {formSuccess && <div className="bg-secondary-container text-on-secondary-container p-4 rounded-xl font-bold text-sm mb-6">{formSuccess}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface dark:bg-slate-800 p-8 rounded-xl shadow-[0_8px_32px_rgba(25,27,35,0.03)]">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400">Listing Title *</label>
                  <input name="title" value={form.title} onChange={handleFormChange} required
                    className="w-full bg-surface dark:bg-slate-900 border-0 focus:ring-2 focus:ring-primary rounded-lg p-3 text-on-surface dark:text-slate-100 font-medium placeholder:text-outline/50"
                    placeholder="e.g. Modern Minimalist Loft in Thamel" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400">Location *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">location_on</span>
                    <input name="location" value={form.location} onChange={handleFormChange} required
                      className="w-full bg-surface dark:bg-slate-900 border-0 focus:ring-2 focus:ring-primary rounded-lg p-3 pl-10 text-on-surface dark:text-slate-100 font-medium placeholder:text-outline/50"
                      placeholder="Neighborhood, City" type="text" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400">Monthly Rent (Rs.) *</label>
                  <input name="pricePerMonth" value={form.pricePerMonth} onChange={handleFormChange} required
                    className="w-full bg-surface dark:bg-slate-900 border-0 focus:ring-2 focus:ring-primary rounded-lg p-3 text-on-surface dark:text-slate-100 font-medium placeholder:text-outline/50"
                    placeholder="45000" type="number" min="1" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400">Room Type</label>
                  <select name="type" value={form.type} onChange={handleFormChange}
                    className="w-full bg-surface dark:bg-slate-900 border-0 focus:ring-2 focus:ring-primary rounded-lg p-3 text-on-surface dark:text-slate-100 font-medium">
                    {['1 BHK', '2 BHK', '3 BHK', 'Studio', 'Shared Space', 'Penthouse'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-full space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} required
                    className="w-full bg-surface dark:bg-slate-900 border-0 focus:ring-2 focus:ring-primary rounded-lg p-3 text-on-surface dark:text-slate-100 font-medium placeholder:text-outline/50"
                    placeholder="Describe the ambiance, amenities, and soul of the space..." rows={4} />
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-surface dark:bg-slate-800 p-8 rounded-xl shadow-[0_8px_32px_rgba(25,27,35,0.03)]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400 mb-4">Amenities</h4>
                <div className="flex flex-wrap gap-3">
                  {AMENITY_OPTIONS.map(a => (
                    <button
                      key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${form.amenities.includes(a)
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-400 border-outline-variant hover:border-primary'
                        }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="bg-surface dark:bg-slate-800 p-8 rounded-xl shadow-[0_8px_32px_rgba(25,27,35,0.03)] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-slate-400">Property Images</h4>
                <div className="flex gap-3">
                  <input
                    type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                    className="flex-1 bg-surface dark:bg-slate-900 border-0 focus:ring-2 focus:ring-primary rounded-lg p-3 text-on-surface dark:text-slate-100 font-medium placeholder:text-outline/50"
                    placeholder="Paste image URL (https://...)"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl(); } }}
                  />
                  <button type="button" onClick={addImageUrl}
                    className="px-5 py-3 bg-primary text-on-primary rounded-lg font-bold text-sm hover:opacity-90 transition-all">
                    Add
                  </button>
                </div>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button" onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 bg-error text-on-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-6 pt-4 border-t border-outline-variant/20">
                <button type="button" onClick={() => { setActiveTab('rooms'); setForm(emptyForm); }}
                  className="text-on-surface dark:text-slate-400 font-bold text-sm hover:text-on-surface dark:text-slate-100 transition-colors">
                  Discard
                </button>
                <button type="submit" disabled={formLoading}
                  className="bg-primary text-on-primary px-12 py-4 rounded-xl font-bold shadow-[0_8px_24px_rgba(0,64,161,0.15)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                  {formLoading ? 'Saving...' : formMode === 'edit' ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ─── PROFILE TAB ─── */}
        {activeTab === 'profile' && (
          <section className="max-w-lg">
            <h3 className="text-2xl font-black tracking-tight text-on-surface dark:text-slate-100 mb-8">My Profile</h3>
            <div className="bg-surface dark:bg-slate-800 rounded-xl p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-black">
                  {getInitials(user?.fullName)}
                </div>
                <div>
                  <p className="font-black text-on-surface dark:text-slate-100 text-xl tracking-tight">{user?.fullName}</p>
                  <p className="text-sm text-on-surface dark:text-slate-400">{user?.email}</p>
                  <span className="inline-block mt-1 px-3 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                    {user?.specialization || user?.role || 'Agent'}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface dark:text-slate-400 font-medium">Email</span>
                  <span className="font-semibold text-on-surface dark:text-slate-100">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface dark:text-slate-400 font-medium">Phone</span>
                  <span className="font-semibold text-on-surface dark:text-slate-100">{user?.phone || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface dark:text-slate-400 font-medium">Agency</span>
                  <span className="font-semibold text-on-surface dark:text-slate-100">The Urban Sanctuary</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface dark:text-slate-400 font-medium">Total Rooms</span>
                  <span className="font-black text-primary">{totalRooms}</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface dark:bg-slate-800 border-t border-outline-variant/20 flex justify-around py-3 z-50">
        {navItems.map(item => (
          <button key={item.id}
            onClick={() => item.id === 'add' ? openAddForm() : setActiveTab(item.id)}
            className={`flex flex-col items-center gap-0.5 transition-colors ${activeTab === item.id ? 'text-primary' : 'text-on-surface dark:text-slate-400'}`}>
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="text-[0.6rem] font-bold uppercase">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ── Shared Room Table ── */
function RoomTable({ rooms, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bg-surface dark:bg-slate-800 rounded-xl p-12 text-center">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading listings...</p>
      </div>
    );
  }
  if (rooms.length === 0) {
    return (
      <div className="text-center py-20 bg-surface dark:bg-slate-800 rounded-2xl border-2 border-dashed border-outline-variant">
        <span className="material-symbols-outlined text-5xl text-outline block mb-3">add_home</span>
        <h3 className="text-lg font-bold text-on-surface dark:text-slate-100 mb-1">No listings yet</h3>
        <p className="text-sm text-on-surface dark:text-slate-400">Add your first property to get started.</p>
      </div>
    );
  }
  return (
    <div className="bg-surface dark:bg-slate-800 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(25,27,35,0.03)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface dark:bg-slate-800 border-b border-outline-variant/10">
            {['Property', 'Location', 'Monthly Rent', 'Status', 'Actions'].map((h, i) => (
              <th key={h} className={`px-6 py-4 text-xs font-bold text-on-surface dark:text-slate-400 uppercase tracking-wider ${i === 4 ? 'text-right' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {rooms.map(room => (
            <tr key={room._id} className="group hover:bg-surface dark:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {room.images?.[0] ? (
                    <img src={room.images[0]} alt={room.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-12 bg-surface dark:bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline text-2xl">home</span>
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-on-surface dark:text-slate-100">{room.title}</div>
                    <div className="text-xs text-on-surface dark:text-slate-400">{room.type} • {room.amenities?.includes('Furnished') ? 'Furnished' : 'Unfurnished'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-on-surface dark:text-slate-400 font-medium">{room.location}</td>
              <td className="px-6 py-4 text-sm font-black text-primary">Rs. {Number(room.pricePerMonth).toLocaleString()}</td>
              <td className="px-6 py-4">
                {room.status === 'approved' ? (
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Active / Approved</span>
                ) : room.status === 'rejected' ? (
                  <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Rejected</span>
                ) : (
                  <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Pending Review</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(room)} className="text-on-surface dark:text-slate-400 hover:text-primary transition-colors p-1" title="Edit">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button onClick={() => onDelete(room._id)} className="text-on-surface dark:text-slate-400 hover:text-error transition-colors p-1" title="Delete">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
