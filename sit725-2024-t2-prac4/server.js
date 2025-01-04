import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import stationRoutes from "./src/routes/stationRoutes.js";
import routeRoutes from "./src/routes/routeRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket state
const activeChargers = new Map();

// Socket connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("startCharging", async (data) => {
    try {
      activeChargers.set(data.stationId, {
        userId: data.userId,
        startTime: Date.now(),
        socketId: socket.id,
      });

      io.emit("chargingStatus", {
        stationId: data.stationId,
        status: "occupied",
      });

      // Update MongoDB station status
      await mongoose
        .model("Station")
        .findByIdAndUpdate(data.stationId, { status: "occupied" });
    } catch (error) {
      console.error("Start charging error:", error);
      socket.emit("error", { message: "Failed to start charging" });
    }
  });

  socket.on("stopCharging", async (data) => {
    try {
      activeChargers.delete(data.stationId);

      io.emit("chargingStatus", {
        stationId: data.stationId,
        status: "available",
      });

      // Update MongoDB station status
      await mongoose
        .model("Station")
        .findByIdAndUpdate(data.stationId, { status: "available" });
    } catch (error) {
      console.error("Stop charging error:", error);
      socket.emit("error", { message: "Failed to stop charging" });
    }
  });

  socket.on("disconnect", async () => {
    for (const [stationId, session] of activeChargers.entries()) {
      if (session.socketId === socket.id) {
        try {
          activeChargers.delete(stationId);

          io.emit("chargingStatus", {
            stationId: stationId,
            status: "available",
          });

          await mongoose
            .model("Station")
            .findByIdAndUpdate(stationId, { status: "available" });
        } catch (error) {
          console.error("Disconnect cleanup error:", error);
        }
      }
    }
  });
});

// Existing middleware and routes
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/stations", stationRoutes);
app.use("/api/routes", routeRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).json({
    error: "Something broke!",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// MongoDB connection
try {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log("Connected to MongoDB successfully");
} catch (err) {
  console.error("MongoDB connection error:", err);
  process.exit(1);
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Socket.IO server running`);
});
