const Operation = require('../models/Operation');
const Client = require('../models/Client');

const recalculateClientTotals = async (clientId) => {
  const operations = await Operation.findAll({ where: { clientId } });
  
  let totalPrice = 0;
  let totalPaid = 0;

  operations.forEach(op => {
    totalPrice += op.price;
    totalPaid += op.paid;
  });

  const remainingBalance = totalPrice - totalPaid;

  await Client.update({
    totalPrice,
    totalPaid,
    remainingBalance
  }, { where: { id: clientId } });
};

module.exports = recalculateClientTotals;
