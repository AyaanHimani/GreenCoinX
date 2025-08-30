const mongoose = require("mongoose");

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

const saleTenderRequest = mongoose.model("SaleTender", sellTenderSchema);

module.exports = { SellRequest };
