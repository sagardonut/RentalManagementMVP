const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { protect, agentOnly } = require('../middlewares/auth.middleware');

// Public
router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomById);

// Protected (agent must be logged in)
router.post('/', protect, agentOnly, roomController.createRoom);
router.put('/:id', protect, agentOnly, roomController.updateRoom);
router.delete('/:id', protect, agentOnly, roomController.deleteRoom);

module.exports = router;