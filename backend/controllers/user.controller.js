const User = require('../models/User.model');
const Room = require('../models/Room.model');

// GET /api/users/agents - all agents
exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents', error: error.message });
  }
};

// GET /api/users/agents-with-rooms - agents enriched with their room counts
exports.getAgentsWithRooms = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password').lean();

    // For each agent, count how many rooms they manage
    const enriched = await Promise.all(
      agents.map(async (agent) => {
        const roomCount = await Room.countDocuments({ agentId: agent._id });
        return { ...agent, roomCount };
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents with rooms', error: error.message });
  }
};

// GET /api/users/stats - dashboard summary counts
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalAgencies = await User.countDocuments({ role: 'agency' });
    const totalRooms = await Room.countDocuments({});
    
    // Calculate total revenue from confirmed bookings
    const Booking = require('../models/Booking.model');
    const bookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    res.status(200).json({ 
      totalUsers, 
      totalAgents, 
      totalAgencies, 
      totalRooms, 
      totalRevenue 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// GET /api/users/agencies - all agencies with agent and room counts
exports.getAgenciesManagement = async (req, res) => {
  try {
    const agencies = await User.find({ role: 'agency' }).select('-password').lean();

    const enriched = await Promise.all(
      agencies.map(async (agency) => {
        const agentCount = await User.countDocuments({ role: 'agent', agencyId: agency._id });
        const roomCount = await Room.countDocuments({ agentId: { 
          $in: [agency._id, ...(await User.find({ agencyId: agency._id }).select('_id'))] 
        }});
        return { ...agency, agentCount, roomCount };
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agencies', error: error.message });
  }
};

// PUT /api/users/:id - update user/agent details
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password from updates if it's empty
    if (updates.password === '') {
      delete updates.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// DELETE /api/users/:id - delete user/agent
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// PATCH /api/users/:id/status - update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: isActive },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};
