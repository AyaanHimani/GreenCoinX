// models/ApprovedSensor.js
const mongoose = require("mongoose");

const ApprovedSensorSchema = new mongoose.Schema({
  partId: { type: String, unique: true, index: true },
  approvedHash: { type: String, required: true }, // sha256(SECRET + partId)
  ownerProducerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  addedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model("ApprovedSensor", ApprovedSensorSchema);
