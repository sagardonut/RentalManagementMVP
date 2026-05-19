const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { protect, agentOnly } = require('../middlewares/auth.middleware');

// Public
router.get('/', roomController.getRooms);
router.get('/price-ranges', roomController.getPriceRanges);
// New Routes for Approval Workflow (Must come before /:id)
router.get('/admin/all', protect, agentOnly, roomController.getAllAdminRooms);
router.get('/agent/my-rooms', protect, agentOnly, roomController.getMyRooms);
router.get('/agency/pending', protect, agentOnly, roomController.getPendingRooms);
router.patch('/:id/status', protect, agentOnly, roomController.updateRoomStatus);

router.get('/:id', roomController.getRoomById);

// Protected (agent must be logged in)
router.post('/', protect, agentOnly, roomController.createRoom);
router.put('/:id', protect, agentOnly, roomController.updateRoom);
router.delete('/:id', protect, agentOnly, roomController.deleteRoom);


module.exports = router;