const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const fetchCredentials = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const roles = ['superadmin', 'agency', 'agent', 'user'];
    
    console.log("=========================================");
    console.log("       SYSTEM CREDENTIALS REPORT         ");
    console.log("=========================================\n");

    for (const role of roles) {
      console.log(`--- [ ROLE: ${role.toUpperCase()} ] ---`);
      const users = await User.find({ role }).select('email fullName role hasPaidFee status isActive password');
      
      if (users.length > 0) {
        users.forEach((u, i) => {
          console.log(`\nUser #${i + 1}`);
          console.log(`Name:     ${u.fullName}`);
          console.log(`Email:    ${u.email}`);
          console.log(`Status:   ${u.status} | Active: ${u.isActive}`);
          console.log(`Password: password123 (Default)`);
        });
        console.log('\n-----------------------------------------');
      } else {
        console.log(`No users found for role: ${role}`);
        console.log('-----------------------------------------');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

fetchCredentials();
