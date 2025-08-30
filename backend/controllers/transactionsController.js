const { TransactionLog } = require("../models/buyerTransactionLog");

/**
 * @desc Get all transactions (regulator view / admin)
 * @route GET /api/transactions
 */
const getAllTransactions = async (req, res) => {
  try {
    const logs = await TransactionLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions", error: err });
  }
};

/**
 * @desc Get transactions for a specific buyer
 * @route GET /api/transactions/buyer/:buyerName
 */
const getBuyerTransactions = async (req, res) => {
  try {
    const { buyerName } = req.params;
    const logs = await TransactionLog.find({ buyerName }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buyer transactions", error: err });
  }
};

/**
 * @desc Get transactions for a specific producer
 * @route GET /api/transactions/producer/:producerName
 */
const getProducerTransactions = async (req, res) => {
  try {
    const { producerName } = req.params;
    const logs = await TransactionLog.find({ producerName }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching producer transactions", error: err });
  }
};

/**
 * @desc Create new transaction log
 * @route POST /api/transactions
 */
const createTransaction = async (req, res) => {
  try {
    const { buyerName, producerName, greenCoins, hydroQty, txnHash } = req.body;

    const newLog = new TransactionLog({
      buyerName,
      producerName,
      greenCoins,
      hydroQty,
      txnHash,
      isConfirm: false
    });

    await newLog.save();
    res.status(201).json({ message: "Transaction logged successfully", transaction: newLog });
  } catch (err) {
    res.status(500).json({ message: "Error creating transaction", error: err });
  }
};

/**
 * @desc Confirm transaction (simulates blockchain confirmation)
 * @route PUT /api/transactions/:id/confirm
 */
const confirmTransaction = async (req, res) => {
  try {
    const transaction = await TransactionLog.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    transaction.isConfirm = true;
    await transaction.save();

    res.json({ message: "Transaction confirmed", transaction });
  } catch (err) {
    res.status(500).json({ message: "Error confirming transaction", error: err });
  }
};

/**
 * @desc Get summary stats for a buyer (total purchased, total coins, etc.)
 * @route GET /api/transactions/buyer/:buyerName/summary
 */
const getBuyerSummary = async (req, res) => {
  try {
    const { buyerName } = req.params;
    const logs = await TransactionLog.find({ buyerName });

    const summary = {
      totalTransactions: logs.length,
      totalHydrogenPurchased: logs.reduce((sum, log) => sum + log.hydroQty, 0),
      totalGreenCoins: logs.reduce((sum, log) => sum + log.greenCoins, 0),
      confirmed: logs.filter(log => log.isConfirm).length
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buyer summary", error: err });
  }
};

/**
 * @desc Get summary stats for a producer (total sold, coins minted, etc.)
 * @route GET /api/transactions/producer/:producerName/summary
 */
const getProducerSummary = async (req, res) => {
  try {
    const { producerName } = req.params;
    const logs = await TransactionLog.find({ producerName });

    const summary = {
      totalTransactions: logs.length,
      totalHydrogenSold: logs.reduce((sum, log) => sum + log.hydroQty, 0),
      totalGreenCoins: logs.reduce((sum, log) => sum + log.greenCoins, 0),
      confirmed: logs.filter(log => log.isConfirm).length
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Error fetching producer summary", error: err });
  }
};

module.exports = {
  getAllTransactions,
  getBuyerTransactions,
  getProducerTransactions,
  createTransaction,
  confirmTransaction,
  getBuyerSummary,
  getProducerSummary
};
