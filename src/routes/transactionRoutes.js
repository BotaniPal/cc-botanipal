const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/users/:userid/transactions",
  authMiddleware,
  transactionController.getTransactionsByUser
);
router.get(
  "/:transactionid",
  authMiddleware,
  transactionController.getTransactionById
);
router.post("/", authMiddleware, transactionController.createTransaction);
router.put(
  "/:transactionId",
  authMiddleware,
  transactionController.updateTransactionProgress
);

module.exports = router;
