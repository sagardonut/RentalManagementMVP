"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="flex flex-col rounded-3xl bg-slate-900/50 p-8 border border-slate-800 transition-colors hover:bg-slate-900"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-100">{title}</h3>
      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
