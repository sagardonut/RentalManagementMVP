const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { initiateEsewa, verifyEsewa, initiateKhalti, verifyKhalti } = require('../controllers/payment.controller');

router.post('/esewa/initiate', protect, initiateEsewa);
router.post('/esewa/verify', protect, verifyEsewa);
router.post('/khalti/initiate', protect, initiateKhalti);
router.post('/khalti/verify', protect, verifyKhalti);

module.exports = router;
