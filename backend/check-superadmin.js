const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const checkSuperAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Find super admin
    const superAdmin = await User.findOne({ role: 'superadmin' });
    
    if (superAdmin) {
      console.log('✅ Super Admin Found:');
      console.log('Email:', superAdmin.email);
      console.log('Full Name:', superAdmin.fullName);
      console.log('Phone:', superAdmin.phone);
      console.log('Role:', superAdmin.role);
      console.log('Created:', superAdmin.createdAt);
      
      // Reset password to a known value
      superAdmin.password = 'Admin123!';
      await superAdmin.save();
      console.log('\n🔑 Password has been reset to: Admin123!');
      
    } else {
      console.log('❌ No super admin found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkSuperAdmin();
