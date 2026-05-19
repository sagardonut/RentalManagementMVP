const mongoose = require('mongoose');
const User = require('./models/User.model');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOne({ email: 'agency@urban.com' });
    console.log('User found in DB:', !!user);
    if (user) {
      console.log('Stored hash:', user.password);
      const isMatch = await user.comparePassword('password123');
      console.log('Match with password123:', isMatch);
      
      // Let's fix it properly!
      if (!isMatch) {
        console.log('Fixing the double-hashing issue...');
        user.password = 'password123'; // Pass raw password, pre-save will hash it ONCE
        await user.save();
        console.log('Fixed! Trying again...');
        const isMatch2 = await user.comparePassword('password123');
        console.log('Match after fix:', isMatch2);
      }
    }
    process.exit(0);
  });
