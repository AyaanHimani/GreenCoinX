const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { Server } = require("socket.io");
const http = require("http");
const producerRoutes = require("./routes/producerRoutes");
const authRoutes = require("./routes/authRoutes");
const { generateIotData, lastIotData } = require("./utils/iotSimulator");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// IoT Simulation every 5 seconds
setInterval(() => {
  const data = generateIotData();
  io.emit("iotData", data);
}, 5000);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/producer", producerRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/regulator", regulatorRoutes);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
