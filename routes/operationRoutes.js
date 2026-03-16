const express = require('express');
const router = express.Router();
const { getOperations, createOperation, deleteOperation, updateOperation } = require('../controllers/operationController');
const { protect, admin, adminOrWorker } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, adminOrWorker, createOperation);

router.route('/:id')
  .put(protect, adminOrWorker, updateOperation)
  .delete(protect, admin, deleteOperation);

router.get('/:clientId', protect, getOperations);

module.exports = router;
