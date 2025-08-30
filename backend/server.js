import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";
import http from "http";
import producerRoutes from "./routes/producerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { generateIotData, lastIotData } from "./utils/iotSimulator.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 🔥 IoT Simulation every 5 seconds
setInterval(() => {
  const data = generateIotData();
  io.emit("iotData", data);
}, 5000);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/producer", producerRoutes);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
