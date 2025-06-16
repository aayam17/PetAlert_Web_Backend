const express = require('express');
const router = express.Router();
const VaccinationRecord = require('../models/VaccinationRecord');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const records = await VaccinationRecord.find().populate('createdBy', 'username email');
  res.json(records);
});

router.post('/', protect, async (req, res) => {
  const record = new VaccinationRecord({
    ...req.body,
    createdBy: req.user.id
  });
  await record.save();
  res.status(201).json(record);
});

module.exports = router;
