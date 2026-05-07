import React, { useState } from 'react';

const AgentManagement = ({ 
  agents, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onCreate,
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (agent.phone && agent.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && agent.isActive !== false) ||
                         (filterStatus === 'inactive' && agent.isActive === false);
    
    return matchesSearch && matchesStatus;
  });

  const getInitials = (fullName) => {
    if (!fullName) return 'N/A';
    return fullName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Header with Actions */}
      <div className="p-6 border-b border-surface-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-on-surface">All Agents</h2>
          <div className="flex gap-3">
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-surface-container border border-outline-variant/20 text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">refresh</span>
              Refresh
            </button>
            <button
              onClick={onCreate}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">add</span>
              Add New Agent
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-surface-container">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search agents by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="sm:w-48">
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
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Loading agents...</p>
        </div>
      ) : (
        <>
          {/* Agents Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Agent
                  </th>
                  <th className="px-6 py-4 text-left text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Agency
                  </th>
                  <th className="px-6 py-4 text-left text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Specialization
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
                {filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                      No agents found
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold text-sm">
                              {getInitials(agent.fullName)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-on-surface">{agent.fullName}</p>
                            <p className="text-sm text-on-surface-variant">ID: {agent._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-on-surface">{agent.email}</p>
                          <p className="text-sm text-on-surface-variant">{agent.phone || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-on-surface">
                          {agent.agency?.name || 'No Agency'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant">
                          {agent.specialization || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onToggleStatus(agent)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            (agent.isActive !== false)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              (agent.isActive !== false)
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className="ml-2 text-xs font-medium text-on-surface-variant">
                          {(agent.isActive !== false) ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => onEdit(agent)}
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg"
                            title="Edit Agent"
                          >
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            onClick={() => onDelete(agent)}
                            className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg"
                            title="Delete Agent"
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
                Showing {filteredAgents.length} of {agents.length} agents
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">
                  Active: {agents.filter(a => a.isActive !== false).length}
                </span>
                <span className="text-gray-500">
                  Inactive: {agents.filter(a => a.isActive === false).length}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AgentManagement;
