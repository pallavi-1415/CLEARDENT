const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cleardent.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'ClearDent Admin';

    // Look for any admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isApproved: true,
        dob: new Date('1990-01-01')
      });
      console.log('✅ Admin user seeded successfully:', adminEmail);
    } else {
      console.log('ℹ️ Admin user already exists.');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
};

module.exports = { seedAdmin };
