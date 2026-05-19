const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const email = 'member@urban.com';
    const password = 'password123';
    
    let member = await User.findOne({ email });
    
    if (member) {
      console.log('Member account exists. Resetting password...');
      member.password = password; // raw string to trigger pre-save hook
      member.role = 'user';
      await member.save();
    } else {
      console.log('Creating new member account...');
      member = await User.create({
        fullName: 'Standard Member',
        email: email,
        password: password, // will be hashed by pre-save
        phone: '+1 555-000-1234',
        role: 'user',
        status: 'verified',
        isActive: true
      });
    }
    
    // Verify password comparison works
    const isMatch = await member.comparePassword(password);
    console.log(`Password match after save? ${isMatch}`);
    
    if (isMatch) {
      console.log(`\nSUCCESS! \nEmail: ${email}\nPassword: ${password}\nRole: ${member.role}`);
    } else {
      console.log('\nFAILURE! Password comparison failed.');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
