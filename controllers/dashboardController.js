const Client = require('../models/Client');

const getDashboardStats = async (req, res) => {
  try {
    const clients = await Client.findAll({ where: { userId: req.user.id } });
    
    let totalOwed = 0;
    let totalPaid = 0;
    let totalRemaining = 0;

    clients.forEach(client => {
      totalOwed += client.totalPrice;
      totalPaid += client.totalPaid;
      totalRemaining += client.remainingBalance;
    });

    res.json({
      totalOwed,
      totalPaid,
      totalRemaining,
      clientsCount: clients.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardStats };
