const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Client = require('./Client');

const Operation = sequelize.define('Operation', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  clientId: { 
    type: DataTypes.INTEGER, 
    references: { model: Client, key: 'id' },
    allowNull: false
  },
  serviceType: { type: DataTypes.STRING, allowNull: true },
  date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
  paid: { type: DataTypes.FLOAT, defaultValue: 0 },
  remaining: { type: DataTypes.FLOAT, defaultValue: 0 },
  feddans: { type: DataTypes.FLOAT, defaultValue: 0 },
  hours: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  hooks: {
    beforeValidate: (operation) => {
      operation.remaining = operation.price - operation.paid;
    }
  }
});

Client.hasMany(Operation, { foreignKey: 'clientId', onDelete: 'CASCADE' });
Operation.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = Operation;
