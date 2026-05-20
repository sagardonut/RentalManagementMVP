const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ============ ROUTES ============
const authRoutes = require('./routes/auth.routes.js');
const roomRoutes = require('./routes/room.routes.js');
const bookingRoutes = require('./routes/booking.routes.js');
const chatRoutes = require('./routes/chat.routes.js');
const paymentRoutes = require('./routes/payment.routes');
const userRoutes = require('./routes/user.routes.js');

// ============ MODELS ============
const User = require('./models/User.model');
const Room = require('./models/Room.model');
const Booking = require('./models/Booking.model');

const app = express();
const PORT = process.env.PORT || 5001;

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: mongoose.connection.readyState === 1 ? 'OK' : 'ERROR',
    mongoConnection: states[mongoose.connection.readyState],
    databaseName: mongoose.connection.name || 'N/A'
  });
});

// ============ DEBUG: CREATE TEST USER ============
app.get('/debug-db', async (req, res) => {
  try {
    const testUser = await User.create({
      fullName: `Test_${Date.now()}`,
      email: `test_${Date.now()}@debug.com`,
      password: 'test123',
      phone: '0000000000',
      role: 'user'
    });

    res.json({
      success: true,
      message: 'User created',
      id: testUser._id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ DEBUG: VERIFY DB ============
app.get('/debug-verify', async (req, res) => {
  try {
    const users = await User.countDocuments();
    const rooms = await Room.countDocuments();
    const bookings = await Booking.countDocuments();

    res.json({
      connected: true,
      counts: { users, rooms, bookings }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ DEBUG: CLEAR TEST DATA ============
app.get('/debug-clear', async (req, res) => {
  try {
    const result = await User.deleteMany({
      email: { $regex: '@debug.com$' }
    });

    res.json({
      success: true,
      deleted: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);

// ============ BASE ROUTE ============
app.get('/', (req, res) => {
  res.json({
    message: 'Urban Sanctuary API Running',
    endpoints: [
      '/health',
      '/debug-db',
      '/debug-verify',
      '/api/auth',
      '/api/rooms',
      '/api/bookings',
      '/api/chat'
    ]
  });
});

// ============ DB CONNECTION ============
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI missing in .env');
    }

    console.log('Connecting to MongoDB...');

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB Connected');
    console.log('Database:', conn.connection.name);

    // counts
    console.log('Users:', await User.countDocuments());
    console.log('Rooms:', await Room.countDocuments());
    console.log('Bookings:', await Booking.countDocuments());

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ DB Connection Failed:', err.message);
    process.exit(1);
  }
};

connectDB();