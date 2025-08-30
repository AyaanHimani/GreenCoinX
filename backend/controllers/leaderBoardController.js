const ProducerLeaderboard = require("../models/producerLdrBrd");
const BuyerLeaderboard = require("../models/buyerLdrBrd");

/**
 * Get all producers (without history)
 */
async function getAllProducers(req, res) {
  try {
    const producers = await ProducerLeaderboard.find({}, { history: 0 })
      .sort({ totalHydrogenProducedKg: -1 });
    res.json(producers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching producers", error: err });
  }
}

/**
 * Get single producer (with history)
 */
async function getProducerById(req, res) {
  try {
    const producer = await ProducerLeaderboard.findById(req.params.id);
    if (!producer) return res.status(404).json({ message: "Producer not found" });
    res.json(producer);
  } catch (err) {
    res.status(500).json({ message: "Error fetching producer", error: err });
  }
}

/**
 * Create or update producer
 */
async function createOrUpdateProducer(req, res) {
  try {
    const { producerId, name } = req.body;
    let producer = await ProducerLeaderboard.findOne({ producerId });

    if (producer) {
      producer.name = name || producer.name;
      await producer.save();
      return res.json({ message: "Producer updated", producer });
    }

    producer = new ProducerLeaderboard({ producerId, name });
    await producer.save();
    res.status(201).json({ message: "Producer created", producer });
  } catch (err) {
    res.status(500).json({ message: "Error creating/updating producer", error: err });
  }
}

/**
 * Update producer stats
 */
async function updateProducerStats(req, res) {
  try {
    const { hydrogenProducedKg, greenCoinsMinted, bonuses, month, year } = req.body;

    const producer = await ProducerLeaderboard.findById(req.params.id);
    if (!producer) return res.status(404).json({ message: "Producer not found" });

    producer.totalHydrogenProducedKg += hydrogenProducedKg || 0;
    producer.greenCoinsMinted += greenCoinsMinted || 0;
    producer.bonusesEarned += bonuses || 0;
    producer.lastUpdated = Date.now();

    if (month && year) {
      producer.history.push({
        month,
        year,
        hydrogenProducedKg: hydrogenProducedKg || 0,
        greenCoinsMinted: greenCoinsMinted || 0,
        bonuses: bonuses || 0,
      });
    }

    await producer.save();
    res.json({ message: "Producer stats updated", producer });
  } catch (err) {
    res.status(500).json({ message: "Error updating producer stats", error: err });
  }
}

/**
 * Get all buyers (without history)
 */
async function getAllBuyers(req, res) {
  try {
    const buyers = await BuyerLeaderboard.find({}, { history: 0 })
      .sort({ totalCreditsRetired: -1 });
    res.json(buyers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buyers", error: err });
  }
}

/**
 * Get single buyer (with history)
 */
async function getBuyerById(req, res) {
  try {
    const buyer = await BuyerLeaderboard.findById(req.params.id);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buyer", error: err });
  }
}

/**
 * Create or update buyer
 */
async function createOrUpdateBuyer(req, res) {
  try {
    const { buyerId, name } = req.body;
    let buyer = await BuyerLeaderboard.findOne({ buyerId });

    if (buyer) {
      buyer.name = name || buyer.name;
      await buyer.save();
      return res.json({ message: "Buyer updated", buyer });
    }

    buyer = new BuyerLeaderboard({ buyerId, name });
    await buyer.save();
    res.status(201).json({ message: "Buyer created", buyer });
  } catch (err) {
    res.status(500).json({ message: "Error creating/updating buyer", error: err });
  }
}

/**
 * Update buyer stats
 */
async function updateBuyerStats(req, res) {
  try {
    const { creditsPurchased, creditsRetired, pollutionOffset, discounts, month, year } = req.body;

    const buyer = await BuyerLeaderboard.findById(req.params.id);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    buyer.totalCreditsPurchased += creditsPurchased || 0;
    buyer.totalCreditsRetired += creditsRetired || 0;
    buyer.discountsEarned += discounts || 0;
    buyer.lastUpdated = Date.now();

    if (month && year) {
      buyer.history.push({
        month,
        year,
        creditsPurchased: creditsPurchased || 0,
        creditsRetired: creditsRetired || 0,
        pollutionOffset: pollutionOffset || 0,
      });
    }

    await buyer.save();
    res.json({ message: "Buyer stats updated", buyer });
  } catch (err) {
    res.status(500).json({ message: "Error updating buyer stats", error: err });
  }
}

module.exports = {
  // Producers
  getAllProducers,
  getProducerById,
  createOrUpdateProducer,
  updateProducerStats,

  // Buyers
  getAllBuyers,
  getBuyerById,
  createOrUpdateBuyer,
  updateBuyerStats,
};
