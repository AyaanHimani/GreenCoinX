const mongoose = require("mongoose");

const sellRequestSchema = new mongoose.Schema({
  producerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hydrogenQty: Number,
  price: Number,
  score: Number,
  proofDoc: String,
  status: { type: String, enum: ["pending", "sold"], default: "pending" },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  txnHash: String,
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", default: null }, // ✅ new link
  createdAt: { type: Date, default: Date.now }
});


const SellRequest = mongoose.model("SellRequest", sellRequestSchema);

module.exports = { SellRequest };
