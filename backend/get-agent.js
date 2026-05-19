const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config({ path: './.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const agents = await User.find({ role: 'agent' });
  console.log(JSON.stringify(agents, null, 2));
  process.exit(0);
}
run();
