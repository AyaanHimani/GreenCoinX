const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  company: String,
  companyRegNo: String,
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["producer", "buyer", "regulator"], required: true },
  credits: { type: Number, default: 0 },  // green credits
  isBlacklisted: { type: Boolean, default: false },
  carbonFootprinting: Number,
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
