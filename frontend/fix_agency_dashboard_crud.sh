#!/bin/bash
cd /Users/kabulmobilellc/Downloads/RentalManagementMVP-main/frontend || exit 1

# 1. Replace the state variables
cat << 'INNER_EOF' > temp_state.jsx
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };
INNER_EOF
sed -i.bak '85,86c\
'"$(cat temp_state.jsx | sed -e 's/[\/&]/\\&/g' -e 's/$/\\/')"$'\n' src/pages/AgencyDashboard.jsx

# 2. Replace the CRUD functions
cat << 'INNER_EOF' > temp_crud.jsx
  const handleAddAgent = async (e) => {
    if (e) e.preventDefault();
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : null;

      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...agentForm,
          role: "agent",
        }),
      });

      if (response.ok) {
        const newAgent = await response.json();
        if (newAgent && newAgent.user) {
          setAgents([newAgent.user, ...agents]);
        } else if (newAgent && newAgent._id) {
          setAgents([newAgent, ...agents]);
        }
        setShowAgentModal(false);
        setAgentForm({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          specialization: "",
        });
        triggerToast("Agent created successfully");
        fetchAll(); // Background refresh
      } else {
        const error = await response.json();
        triggerToast(error.message || "Failed to create agent", "error");
      }
    } catch (error) {
      triggerToast("Failed to create agent. Please try again.", "error");
    }
  };

  const handleUpdateAgent = async (e) => {
    if (e) e.preventDefault();
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : null;

      const response = await fetch(`${API}/users/${editingAgent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(agentForm),
      });

      if (response.ok) {
        const updatedData = await response.json();
        const updatedAgent = updatedData.user || updatedData;
        setAgents(
          agents.map((agent) =>
            agent._id === editingAgent._id ? { ...agent, ...updatedAgent } : agent,
          ),
        );
        setShowEditModal(false);
        setEditingAgent(null);
        setAgentForm({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          specialization: "",
        });
        triggerToast("Agent updated successfully");
      } else {
        const error = await response.json();
        triggerToast(error.message || "Failed to update agent", "error");
      }
    } catch (error) {
      triggerToast("Failed to update agent. Please try again.", "error");
    }
  };

  const handleDeleteAgent = async () => {
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : null;

      const response = await fetch(`${API}/users/${agentToDelete._id}`, {
        method: "DELETE",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(agents.filter((agent) => agent._id !== agentToDelete._id));
        setShowDeleteModal(false);
        setAgentToDelete(null);
        triggerToast(data.message || "Agent deleted successfully");
      } else {
        const error = await response.json();
        triggerToast(error.message || "Failed to delete agent", "error");
      }
    } catch (error) {
      triggerToast("Failed to delete agent. Please try again.", "error");
    }
  };

  const openEditModal = (agent) => {
    setEditingAgent(agent);
    setAgentForm({
      fullName: agent.fullName,
      email: agent.email,
      phone: agent.phone,
      password: "",
      specialization: agent.specialization || "",
    });
    setShowEditModal(true);
  };

  const handleToggleAgentStatus = async (agent) => {
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : null;

      const newIsActive =
        agent.isActive === undefined ? false : !agent.isActive;

      const response = await fetch(`${API}/users/${agent._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ isActive: newIsActive }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        const updatedAgent = updatedData.user || updatedData;
        setAgents(agents.map((a) => (a._id === agent._id ? { ...a, ...updatedAgent } : a)));
        triggerToast(`Agent status updated to ${newIsActive ? 'Active' : 'Inactive'}`);
      } else {
        const error = await response.json();
        triggerToast(error.message || "Failed to update agent status", "error");
      }
    } catch (error) {
      triggerToast("Failed to update agent status. Please try again.", "error");
    }
  };
INNER_EOF
sed -i.bak '151,325c\
'"$(cat temp_crud.jsx | sed -e 's/[\/&]/\\&/g' -e 's/$/\\/')"$'\n' src/pages/AgencyDashboard.jsx

# 3. Add Toast UI component after the root div (which should be around line 324 after state and before return)
# Wait, let's find the `return (` that returns the main layout.
# It is around line 317 in the original file.
# After replacement, lines shifted. We can find the exact match for the main wrapper.

cat << 'INNER_EOF' > temp_toast.jsx
    <div className="bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 flex min-h-screen">
      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in-down ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>
          <span className="material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}
INNER_EOF

# Replace the single line of the main wrapper with the wrapper AND the toast.
sed -i.bak 's/<div className="bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 flex min-h-screen">/'"$(cat temp_toast.jsx | tr '\n' '\r' | sed -e 's/[\/&]/\\&/g' | sed -e 's/\r/\\n/g')"'/g' src/pages/AgencyDashboard.jsx

rm temp_state.jsx temp_crud.jsx temp_toast.jsx
