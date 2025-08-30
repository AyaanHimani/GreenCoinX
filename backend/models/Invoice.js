import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  producerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "SellRequest" },
  hydrogenQty: Number,
  price: Number,
  totalAmount: Number,
  txnHash: String,
  createdAt: { type: Date, default: Date.now }
});

export const Invoice = mongoose.model("Invoice", invoiceSchema);
