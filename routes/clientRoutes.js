const express = require('express');
const router = express.Router();
const { getClients, getClientById, createClient, updateClient } = require('../controllers/clientController');
const { protect, admin, adminOrWorker } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getClients)
  .post(protect, admin, createClient);

router.route('/:id')
  .get(protect, getClientById)
  .put(protect, adminOrWorker, updateClient);

module.exports = router;
