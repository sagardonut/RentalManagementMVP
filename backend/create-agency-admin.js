const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const createAgencyAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Remove existing agency admins to ensure only one
    await User.deleteMany({ role: 'agency' });
    console.log('Removed existing agency admins');

    // Create single hardcoded agency admin
    const agencyAdmin = await User.create({
      fullName: 'Agency Administrator',
      email: 'agency@urban.com',
      password: 'Agency123!',
      phone: '+977 9800000002',
      role: 'agency',
      hasPaidFee: true
    });

    console.log('✅ Agency Admin created successfully!');
    console.log('Email: agency@urban.com');
    console.log('Password: Agency123!');
    console.log('Role:', agencyAdmin.role);

  } catch (error) {
    console.error('Error creating agency admin:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createAgencyAdmin();
