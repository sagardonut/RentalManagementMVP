import React from 'react';
import { Link } from 'react-router-dom';

export default function RoomCard({ id, image, price, title, location, verified, amenities }) {
  return (
    <Link to={`/rooms/${id}`} className="group cursor-pointer block">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-surface-container">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={image} 
          alt={title} 
        />
        {verified && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center shadow-sm">
            <span className="material-symbols-outlined text-[14px] text-tertiary mr-1" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
            <span className="text-[10px] font-bold tracking-wider text-on-surface uppercase">Verified</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
          <span className="text-lg font-bold text-primary">{price}</span>
          <span className="text-[10px] text-on-surface-variant ml-1">/mo</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <div className="flex items-center space-x-2">
            {amenities?.map((icon, idx) => (
              <span key={idx} className="material-symbols-outlined text-slate-400 amenity-icon" style={{ fontSize: '16px' }}>{icon}</span>
            ))}
          </div>
        </div>
        <p className="text-sm text-on-surface-variant flex items-center">
          <span className="material-symbols-outlined text-[16px] mr-1">location_on</span>
          {location}
        </p>
      </div>
    </Link>
  );
}
