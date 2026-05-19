import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5001/api';

const PendingRoomsManagement = () => {
  const { user } = useAuth();
  const [pendingRooms, setPendingRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchPendingRooms();
  }, []);
  
  const getToken = () => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored).token : null;
  };
  
  const fetchPendingRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/rooms/agency/pending`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPendingRooms(data.rooms || []);
      } else {
        setError(data.message || 'Failed to fetch pending rooms');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async (roomId, status) => {
    try {
      const res = await fetch(`${API}/rooms/${roomId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${status} room`);
      }
      
      // Remove from list or refresh
      setPendingRooms(prev => prev.filter(r => r._id !== roomId));
    } catch (err) {
      alert(err.message);
    }
  };
  
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-on-surface dark:text-slate-400 text-sm font-bold uppercase tracking-widest">Loading pending rooms...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-surface-container flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-on-surface dark:text-slate-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">pending_actions</span>
            Rooms Awaiting Approval
          </h2>
          <p className="text-sm text-on-surface dark:text-slate-400 mt-1">Review new listings from your agents before they go public.</p>
        </div>
        <button
          onClick={fetchPendingRooms}
          className="px-4 py-2 bg-surface dark:bg-slate-800 border border-outline-variant/20 text-on-surface dark:text-slate-100 rounded-xl font-bold text-sm hover:bg-surface dark:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-lg align-middle mr-1">refresh</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 m-6 bg-error-container text-on-error-container rounded-xl text-sm font-bold">
          {error}
        </div>
      )}

      <div className="p-6">
        {pendingRooms.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-on-surface dark:text-slate-400 mb-4 block">check_circle</span>
            <h3 className="text-xl font-bold text-on-surface dark:text-slate-400 mb-2">All caught up!</h3>
            <p className="text-on-surface dark:text-slate-400 text-sm">There are no rooms waiting for your approval right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingRooms.map(room => (
              <div key={room._id} className="flex flex-col md:flex-row gap-6 bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-xl p-4">
                <div className="w-full md:w-64 h-40 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                  {room.images && room.images.length > 0 ? (
                    <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-outline/50">image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">{room.title}</h3>
                      <span className="text-xl font-black text-primary">Rs. {Number(room.pricePerMonth).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-on-surface dark:text-slate-400 flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-sm">location_on</span> {room.location}
                    </p>
                    <p className="text-sm text-on-surface dark:text-slate-400 line-clamp-2 mb-4">
                      {room.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-surface dark:bg-slate-800 border border-outline-variant/30 text-[10px] font-bold rounded uppercase tracking-wider">{room.type}</span>
                      {room.amenities?.slice(0, 3).map(a => (
                        <span key={a} className="px-2 py-1 bg-surface dark:bg-slate-800 border border-outline-variant/30 text-[10px] font-bold rounded uppercase tracking-wider">{a}</span>
                      ))}
                      {room.amenities?.length > 3 && (
                        <span className="px-2 py-1 bg-surface dark:bg-slate-800 border border-outline-variant/30 text-[10px] font-bold rounded uppercase tracking-wider">+{room.amenities.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                        {room.agentId?.fullName?.charAt(0) || '?'}
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-on-surface dark:text-slate-100 leading-none mb-1">{room.agentId?.fullName || 'Unknown Agent'}</p>
                        <p className="text-[10px] text-on-surface dark:text-slate-400 leading-none">{room.agentId?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(room._id, 'rejected')}
                        className="px-4 py-2 border border-error text-error rounded-lg text-sm font-bold hover:bg-error-container transition-colors"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(room._id, 'approved')}
                        className="px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRoomsManagement;
