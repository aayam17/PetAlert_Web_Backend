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

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("---- INCOMING REQUEST ----");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Parsed Body:", req.body);
  next();
});

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/lostandfound", lostAndFoundRoutes);
app.use("/api/vaccinationrecords", vaccinationRecordRoutes);
app.use("/api/vetappointments", vetAppointmentRoutes);
app.use("/api/memorials", memorialRoutes);
app.use('/api/admin', adminStatsRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ REMOVE THIS from index.js
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app;
