const mongoose = require('mongoose');
const Room = require('./models/Room.model');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Migrating existing rooms to approved status...');
    const result = await Room.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'approved' } }
    );
    console.log(`Migration complete. Modified ${result.modifiedCount} rooms.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
