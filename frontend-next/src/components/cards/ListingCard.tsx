"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import Link from "next/link";

interface ListingCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  imageUrl: string;
  beds?: number | string;
  baths?: number | string;
  sqft?: number | string;
}

export function ListingCard({ id, title, price, location, imageUrl, beds = "N/A", baths = "N/A", sqft = "N/A" }: ListingCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] transition-all hover:border-slate-700"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 rounded-full bg-slate-950/60 px-3 py-1 backdrop-blur-md">
          <p className="text-sm font-bold text-slate-200">{price}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-1.5 text-slate-400 mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">{location}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100 line-clamp-1 mb-4">{title}</h3>
        
        <div className="mt-auto flex items-center justify-between border-t border-slate-800/50 pt-4 text-slate-400">
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="text-sm font-medium">{beds} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4" />
            <span className="text-sm font-medium">{baths} Baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            <span className="text-sm font-medium">{sqft} sqft</span>
          </div>
        </div>
      </div>
      <Link href={`/listings/${id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {title}</span>
      </Link>
    </motion.div>
  );
}
