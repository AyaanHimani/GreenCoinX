const express = require("express");
const router = express.Router();
const {
  // Producer
  getAllProducers,
  getProducerById,
  createOrUpdateProducer,
  updateProducerStats,
  // Buyer
  getAllBuyers,
  getBuyerById,
  createOrUpdateBuyer,
  updateBuyerStats,
} = require("../controllers/leaderBoardController");

const { protect: verifyToken } = require("../middlewares/AuthMiddleware");

/* ========= PRODUCER ROUTES ========= */
// Public
router.get("/producers", getAllProducers);          // List producers (no history)
router.get("/producers/:id", getProducerById);      // Get single producer (with history)

// Protected
router.post("/producers", verifyToken, createOrUpdateProducer);  
router.put("/producers/:id/stats", verifyToken, updateProducerStats);

/* ========= BUYER ROUTES ========= */
// Public
router.get("/buyers", getAllBuyers);               
router.get("/buyers/:id", getBuyerById);

// Protected
router.post("/buyers", verifyToken, createOrUpdateBuyer);       
router.put("/buyers/:id/stats", verifyToken, updateBuyerStats);

module.exports = router;
