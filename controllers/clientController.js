const { Op } = require('sequelize');
const Client = require('../models/Client');

const getClients = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        userId: req.user.id,
        [Op.or]: [
          { name: { [Op.like]: `%${req.query.keyword}%` } },
          { phone: { [Op.like]: `%${req.query.keyword}%` } },
        ],
      }
    : { userId: req.user.id };

  const clients = await Client.findAll({
    where: keyword,
    order: [['createdAt', 'DESC']],
  });
  
  // Format for frontend
  const formattedClients = clients.map(client => ({
    ...client.toJSON(),
    _id: client.id
  }));

  res.json(formattedClients);
};

const getClientById = async (req, res) => {
  const client = await Client.findOne({ 
    where: { id: req.params.id, userId: req.user.id } 
  });
  if (client) {
    const formatted = { ...client.toJSON(), _id: client.id };
    res.json(formatted);
  } else {
    res.status(404).json({ message: 'Client not found' });
  }
};

const createClient = async (req, res) => {
  const { name, phone, location } = req.body;

  const clientExists = await Client.findOne({ 
    where: { phone, userId: req.user.id } 
  });
  if (clientExists && phone) { // Only check if phone is provided
    return res.status(400).json({ message: 'الزبون موجود بالفعل بهذا الرقم' });
  }

  const client = await Client.create({
    userId: req.user.id,
    name,
    phone,
    location,
  });

  const formatted = { ...client.toJSON(), _id: client.id };
  res.status(201).json(formatted);
};

const updateClient = async (req, res) => {
  const { name, phone, location } = req.body;

  const client = await Client.findOne({ 
    where: { id: req.params.id, userId: req.user.id } 
  });

  if (client) {
    client.name = name || client.name;
    client.phone = phone || client.phone;
    client.location = location || client.location;

    await client.save();
    const formatted = { ...client.toJSON(), _id: client.id };
    res.json(formatted);
  } else {
    res.status(404).json({ message: 'Client not found' });
  }
};

module.exports = { getClients, getClientById, createClient, updateClient };
