const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });

    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email);
      return;
    }

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
    console.error('Error creating super admin:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createSuperAdmin();