const mongoose = require("mongoose");

const productionDataSchema = new mongoose.Schema({
  producerName: String,
  hydrogenQty: Number,
  purity: Number,
  powerConsumption: Number,
  IPFShash: String,
  source: String,
  createdAt: { type: Date, default: Date.now }
});

const ProductionData = mongoose.model("ProducatioData", productionDataSchema);

module.exports = { ProductionData };
