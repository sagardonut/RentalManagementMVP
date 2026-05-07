const User = require('../models/User.model');

// @desc    Get all agencies
// @route   GET /api/agencies
// @access  Private (Admin/SuperAdmin)
exports.getAgencies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';

    // Build query
    const query = { role: 'agency' };
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && ['verified', 'pending'].includes(status)) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const agencies = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      agencies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get agencies error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch agencies',
      error: error.message 
    });
  }
};

// @desc    Get single agency
// @route   GET /api/agencies/:id
// @access  Private (Admin/SuperAdmin)
exports.getAgencyById = async (req, res) => {
  try {
    const agency = await User.findOne({ 
      _id: req.params.id, 
      role: 'agency' 
    }).select('-password');

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    res.status(200).json(agency);
  } catch (error) {
    console.error('Get agency error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch agency',
      error: error.message 
    });
  }
};

// @desc    Update agency
// @route   PUT /api/agencies/:id
// @access  Private (Admin/SuperAdmin)
exports.updateAgency = async (req, res) => {
  try {
    const { fullName, email, phone, avatar, status, isActive } = req.body;

    // Check if agency exists
    const agency = await User.findOne({ 
      _id: req.params.id, 
      role: 'agency' 
    });

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== agency.email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (status && ['verified', 'pending'].includes(status)) updateData.status = status;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedAgency = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'Agency updated successfully',
      agency: updatedAgency
    });
  } catch (error) {
    console.error('Update agency error:', error);
    res.status(500).json({ 
      message: 'Failed to update agency',
      error: error.message 
    });
  }
};

// @desc    Delete agency
// @route   DELETE /api/agencies/:id
// @access  Private (Admin/SuperAdmin)
exports.deleteAgency = async (req, res) => {
  try {
    const agency = await User.findOne({ 
      _id: req.params.id, 
      role: 'agency' 
    });

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    // Check if agency has associated agents
    const associatedAgents = await User.countDocuments({ 
      agencyId: req.params.id,
      role: 'agent'
    });

    if (associatedAgents > 0) {
      return res.status(400).json({ 
        message: `Cannot delete agency. ${associatedAgents} agent(s) are associated with this agency. Please reassign or remove agents first.` 
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      message: 'Agency deleted successfully',
      agencyId: req.params.id
    });
  } catch (error) {
    console.error('Delete agency error:', error);
    res.status(500).json({ 
      message: 'Failed to delete agency',
      error: error.message 
    });
  }
};

// @desc    Get agency statistics
// @route   GET /api/agencies/stats
// @access  Private (Admin/SuperAdmin)
exports.getAgencyStats = async (req, res) => {
  try {
    const totalAgencies = await User.countDocuments({ role: 'agency' });
    const verifiedAgencies = await User.countDocuments({ 
      role: 'agency', 
      status: 'verified' 
    });
    const pendingAgencies = await User.countDocuments({ 
      role: 'agency', 
      status: 'pending' 
    });
    const activeAgencies = await User.countDocuments({ 
      role: 'agency', 
      isActive: true 
    });

    res.status(200).json({
      total: totalAgencies,
      verified: verifiedAgencies,
      pending: pendingAgencies,
      active: activeAgencies,
      inactive: totalAgencies - activeAgencies
    });
  } catch (error) {
    console.error('Get agency stats error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch agency statistics',
      error: error.message 
    });
  }
};

// @desc    Bulk update agency status
// @route   PUT /api/agencies/bulk-status
// @access  Private (Admin/SuperAdmin)
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { agencyIds, status } = req.body;

    if (!agencyIds || !Array.isArray(agencyIds) || agencyIds.length === 0) {
      return res.status(400).json({ message: 'Agency IDs array is required' });
    }

    if (!['verified', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be verified or pending' });
    }

    const result = await User.updateMany(
      { 
        _id: { $in: agencyIds },
        role: 'agency'
      },
      { status: status }
    );

    res.status(200).json({
      message: `Successfully updated ${result.modifiedCount} agencies to ${status}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update status error:', error);
    res.status(500).json({ 
      message: 'Failed to bulk update agency status',
      error: error.message 
    });
  }
};
