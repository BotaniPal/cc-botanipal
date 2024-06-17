const transactionService = require("../services/transactionService");
const { successResponse, errorResponse } = require("../utils/responseUtils");
const admin = require("firebase-admin");

const createTransaction = async (req, res) => {
  try {
    const { uid_expert, uid_user, paymentNominal, paymentMethod, transactionProgress, timestamp } = req.body;

    // Validasi inputan
    if (
      typeof uid_expert !== 'string' ||
      typeof uid_user !== 'string' ||
      typeof paymentNominal !== 'number' ||
      typeof paymentMethod !== 'string' ||
      typeof transactionProgress !== 'string' ||
      typeof timestamp !== 'string'
    ) {
      return errorResponse(res, 400, 'Invalid data format');
    }
    
    const validStatuses = ['waiting for payment'];
    if (!validStatuses.includes(transactionProgress)) {
      return errorResponse(res, 400, 'Invalid transaction progress value. Only "waiting for payment" is allowed during creation.');
    }

    const userDoc = await admin.firestore().collection('users').doc(uid_user).get();
    const expertDoc = await admin.firestore().collection('experts').doc(uid_expert).get();

    if (!userDoc.exists) {
      return errorResponse(res, 404, 'User not found');
    }

    if (!expertDoc.exists) {
      return errorResponse(res, 404, 'Expert not found');
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
    
    successResponse(res, 201, 'Transaction created successfully', newTransaction); 
  } catch (error) {
    console.error('Error creating transaction:', error);
    if (error.status) { 
      errorResponse(res, error.status, error.message);
    } else {
      errorResponse(res, 500, 'Internal server error');
    }
  }
}

const getTransactionsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await transactionService.getTransactionsByUser(userId);
    successResponse(
      res,
      200,
      "Transactions retrieved successfully",
      transactions
    );
  } catch (error) {
    console.error("Error getting transactions:", error);
    errorResponse(res, 500, "Failed to get transactions for user");
  }
};

const getTransactionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.transactionid;
    const transaction = await transactionService.getTransactionById(
      transactionId,
      userId
    );
    successResponse(
      res,
      200,
      "Transaction retrieved successfully",
      transaction
    ); // Menggunakan successResponse
  } catch (error) {
    if (error.message === "Transaction not found") {
      errorResponse(res, 404, error.message);
    } else if (error.message === "Unauthorized access to transaction") {
      errorResponse(res, 403, error.message);
    } else {
      console.error("Error getting transaction:", error);
      errorResponse(res, 500, "Internal server error");
    }
  }
};

const updateTransactionProgress = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const newProgress = req.body.transactionProgress;
    const userId = req.user.id;

    if (!newProgress) {
      return res
        .status(400)
        .json({ error: "Missing transactionProgress field" });
    }

    const validStatuses = [
      "waiting for payment",
      "paid",
      "cancelled",
      "on process",
    ];
    if (!validStatuses.includes(newProgress)) {
      return res
        .status(400)
        .json({ error: "Invalid transaction progress value" });
    }

    const allowedFields = ["transactionProgress"];
    const invalidFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid fields: ${invalidFields.join(", ")}` });
    }

    const updatedTransaction = await transactionService.updateTransaction(
      transactionId,
      newProgress,
      userId
    );
    successResponse(
      res,
      200,
      "Transaction updated successfully",
      updatedTransaction
    ); // Menggunakan successResponse
  } catch (error) {
    if (error.message === "Transaction not found") {
      errorResponse(res, 404, error.message);
    } else if (error.message === "Unauthorized to update transaction") {
      errorResponse(res, 403, error.message);
    } else {
      console.error("Error updating transaction:", error);
      errorResponse(res, 500, "Internal server error");
    }
  }
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  updateTransactionProgress,
};
