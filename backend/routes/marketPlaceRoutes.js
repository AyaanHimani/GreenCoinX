const express = require("express");
const router = express.Router();
const { listCoin, buyCoin, confirmPurchase } = require("../controllers/marketPlaceController");
const { protect: verifyToken } = require("../middlewares/AuthMiddleware");

router.post("/list", verifyToken, listCoin);
router.post("/buy", verifyToken, buyCoin);
router.put("/confirm/:id", verifyToken, confirmPurchase);

module.exports = router;
