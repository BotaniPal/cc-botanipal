const admin = require('firebase-admin');
const { validationResult } = require('express-validator');
const midtransClient = require('midtrans-client');

// Midtrans configuration
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;

// Initialize Midtrans Client
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

// Create Transaction
exports.createTransaction = async (req, res) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { expertId, sessionDuration } = req.body;
  const userId = req.user.id;

  try {
    const expertRef = admin.firestore().collection('users').doc(expertId);
    const expertDoc = await expertRef.get();

    if (!expertDoc.exists || expertDoc.data().role !== 'expert') {
      return res.status(404).json({ message: 'Expert not found' });
    }

    const expert = expertDoc.data();
    const transactionDetails = {
      order_id: `order-${Date.now()}`,
      gross_amount: expert.pricePerSession * sessionDuration * 1.1, // 10% service fee
    };

    const customerDetails = {
      first_name: req.user.username,
      email: req.user.email,
    };

    const parameter = {
      transaction_details: transactionDetails,
      customer_details: customerDetails,
    };

    snap.createTransaction(parameter)
      .then((transaction) => {
        const transactionToken = transaction.token;
        res.json({ token: transactionToken });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Error creating transaction', error: error.message });
      });
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

// Transaction History
exports.transactionHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactionsRef = admin.firestore().collection('transactions').where('userId', '==', userId);
    const transactionsSnapshot = await transactionsRef.get();

    if (transactionsSnapshot.empty) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    const transactions = [];
    transactionsSnapshot.forEach(doc => transactions.push(doc.data()));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transactions', error: error.message });
  }
};
