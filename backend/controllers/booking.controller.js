const Booking = require('../models/Booking.model');
const Room = require('../models/Room.model');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  console.log('hit createBooking');
  try {
    const { roomId, numRooms, paymentMethod, totalAmount } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user data missing' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      roomId,
      numRooms,
      paymentMethod,
      totalAmount,
      status: 'confirmed'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.placeholder = (req, res) => {
  res.json({ message: 'booking route working' });
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'fullName avatar email')
      .populate({
        path: 'roomId',
        select: 'title location agentId images pricePerMonth',
        populate: { path: 'agentId', select: 'fullName' }
      })
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'roomId',
        select: 'title location agentId images pricePerMonth',
        populate: { path: 'agentId', select: 'fullName avatar' }
      })
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};