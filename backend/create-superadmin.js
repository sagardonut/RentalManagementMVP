const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email);
      return;
    }

    // Create super admin
    const superAdmin = await User.create({
      fullName: 'Super Admin',
      email: 'admin@urban.com',
      password: 'Admin123!',
      phone: '+977 9800000001',
      role: 'superadmin',
      hasPaidFee: true
    });

    console.log('✅ Super admin created successfully!');
    console.log('Email: admin@urban.com');
    console.log('Password: Admin123!');
    console.log('Role:', superAdmin.role);

  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createSuperAdmin();
