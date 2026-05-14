import React from 'react';

export default function AgentCard({ agent, onViewListings }) {
  return (
    <div className="bg-surface dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-outline-variant/10 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start gap-5 mb-6">
        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-500">
          <img 
            className="w-full h-full object-cover" 
            alt={agent.fullName} 
            src={agent.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAMLqNAq9bWo-r4khyOHdNQRZamrFAjbWXzeq3GKUHFMsEaRkieMB3HBkW8ibpXNS8c6Lo11xudIr_CWnoFF4reTrEaJR_VMborHC9Tc96aBJDvCo7t55Ky5JLQlELzu2CIVOr2x9n69mhEF3KpsGGWw8LyKACVFXY20jZWzH40PLi5MVSBzzth5Dg6ZFQIPkNiSBv5mWqAyKd9vzFX1akvmFdB8lmh2tr4PN8O2VoJwjvgczjPuqN_fD83s4o30gr6wvsYHiOneNCA"} 
          />
        </div>
        <div className="flex-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container mb-2">
            <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            Verified Agent
          </span>
          <h4 className="text-xl font-extrabold text-on-surface dark:text-slate-100 group-hover:text-primary transition-colors">{agent.fullName}</h4>
          <p className="text-xs text-on-surface dark:text-slate-400 font-medium">{agent.specialization || "Residential Specialist"}</p>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-on-surface dark:text-slate-400">
          <span className="material-symbols-outlined text-primary text-[20px]">call</span>
          <span>{agent.phone || "+977 980-0000000"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-on-surface dark:text-slate-400">
          <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
          <span>{agent.email}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none">Inventory</span>
          <span className="text-lg font-black text-primary">{agent.roomCount || 0} Rooms</span>
        </div>
        <button 
          onClick={() => onViewListings(agent._id)}
          className="px-5 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl active:scale-95 transition-all shadow-sm shadow-primary/20 hover:bg-primary-container"
        >
          View Listings
        </button>
      </div>
    </div>
  );
}
