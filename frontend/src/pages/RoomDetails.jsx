import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RoomCard from '../components/common/RoomCard';

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5001/api/rooms/${id}`);
        if (!res.ok) throw new Error('Room not found');
        const data = await res.json();
        setRoom(data);

        // Fetch similar rooms
        const similarRes = await fetch(`http://localhost:5001/api/rooms?limit=4`);
        if (similarRes.ok) {
          const similarData = await similarRes.json();
          // Filter out the current room and take up to 3
          setSimilarRooms((similarData.rooms || []).filter(r => r._id !== id).slice(0, 3));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomDetails();
    // Scroll to top when room changes
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 pt-24 transition-colors">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !room) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 pt-24 transition-colors">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400 mb-4 transition-colors">Room Not Found</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 transition-colors">The room you are looking for doesn't exist.</p>
            <Link to="/rooms" className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20">Go Back to Listings</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const mapAmenity = (key) => {
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
    
    // Format label: NEAR_AIRPORT -> Near Airport
    const formattedLabel = key.replace(/_/g, ' ')
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                              .join(' ');
                              
    const iconKey = iconMap[key] || 'check_circle'; // Fallback icon

    return {
      icon: iconKey,
      label: formattedLabel
    };
  };

  const amenitiesList = (room.amenities || []).map(mapAmenity);
  const formattedPrice = `NPR ${room.pricePerMonth?.toLocaleString() || 'N/A'}`;
  const agencyName = room.agentId?.fullName || 'Independent Agent';
  const agencyPhone = room.agentId?.phone || '980-000-0000';

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 max-w-screen-xl mx-auto px-6 md:px-12 bg-white dark:bg-slate-900 min-h-screen transition-colors">
        {/* Editorial Image Gallery */}
        <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[600px] mb-12">
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-xl group relative">
            <img 
              alt={room.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={room.images?.[0] || 'https://via.placeholder.com/800'} 
            />
            {room.isVerified && (
              <div className="absolute top-4 left-4 glass-morphism px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified Listing
              </div>
            )}
          </div>
          <div className="hidden md:block md:col-span-2 overflow-hidden rounded-xl group">
            <img 
              alt="Detail 1" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={room.images?.[1] || room.images?.[0] || 'https://via.placeholder.com/800'} 
            />
          </div>
          <div className="hidden md:block overflow-hidden rounded-xl group">
            <img 
              alt="Detail 2" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={room.images?.[2] || room.images?.[0] || 'https://via.placeholder.com/800'} 
            />
          </div>
          <div className="hidden md:block overflow-hidden rounded-xl group relative">
            <img 
              alt="Detail 3" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={room.images?.[3] || room.images?.[0] || 'https://via.placeholder.com/800'} 
            />
            <div className="absolute inset-0 bg-on-background/40 flex items-center justify-center cursor-pointer group-hover:bg-on-background/50 transition-colors">
              <span className="text-white font-bold">+{(Math.max(0, (room.images?.length || 0) - 4))} Photos</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Room Info (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium transition-colors">
                  {room.location}
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">star</span> Top Pick
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">{room.title}</h1>
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 transition-colors">
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{formattedPrice}<span className="text-sm font-normal text-slate-600 dark:text-slate-400">/mo</span></p>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <p className="flex items-center gap-1">
                  <span className="material-symbols-outlined">location_on</span>
                  {room.location}
                </p>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl space-y-6 transition-colors">
              <h2 className="text-lg font-bold tracking-tight uppercase text-slate-600 dark:text-slate-400 transition-colors">Amenities & Features</h2>
              <div className="flex flex-wrap gap-4">
                {amenitiesList.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 max-w-full">
                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">{amenity.icon}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">Property Description</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                {room.description}
              </p>
            </div>
          </div>

          {/* Sticky Sidebar (Right Column) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Agency Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg shadow-on-surface/5 border border-outline-variant/20 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors">
                    {room.agentId?.avatar ? (
                      <img
                        alt="Agency Representative"
                        className="w-full h-full object-cover"
                        src={room.agentId.avatar}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span class="text-2xl font-bold text-primary">${agencyName.charAt(0).toUpperCase()}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">{agencyName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white transition-colors">{agencyName}</h4>
                  </div>
                </div>

                {/* Access Section */}
                {!user ? (
                  /* Guest View */
                  <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl p-6 overflow-hidden text-center transition-colors">
                    <div className="absolute inset-0 backdrop-blur-md bg-slate-50/40 dark:bg-slate-900/40 z-10 transition-colors"></div>
                    <div className="relative z-20 flex flex-col items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                        <span className="material-symbols-outlined text-primary">lock</span>
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[10px] transition-colors">Locked Access</h5>
                      <div className="space-y-1 select-none">
                        <p className="text-sm font-mono text-slate-600 dark:text-slate-400 blur-[4px] transition-colors">{agencyPhone}</p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 blur-[2px] transition-colors">Kathmandu, Nepal</p>
                      </div>
                      <hr className="w-full border-outline-variant/30 my-1"/>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight transition-colors">
                        Sign up and pay a one-time fee of <span className="font-bold text-slate-900 dark:text-slate-100 transition-colors">Rs. 500</span> to unlock all agencies.
                      </p>
                      <Link to="/signup" className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] block text-center text-xs uppercase tracking-widest">
                        Pay & Sign Up
                      </Link>
                    </div>
                  </div>
                ) : !user.hasPaidFee ? (
                  /* Authenticated but Unpaid View */
                  <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl p-6 overflow-hidden text-center border border-primary/10 transition-colors">
                    <div className="relative z-20 flex flex-col items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                        <span className="material-symbols-outlined text-primary">payments</span>
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[10px] transition-colors">Unlock Details</h5>
                      <div className="space-y-1 select-none">
                        <p className="text-sm font-mono text-slate-600 dark:text-slate-400 blur-[4px] transition-colors">{agencyPhone}</p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 blur-[2px] transition-colors">Kathmandu, Nepal</p>
                      </div>
                      <hr className="w-full border-outline-variant/30 my-1"/>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight px-2 transition-colors">
                        One-time verification fee required to unlock contact details.
                      </p>
                      <Link to="/booking/payment" className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] block text-center text-xs uppercase tracking-widest">
                        Unlock Now (Rs. 500)
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Authenticated and Paid View */
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-primary/20 shadow-sm transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-lg">call</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Agency Phone</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors">{agencyPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Listing Agent</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors">{agencyName}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (!room.isAvailable) return;
                        if (!user) {
                          navigate('/signin');
                        } else {
                          navigate(`/booking/${id}`);
                        }
                      }}
                      disabled={!room.isAvailable}
                      className={`w-full font-bold py-4 rounded-xl transition-all block text-center uppercase tracking-widest text-xs ${!room.isAvailable ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-primary text-on-primary shadow-xl shadow-primary/20 hover:bg-primary-container hover:-translate-y-0.5 active:scale-[0.98]'}`}
                    >
                      {!room.isAvailable ? 'Currently Booked' : 'Book This Room'}
                    </button>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 py-4 px-2">
                <div className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 transition-colors">
                  <span className="material-symbols-outlined text-2xl">shield</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 transition-colors">
                  <span className="material-symbols-outlined text-2xl">house_with_shield</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">Visit Guaranteed</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 transition-colors">
                  <span className="material-symbols-outlined text-2xl">support_agent</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <section className="mt-24 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Curated for you</span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Similar Sanctuaries nearby</h2>
            </div>
            <Link to="/rooms" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
              View all Rooms <span className="material-symbols-outlined">trending_flat</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarRooms.map((sRoom) => (
              <RoomCard 
                key={sRoom._id}
                id={sRoom._id}
                title={sRoom.title}
                price={`NPR ${sRoom.pricePerMonth?.toLocaleString() || 'N/A'}`}
                location={sRoom.location}
                verified={sRoom.isVerified}
                amenities={sRoom.amenities}
                image={sRoom.images?.[0]}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
