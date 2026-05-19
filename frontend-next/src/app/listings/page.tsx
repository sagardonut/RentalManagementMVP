"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { ListingCard } from "@/components/cards/ListingCard";
import { Filter } from "lucide-react";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";

export default function ListingsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchRooms = (pageNum: number) => {
    setIsLoading(true);
    fetch(`http://localhost:5001/api/rooms?limit=9&page=${pageNum}`)
      .then(res => res.json())
      .then(data => {
        if (pageNum === 1) {
          setRooms(data.rooms || []);
        } else {
          setRooms(prev => [...prev, ...(data.rooms || [])]);
        }
        setHasMore(data.currentPage < data.pages);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching rooms:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRooms(nextPage);
  };
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-800 pb-8">
          <SectionHeader 
            title="Available Listings" 
            description="Explore our complete collection of verified premium properties."
            className="mb-0"
          />
          
          <div className="mt-8 md:mt-0 flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-6 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800">
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % 9) * 0.1 }}
            >
              <ListingCard 
                id={room._id}
                title={room.title}
                price={`Rs. ${room.pricePerMonth?.toLocaleString() || "N/A"}`}
                location={room.location || "Not available"}
                imageUrl={room.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80"}
              />
            </motion.div>
          ))}
          {isLoading && rooms.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-slate-400">
              Loading properties...
            </div>
          )}
          {!isLoading && rooms.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-slate-400">
              No properties found matching your criteria.
            </div>
          )}
        </div>
        
        {hasMore && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={loadMore}
              disabled={isLoading}
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load More Properties'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
