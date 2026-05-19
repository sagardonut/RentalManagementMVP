const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const users = await User.find({}, 'email role');
    console.log(users);
    process.exit(0);
  });
