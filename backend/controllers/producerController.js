// controllers/producerIoTController.js
const IoTData = require("../models/ProductionData");

/**
 * @desc Store IoT data (running average update)
 * @route POST /api/producers/:id/iot
 */
const storeOrUpdateIoTData = async (req, res) => {
  try {
    const { id } = req.params; // producerId
    const { hydrogenQty, purity, renewableShare, powerConsumption, powerFromRenewable } = req.body;

    let record = await IoTData.findOne({ producerId: id });

    if (record) {
      // Increment sample count
      const newCount = record.sampleCount + 1;

      // Running average formula
      record.hydrogenQty = (record.hydrogenQty * record.sampleCount + hydrogenQty) / newCount;
      record.purity = (record.purity * record.sampleCount + purity) / newCount;
      record.renewableShare = (record.renewableShare * record.sampleCount + renewableShare) / newCount;
      record.powerConsumption = (record.powerConsumption * record.sampleCount + powerConsumption) / newCount;
      record.powerFromRenewable = (record.powerFromRenewable * record.sampleCount + powerFromRenewable) / newCount;

      record.sampleCount = newCount;
      record.lastUpdated = Date.now();

      await record.save();
      return res.json({ message: "IoT data updated (averaged)", record });
    }

    // If no record yet, create new
    record = new IoTData({
      producerId: id,
      hydrogenQty,
      purity,
      renewableShare,
      powerConsumption,
      powerFromRenewable,
      sampleCount: 1,
      lastUpdated: Date.now(),
    });

    await record.save();
    res.status(201).json({ message: "IoT data created", record });
  } catch (err) {
    res.status(500).json({ message: "Error storing IoT data", error: err.message });
  }
};

/**
 * @desc Get averaged IoT data for a producer
 * @route GET /api/producers/:id/iot
 */
const getIoTData = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await IoTData.findOne({ producerId: id });
    if (!record) return res.status(404).json({ message: "No IoT data for this producer" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Error fetching IoT data", error: err.message });
  }
};

/**
 * @desc Reset IoT averages for a producer
 * @route POST /api/producers/:id/iot/reset
 */
const resetIoTStats = async (req, res) => {
  try {
    const { id } = req.params;

    let record = await IoTData.findOne({ producerId: id });
    if (!record) {
      return res.status(404).json({ message: "No IoT stats found for this producer" });
    }

    record.hydrogenQty = 0;
    record.purity = 0;
    record.renewableShare = 0;
    record.powerConsumption = 0;
    record.powerFromRenewable = 0;
    record.sampleCount = 0;
    record.lastUpdated = Date.now();

    await record.save();

    res.json({ message: "IoT stats reset successfully", record });
  } catch (err) {
    res.status(500).json({ message: "Error resetting IoT stats", error: err.message });
  }
};

module.exports = { storeOrUpdateIoTData, getIoTData, resetIoTStats };
