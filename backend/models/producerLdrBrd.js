const mongoose = require("mongoose");

const ProducerLeaderboardSchema = new mongoose.Schema({
  producerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: { type: String, required: true }, // Producer name (e.g., Adani Hydrogen)
  totalHydrogenProducedKg: { type: Number, default: 0 }, // cumulative verified production
  greenCoinsMinted: { type: Number, default: 0 },
  bonusesEarned: { type: Number, default: 0 }, // ₹ subsidy bonuses
  rank: { type: Number, default: null }, // updated dynamically
  badges: [{ type: String }], // ["Most Green Producer", etc.]
  lastUpdated: { type: Date, default: Date.now },
  isFlagged: { type: Boolean, default: false }, // for suspicious activity
  history: [
    {
      month: Number,
      year: Number,
      hydrogenProducedKg: Number,
      greenCoinsMinted: Number,
      bonuses: Number,
    },
  ], // track monthly stats
});

module.exports = mongoose.model("ProducerLeaderboard", ProducerLeaderboardSchema);
