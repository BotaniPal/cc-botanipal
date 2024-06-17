const admin = require("firebase-admin");
const db = admin.firestore();

class TransactionError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function createTransaction(transactionData) {
  try {
    const transactionRef = await db.collection("transactions").add(transactionData);
    const transactionDoc = await transactionRef.get(); 

    return { id: transactionDoc.id, ...transactionDoc.data() };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new TransactionError(error.message || "Failed to create transaction", 500);
  }
}

async function getTransactionsByUser(userId) {
  const userTransactionsQuery = db
    .collection("transactions")
    .where("uid_user", "==", userId);
  const expertTransactionsQuery = db
    .collection("transactions")
    .where("uid_expert", "==", userId);

  const [userTransactionsSnapshot, expertTransactionsSnapshot] =
    await Promise.all([
      userTransactionsQuery.get(),
      expertTransactionsQuery.get(),
    ]);

  const transactions = [];
  userTransactionsSnapshot.forEach((doc) =>
    transactions.push({ id: doc.id, ...doc.data() })
  );
  expertTransactionsSnapshot.forEach((doc) =>
    transactions.push({ id: doc.id, ...doc.data() })
  );

  return transactions;
}

async function getTransactionById(transactionId, userId) {
  const transactionDoc = await db
    .collection("transactions")
    .doc(transactionId)
    .get();
  if (!transactionDoc.exists) {
    throw new Error("Transaction not found");
  }

  const transactionData = transactionDoc.data();
  if (
    transactionData.uid_user !== userId &&
    transactionData.uid_expert !== userId
  ) {
    throw new Error("Unauthorized access to transaction");
  }
  return { id: transactionDoc.id, ...transactionData };
}

async function updateTransaction(transactionId, newProgress, userId) {
  try {
    const transactionRef = db.collection("transactions").doc(transactionId);
    const transactionDoc = await transactionRef.get();

    if (!transactionDoc.exists) {
      throw new Error("Transaction not found");
    }

    const transactionData = transactionDoc.data();

    if (
      transactionData.uid_user !== userId &&
      transactionData.uid_expert !== userId
    ) {
      throw new Error("Unauthorized to update transaction");
    }

    await transactionRef.update({ transactionProgress: newProgress });

    return {
      id: transactionId,
      ...transactionData,
      transactionProgress: newProgress,
    };
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

module.exports = {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  updateTransaction,
};
