const Room = require('../models/Room.model');
const Booking = require('../models/Booking.model');

/*
=================================================
📦 DATABASE TOOLS LAYER (SAFE AI ACCESS ONLY)
=================================================

This file acts as a controlled bridge between:
AI (Groq) → Backend → MongoDB

RULES:
- NO req/res here
- NO AI logic here
- ONLY database queries
=================================================
*/

/**
 * 🔎 Search available rooms with filters
 * @param {Object} filters
 * @param {number|null} filters.priceMax
 * @param {number|null} filters.guests
 */
const searchRooms = async ({ priceMax, guests }) => {
  const query = {};

  if (priceMax !== undefined && priceMax !== null) {
    query.price = { $lte: priceMax };
  }

  if (guests !== undefined && guests !== null) {
    query.capacity = { $gte: guests };
  }

  const rooms = await Room.find(query)
    .limit(10)
    .sort({ createdAt: -1 });

  return rooms;
};

/**
 * 📦 Get bookings for a specific user
 * @param {string} userId
 */
const getUserBookings = async (userId) => {
  if (!userId) return [];

  const bookings = await Booking.find({ user: userId })
    .populate('room')
    .sort({ createdAt: -1 });

  return bookings;
};

/**
 * 🔍 Get single room by ID
 * (useful for AI booking flow later)
 */
const getRoomById = async (roomId) => {
  if (!roomId) return null;

  return await Room.findById(roomId);
};

/**
 * 📊 Count available rooms (optional analytics)
 */
const countRooms = async () => {
  return await Room.countDocuments();
};

/**
 * 📊 Count user bookings
 */
const countUserBookings = async (userId) => {
  if (!userId) return 0;

  return await Booking.countDocuments({ user: userId });
};

/**
 * 🧹 OPTIONAL: future AI booking helper (not used yet)
 * (reserved for "AI booking automation feature")
 */
const createBooking = async ({ userId, roomId, date }) => {
  if (!userId || !roomId) return null;

  const booking = await Booking.create({
    user: userId,
    room: roomId,
    date: date || new Date(),
  });

  return booking;
};

module.exports = {
  searchRooms,
  getUserBookings,
  getRoomById,
  countRooms,
  countUserBookings,

  // reserved for future AI automation
  createBooking,
};