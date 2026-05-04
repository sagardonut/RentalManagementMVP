/**
 * One-time script to fix users who were incorrectly registered as 'agency' role.
 * Updates users with role 'agency' who have no agents linked to them (i.e., they are
 * regular members, not actual agency companies) to role 'user'.
 */
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User.model');

async function fixUserRoles() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users with role 'agency'
    const agencyUsers = await User.find({ role: 'agency' }).select('fullName email role createdAt');
    console.log(`\nFound ${agencyUsers.length} users with role 'agency':`);
    agencyUsers.forEach(u => console.log(`  - ${u.fullName} (${u.email})`));

    // Find which of these actually have agents linked to them (real agencies)
    const realAgencyIds = await User.distinct('agencyId', { agencyId: { $ne: null } });
    
    // Users with role 'agency' who do NOT have any agents = wrongly assigned members
    const fakeAgencies = agencyUsers.filter(u => 
      !realAgencyIds.some(id => id.toString() === u._id.toString())
    );

    console.log(`\n${fakeAgencies.length} of these are regular members (no agents linked):`);
    fakeAgencies.forEach(u => console.log(`  - ${u.fullName} (${u.email}) -> will be changed to 'user'`));

    if (fakeAgencies.length > 0) {
      const fakeIds = fakeAgencies.map(u => u._id);
      const result = await User.updateMany(
        { _id: { $in: fakeIds } },
        { $set: { role: 'user' } }
      );
      console.log(`\n✅ Updated ${result.modifiedCount} users from 'agency' to 'user' role.`);
    } else {
      console.log('\nNo users need updating.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixUserRoles();
