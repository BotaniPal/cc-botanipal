const express = require('express');
const { check } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create Transaction Route
router.post('/create', [
  check('expertId', 'Expert ID is required').notEmpty(),
  check('sessionDuration', 'Session duration is required').notEmpty(),
], authMiddleware.verifyToken, transactionController.createTransaction);

// Transaction History Route
router.get('/history', authMiddleware.verifyToken, transactionController.transactionHistory);

module.exports = router;
