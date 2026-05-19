const mongoose = require('mongoose');
const User = require('./models/User.model');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'agent@email.com'; // one of the agents
  const passwordsToTest = ['password123', 'Password123!', 'agent123', 'Agent123!'];
  
  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found!');
    process.exit(1);
  }

  console.log('Testing password for', email, 'hash:', user.password);
  for (const pwd of passwordsToTest) {
    const isMatch = await bcrypt.compare(pwd, user.password);
    console.log(`Password: ${pwd} -> Match: ${isMatch}`);
  }
  process.exit(0);
}
test();
