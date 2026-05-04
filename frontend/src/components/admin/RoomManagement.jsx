import React, { useState } from 'react';

const RoomManagement = ({ 
  rooms, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleAvailability, 
  onCreate,
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (room.location && room.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || room.type === filterType;
    
    const matchesAvailability = filterAvailability === 'all' || 
                               (filterAvailability === 'available' && room.isAvailable) ||
                               (filterAvailability === 'unavailable' && !room.isAvailable);
    
    return matchesSearch && matchesType && matchesAvailability;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price || 0);
  };

  const getRoomTypeLabel = (type) => {
    const types = {
      'single': 'Single Room',
      'double': 'Double Room',
      'suite': 'Suite',
      'deluxe': 'Deluxe Room',
      'family': 'Family Room'
    };
    return types[type] || type || 'Standard';
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Header with Actions */}
      <div className="p-6 border-b border-surface-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-on-surface">All Rooms</h2>
          <div className="flex gap-3">
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-surface-container border border-outline-variant/20 text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">refresh</span>
              Refresh
            </button>
            <button
              onClick={onCreate}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">add</span>
              Add New Room
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-surface-container">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search rooms by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="lg:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="suite">Suite</option>
              <option value="deluxe">Deluxe Room</option>
              <option value="family">Family Room</option>
            </select>
          </div>
          <div className="lg:w-48">
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Loading rooms...</p>
        </div>
      ) : (
        <>
          {/* Rooms Grid */}
          <div className="p-6">
            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">bed</span>
                <h3 className="text-xl font-bold text-on-surface-variant mb-2">No Rooms Found</h3>
                <p className="text-on-surface-variant text-sm">
                  {searchTerm || filterType !== 'all' || filterAvailability !== 'all' 
                    ? 'No rooms match your search criteria' 
                    : 'No rooms have been added yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <div key={room._id} className="bg-surface rounded-xl overflow-hidden border border-outline-variant/20 hover:shadow-lg transition-shadow">
                    {/* Room Image */}
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      {room.images && room.images.length > 0 ? (
                        <img 
                          src={room.images[0]} 
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-6xl text-primary">bed</span>
                      )}
                    </div>
                    
                    {/* Room Details */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-on-surface line-clamp-1">{room.title}</h3>
                        <button
                          onClick={() => onToggleAvailability(room)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            room.isAvailable ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              room.isAvailable ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-lg mr-2">category</span>
                          {getRoomTypeLabel(room.type)}
                        </div>
                        <div className="flex items-center text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-lg mr-2">location_on</span>
                          {room.location || 'No location specified'}
                        </div>
                        <div className="flex items-center text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-lg mr-2">group</span>
                          Max {room.maxOccupancy || 2} guests
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold text-primary">{formatPrice(room.price)}</p>
                          <p className="text-xs text-on-surface-variant">per night</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {room.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      
                      {room.description && (
                        <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">
                          {room.description}
                        </p>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(room)}
                          className="flex-1 px-4 py-2 bg-surface-container border border-outline-variant/20 text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg align-middle mr-1">edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(room)}
                          className="flex-1 px-4 py-2 bg-error-container text-on-error-container rounded-lg font-bold text-sm hover:bg-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg align-middle mr-1">delete</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="p-6 border-t border-surface-container bg-surface-container-low/30">
            <div className="flex items-center justify-between">
              <p className="text-sm text-on-surface-variant">
                Showing {filteredRooms.length} of {rooms.length} rooms
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">
                  Available: {rooms.filter(r => r.isAvailable).length}
                </span>
                <span className="text-red-600">
                  Unavailable: {rooms.filter(r => !r.isAvailable).length}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomManagement;
