const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public endpoints (or filtered by query params)
router.get('/agents', userController.getAgents);
router.get('/agents-with-rooms', userController.getAgentsWithRooms);
router.get('/stats', userController.getStats);
router.get('/agencies', userController.getAgenciesManagement);

// CRUD operations for users/agents (Protected)
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);
router.patch('/:id/status', protect, userController.updateUserStatus);

module.exports = router;
