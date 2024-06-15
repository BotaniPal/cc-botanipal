const transactionService = require('../services/transactionService');

const createTransaction = async (req, res) => {
  try {
    const { uid_expert, uid_user, paymentNominal, paymentMethod, transactionProgress, timestamp } = req.body;

    if (
      typeof uid_expert !== 'string' ||
      typeof uid_user !== 'string' ||
      typeof paymentNominal !== 'number' ||
      typeof paymentMethod !== 'string' ||
      typeof transactionProgress !== 'string' ||
      typeof timestamp !== 'string'
    ) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const transactionData = {
      uid_expert,
      uid_user,
      paymentNominal,
      paymentMethod,
      transactionProgress,
      timestamp
    };

    const newTransaction = await transactionService.createTransaction(transactionData);
    res.json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTransactionsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await transactionService.getTransactionsByUser(userId);
    res.json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.transactionid;
    const transaction = await transactionService.getTransactionById(transactionId, userId);
    res.json(transaction);
  } catch (error) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({ error: error.message });
    } else if (error.message === 'Unauthorized access to transaction') {
      return res.status(403).json({ error: error.message });
    } else {
      console.error('Error getting transaction:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const updateTransactionProgress = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const newProgress = req.body.transactionProgress;
    const userId = req.user.id;

    if (!newProgress) {
      return res.status(400).json({ error: 'Missing transactionProgress field' });
    }

    const validStatuses = ['waiting for payment', 'paid', 'cancelled', 'on process'];
    if (!validStatuses.includes(newProgress)) {
      return res.status(400).json({ error: 'Invalid transaction progress value' });
    }

    const allowedFields = ['transactionProgress'];
    const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    const updatedTransaction = await transactionService.updateTransaction(transactionId, newProgress, userId); 
    res.json(updatedTransaction);
  } catch (error) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({ error: error.message });
    } else if (error.message === 'Unauthorized to update transaction') {
      return res.status(403).json({ error: error.message });
    } else {
      console.error('Error updating transaction:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  updateTransactionProgress,
}; 
