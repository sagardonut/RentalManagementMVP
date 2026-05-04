const express = require('express');
const router = express.Router();
const { createBooking, placeholder, getAllBookings, getUserBookings } = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', placeholder);
router.get('/all', protect, getAllBookings);
router.get('/my-bookings', protect, getUserBookings);
router.post('/', protect, createBooking);

module.exports = router;