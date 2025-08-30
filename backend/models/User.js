import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  company: String,
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["producer", "buyer", "regulator"], required: true },
  credits: { type: Number, default: 0 },  // green credits
  walletBalance: { type: Number, default: 0 }, // 💰 buyer wallet
  isBlacklisted: { type: Boolean, default: false },
  carbonFootprinting: Number,
  score: Number
});


export const User = mongoose.model("User", userSchema);
