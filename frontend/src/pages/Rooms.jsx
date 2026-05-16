import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RoomCard from '../components/common/RoomCard';

const ROOMS_PER_PAGE = 9; // 3 rows of 3 columns

export default function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  const [locations, setLocations] = useState([]);

  // Derive filters from URL search params
  const locationFilter = searchParams.get('location') || 'All Locations';
  const priceFilter = searchParams.get('maxPrice') || 'Price Range';

  useEffect(() => {
    fetchRooms(1); // Fetch whenever URL params change
  }, [searchParams]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/rooms/locations');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const fetchRooms = async (page) => {
    setLoading(true);
    try {
      let url = `http://localhost:5001/api/rooms?page=${page}&limit=${ROOMS_PER_PAGE}&`;
      if (locationFilter !== 'All Locations') url += `location=${locationFilter}&`;
      if (priceFilter !== 'Price Range') url += `maxPrice=${priceFilter}&`;

      const response = await fetch(url);
      const data = await response.json();

      setRooms(data.rooms || []);
      setTotalPages(data.pages || 1);
      setTotalRooms(data.total || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All Locations' || value === 'Price Range') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', page.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-8">
          {/* Header */}
          <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-blue-900 mb-2">Available Listings</h1>
              <p className="text-slate-500">
                {loading ? 'Loading...' : `Showing ${rooms.length} of ${totalRooms} properties in Kathmandu.`}
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="appearance-none border border-slate-200 rounded-lg px-6 py-3 text-sm font-bold text-slate-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer pr-10"
                >
                  <option>All Locations</option>
                  {locations.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
              </div>

              <div className="relative">
                <select
                  value={priceFilter}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="appearance-none border border-slate-200 rounded-lg px-6 py-3 text-sm font-bold text-slate-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer pr-10"
                >
                  <option>Price Range</option>
                  <option>NPR 25,000</option>
                  <option>NPR 45,000</option>
                  <option>NPR 90,000</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Curating your sanctuary...</p>
            </div>
          ) : rooms.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                {rooms.map((room) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm hover:-translate-x-0.5'}`}
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Show ellipsis for large page counts
                      if (totalPages > 7 && page !== 1 && page !== totalPages && (page < currentPage - 1 || page > currentPage + 1)) {
                        if (page === currentPage - 2 || page === currentPage + 2) return <span key={i} className="text-slate-400 px-1">…</span>;
                        return null;
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(page)}
                          className={`w-12 h-12 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${currentPage === page ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm hover:translate-x-0.5'}`}
                  >
                    Next
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              )}

              {/* Page info */}
              {totalPages > 1 && (
                <p className="text-center text-xs text-slate-400 font-medium mt-4">
                  Page {currentPage} of {totalPages} · {totalRooms} total properties
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">search_off</span>
              <h3 className="text-2xl font-bold text-slate-400">No rooms found matching your criteria.</h3>
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
