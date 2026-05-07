import React, { useState } from 'react';

const AgenciesManagement = ({ 
  agencies, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onViewDetails,
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (agency.phone && agency.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && agency.isActive !== false) ||
                         (filterStatus === 'inactive' && agency.isActive === false);
    
    const matchesVerification = filterVerification === 'all' ||
                               (filterVerification === 'verified' && agency.status === 'verified') ||
                               (filterVerification === 'pending' && agency.status === 'pending');
    
    return matchesSearch && matchesStatus && matchesVerification;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.fullName.localeCompare(b.fullName);
      case 'agents':
        return (b.agentCount || 0) - (a.agentCount || 0);
      case 'rooms':
        return (b.roomCount || 0) - (a.roomCount || 0);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const getInitials = (fullName) => {
    if (!fullName) return 'A';
    return fullName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculatePerformanceScore = (agency) => {
    const agentScore = Math.min((agency.agentCount || 0) * 10, 50);
    const roomScore = Math.min((agency.roomCount || 0) * 5, 50);
    const verificationScore = agency.status === 'verified' ? 20 : 0;
    const activityScore = agency.isActive !== false ? 30 : 0;
    return Math.min(agentScore + roomScore + verificationScore + activityScore, 100);
  };

  const exportAgencies = () => {
    const csvContent = [
      ['Agency Name', 'Email', 'Phone', 'Agents', 'Rooms', 'Status', 'Verification', 'Performance Score'],
      ...filteredAgencies.map(agency => [
        agency.fullName,
        agency.email,
        agency.phone || 'N/A',
        agency.agentCount || 0,
        agency.roomCount || 0,
        agency.isActive !== false ? 'Active' : 'Inactive',
        agency.status || 'pending',
        calculatePerformanceScore(agency) + '%'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agencies_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-surface-container">
          <div className="flex justify-between items-center">
            <div className="h-8 w-48 bg-surface-container rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-surface-container rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-surface-container rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 w-full bg-surface-container rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Header with Actions */}
      <div className="p-6 border-b border-surface-container">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Agencies Management</h2>
            <p className="text-sm text-on-surface-variant">Monitor and manage all platform partners</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-surface-container border border-outline-variant/20 text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">refresh</span>
              Refresh
            </button>
            <button
              onClick={exportAgencies}
              className="px-4 py-2 bg-surface-container border border-outline-variant/20 text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">download</span>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="p-6 border-b border-surface-container bg-surface-container-low/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl p-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Agencies</p>
                <p className="text-2xl font-bold text-on-surface mt-1">{agencies.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">business</span>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Agencies</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {agencies.filter(a => a.isActive !== false).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Verified Agencies</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {agencies.filter(a => a.status === 'verified').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 text-xl">verified</span>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Avg Performance</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {agencies.length > 0 
                    ? Math.round(agencies.reduce((acc, a) => acc + calculatePerformanceScore(a), 0) / agencies.length)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-surface-container">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search agencies by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="xl:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="xl:w-48">
            <select
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="xl:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="name">Sort by Name</option>
              <option value="agents">Sort by Agents</option>
              <option value="rooms">Sort by Rooms</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agencies Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-container-low/50">
            <tr>
              <th className="px-6 py-4 text-left text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Agency
              </th>
              <th className="px-6 py-4 text-left text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Performance
              </th>
              <th className="px-6 py-4 text-left text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Resources
              </th>
              <th className="px-6 py-4 text-left text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {filteredAgencies.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                  No agencies found matching your criteria
                </td>
              </tr>
            ) : (
              filteredAgencies.map((agency) => (
                <tr key={agency._id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {getInitials(agency.fullName)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{agency.fullName}</p>
                        <p className="text-sm text-on-surface-variant">ID: {agency._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-on-surface">{agency.email}</p>
                      <p className="text-sm text-on-surface-variant">{agency.phone || 'No phone'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-on-surface-variant">Performance</span>
                          <span className="text-xs font-bold text-on-surface">
                            {calculatePerformanceScore(agency)}%
                          </span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              calculatePerformanceScore(agency) >= 80 ? 'bg-green-500' :
                              calculatePerformanceScore(agency) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${calculatePerformanceScore(agency)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-on-surface-variant">badge</span>
                        <span className="text-sm font-medium text-on-surface">{agency.agentCount || 0} Agents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-on-surface-variant">bed</span>
                        <span className="text-sm font-medium text-on-surface">{agency.roomCount || 0} Rooms</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <button
                        onClick={() => onToggleStatus(agency)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          (agency.isActive !== false) ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            (agency.isActive !== false) ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agency.status)}`}>
                        {agency.status || 'pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onViewDetails && onViewDetails(agency)}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      <button
                        onClick={() => onEdit(agency)}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg"
                        title="Edit Agency"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(agency)}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg"
                        title="Delete Agency"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Footer */}
      <div className="p-6 border-t border-surface-container bg-surface-container-low/30">
        <div className="flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">
            Showing {filteredAgencies.length} of {agencies.length} agencies
          </p>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">
              Active: {agencies.filter(a => a.isActive !== false).length}
            </span>
            <span className="text-blue-600">
              Verified: {agencies.filter(a => a.status === 'verified').length}
            </span>
            <span className="text-gray-500">
              Inactive: {agencies.filter(a => a.isActive === false).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenciesManagement;
