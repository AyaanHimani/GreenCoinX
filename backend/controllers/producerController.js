// --- CORRECTED: Using CommonJS syntax ('require' and 'module.exports') consistently ---
const { ProducerData } = require("../models/ProductionData");
const { uploadToIPFS } = require("../utils/ipfs");
const { mintGreenCoins } = require("../utils/blockchain");
const { lastIotData, resetIotBatch } = require("../utils/iotSimulator");
const { SellRequest } = require("../models/SaleTenderRequest");
const { User } = require("../models/User");
const { TransactionLog } = require("../models/buyerTransactionLog");
// const { Invoice } = require("../models/Invoice"); // Make sure you have an Invoice model if you use it

const addTransactionLog = async (userId, type, points, reason, relatedTxn = null) => {
  // fetch last balance
  const lastLog = await TransactionLog.findOne({ userId }).sort({ createdAt: -1 });
  const lastBalance = lastLog ? lastLog.balanceAfter : 0;

  const newBalance = type === "credit" 
    ? lastBalance + points 
    : lastBalance - points;

  const log = new TransactionLog({
    userId,
    type,
    points,
    reason,
    relatedTxn,
    balanceAfter: newBalance
  });

  await log.save();
  return log;
};

// ✅ Submit latest IoT data as batch
const submitBatch = async (req, res) => {
  try {
    if (!lastIotData) return res.status(400).json({ msg: "No IoT data available yet" });

    const producerId = req.user.id;
    const { hydrogenQty, purity, renewableShare, powerConsumption, powerFromRenewable } = lastIotData;

    // 1. Upload to IPFS
    const ipfsCid = await uploadToIPFS(lastIotData);

    // 2. Mint coins on blockchain
    const mintedCoins = hydrogenQty;
    const txnHash = await mintGreenCoins(producerId, mintedCoins, ipfsCid);

    // 3. Scoring System
    let score = hydrogenQty;  // 1 point per kg
    if (renewableShare >= 95) score += 10; // bonus

    // 4. Save in DB
    const record = new ProducerData({
      producerId,
      hydrogenQty,
      purity,
      renewableShare,
      powerConsumption,
      powerFromRenewable,
      ipfsCid,
      mintedCoins,
      txnHash,
      score,
    });
    await record.save();

    await addTransactionLog(
      producerId,
      "credit",
      score,
      `Generated ${score} Green Credit Points`,
      null
    );

    // 5. Reset IoT batch
    resetIotBatch(); // reset counters for next batch

    res.status(201).json({ msg: "Batch submitted successfully", record });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get producer stats
const getProducerStats = async (req, res) => {
  try {
    const producerId = req.user.id;
    const records = await ProducerData.find({ producerId }).sort({ createdAt: -1 });

    const totalCoins = records.reduce((sum, r) => sum + r.mintedCoins, 0);
    const totalScore = records.reduce((sum, r) => sum + r.score, 0);

    res.json({ totalCoins, totalScore, history: records });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// -------------------- CREATE SELL REQUEST --------------------
const createSellRequest = async (req, res) => {
  try {
    const producerId = req.user.id;
    const { hydrogenQty, price, score, proofDoc } = req.body;

    const request = new SellRequest({
      producerId,
      hydrogenQty,
      price,
      score,
      proofDoc
    });

    await request.save();

    res.status(201).json({ msg: "Sell request created", request });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// -------------------- CONFIRM BUY --------------------
const confirmBuy = async (req, res) => {
  try {
    const { id } = req.params; // SellRequest ID
    const producerId = req.user.id;

    const request = await SellRequest.findById(id);
    if (!request) return res.status(404).json({ msg: "Sell request not found" });
    if (request.producerId.toString() !== producerId) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    if (!request.buyerId) {
      return res.status(400).json({ msg: "No buyer assigned yet" });
    }

    const buyer = await User.findById(request.buyerId);
    if (!buyer) return res.status(404).json({ msg: "Buyer not found" });

    const totalAmount = request.hydrogenQty * request.price;

    if (buyer.walletBalance < totalAmount) {
      return res.status(400).json({ msg: "Buyer has insufficient balance" });
    }

    buyer.walletBalance -= totalAmount;
    await buyer.save();

    const txnHash = await mintGreenCoins(producerId, request.hydrogenQty, request.proofDoc);

    // NOTE: The Invoice logic is commented out as it was in your original file.
    // Ensure you have an 'Invoice' model if you uncomment this.
    /*
    const invoice = new Invoice({
      producerId,
      buyerId: request.buyerId,
      sellRequestId: request._id,
      hydrogenQty: request.hydrogenQty,
      price: request.price,
      totalAmount,
      txnHash
    });
    await invoice.save();
    */

    await addTransactionLog(
      producerId,
      "debit",
      request.hydrogenQty,
      `Sold ${request.hydrogenQty} units to ${buyer.company}`,
      request._id
    );
    
    request.status = "sold";
    request.txnHash = txnHash;
    // request.invoiceId = invoice._id; // Uncomment if using invoices
    await request.save();

    res.json({
      msg: "Purchase confirmed, buyer wallet debited, blockchain txn recorded",
      buyerWallet: buyer.walletBalance,
      request,
      // invoice // Uncomment if using invoices
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// -------------------- LEADERBOARD --------------------
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await ProducerData.aggregate([
      { $group: { _id: "$producerId", totalScore: { $sum: "$score" } } },
      { $sort: { totalScore: -1 } },
      { $limit: 10 }
    ]);

    const result = await User.populate(leaderboard, { path: "_id", select: "name company" });

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getProducerHistory = async (req, res) => {
  try {
    const producerId = req.user.id;

    const transactions = await SellRequest.find({ producerId, status: "sold" })
      .populate("buyerId", "name company")
      .populate("invoiceId")
      .sort({ createdAt: -1 });

    const buyerMap = {};
    transactions.forEach(tx => {
      const buyerKey = tx.buyerId?._id.toString() || "unknown";
      if (!buyerMap[buyerKey]) {
        buyerMap[buyerKey] = {
          buyer: tx.buyerId,
          totalBought: 0,
          totalSpent: 0,
          transactions: []
        };
      }
      buyerMap[buyerKey].totalBought += tx.hydrogenQty;
      buyerMap[buyerKey].totalSpent += tx.invoiceId?.totalAmount || 0;
      buyerMap[buyerKey].transactions.push(tx);
    });

    const buyers = Object.values(buyerMap);

    res.json({ transactions, buyers });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET /producer/logs
const getTransactionLogs = async (req, res) => {
  try {
    const producerId = req.user.id;

    const logs = await TransactionLog.find({ userId: producerId })
      .populate("relatedTxn", "hydrogenQty price txnHash")
      .sort({ createdAt: -1 });

    res.json({ count: logs.length, logs });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// --- CORRECTED: Exporting all functions using module.exports ---
module.exports = {
  addTransactionLog,
  submitBatch,
  getProducerStats,
  createSellRequest,
  confirmBuy,
  getLeaderboard,
  getProducerHistory,
  getTransactionLogs
};