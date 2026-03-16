const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Client = sequelize.define('Client', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  location: { type: DataTypes.STRING, allowNull: true },
  totalPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalPaid: { type: DataTypes.FLOAT, defaultValue: 0 },
  remainingBalance: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = Client;
