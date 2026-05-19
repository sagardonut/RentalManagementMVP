const mongoose = require('mongoose');
const User = require('./models/User.model');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const email = 'admin@example.com';
    const password = 'password123';
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }
    
    console.log(`User found. Role: ${user.role}, Password Hash: ${user.password}`);
    
    const isMatch = await user.comparePassword(password);
    console.log(`Password match? ${isMatch}`);
    
    const isPlainMatch = password === user.password;
    if (isPlainMatch) {
      console.log('WARNING: Password is stored in plain text!');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
