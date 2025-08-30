const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getBuyerTransactions,
  getProducerTransactions,
  createTransaction,
  confirmTransaction,
  getBuyerSummary,
  getProducerSummary
} = require("../controllers/transactionsController");

const { protect: verifyToken } = require("../middlewares/AuthMiddleware");

// Regulator / All
router.get("/", verifyToken, getAllTransactions);

// Buyer perspective
router.get("/buyer/:buyerName", verifyToken, getBuyerTransactions);
router.get("/buyer/:buyerName/summary", verifyToken, getBuyerSummary);

// Producer perspective
router.get("/producer/:producerName", verifyToken, getProducerTransactions);
router.get("/producer/:producerName/summary", verifyToken, getProducerSummary);

// Create + confirm
router.post("/", verifyToken, createTransaction);
router.put("/:id/confirm", verifyToken, confirmTransaction);

module.exports = router;
