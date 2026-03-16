const Operation = require('../models/Operation');
const recalculateClientTotals = require('../utils/calcClientTotals');

const getOperations = async (req, res) => {
  const operations = await Operation.findAll({ 
    where: { clientId: req.params.clientId, userId: req.user.id },
    order: [['date', 'DESC']]
  });
  
  const formatted = operations.map(op => ({ ...op.toJSON(), _id: op.id }));
  res.json(formatted);
};

const createOperation = async (req, res) => {
  const { client, serviceType, date, price, paid, feddans, hours } = req.body;

  const operation = await Operation.create({
    userId: req.user.id,
    clientId: client,
    serviceType,
    date: date || new Date(),
    price: price || 0,
    paid: paid || 0,
    feddans: feddans || 0,
    hours: hours || 0,
    remaining: (price || 0) - (paid || 0)
  });

  await recalculateClientTotals(client);

  const formatted = { ...operation.toJSON(), _id: operation.id };
  res.status(201).json(formatted);
};

const deleteOperation = async (req, res) => {
  const operation = await Operation.findOne({ 
    where: { id: req.params.id, userId: req.user.id } 
  });

  if (operation) {
    const clientId = operation.clientId;
    await operation.destroy();
    await recalculateClientTotals(clientId);
    res.json({ message: 'Operation removed' });
  } else {
    res.status(404).json({ message: 'Operation not found' });
  }
};

const updateOperation = async (req, res) => {
  const { serviceType, date, price, paid, feddans, hours } = req.body;

  const operation = await Operation.findOne({ 
    where: { id: req.params.id, userId: req.user.id } 
  });

  if (operation) {
    if (serviceType !== undefined) operation.serviceType = serviceType;
    if (date !== undefined) operation.date = date;
    if (price !== undefined) operation.price = price;
    if (paid !== undefined) operation.paid = paid;
    if (feddans !== undefined) operation.feddans = feddans;
    if (hours !== undefined) operation.hours = hours;
    
    operation.remaining = (operation.price || 0) - (operation.paid || 0);

    await operation.save();
    await recalculateClientTotals(operation.clientId);
    
    const formatted = { ...operation.toJSON(), _id: operation.id };
    res.json(formatted);
  } else {
    res.status(404).json({ message: 'Operation not found' });
  }
};

module.exports = { getOperations, createOperation, deleteOperation, updateOperation };
