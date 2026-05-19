import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5001/api';
const AMENITY_OPTIONS = ['WiFi', 'Parking', 'AC', 'Water Supply', 'Security', 'Kitchen', 'Furnished', 'Balcony'];

export default function RoomCRUDModal({ room, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', description: '', pricePerMonth: '', location: '',
    type: '1 BHK', amenities: [], images: [],
    status: 'approved' // Agency can directly approve their own created rooms
  });
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (room) {
      setForm({
        title: room.title,
        description: room.description,
        pricePerMonth: room.pricePerMonth,
        location: room.location,
        type: room.type || '1 BHK',
        amenities: room.amenities || [],
        images: room.images || [],
        status: room.status || 'approved'
      });
    }
  }, [room]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.pricePerMonth || !form.location) {
      return setError('Please fill all required fields.');
    }
    setLoading(true);
    try {
      const stored = localStorage.getItem('user');
      const token = stored ? JSON.parse(stored).token : null;
      
      const url = room ? `${API}/rooms/${room._id}` : `${API}/rooms`;
      const method = room ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, pricePerMonth: Number(form.pricePerMonth) }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save room');
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl relative my-8">
        <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 p-6 rounded-t-2xl flex justify-between items-center z-10">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            {room ? 'Edit Property Listing' : 'Create New Listing'}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl font-bold text-sm">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Location *</label>
              <input name="location" value={form.location} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Monthly Rent (Rs.) *</label>
              <input type="number" name="pricePerMonth" value={form.pricePerMonth} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Room Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-white">
                {['1 BHK', '2 BHK', '3 BHK', 'Studio', 'Shared Space', 'Penthouse'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Status (Agency Override)</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-white">
                <option value="approved">Approved / Active</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-slate-500">Amenities</label>
            <div className="flex flex-wrap gap-3">
              {AMENITY_OPTIONS.map(a => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${form.amenities.includes(a) ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-slate-500">Images</label>
            <div className="flex gap-3">
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-900 dark:text-white" placeholder="https://..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl(); } }} />
              <button type="button" onClick={addImageUrl} className="px-6 py-3 bg-slate-200 dark:bg-slate-700 rounded-lg font-bold">Add</button>
            </div>
            {form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
