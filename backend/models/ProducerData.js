const mongoose = require("mongoose");

const producerDataSchema = new mongoose.Schema({
  producerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hydrogenQty: Number,
  purity: Number,
  renewableShare: Number,
  powerConsumption: Number,
  powerFromRenewable: Number,
  ipfsCid: String,
  mintedCoins: Number,
  txnHash: String,
  score: { type: Number, default: 0 },   // ✅ replace subsidy
  createdAt: { type: Date, default: Date.now }
});


const ProducerData = mongoose.model("ProducerData", producerDataSchema);

module.exports = { ProducerData };
