import React from 'react';
import { Link } from 'react-router-dom';

const iconMap = {
  'WiFi': 'wifi',
  'Parking': 'local_parking',
  'AC': 'ac_unit',
  'Water Supply': 'water_drop',
  'Security': 'security',
  'Kitchen': 'kitchen',
  'Furnished': 'chair',
  'Balcony': 'balcony',
  'wifi': 'wifi',
  'ac_unit': 'ac_unit',
  'local_parking': 'local_parking',
  'kitchen': 'kitchen',
  'pool': 'pool',
  'washing_machine': 'local_laundry_service',
  'furnished': 'chair',
  'security': 'security',
  'rooftop': 'deck',
  'garden': 'yard',
  'gym': 'fitness_center',
  'concierge': 'room_service',
  'shared_bathroom': 'bathroom',
  'courtyard': 'deck',
  'cultural': 'temple_buddhist',
  'inverter': 'battery_charging_full',
  'mountain_view': 'landscape',
  'workspace': 'desk',
  'solar_backup': 'solar_power',
  'near_airport': 'flight_takeoff',
  'quiet': 'volume_off'
};

export default function RoomCard({ id, image, price, title, location, verified, amenities }) {
  // Take up to 4 amenities to prevent overflow
  const displayAmenities = amenities?.slice(0, 4) || [];
  const extraAmenities = (amenities?.length || 0) - 4;

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
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-xl font-bold tracking-tight line-clamp-1 flex-1">{title}</h3>
          <div className="flex items-center space-x-1.5 flex-shrink-0 bg-slate-50 px-2 py-1 rounded-lg">
            {displayAmenities.map((amenity, idx) => {
              const mappedIcon = iconMap[amenity] || amenity;
              return (
                <span key={idx} title={amenity} className="material-symbols-outlined text-slate-500 amenity-icon" style={{ fontSize: '16px' }}>
                  {mappedIcon}
                </span>
              );
            })}
            {extraAmenities > 0 && (
              <span className="text-[10px] font-bold text-slate-400 ml-1">+{extraAmenities}</span>
            )}
          </div>
        </div>
        <p className="text-sm text-on-surface-variant flex items-center">
          <span className="material-symbols-outlined text-[16px] mr-1">location_on</span>
          <span className="line-clamp-1">{location}</span>
        </p>
      </div>
    </Link>
  );
}
