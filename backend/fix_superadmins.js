const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Fixing Super Admin accounts...');
    
    const adminEmails = ['admin@urbansanctuary.com', 'admin@example.com'];
    
    for (const email of adminEmails) {
      let admin = await User.findOne({ email });
      if (admin) {
        admin.password = 'password123';
        admin.role = 'superadmin';
        await admin.save();
        console.log(`✅ Updated existing super admin: ${email}`);
      } else {
        await User.create({
          fullName: 'System Admin',
          email: email,
          password: 'password123',
          phone: '+977 980-0000000',
          role: 'superadmin'
        });
        console.log(`✅ Created new super admin: ${email}`);
      }
    }
    
    console.log('Done! Both admins now have password "password123".');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
