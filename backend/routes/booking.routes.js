const express = require('express');
const router = express.Router();
const { createBooking, placeholder, getAllBookings, getUserBookings, cancelBooking } = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', placeholder);
router.get('/all', protect, getAllBookings);
router.get('/my-bookings', protect, getUserBookings);
router.post('/', protect, createBooking);
router.delete('/:id', protect, cancelBooking);

module.exports = router;