// /index.js or app.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const lostAndFoundRoutes = require("./routes/lostandfoundRoutes");
const vaccinationRecordRoutes = require("./routes/vaccinationrecordRoutes");
const vetAppointmentRoutes = require("./routes/vetappointmentRoutes");
const memorialRoutes = require("./routes/memorialRoutes");
const adminStatsRoute = require('./routes/adminStats');
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lostandfound", lostAndFoundRoutes);
app.use("/api/vaccinationrecords", vaccinationRecordRoutes);
app.use("/api/vetappointments", vetAppointmentRoutes);
app.use("/api/memorials", memorialRoutes);
app.use("/api/admin", adminStatsRoute);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
