const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes.js');
const roomRoutes = require('./routes/room.routes.js');
const bookingRoutes = require('./routes/booking.routes.js');
const agencyRoutes = require('./routes/agency.routes.js');
const adminRoomRoutes = require('./routes/adminRoom.routes.js');
const User = require('./models/User.model');
const Room = require('./models/Room.model');
const Booking = require('./models/Booking.model');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// ============ DEBUG ROUTES ============
// Health check with connection status
app.get('/health', async (req, res) => {
  const connState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  
  res.json({
    status: connState === 1 ? 'OK' : 'ERROR',
    mongoConnection: states[connState],
    databaseName: mongoose.connection.name || 'N/A',
    mongoUri: process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'NOT SET'
  });
});

// Debug: Create test document to force DB creation
app.get('/debug-db', async (req, res) => {
  try {
    console.log('🔍 DEBUG: Testing database write operation...');
    
    // Create a test user with timestamp to verify uniqueness
    const testUser = await User.create({
      fullName: `Atlas_Test_${Date.now()}`,
      email: `test_${Date.now()}@debug.com`,
      password: 'testpass123',
      phone: '+977 9800000000',
      role: 'user'
    });
    
    console.log('✅ DEBUG: Test user created with ID:', testUser._id);
    
    res.json({ 
      success: true, 
      message: 'CONNECTED TO ATLAS - Data inserted successfully',
      databaseName: mongoose.connection.name,
      insertedId: testUser._id,
      insertedEmail: testUser.email,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ DEBUG: Database write failed:', err.message);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      databaseName: mongoose.connection.name || 'N/A'
    });
  }
});

// Debug: Verify data persistence by listing all test users
app.get('/debug-verify', async (req, res) => {
  try {
    const testUsers = await User.find({ email: { $regex: '@debug.com$' } }).select('-password');
    const allUsers = await User.countDocuments();
    const allRooms = await Room.countDocuments();
    const allBookings = await Booking.countDocuments();
    
    res.json({
      connected: true,
      databaseName: mongoose.connection.name,
      totalCounts: {
        users: allUsers,
        rooms: allRooms,
        bookings: allBookings
      },
      testUsersFound: testUsers.length,
      testUsers: testUsers.map(u => ({ id: u._id, email: u.email, createdAt: u.createdAt }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Debug: Clear all test data
app.get('/debug-clear', async (req, res) => {
  try {
    const result = await User.deleteMany({ email: { $regex: '@debug.com$' } });
    res.json({ 
      success: true, 
      deletedCount: result.deletedCount,
      message: 'Test users cleared'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ APP ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/admin/rooms', adminRoomRoutes);
app.use('/api/users', require('./routes/user.routes.js'));

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'The Urban Sanctuary API is running',
    database: mongoose.connection.name || 'Not connected',
    endpoints: {
      health: '/health',
      debugInsert: '/debug-db',
      debugVerify: '/debug-verify',
      debugClear: '/debug-clear'
    }
  });
});

// ============ DATABASE CONNECTION ============
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('❌ CRITICAL: MONGO_URI is not defined in environment variables.');
      console.error('   Set it in your .env file: MONGO_URI=mongodb+srv://username:password@cluster...');
      process.exit(1);
    }

    // Log connection attempt (with masked password)
    const maskedUri = mongoUri.replace(/:([^@]+)@/, ':****@');
    console.log('========================================');
    console.log('🔌 MONGO_URI found:', maskedUri);
    console.log('========================================');
    console.log('⏳ Attempting to connect to MongoDB Atlas...');

    const conn = await mongoose.connect(mongoUri);
    
    // Success logging
    console.log('========================================');
    console.log('✅ CONNECTED TO ATLAS SUCCESSFULLY!');
    console.log('📁 Database Name:', conn.connection.name);
    console.log('🔌 Host:', conn.connection.host);
    console.log('========================================');

    // Log document counts
    const roomCount = await Room.countDocuments();
    const userCount = await User.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    console.log('📊 Current Database Status:');
    console.log('   - Users:', userCount);
    console.log('   - Rooms:', roomCount);
    console.log('   - Bookings:', bookingCount);
    console.log('========================================');
    console.log('🧪 Test the connection:');
    console.log('   GET http://localhost:' + PORT + '/debug-db');
    console.log('   GET http://localhost:' + PORT + '/debug-verify');
    console.log('========================================');

    app.listen(PORT, () => {
      console.log('🚀 Server running on port', PORT);
    });
  } catch (err) {
    console.error('❌ FAILED TO CONNECT TO MONGODB ATLAS');
    console.error('   Error:', err.message);
    console.error('========================================');
    process.exit(1);
  }
};

connectDB();
