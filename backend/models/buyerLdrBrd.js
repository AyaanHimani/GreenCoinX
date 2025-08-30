const mongoose = require("mongoose");

const BuyerLeaderboardSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming buyers are stored in Users collection
    required: true,
    index: true,
  },
  name: { type: String, required: true }, // Buyer name (e.g., Tata Steel)
  totalCreditsPurchased: { type: Number, default: 0 },
  totalCreditsRetired: { type: Number, default: 0 }, // used credits
  discountsEarned: { type: Number, default: 0 }, // marketplace discounts
  rank: { type: Number, default: null },
  badges: [{ type: String }], // ["Responsible Buyer", etc.]
  lastUpdated: { type: Date, default: Date.now },
  isFlagged: { type: Boolean, default: false }, // for suspicious activity
  history: [
    {
      month: Number,
      year: Number,
      creditsPurchased: Number,
      creditsRetired: Number,
      pollutionOffset: Number,
    },
  ], // track monthly stats
});

module.exports = mongoose.model("BuyerLeaderboard", BuyerLeaderboardSchema);
