const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const lostAndFoundRoutes = require("./routes/lostandfoundRoutes");
const vaccinationRecordRoutes = require("./routes/vaccinationrecordRoutes");
const vetAppointmentRoutes = require("./routes/vetappointmentRoutes");
const memorialRoutes = require("./routes/memorialRoutes");
const adminStatsRoute = require('./routes/adminStats'); 

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lostandfound", lostAndFoundRoutes);
app.use("/api/vaccinationrecords", vaccinationRecordRoutes);
app.use("/api/vetappointments", vetAppointmentRoutes);
app.use("/api/memorials", memorialRoutes);
app.use('/api/admin', adminStatsRoute);


// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
