// routes/producerIoTRoutes.js
const express = require("express");
const router = express.Router();
const { storeOrUpdateIoTData, getIoTData, resetIoTStats } = require("../controllers/producerController");
const { protect: verifyToken } = require("../middlewares/AuthMiddleware");

// Store IoT data (averaged with existing)
router.post("/store_iot/:id", verifyToken, storeOrUpdateIoTData);

// Get averaged IoT data
router.get("/get_iot/:id", verifyToken, getIoTData);

// Reset IoT averages (e.g., month-end)
router.post("/reset_iot/:id", verifyToken, resetIoTStats);

module.exports = router;
