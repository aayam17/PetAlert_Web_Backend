const express = require('express');
const router = express.Router();
const VetAppointment = require('../models/VetAppointment');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const appointments = await VetAppointment.find().populate('createdBy', 'username email');
  res.json(appointments);
});

router.post('/', protect, async (req, res) => {
  const appointment = new VetAppointment({
    ...req.body,
    createdBy: req.user.id
  });
  await appointment.save();
  res.status(201).json(appointment);
});

module.exports = router;
