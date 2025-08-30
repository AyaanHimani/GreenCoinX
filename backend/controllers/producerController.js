const { ProducerData } = require("../models/ProducerData");
const { uploadToIPFS } = require("../utils/ipfs");
const { mintGreenCoins } = require("../utils/blockchain");
const { lastIotData, resetIotBatch } = require("../utils/iotSimulator");
const { SellRequest } = require("../models/SellRequest");
const { User } = require("../models/User");
const { Invoice } = require("../models/Invoice");
const { TransactionLog } = require("../models/TransactionLog");

export const addTransactionLog = async (userId, type, points, reason, relatedTxn = null) => {
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
export const submitBatch = async (req, res) => {
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
      score,   // ✅ save score instead of subsidy
    });
    await record.save();

    await addTransactionLog(
      producerId,
      "credit",
      score,  // or mintedCoins if you prefer coin count
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
export const getProducerStats = async (req, res) => {
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

// -------------------- GET PRODUCER DATA --------------------
// export const getProducerData = async (req, res) => {
//   try {
//     const producerId = req.user.id;

//     const user = await User.findById(producerId).select("-passwordHash");
//     if (!user) return res.status(404).json({ msg: "Producer not found" });

//     const pastTransactions = await SellRequest.find({ producerId }).populate("buyerId", "name company");

//     res.json({
//       profile: user,
//       pastTransactions
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// -------------------- CREATE SELL REQUEST --------------------
export const createSellRequest = async (req, res) => {
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
export const confirmBuy = async (req, res) => {
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

    // 🔹 Fetch buyer
    const buyer = await User.findById(request.buyerId);
    if (!buyer) return res.status(404).json({ msg: "Buyer not found" });

    // 🔹 Calculate total amount
    const totalAmount = request.hydrogenQty * request.price;

    // 🔹 Check buyer wallet
    if (buyer.walletBalance < totalAmount) {
      return res.status(400).json({ msg: "Buyer has insufficient balance" });
    }

    // 🔹 Deduct from buyer wallet
    buyer.walletBalance -= totalAmount;
    await buyer.save();

    // 🔹 Blockchain settlement
    const txnHash = await mintGreenCoins(producerId, request.hydrogenQty, request.proofDoc);

    // 🔹 Generate Invoice
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

    await addTransactionLog(
      producerId,
      "debit",
      request.hydrogenQty,  // or points to subtract
      `Sold ${request.hydrogenQty} units to ${buyer.company}`,
      request._id
    );
    // 🔹 Update SellRequest
    request.status = "sold";
    request.txnHash = txnHash;
    request.invoiceId = invoice._id;
    await request.save();

    res.json({
      msg: "Purchase confirmed, buyer wallet debited, blockchain txn recorded, invoice generated",
      buyerWallet: buyer.walletBalance,
      request,
      invoice
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// -------------------- LEADERBOARD --------------------
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await ProducerData.aggregate([
      { $group: { _id: "$producerId", totalScore: { $sum: "$score" } } },
      { $sort: { totalScore: -1 } },
      { $limit: 10 }
    ]);

    // Populate producer info
    const result = await User.populate(leaderboard, { path: "_id", select: "name company" });

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getProducerHistory = async (req, res) => {
  try {
    const producerId = req.user.id;

    // 1️⃣ Get all transactions with buyer + invoice
    const transactions = await SellRequest.find({ producerId, status: "sold" })
      .populate("buyerId", "name company")
      .populate("invoiceId")
      .sort({ createdAt: -1 });

    // 2️⃣ Aggregate buyer history
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
export const getTransactionLogs = async (req, res) => {
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

// GET /producer/invoices
export const getInvoices = async (req, res) => {
  try {
    const producerId = req.user.id;

    const invoices = await Invoice.find({ producerId })
      .populate("buyerId", "name company")
      .populate("sellRequestId", "hydrogenQty price");

    res.json({
      count: invoices.length,
      invoices
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  addTransactionLog,
  submitBatch,
  getProducerStats,
  createSellRequest,
  confirmBuy,
  getLeaderboard,
  getProducerHistory,
  getTransactionLogs,
  getInvoices
  // If you uncomment getProducerData, include it here too
};
