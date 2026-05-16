const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const checkSuperAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    const superAdmin = await User.findOne({ role: 'superadmin' });

    if (!superAdmin) {
      console.log('❌ No super admin found');
      return;
    }

    console.log('✅ Super Admin Found:');
    console.log('Email:', superAdmin.email);
    console.log('Name:', superAdmin.fullName);

    superAdmin.password = 'Admin123!';
    await superAdmin.save();

    console.log('🔑 Password reset to: Admin123!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

checkSuperAdmin();