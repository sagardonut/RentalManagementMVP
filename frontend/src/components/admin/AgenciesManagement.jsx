import React from 'react';

const AgenciesManagement = ({ agencies, loading }) => {
  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 animate-pulse">
        <div className="h-8 w-48 bg-surface-container rounded mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 w-full bg-surface-container rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-on-surface">Agencies Management</h3>
          <p className="text-on-surface-variant text-sm font-medium mt-1">Manage and monitor all platform partners</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-sm font-bold transition-colors">
          <span className="material-symbols-outlined text-lg">filter_alt</span>
          Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-outline-variant/20">
              <th className="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-4">Agency Details</th>
              <th className="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Agents</th>
              <th className="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Rooms</th>
              <th className="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="pb-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {agencies.length > 0 ? agencies.map((agency) => (
              <tr key={agency._id} className="group hover:bg-surface-container transition-colors">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                      <span className="text-primary font-bold text-lg">
                        {agency.fullName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-sm">{agency.fullName}</p>
                      <p className="text-xs text-on-surface-variant font-medium">{agency.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">badge</span>
                    <span className="font-bold text-on-surface">{agency.agentCount || 0}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">bed</span>
                    <span className="font-bold text-on-surface">{agency.roomCount || 0}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    agency.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {agency.status || 'Pending'}
                  </span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-20 text-center text-on-surface-variant font-medium">
                  No agencies found. Start by recruiting platform partners.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgenciesManagement;
