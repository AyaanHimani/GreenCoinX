import mongoose from "mongoose";

const transactionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["credit", "debit"], required: true }, // add / subtract
  points: Number,                 // score/coins added or removed
  reason: String,                 // e.g. "GreenCoins Minted", "Sold to Tata Steel"
  relatedTxn: { type: mongoose.Schema.Types.ObjectId, ref: "SellRequest", default: null },
  balanceAfter: Number,           // running balance after this txn
  createdAt: { type: Date, default: Date.now }
});

export const TransactionLog = mongoose.model("TransactionLog", transactionLogSchema);
