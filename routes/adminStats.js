const express = require('express');
const router = express.Router();
const User = require('../models/User');
const VetAppointment = require('../models/VetAppointment');
const VaccinationRecord = require('../models/VaccinationRecord');
const LostFound = require('../models/LostAndFound'); 
const Memorial = require('../models/Memorial');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, async (req, res) => {
  try {
    // Only allow admin access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Count stats
    const users = await User.countDocuments();
    const appointments = await VetAppointment.countDocuments();
    const vaccinations = await VaccinationRecord.countDocuments();
    const lost = await LostFound.countDocuments(); 
    const memorials = await Memorial.countDocuments();

    res.json({ users, appointments, vaccinations, lost, memorials });
  } catch (err) {
    console.error("Stats error:", err.message);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;
