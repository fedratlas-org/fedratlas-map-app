const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const placeRoutes = require("./routes/placeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/map_web_db";

// Middleware
app.use(cors());
// Set JSON payload limit to 25MB to accommodate high-res base64 image uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Routes
app.use("/api/places", placeRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Map-Web MongoDB Backend Server Running" });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("--------------------------------------------------")
        console.log("✅ Successfully connected to MongoDB Database!");
        console.log(`📡 Server running on http://localhost:${PORT}`);
        console.log("--------------------------------------------------")
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.log("💡 Tip: Make sure your local MongoDB service is running or check your MONGODB_URI in server/.env");
    });

app.listen(PORT, () => {
    console.log(`🚀 Express server starting on port ${PORT}...`);
});
