const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Public endpoints (no auth for testing)
router.get('/all', userController.getAllUsers);
router.get('/agents', userController.getAgents);
router.get('/agents-with-rooms', userController.getAgentsWithRooms);
router.get('/stats', userController.getStats);
router.get('/agencies', userController.getAgenciesManagement);

// CRUD operations for users/agents (no auth for testing)
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/status', userController.updateUserStatus);

module.exports = router;
