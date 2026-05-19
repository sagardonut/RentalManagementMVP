const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.model');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Check if agency@urban.com exists
    let agency = await User.findOne({ email: 'agency@urban.com' });
    
    if (agency) {
      console.log('Found existing agency@urban.com, updating password to password123...');
      agency.password = passwordHash;
      agency.role = 'agency'; // Ensure role is correct
      await agency.save();
    } else {
      console.log('Creating new agency@urban.com...');
      agency = await User.create({
        fullName: 'Test Agency',
        email: 'agency@urban.com',
        password: 'password123', // Pre-save hook hashes it if using .create, wait, let's use insert to avoid double hash if pre-save exists, but .create triggers pre-save.
        phone: '+977 980-0000000',
        role: 'agency'
      });
    }
    
    console.log('Done! You can now login with: agency@urban.com / password123');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
