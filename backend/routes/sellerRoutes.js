const express = require("express")
const { getAllSellingOrders, makeBuyRequest } = require("../controllers/sellerControllers")

const router = express.Router()

router.get("/selling",getAllSellingOrders); // Getting all selling orders
router.post("/buyRequest", makeBuyRequest); // Making a buy request

module.exports = router;