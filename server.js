require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");

const app = express();
app.use(express.json());

// This is a simple Express server setup with a MongoDB connection using Mongoose.

// Health endpoint
app.get("/health", (req, res) => {
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
    99: "uninitialized",
  };
  const dbState = stateMap[mongoose.connection.readyState] || "unknown";
  res.json({ status: "ok", db: dbState });
});

const PORT = process.env.PORT || 3000;

// This is an immediately invoked async function to connect to the database and start the server

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
})();

// This file initializes the Express server and connects to my MongoDB using the connectDB function from config/db.js.
// It also defines a health check endpoint to report the server and database status.
