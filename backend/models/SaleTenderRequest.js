const mongoose = require("mongoose");

// This is the correct variable name
const saleTenderSchema = new mongoose.Schema({
  producerName: String,
  hydrogenQty: Number,
  purity: Number,
  pricePerKg: Number,
  score: Number,
  proofOfTxn: String,
  status: { type: String, enum: ["pending", "sold"], default: "pending" },
  buyerName: String,
  createdAt: { type: Date, default: Date.now }
});

// 1. CORRECTED: Changed 'sellTenderSchema' to 'saleTenderSchema' to match the definition above.
// 2. CORRECTED: Changed the model variable name to 'SellRequest' to match the export.
const SellRequest = mongoose.model("SaleTender", saleTenderSchema);

// This now correctly exports the 'SellRequest' model.
module.exports = { SellRequest };