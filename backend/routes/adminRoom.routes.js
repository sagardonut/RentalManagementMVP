const express = require('express');
const router = express.Router();
const adminRoomController = require('../controllers/adminRoom.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// All admin room routes require authentication + admin role
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/rooms
// @desc    Get all rooms (admin view with full data)
// @access  Private (Admin/SuperAdmin)
router.get('/', adminRoomController.getAllRooms);

// @route   GET /api/admin/rooms/:id
// @desc    Get single room by ID
// @access  Private (Admin/SuperAdmin)
router.get('/:id', adminRoomController.getRoomById);

// @route   POST /api/admin/rooms
// @desc    Create new room (no agent ownership restriction)
// @access  Private (Admin/SuperAdmin)
router.post('/', adminRoomController.createRoom);

// @route   PUT /api/admin/rooms/:id
// @desc    Update any room
// @access  Private (Admin/SuperAdmin)
router.put('/:id', adminRoomController.updateRoom);

// @route   PUT /api/admin/rooms/:id/verify
// @desc    Verify/unverify a room
// @access  Private (Admin/SuperAdmin)
router.put('/:id/verify', adminRoomController.verifyRoom);

// @route   DELETE /api/admin/rooms/:id
// @desc    Delete any room
// @access  Private (Admin/SuperAdmin)
router.delete('/:id', adminRoomController.deleteRoom);

module.exports = router;
