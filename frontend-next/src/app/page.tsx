"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Search, Building2 } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ListingCard } from "@/components/cards/ListingCard";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { CTASection } from "@/components/sections/CTASection";

import { useState, useEffect } from "react";

export default function Home() {
  const [featuredRooms, setFeaturedRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/rooms?limit=3&page=1")
      .then(res => res.json())
      .then(data => {
        setFeaturedRooms(data.rooms || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching featured rooms:", err);
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden py-24">
        {/* Background gradient/image */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-20 relative z-20 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
              Elevate Your <span className="text-blue-500">Living Standard.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
              Discover Nepal's most exclusive curated collection of luxury apartments, homes, and sanctuaries.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/discover"
                className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                Start Exploring
              </Link>
              <Link
                href="/listings"
                className="flex items-center gap-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 px-8 py-4 text-base font-bold text-slate-200 transition-colors hover:bg-slate-800"
              >
                View Properties <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-20">
          <SectionHeader 
            title="The New Standard" 
            description="Why thousands choose Urban Sanctuary for their premium real estate needs."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <FeatureCard 
              icon={<Search />}
              title="Curated Selection"
              description="Every property is hand-picked and verified to meet our strict luxury and quality standards."
            />
            <FeatureCard 
              icon={<ShieldCheck />}
              title="Verified Agents"
              description="Work exclusively with top-tier, licensed real estate professionals in the Kathmandu valley."
            />
            <FeatureCard 
              icon={<Building2 />}
              title="Premium Support"
              description="Enjoy 24/7 concierge-level support throughout your entire renting or buying journey."
            />
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-24 bg-slate-950 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <SectionHeader 
              title="Featured Sanctuaries" 
              description="Explore our most sought-after properties available this week."
              className="mb-0"
            />
            <Link href="/listings" className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-2 transition-colors mt-4 md:mt-0">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-3 text-center py-12 text-slate-400">Loading featured properties...</div>
            ) : featuredRooms.length > 0 ? (
              featuredRooms.map(room => (
                <ListingCard 
                  key={room._id} 
                  id={room._id}
                  title={room.title}
                  price={`Rs. ${room.pricePerMonth?.toLocaleString() || "N/A"}`}
                  location={room.location || "Not available"}
                  imageUrl={room.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80"}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-400">No featured properties found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CTASection />
    </div>
  );
}
