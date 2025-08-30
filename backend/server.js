const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db.js");
const { Server } = require("socket.io");
const http = require("http");
const authRoutes = require("./routes/authRoutes.js");
const producerRoutes = require("./routes/producerRoutes.js");
// CORRECTED: Added imports for seller and regulator routes
const sellerRoutes = require("./routes/sellerRoutes.js");
const regulatorRoutes = require("./routes/regulatorRoutes.js");
const leaderBoardRoutes = require("./routes/leaderBoardRoutes.js");
const transactionRoutes = require("./routes/transactionsRoutes.js");
const { generateIotData, lastIotData } = require("./utils/iotSimulator.js");

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
app.use("/api/leaderboard", leaderBoardRoutes);
app.use("/api/transactions", transactionRoutes);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));