// models/GreenCoin.js
const mongoose = require("mongoose");

const GreenCoinSchema = new mongoose.Schema({
  // Provenance & identity
  batchId: { type: String, required: true, index: true },   // your internal batch ref
  producerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  producerName: { type: String, required: true },

  // IoT & IPFS
  ipfsCid: { type: String, required: true },                 // IPFS proof for batch
  hydrogenQtyKg: { type: Number, required: true },           // from IoT batch
  purity: { type: Number, required: true },
  renewableShare: { type: Number, required: true },

  // Tokenization
  tokenStandard: { type: String, default: "ERC1155" },       // planned
  tokenId: { type: String, required: true },                 // e.g., hash(cid) or on-chain id
  amount: { type: Number, required: true },                  // coins minted = floor(kg/1000)
  decimals: { type: Number, default: 0 },                    // keep whole coins for hackathon
  chain: { type: String, default: "Polygon Amoy" },
  mintTxHash: { type: String, required: true },

  // Ownership & trade
  status: { 
    type: String, 
    enum: ["MINTED", "LISTED", "SOLD", "RETIRED", "REVOKED"], 
    default: "MINTED" 
  },
  currentOwnerType: { type: String, enum: ["PRODUCER", "BUYER"], default: "PRODUCER" },
  currentOwnerId: { type: mongoose.Schema.Types.ObjectId, refPath: "currentOwnerTypeRef" },
  currentOwnerTypeRef: { type: String, default: "User" }, // if you separate Buyer/Producer collections, adjust

  // Marketplace (optional)
  listPriceInINR: { type: Number, default: 0 },
  lastSaleTxHash: { type: String },

  // Retirement
  retiredAt: { type: Date },
  retiredByBuyerName: { type: String },

  // Audit
  auditorVerified: { type: Boolean, default: true },         // set true only if auto-auditor passes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GreenCoin", GreenCoinSchema);
