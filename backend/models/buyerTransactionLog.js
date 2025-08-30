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

const buyerTransactionLog = mongoose.model("BuyerTransactionLog", buyerTransactionLogSchema);
module.exports = { TransactionLog };