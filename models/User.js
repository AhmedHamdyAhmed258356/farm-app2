const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'worker', 'accountant'), defaultValue: 'worker' }
}, {
    hooks: {
          beforeCreate: async (user) => {
                  const salt = await bcrypt.genSalt(10);
                  user.password = await bcrypt.hash(user.password, salt);
          },
          beforeUpdate: async (user) => {
                  if (user.changed('password')) {
                            const salt = await bcrypt.genSalt(10);
                            user.password = await bcrypt.hash(user.password, salt);
                  }
          }
    }
});

User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
