const express = require('express');
const router = express.Router();
const { register, login, getProfile, updatePaymentStatus } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/payment-status', protect, updatePaymentStatus);

module.exports = router;