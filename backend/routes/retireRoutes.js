const express = require("express");
const router = express.Router();
const { retireCoin } = require("../controllers/retireController");
const { protect: verifyToken } = require("../middlewares/AuthMiddleware");

router.post("/retire", verifyToken, retireCoin);
module.exports = router;
