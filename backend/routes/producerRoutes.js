const express = require("express");
const {
  submitBatch,
  getProducerStats,
  createSellRequest,
  confirmBuy,
  getLeaderboard,
  getTransactionLogs
} = require("../controllers/producerController");

const { protect: verifyToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/submit", verifyToken, submitBatch);    // Pushing Data into the blockchain
router.get("/stats", verifyToken, getProducerStats);  // Getting the stats of Production stats  
router.post("/sell-request", verifyToken, createSellRequest);    // Raising a sell request
router.get("/leaderboard", getLeaderboard);     // Getting the position of leaderboard
router.put("/confirm-buy/:id", verifyToken, confirmBuy);    // Confirming the buying request
router.get("/logs", verifyToken,getTransactionLogs);    // Getting the transaction logs of past 

module.exports = router;
