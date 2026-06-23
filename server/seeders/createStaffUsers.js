// Creates (or updates) the Admin and Coordinator accounts without touching existing data.
// Run with: node seeders/createStaffUsers.js
require('dotenv').config({ override: false });
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

const STAFF_USERS = [
  {
    fullName: 'IIPA Admin',
    email: 'admin@iipajobs.co.in',
    password: 'Admin@2026',
    role: 'admin',
    location: 'Mumbai',
    nationality: 'Indian',
    approvalStatus: 'approved',
  },
  {
    fullName: 'IIPA Coordinator',
    email: 'coordinator@iipajobs.co.in',
    password: 'Coordinator@2026',
    role: 'coordinator',
    location: 'Mumbai',
    nationality: 'Indian',
    approvalStatus: 'approved',
  },
];

async function run() {
  await sequelize.sync(); // does NOT alter existing columns — see note below

  for (const u of STAFF_USERS) {
    const hashed = await bcrypt.hash(u.password, 10);
    const [user, created] = await User.findOrCreate({
      where: { email: u.email },
      defaults: { ...u, password: hashed },
    });
    if (!created) {
      await user.update({ role: u.role, password: hashed, approvalStatus: 'approved' });
      console.log(`Updated existing user: ${u.email} -> role=${u.role}`);
    } else {
      console.log(`Created user: ${u.email} -> role=${u.role}`);
    }
  }

  console.log('\nDone. Credentials:');
  STAFF_USERS.forEach(u => console.log(`  ${u.role}: ${u.email} / ${u.password}`));
  process.exit(0);
}

run().catch(err => { console.error('FAILED:', err.message); process.exit(1); });
