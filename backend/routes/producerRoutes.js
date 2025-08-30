const express = require("express");
const {
  submitBatch,
  getProducerStats,
  // getProducerData,
  createSellRequest,
  confirmBuy,
  getLeaderboard,
  getInvoices,
  getProducerHistory,
  getTransactionLogs
} = require("../controllers/producerController");

const { protect: verifyToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/submit", verifyToken, submitBatch);   
router.get("/stats", verifyToken, getProducerStats); 
// router.get("/data", verifyToken, getProducerData);
router.post("/sell-request", verifyToken, createSellRequest);
router.get("/leaderboard", getLeaderboard);
router.put("/confirm-buy/:id", verifyToken, confirmBuy);
router.get("/history", verifyToken, getProducerHistory); 
router.get("/logs", verifyToken,getTransactionLogs);
router.get("/invoices", getInvoices); 

module.exports = router;
