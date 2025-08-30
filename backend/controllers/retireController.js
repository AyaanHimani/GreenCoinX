const GreenCoin = require("../models/greenCoin");

exports.retireCoin = async (req, res) => {
  try {
    const { coinId, buyerName } = req.body;
    const coin = await GreenCoin.findById(coinId);
    if (!coin || coin.status !== "SOLD") return res.status(400).json({ message: "Coin not retire-able" });

    // TODO: call contract.burn(buyer, tokenId, amount) on Amoy; get tx hash
    const retireTxHash = "0xMOCK_RETIRE_" + Date.now();

    coin.status = "RETIRED";
    coin.retiredAt = new Date();
    coin.retiredByBuyerName = buyerName;
    await coin.save();

    res.json({ message: "Retired permanently", retireTxHash, coin });
  } catch (err) {
    res.status(500).json({ message: "Retire failed", error: err.message });
  }
};
