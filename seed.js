require('dotenv').config();
const { sequelize } = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // Sync all models defined with the database
    await sequelize.sync();
    
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        name: 'مدير النظام',
        email: 'admin@farm.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin user created: admin@farm.com / password123');
    } else {
      console.log('Admin already exists.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
