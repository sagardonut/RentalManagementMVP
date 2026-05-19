"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTASection } from "@/components/sections/CTASection";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-20">
          <SectionHeader 
            title="Discover Kathmandu" 
            description="Explore neighborhoods, lifestyle insights, and the pulse of luxury living."
            centered
          />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="group relative h-96 overflow-hidden rounded-3xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80" 
                alt="Patan"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2">Patan</h3>
                <p className="text-sm text-slate-300 line-clamp-2">Historic charm meets modern living in this vibrant sanctuary.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="group relative h-96 overflow-hidden rounded-3xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1521404111306-69614a9a0ea9?auto=format&fit=crop&q=80" 
                alt="Sanepa"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2">Sanepa</h3>
                <p className="text-sm text-slate-300 line-clamp-2">The premier expatriate hub offering unparalleled tranquility.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="group relative h-96 overflow-hidden rounded-3xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1582201943021-e8e5b604bc1b?auto=format&fit=crop&q=80" 
                alt="Baluwatar"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2">Baluwatar</h3>
                <p className="text-sm text-slate-300 line-clamp-2">Central, secure, and surrounded by prime diplomatic missions.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
