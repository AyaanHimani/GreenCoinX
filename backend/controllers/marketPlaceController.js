const GreenCoin = require("../models/greenCoin");
const MarketplaceListing = require("../models/MarketplaceListing");
const { TransactionLog } = require("../models/TransactionLog"); // your buyer log

// LIST
exports.listCoin = async (req, res) => {
  try {
    const { greenCoinId, priceInINR, amount } = req.body;
    const coin = await GreenCoin.findById(greenCoinId);
    if (!coin || coin.status === "RETIRED" || coin.status === "REVOKED") {
      return res.status(400).json({ message: "Coin not listable" });
    }
    if (amount > coin.amount) return res.status(400).json({ message: "Amount exceeds available" });

    await MarketplaceListing.create({
      greenCoinId,
      producerId: coin.producerId,
      priceInINR,
      availableAmount: amount
    });

    coin.status = "LISTED";
    coin.listPriceInINR = priceInINR;
    await coin.save();

    res.json({ message: "Listed", coin });
  } catch (err) {
    res.status(500).json({ message: "List failed", error: err.message });
  }
};

// BUY (off-chain DB record + call your contract later)
exports.buyCoin = async (req, res) => {
  try {
    const { listingId, buyerName } = req.body;
    const listing = await MarketplaceListing.findById(listingId).populate("greenCoinId");
    if (!listing || listing.status !== "ACTIVE") return res.status(404).json({ message: "Listing not found" });

    const coin = await GreenCoin.findById(listing.greenCoinId);
    if (!coin) return res.status(404).json({ message: "Coin not found" });

    // MOCK transfer on-chain here (call a smart contract purchase/transfer)
    const txnHash = "0xMOCK_PURCHASE_" + Date.now();

    // Update owner in DB
    coin.currentOwnerType = "BUYER";
    coin.currentOwnerId = null; // optional if you store buyers as Users
    coin.status = "SOLD";
    coin.lastSaleTxHash = txnHash;
    await coin.save();

    listing.status = "SOLD_OUT";
    listing.availableAmount = 0;
    await listing.save();

    // Log the buyer transaction for dashboards
    await TransactionLog.create({
      buyerName,
      producerName: coin.producerName,
      greenCoins: coin.amount,
      hydroQty: coin.hydrogenQtyKg,
      txnHash,
      isConfirm: false
    });

    res.json({ message: "Purchased", coin, txnHash });
  } catch (err) {
    res.status(500).json({ message: "Purchase failed", error: err.message });
  }
};

// CONFIRM (toggle isConfirm once Amoy confirms the tx)
exports.confirmPurchase = async (req, res) => {
  try {
    const { id } = req.params; // transactionId
    const { TransactionLog } = require("../models/TransactionLog");
    const tx = await TransactionLog.findById(id);
    if (!tx) return res.status(404).json({ message: "Not found" });

    tx.isConfirm = true;
    await tx.save();

    res.json({ message: "Confirmed", tx });
  } catch (err) {
    res.status(500).json({ message: "Confirm failed", error: err.message });
  }
};
