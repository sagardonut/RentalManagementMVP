import React from 'react';
import { Link } from 'react-router-dom';

export default function RoomCard({ id, image, price, title, location, verified, amenities }) {
  const iconMap = {
    'WiFi': 'wifi',
    'Parking': 'local_parking',
    'AC': 'ac_unit',
    'Water Supply': 'water_drop',
    'Security': 'security',
    'Kitchen': 'kitchen',
    'Furnished': 'weekend',
    'Balcony': 'balcony',
    'wifi': 'wifi',
    'ac_unit': 'ac_unit',
    'local_parking': 'local_parking',
    'kitchen': 'kitchen',
    'pool': 'pool'
  };
  return (
    <Link to={`/rooms/${id}`} className="group cursor-pointer block">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-surface dark:bg-slate-800">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={image} 
          alt={title} 
        />
        {verified && (
          <div className="absolute top-4 left-4 bg-white dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center shadow-sm">
            <span className="material-symbols-outlined text-[14px] text-tertiary dark:text-blue-400 mr-1" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
            <span className="text-[10px] font-bold tracking-wider text-on-surface dark:text-slate-100 uppercase">Verified</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
          <span className="text-lg font-bold text-primary dark:text-blue-400">{price}</span>
          <span className="text-[10px] text-on-surface dark:text-slate-400 ml-1">/mo</span>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold tracking-tight text-on-surface dark:text-slate-100 transition-colors line-clamp-1">{title}</h3>
        <p className="text-sm text-on-surface dark:text-slate-400 flex items-center">
          <span className="material-symbols-outlined text-[16px] mr-1">location_on</span>
          {location}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {amenities?.slice(0, 3).map((amenity, idx) => {
            const formattedLabel = amenity.replace(/_/g, ' ')
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' ');
            const iconKey = iconMap[amenity] || iconMap[formattedLabel] || 'check_circle';
            
            return (
              <div key={idx} title={formattedLabel} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700/50 max-w-[140px]">
                <span className="material-symbols-outlined text-slate-400 text-[14px] flex-shrink-0">
                  {iconKey}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                  {formattedLabel}
                </span>
              </div>
            );
          })}
          {(amenities?.length || 0) > 3 && (
            <span className="text-[11px] text-slate-400 font-bold px-1">+{amenities.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
