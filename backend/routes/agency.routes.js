const express = require('express');
const router = express.Router();
const { 
  getAgencies, 
  getAgencyById, 
  updateAgency, 
  deleteAgency, 
  getAgencyStats,
  bulkUpdateStatus 
} = require('../controllers/agency.controller');
const { protect } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all routes
router.use(protect);

// @route   GET /api/agencies
// @desc    Get all agencies with pagination, search, and filtering
// @access  Private (Admin/SuperAdmin)
router.get('/', getAgencies);

// @route   GET /api/agencies/stats
// @desc    Get agency statistics
// @access  Private (Admin/SuperAdmin)
router.get('/stats', getAgencyStats);

// @route   GET /api/agencies/:id
// @desc    Get single agency by ID
// @access  Private (Admin/SuperAdmin)
router.get('/:id', getAgencyById);

// @route   PUT /api/agencies/:id
// @desc    Update agency details
// @access  Private (Admin/SuperAdmin)
router.put('/:id', updateAgency);

// @route   PUT /api/agencies/bulk-status
// @desc    Bulk update agency status
// @access  Private (Admin/SuperAdmin)
router.put('/bulk-status', bulkUpdateStatus);

// @route   DELETE /api/agencies/:id
// @desc    Delete agency
// @access  Private (Admin/SuperAdmin)
router.delete('/:id', deleteAgency);

module.exports = router;
