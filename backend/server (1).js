// server.js
// Entry point for the backend. Run with: node server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const contactRoutes = require("./routes/contact");

const app = express();

// ---- Middleware ----
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json()); // lets us read JSON from fetch() requests

// ---- Routes ----
app.use("/api/contact", contactRoutes);

// Simple health check — visit this in browser to confirm server is alive
app.get("/", (req, res) => {
  res.send("Portfolio backend is running ✅");
});

// ---- Connect to MongoDB, then start server ----
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
