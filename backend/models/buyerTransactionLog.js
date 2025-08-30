const mongoose = require("mongoose");

const buyerTransactionLogSchema = new mongoose.Schema({
  buyerName: String,
  producerName: String,
  greenCoins: Number,
  hydroQty: Number,
  txnHash: String,
  isConfirm: Boolean,
  createdAt: { type: Date, default: Date.now }
});

// CORRECTED: Renamed this variable to match what you are exporting.
const TransactionLog = mongoose.model("BuyerTransactionLog", buyerTransactionLogSchema);

// This now correctly exports the 'TransactionLog' model.
module.exports = { TransactionLog };