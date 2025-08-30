const express = require("express");
const router = express.Router();
const { verifyAndMint } = require("../controllers/mintController");
const { protect: verifyToken } = require("../middlewares/AuthMiddleware");

router.post("/verify-and-mint", verifyToken, verifyAndMint);
module.exports = router;
